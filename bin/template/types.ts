
type Type = "abilityList" | "armorType" | "itemClass" | "int" | "abilCode" | "bool"
	| "model" | "real" | "stringList" | "icon" | "string" | "soundLabel" | "unitList"
	| "char" | "itemList" | "unreal" | "techList" | "intList" | "upgradeList" | "modelList"
	| "heroAbilityList" | "defenseType" | "pathingListPrevent" | "attributeType"
	| "regenType" | "pathingListRequire" | "tilesetList" | "unitClass" | "aiBuffer" | "deathType"
	| "moveType" | "pathingTexture" | "unitRace" | "targetList" | "shadowTexture"
	| "versionFlags" | "teamColor" | "uberSplat" | "shadowImage" | "unitSound" | "attackType"
	| "attackBits" | "weaponType" | "combatSound"

type Slks = "ItemData" | "Profile" | "UnitAbilities" | "UnitBalance" | "UnitData" | "UnitUI"
	| "UnitWeapons"

export interface TypeSpec {
	ID: string;
	field: string;
	slk: Slks;
	index: - 1 | 0 | 1;
	category: string;
	displayName: string;
	sort: string | undefined;
	type: Type;
	changeFlags: "s" | "c" | "m" | "i" | "t" | undefined;
	importType: "Model" | "Image" | undefined;
	stringExt: 0 | 1 | 3;
	caseSens: 0 | 1;
	canBeEmpty: 0 | 1;
	minVal: number | undefined;
	maxVal: number | undefined | "TTDesc" | "TTName" | "TTUber";
	forceNonNeg: 0 | 1;
	useHero: 0 | 1;
	useUnit: 0 | 1;
	useBuilding: 0 | 1;
	useItem: 0 | 1;
	useSpecific: undefined;
	version: 0 | 1;
}
