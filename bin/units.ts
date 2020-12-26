#!/usr/bin/env node --experimental-modules --no-warnings
// Builds units.ts from slk files

/* eslint-disable no-console */

import glob from "fast-glob";
import { promises as fs } from "fs";
import { inspect } from "util";

import { castValue, typesByField, Value as CastValue } from "../src/castValue";
import { iniToObjs } from "./util/iniToObjs";
import { jsStringify } from "./util/jsStringify";
import { slkToTable } from "./util/slkToTable";

const UNIT_SLKS = [
	"UnitAbilities",
	"UnitUI",
	"UnitBalance",
	"UnitData",
	"Profile",
	"UnitWeapons",
];

type Value = CastValue | CastValue[];
type Def = Record<string, Value>;
type IndexedDef = Def | { [key: string]: IndexedDef };

const killWithError = (err: string): void => {
	console.error(err);
	process.exit(1);
};

const input = process.argv[2] || "data/units";

const fromPathEntries = (
	arr: [string, string | number | boolean | void | Value[]][],
): IndexedDef => {
	const obj: IndexedDef = {};

	if (!Array.isArray(arr))
		throw new Error(`not an array: ${inspect(arr, true, 10, true)}`);

	for (const [path, value] of arr) {
		const parts = path.split(".");
		let cur: IndexedDef | IndexedDef[] = obj;
		for (const part of parts.slice(0, -1))
			cur = cur[part] || (cur[part] = isNaN(parseInt(part)) ? {} : []);

		if (cur[parts[parts.length - 1]])
			throw new Error(`Redefining unit property ${path}`);
		cur[parts[parts.length - 1]] = value;
	}

	return obj;
};

const untyped = (data: Array<string | number | boolean>[]): string[][] =>
	data.map((r) => r.map((v) => v.toString()));

// const dir = "data/1.31.1.12164/units/raw";
glob(input + "/*.(slk|txt)")
	.then((paths) => {
		if (paths.length === 0) throw new Error(`No files found at ${input}`);

		return Promise.all([
			fs.readFile("./bin/template/units.ts", "utf-8"),
			Promise.all(
				paths
					.filter((path) => path.endsWith(".slk"))
					.map((path) =>
						fs
							.readFile(path, "utf-8")
							.then(slkToTable)
							.then(untyped),
					),
			),
			Promise.all(
				paths
					.filter((path) => path.endsWith(".txt"))
					.map((path) => fs.readFile(path, "utf-8").then(iniToObjs)),
			),
		]);
	})
	.then(([template, tsvs, inis]) => {
		const units: Record<string, Record<string, string | string[]>> = {};
		for (const tsv of tsvs) {
			const header = tsv[0];
			for (const row of tsv.slice(1)) {
				const unit = units[row[0]] || (units[row[0]] = {});
				for (let i = 1; i < row.length; i++) {
					const column = header[i];
					const value = row[i];
					const existingValue = unit[column];
					if (existingValue !== undefined) {
						if (Array.isArray(existingValue)) {
							if (!existingValue.includes(value))
								existingValue.push(value);
						} else if (existingValue !== value)
							unit[column] = [existingValue, value];
					} else unit[column] = value;
				}
			}
		}

		for (const ini of inis)
			for (const [unitId, values] of Object.entries(ini)) {
				const unit = units[unitId];
				if (unit) Object.assign(unit, values);
			}

		const sorted = Object.fromEntries(
			Object.entries(units)
				.map(([id, unit]) => {
					const rawUnitEntries: [
						string,
						Value | Value[],
					][] = Object.entries(unit).map(([field, value]) => {
						const types = typesByField[field];
						const filteredTypes = types
							? types.filter((v) => UNIT_SLKS.includes(v.slk))
							: [];
						const type =
							filteredTypes.length === 1
								? filteredTypes[0]
								: undefined;

						return [
							type && type.category
								? `${type.category}.${field}`
								: field,
							castValue(value, field, type),
						];
					});

					const unitEntries = rawUnitEntries
						.filter(([, value]) => value !== undefined)
						.sort((a, b) => a[0].localeCompare(b[0]));

					const castedUnit = fromPathEntries(unitEntries);

					return [id, castedUnit] as [string, IndexedDef];
				})
				.sort((a, b) => a[0].localeCompare(b[0])),
		);

		console.log(
			template +
				`\nexport const units: Record<string, UnitSpec> = ${jsStringify(
					sorted,
				)};`,
		);
	})
	.catch(killWithError);
