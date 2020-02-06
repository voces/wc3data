
import { inspect } from "util";
import { types, typeIds, Type } from "../../src/types";

export type Value = string | number | boolean | void;

export const typesByField: Record<string, Type[]> = typeIds.reduce(
	( obj, typeIds ) => {

		if ( ! obj[ types[ typeIds ].field ] ) obj[ types[ typeIds ].field ] = [ types[ typeIds ] ];
		else obj[ types[ typeIds ].field ].push( types[ typeIds ] );
		return obj;

	},
	{},
);

const empty = [ "", "_", "-", " - ", "NaN", " ", "@" ];
const _castValue = ( value: string, fieldType: string ): Value => {

	if ( empty.includes( value ) ) return undefined;

	let v;

	switch ( fieldType ) {

		case "int":
		case "deathType":
		case "attackBits":
		case "versionFlags":
		case "teamColor":
			if ( v === undefined ) return v;
			v = parseInt( value );
			if ( isNaN( v ) ) throw new Error( `bad int ${value}` );
			return v;
		case "real":
		case "unreal":
			if ( v === undefined ) return v;
			v = parseFloat( value );
			if ( isNaN( v ) ) throw new Error( `bad float ${value}` );
			return v;
		case "ability":
		case "heroAbility":
		case "regenType":
		case "defenseType":
		case "attributeType":
		case "unitRace":
		case "moveType":
		case "target":
		case "attackType":
		case "weaponType":
		case "model":
		case "unitSound":
		case "armorType":
		case "shadowImage":
		case "combatSound":
		case "unitClass":
		case "upgrade":
		case "abilCode":
		case "pathingListPrevent":
		case "pathingTexture":
		case "aiBuffer":
		case "uberSplat":
		case "shadowTexture":
		case "pathingListRequire":
		case "tileset":
		case "string":
		case "icon":
		case "unit":
		case "char":
		case "item":
			return value;
		case "bool":
			return value === "1";

	}

	throw new Error( `Uncaught cast: value=${inspect( value )} field=${fieldType}` );

};

export const castValue = ( value: string | string[], field: string, fieldDef?: Type ): Value | Value[] => {

	if ( typeof value === "string" && empty.includes( value ) ) return undefined;

	// debugger;
	if ( ! fieldDef ) {

		let v;

		switch ( field ) {

			case "dmod1":
			case "dmod2":
			case "maxdmg1":
			case "avgdmg1":
			case "mindmg1":
			case "maxdmg2":
			case "avgdmg2":
			case "mindmg2":
			case "version":
			case "realM":
			case "realHP":
				if ( v === undefined ) return v;
				v = parseInt( value as string );
				if ( isNaN( v ) ) throw new Error( `bad int ${value}` );
				return v;
			case "legacyModelScale":
			case "mincool1":
			case "mincool2":
			case "legacyScale":
			case "DPS":
			case "abilTest":
			case "realdef":
				if ( v === undefined ) return v;
				v = parseFloat( value as string );
				if ( isNaN( v ) ) throw new Error( `bad float ${value}` );
				return v;
			case "weap1":
			case "weap2":
			case "DmgUpg":
			case "unitClass":
			case "name":
			case "Name":
				return value;
			case "hiddenInEditor":
			case "valid":
			case "threat": // todo: maybe an int?
				return value === "1";
			case "comment(s)":
				return Array.isArray( value ) ?
					value.reduce(
						( longest, value ) => value.length > longest.length ? longest : value,
						"",
					) :
					value;
			case "InBeta":
			case "sortWeap":
			case "sort":
			case "sort2":
			case "sortBalance":
			case "sortAbil":
			case "sortUI":
			case "": // shows up in UnitBalance
			case "undefined": // shows up in UnitWeapons
				return;

		}

		throw new Error( `Uncaught cast: value=${inspect( value )} field=${field}` );

	}

	// eslint-disable-next-line no-extra-parens
	const type = ( fieldDef || ( typesByField[ field ] ) ).type as string;

	if ( type.endsWith( "List" ) ) {

		// eslint-disable-next-line no-extra-parens
		const arr = ( ( value || "" ) as string ).split( "," ).map( value =>
			_castValue( value, type.slice( 0, - 4 ) ) );

		if ( arr.filter( Boolean ).length === 0 ) return undefined;
		else return arr;

	}

	try {

		return _castValue( value as string, type );

	} catch ( err ) {

		console.error( err );
		throw new Error( `bad cast; value: '${value}', field: '${field}', typeof: ${typeof value}` );

	}

};
