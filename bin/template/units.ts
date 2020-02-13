
type Armor = "Stone" | "Flesh" | "Wood" | "Ethereal" | "Metal"
type AttackType = "pierce" | "normal" | "siege" | "chaos" | "hero" | "magic" | "spells"
type DefenseType = "fort" | "medium" | "large" | "divine" | "small" | "hero" | "none"
type Target = "ground" | "structure" | "debris" | "item" | "ward" | "air" | "wall" | "tree" | "enemy" | "neutral" | "notself"
type Weapon = "normal" | "missile" | "artillery" | "msplash" | "mbounce" | "mline" | "instant"
type UberSplat = "EMDA" | "EMDB" | "ESMB" | "ESMA" | "HMED" | "HSMA" | "HCAS" | "HTOW" | "OMED" | "OSMA" | "OLAR" | "DPSE" | "NDGS" | "DPSW" | "NGOL" | "HLAR" | "NLAR" | "USMA" | "UMED" | "ULAR"
type MovementType = "foot" | "float" | "horse" | "fly" | "amph" | "hover"
type Race = "nightelf" | "human" | "naga" | "creeps" | "critters" | "orc" | "demon" | "undead" | "other" | "commoner";
type UnitType = "Ancient" | "Mechanical" | "TownHall" | "Peon" | "Undead" | "Neutral" | "Standon" | "Sapper" | "Ward" | "Tauren"
type WeaponType =
	| "AxeMediumChop"
	| "MetalHeavyBash"
	| "MetalHeavyChop"
	| "MetalHeavySlice"
	| "MetalLightChop"
	| "MetalMediumBash"
	| "MetalMediumChop"
	| "MetalMediumSlice"
	| "RockHeavyBash"
	| "WoodHeavyBash"
	| "WoodLightBash"
	| "WoodMediumBash"
type Tileset = "*" | "A" | "B" | "C" | "D" | "F" | "G" | "I" | "J" | "K" | "L" | "N" | "O" | "Q" | "V" | "W" | "X" | "Y" | "Z"

type CommonArt = {
	castbsw: number;
	castpt?: number;
	impactSwimZ: number;
	impactZ: number;
	launchSwimZ: number;
	launchX: number;
	launchY: number;
	launchZ: number;
}

