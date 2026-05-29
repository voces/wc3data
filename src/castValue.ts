import { typeArray, TypeSpec } from "./types";

export type Value = string | number | boolean | void;

export const typesByField: Record<string, TypeSpec[]> = typeArray.reduce(
  (obj, type) => {
    const field = type.field;
    if (!obj[field]) obj[field] = [type];
    else obj[field].push(type);
    return obj;
  },
  {},
);

const empty = ["", "_", "-", " - ", "NaN", " ", "@"];
const _castValue = (value: string, fieldType: string): Value => {
  if (empty.includes(value)) return undefined;

  // types
  switch (fieldType) {
    case "int":
    case "deathType":
    case "attackBits":
    case "versionFlags":
    case "teamColor": {
      if (value === undefined) return;
      const v = parseInt(value);
      if (isNaN(v)) throw new Error(`bad int ${value}`);
      return v;
    }
    case "real":
    case "unreal": {
      if (value === undefined) return;
      const v = parseFloat(value);
      if (isNaN(v)) throw new Error(`bad float ${value}`);
      return v;
    }
    case "ability":
    case "abilitySkin":
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
    case "itemClass":
    case "upgrade":
    case "abilCode":
    case "tech":
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
    case "soundLabel":
      // this may be wrong; we should maaybe just do this in the iniToObj function
      if (value && value.match(/^".*"$/)) return value.slice(1, -1);
      return value;
    case "bool":
      return value === "1";
    case "unitC": // a hack, since we treat unitClass as a list and chop the last four
      return value[0].toUpperCase() + value.slice(1);
  }

  throw new Error(
    `Uncaught type cast: value=${
      JSON.stringify(
        value,
      )
    } fieldType=${fieldType}`,
  );
};

export const castValue = (
  value: string | string[],
  field: string,
  fieldDef?: TypeSpec,
): Value | Value[] => {
  if (typeof value === "string" && empty.includes(value)) return undefined;

  if (!fieldDef) {
    // values
    switch (field) {
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
      case "realHP": {
        if (value === undefined) return;
        const v = parseInt(value as string);
        if (isNaN(v)) throw new Error(`bad int ${value}`);
        return v;
      }
      case "legacyModelScale":
      case "mincool1":
      case "mincool2":
      case "legacyScale":
      case "DPS":
      case "abilTest":
      case "realdef": {
        if (value === undefined) return;
        const v = parseFloat(value as string);
        if (isNaN(v)) throw new Error(`bad float ${value}`);
        return v;
      }
      case "weap1":
      case "weap2":
      case "DmgUpg":
      case "unitClass":
      case "name":
      case "Name":
      case "scriptname":
        return value;
      case "Animprops": {
        if (typeof value !== "string") return value;
        const arr = value.split(",").map((v) => v.trim()).filter(Boolean);
        return arr.length === 0 ? undefined : arr;
      }
      case "XPFactor": {
        if (typeof value !== "string") return undefined;
        const arr = value.split(",").map((v) => parseFloat(v));
        if (arr.some((v) => isNaN(v))) return undefined;
        return arr.length === 1 ? arr[0] : arr;
      }
      case "InBeta":
      case "hiddenInEditor":
      case "valid":
      case "threat": // todo: maybe an int?
        return value === "1";
      case "comment(s)":
      case "comment":
        return Array.isArray(value)
          ? value.reduce(
            (longest, value) => value.length > longest.length ? longest : value,
            "",
          )
          : value;
      // Skipped: editor-only sort-order strings ("c1a02"-style codes used for
      // ordering fields in the WE property panel — no consumer use case).
      case "sortWeap":
      case "sort":
      case "sort2":
      case "sortBalance":
      case "sortAbil":
      case "sortUI":
      // Skipped: row tagging fields whose value is fully implied by context.
      // `skinType` is always the kind of entity the source file describes;
      // `skinnableID` is a verbatim copy of the row key.
      case "skinType":
      case "skinnableID":
      // Skipped: malformed SLK header cells (empty / literal "undefined" cell
      // names produced by buggy SLK exports in UnitBalance / UnitWeapons).
      case "":
      case "undefined":
        return;
      case "unitC": // a hack, since we treat unitClass as a list and chop the last four
        return value[0].toUpperCase() + value.slice(1);
    }

    throw new Error(
      `Uncaught value cast: value=${
        JSON.stringify(
          value,
        )
      } field=${field}`,
    );
  }

  const type = (fieldDef || typesByField[field]).type as string;

  if (type.endsWith("List") || type === "unitClass") {
    const arr = ((value || "") as string)
      .split(",")
      .map((value) => _castValue(value, type.slice(0, -4)));

    if (arr.filter(Boolean).length === 0) return undefined;
    else return arr;
  }

  try {
    return _castValue(value as string, type);
  } catch (err) {
    console.error(err);
    throw new Error(
      `bad cast; value: '${value}', field: '${field}', typeof: ${typeof value}`,
    );
  }
};
