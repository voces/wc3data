#!/usr/bin/env node --experimental-modules --no-warnings
// Builds types.js from unit .slk files

import { promises as fs } from "fs";
import path from "path";
import glob from "fast-glob";
import { jsStringify } from "./util/jsStringify";
import { slkToTable } from "./util/slkToTable";
import { tableToObjs } from "./util/tableToObjs";

const killWithError = ( err: string ): void => {

	console.error( err );
	process.exit( 1 );

};

const input = process.argv[ 2 ] || "data";

glob( path.join( input, "*MetaData.slk" ) )
	.then( slkPaths => {

		if ( slkPaths.length === 0 ) throw new Error( `No slk files found at ${input}` );

		return Promise.all( slkPaths.map( tsvPath =>
			fs.readFile( tsvPath, "utf-8" )
				.then( slkToTable ),
		) );

	} )
	.then( slkFiles => slkFiles
		.map( file => tableToObjs( file ) )
		.flat()
		.reduce(
			( obj, type ) => {

				if ( typeof type.ID !== "string" ) throw new Error( `Type has bad id ${type.ID}` );
				if ( obj[ type.ID ] ) throw new Error( `Duplicate types ${type.ID}` );
				obj[ type.ID ] = type;

				return obj;

			},
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			{} as Record<string, Record<string, any>>,
		),

	)
	.then( async types => {

		[
			"",
			`export const types = ${jsStringify( types )};`,
			"",
			"export const typeArray = Object.values( types );",
			"export type TypeId = keyof typeof types;",
			"export const typeIds = Object.keys( types ) as Array<TypeId>;",
			"export type Type = typeof types[TypeId];",
			"",
		].forEach( v => console.log( v ) );

	} )
	.catch( killWithError );