export interface UnitSpec {
	abil?: {
		abilList: string[];
		heroAbilList?: string[];
		auto?: string;
	};
	abilTest?: number;
	art?: CommonArt | CommonArt & {
		blend: number;
		blue: number;
		buildingShadow: string;
		customTeamColor: boolean;
		death: number;
		elevPts?: 2 | 3 | 4;
		elevRad: number;
		fatLOS: boolean;
		file: string;
		fileVerFlags: 0 | 2;
		fogRad: number;
		green: number;
		maxPitch: number;
		maxRoll: number;
		modelScale: number;
		occH: number;
		orientInterp: 0 | 1 | 2 | 3 | 4 | 5;
		propWin: number;
		red: number;
		run: number;
		scale: number;
		scaleBull: boolean;
		selCircOnWater: boolean;
		selZ: number;
		shadowH?: number;
		shadowOnWater: boolean;
		shadowW?: number;
		shadowX?: number;
		shadowY?: number;
		teamColor: number;
		uberSplat?: UberSplat;
		unitShadow?: "Shadow" | "ShadowFlyer" | "shadow";
		walk: number;
	};
	avgdmg1?: number;
	avgdmg2?: number;
	legacyModelScale?: number;
	legacyScale?: number;
	maxdmg1?: number;
	maxdmg2?: number;
	mindmg1?: number;
	mindmg2?: number;
	mincool1?: number;
	mincool2?: number;
	combat: {
		acquire?: number;
		armor?: Armor;
		atkType1: AttackType;
		atkType2: AttackType;
		backSw1?: number;
		backSw2?: number;
		cool1?: number;
		cool2?: number;
		damageLoss1: number;
		damageLoss2: number;
		deathType?: 0 | 2 | 3;
		def?: number;
		defType?: DefenseType;
		defUp?: number;
		dice1?: number;
		dice2?: number;
		dmgplus1?: number;
		dmgplus2?: number;
		dmgpt1?: number;
		dmgpt2?: number;
		dmgUp2?: number;
		Farea1?: number;
		Farea2?: number;
		Harea1?: number;
		Harea2?: number;
		Hfact1?: number;
		Hfact2?: number;
		minRange?: number;
		Qarea1?: number;
		Qarea2?: number;
		Qfact1?: number;
		Qfact2?: number;
		rangeN1?: number;
		rangeN2?: number;
		RngBuff1?: number;
		RngBuff2?: number;
		showUI1: boolean;
		showUI2: boolean;
		sides1?: number;
		sides2?: number;
		spillDist1: number;
		spillDist2: number;
		spillRadius1: number;
		spillRadius2: number;
		splashTargs1?: Target[];
		splashTargs2?: Target[];
		targCount1?: 1 | 2 | 5;
		targCount2: 1 | 2 | 5;
		targs1?: Target | Target[];
		targs2?: Target | Target[];
		targType?: Target | Target[];
		weapsOn: 0 | 1 | 2 | 3;
		weapTp1?: Weapon;
		weapTp2?: Weapon;
		weapType1?: WeaponType;
		weapType2?: WeaponType;
	};
	"comment(s)": string;
	DmgUpg?: "low" | "high";
	dmod1?: number;
	dmod2?: number;
	DPS?: number;
	editor?: {
		campaign: boolean;
		dropItems: boolean;
		hostilePal?: boolean;
		inEditor: boolean;
		special: boolean;
		tilesets?: Tileset[];
		tilesetSpecific: boolean;
		useClickHelper: boolean;
	};
	hiddenInEditor?: boolean;
	move?: {
		maxSpd: number;
		minSpd: number;
		moveFloor: number;
		moveHeight: number;
		movetp?: MovementType;
		repulse: boolean;
		repulseGroup: 0 | 1 | 2;
		repulseParam: 0 | 1 | 2;
		repulsePrio: 0;
		spd?: number;
		turnRate?: number;
	};
	name?: string;
	path?: {
		buffRadius?: number;
		buffType?: "factory" | "resource" | "buffer" | "townhall";
		collision: number;
		pathTex?: string;
		preventPlace?: "unbuildable" | "unwalkable";
		requirePlace?: "blighted";
		requireWaterRadius: number;
	};
	realdef?: number;
	realHP?: number;
	realM?: number;
	sound?: { unitSound: string };
	stats?: {
		AGI?: number;
		AGIplus?: number;
		bldtm: number;
		bountydice: number;
		bountyplus: number;
		bountysides: number;
		canBuildOn: boolean;
		canFlee: boolean;
		canSleep: boolean;
		cargoSize?: number;
		fmade?: number;
		formation: 0 | 1 | 2 | 3 | 4 | 5 | 6;
		fused?: number;
		goldcost: number;
		goldRep: number;
		hideHeroBar: boolean;
		hideHeroDeathMsg: boolean;
		hideHeroMinimap: boolean;
		hideOnMinimap: boolean;
		HP: number;
		INT?: number;
		INTplus?: number;
		isbldg: boolean;
		isBuildOn: boolean;
		level?: number;
		lumberbountydice: number;
		lumberbountyplus: number;
		lumberbountysides: number;
		lumbercost: number;
		lumberRep: number;
		mana0?: number;
		manaN?: number;
		nbmmIcon?: boolean;
		nbrandom?: boolean;
		nsight: number;
		points: number;
		Primary?: "INT" | "AGI" | "STR";
		prio: number;
		race: Race;
		regenHP?: number;
		regenMana?: number;
		regenType: "night" | "none" | "always" | "blight";
		reptm: number;
		sight: number;
		stockInitial?: number;
		stockMax?: number;
		stockRegen?: number;
		stockStart?: number;
		STR?: number;
		STRplus?: number;
		type?: UnitType[];
	};
	tech?: {
		DependencyOr?: string[];
		upgrades: string[];
	};
	text?: {
		Awakentip?: string;
		Casterupgradename?: string[];
		Casterupgradetip?: string[];
		Description?: string;
		EditorSuffix?: string;
		Hotkey?: string;
		Name: string;
		nameCount?: number;
		Propernames?: string[];
		Revivetip?: string;
		Tip?: string;
		Ubertip?: string;
	};
	threat?: boolean;
	unitClass?: string;
	valid?: boolean;
	version?: 0 | 1;
	weap1?: WeaponType;
	weap2?: WeaponType;
}
