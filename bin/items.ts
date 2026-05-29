#!/usr/bin/env node --experimental-modules --no-warnings
// Builds items.ts from slk files

/* eslint-disable no-console */

import glob from "fast-glob";
import { promises as fs } from "fs";
import process from "node:process";
import { inspect } from "util";

import { castValue, typesByField, Value as CastValue } from "../src/castValue";
import { iniToObjs } from "./util/iniToObjs";
import { jsStringify } from "./util/jsStringify";
import { slkToTable } from "./util/slkToTable";

const ITEM_SLKS = ["ItemData", "Profile"];

type Value = CastValue | CastValue[];
type Def = Record<string, Value>;
type IndexedDef = Def | { [key: string]: IndexedDef };

const killWithError = (err: string): void => {
  console.error(err);
  process.exit(1);
};

const input = process.argv[2] || "data/items";

const fromPathEntries = (
  arr: [string, string | number | boolean | void | Value[]][],
): IndexedDef => {
  const obj: IndexedDef = {};

  if (!Array.isArray(arr)) {
    throw new Error(`not an array: ${inspect(arr, true, 10, true)}`);
  }

  for (const [path, value] of arr) {
    const parts = path.split(".");
    let cur: IndexedDef | IndexedDef[] = obj;
    for (const part of parts.slice(0, -1)) {
      cur = cur[part] || (cur[part] = isNaN(parseInt(part)) ? {} : []);
    }

    if (cur[parts[parts.length - 1]]) {
      throw new Error(`Redefining item property ${path}`);
    }
    cur[parts[parts.length - 1]] = value;
  }

  return obj;
};

const untyped = (data: Array<string | number | boolean>[]): string[][] =>
  data.map((r) => r.map((v) => v.toString()));

const main = async () => {
  const paths = await glob(input + "/*.(slk|txt)");
  if (paths.length === 0) throw new Error(`No files found at ${input}`);

  const template = await fs.readFile("./bin/template/items.ts", "utf-8");
  const tsvs = await Promise.all(
    paths
      .filter((path) => path.endsWith(".slk"))
      .map((path) =>
        fs
          .readFile(path, "utf-8")
          .then(slkToTable)
          .then(untyped)
      ),
  );
  const inis = await Promise.all(
    paths
      .filter((path) => path.endsWith(".txt"))
      .map((path) => fs.readFile(path, "utf-8").then(iniToObjs)),
  );

  const items: Record<string, Record<string, string | string[]>> = {};
  for (const tsv of tsvs) {
    const header = tsv[0];
    for (const row of tsv.slice(1)) {
      const item = items[row[0]] || (items[row[0]] = {});
      for (let i = 1; i < row.length; i++) {
        const column = header[i];
        const value = row[i];
        const existingValue = item[column];
        if (existingValue !== undefined) {
          if (Array.isArray(existingValue)) {
            if (!existingValue.includes(value)) {
              existingValue.push(value);
            }
          } else if (existingValue !== value) {
            item[column] = [existingValue, value];
          }
        } else item[column] = value;
      }
    }
  }

  for (const ini of inis) {
    for (const [itemId, values] of Object.entries(ini)) {
      const item = items[itemId];
      if (item) Object.assign(item, values);
    }
  }

  const sorted = Object.fromEntries(
    Object.entries(items)
      .map(([id, item]) => {
        const rawItemEntries: [
          string,
          Value | Value[],
        ][] = Object.entries(item).map(([field, value]) => {
          if (field === "Buttonpos" && typeof value === "string") {
            const parts = value.split(",").map((v) => parseInt(v, 10));
            if (parts.every((n) => !isNaN(n))) {
              return ["art.Buttonpos", parts];
            }
            return [field, undefined];
          }

          const types = typesByField[field];
          const filteredTypes = types
            ? types.filter((v) =>
              ITEM_SLKS.includes(v.slk) &&
              (v.slk !== "Profile" || v.useItem === 1)
            )
            : [];
          // Metadata exists but none of it applies to items — skip the value
          // entirely rather than falling through to the field-name fallback.
          if (types && filteredTypes.length === 0) return [field, undefined];

          const type = filteredTypes.length === 1
            ? filteredTypes[0]
            : undefined;

          return [
            type && type.category ? `${type.category}.${field}` : field,
            castValue(value, field, type),
          ];
        });

        const itemEntries = rawItemEntries
          .filter(([, value]) => value !== undefined)
          .sort((a, b) => a[0].localeCompare(b[0]));

        const castedItem = fromPathEntries(itemEntries);

        return [id, castedItem] as [string, IndexedDef];
      })
      .sort((a, b) => a[0].localeCompare(b[0])),
  );

  console.log(
    template +
      `\nexport const items: Record<string, ItemSpec> = ${
        jsStringify(sorted)
      };`,
  );
};

main().catch(killWithError);
