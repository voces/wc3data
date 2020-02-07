
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

export interface UnitSpec {
	abil?: {
		abilList: string[];
		heroAbilList?: string[];
		auto?: string;
	};
	art?: {
		buildingShadow?: string;
		customTeamColor: boolean;
		fatLOS: boolean;
		file: string;
		scaleBull: boolean;
		selCircOnWater: boolean;
		shadowOnWater: boolean;
		uberSplat?: UberSplat;
		unitShadow?: "Shadow" | "ShadowFlyer" | "shadow";
	};
	combat: {
		armor?: Armor;
		atkType1: AttackType;
		atkType2: AttackType;
		defType?: DefenseType;
		showUI1: boolean;
		showUI2: boolean;
		targs1?: Target | Target[];
		targs2?: Target | Target[];
		targType?: Target | Target[];
		weapTp1?: Weapon;
		weapTp2?: Weapon;
		weapType1?: WeaponType;
		weapType2?: WeaponType;
		splashTargs1?: Target[];
		splashTargs2?: Target[];
	};
	"comment(s)": string;
	DmgUpg?: "low" | "high";
	editor?: {
		campaign: boolean;
		dropItems: boolean;
		inEditor: boolean;
		special: boolean;
		tilesets?: Tileset[];
		tilesetSpecific: boolean;
		useClickHelper: boolean;
		hostilePal?: boolean;
	};
	hiddenInEditor?: boolean;
	move?: {
		movetp?: MovementType;
		repulse: boolean;
	};
	name?: string;
	path?: {
		buffType?: "factory" | "resource" | "buffer" | "townhall";
		pathTex?: string;
		preventPlace?: "unbuildable" | "unwalkable";
		requirePlace?: "blighted";
	};
	sound?: { unitSound: string };
	stats?: {
		canBuildOn: boolean;
		canFlee: boolean;
		canSleep: boolean;
		hideHeroBar: boolean;
		hideHeroDeathMsg: boolean;
		hideHeroMinimap: boolean;
		hideOnMinimap: boolean;
		isbldg: boolean;
		isBuildOn: boolean;
		race: Race;
		regenType: "night" | "none" | "always" | "blight";
		type?: UnitType[];
		Primary?: "INT" | "AGI" | "STR";
		nbmmIcon?: boolean;
		nbrandom?: boolean;
	};
	tech?: { upgrades: string[] };
	threat?: boolean;
	unitClass?: string;
	valid?: boolean;
	weap1?: WeaponType;
	weap2?: WeaponType;
}
