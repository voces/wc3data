/* eslint-disable no-console */

import glob from "fast-glob";
import { readFile } from "fs/promises";
import path from "path";
import process from "node:process";

import { jsStringify } from "./util/jsStringify";
import { slkToTable } from "./util/slkToTable";
import { tableToObjs } from "./util/tableToObjs";

const input = process.argv[2] || "data";

const main = async () => {
  const slkPaths = await glob(path.join(input, "*MetaData.slk"));
  if (slkPaths.length === 0) {
    throw new Error(`No slk files found at ${input}`);
  }

  const template = await readFile("./bin/template/types.ts", "utf-8");
  const slkFiles = await Promise.all(
    slkPaths.map((tsvPath) => readFile(tsvPath, "utf-8").then(slkToTable)),
  );

  const types = slkFiles
    .map((file) => tableToObjs(file))
    .flat()
    .reduce(
      (obj, type) => {
        if (typeof type.ID !== "string") {
          throw new Error(`Type has bad id ${type.ID}`);
        }
        if (obj[type.ID]) {
          throw new Error(`Duplicate types ${type.ID}`);
        }
        obj[type.ID] = type;

        return obj;
      },
      {} as Record<string, Record<string, unknown>>,
    );

  console.log(template);
  console.log(
    `export const types: Record<string, TypeSpec> = ${jsStringify(types)};`,
  );
  console.log("");
  console.log("export const typeArray = Object.values(types);");
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
