type Armor = "Stone" | "Flesh" | "Wood" | "Ethereal" | "Metal";
type ItemClass =
  | "Permanent"
  | "Charged"
  | "PowerUp"
  | "Artifact"
  | "Purchasable"
  | "Campaign"
  | "Miscellaneous";

export interface ItemSpec {
  abil?: {
    abilList: string[];
  };
  art?: {
    Art?: string;
    colorB?: number;
    colorG?: number;
    colorR?: number;
    file?: string;
    scale?: number;
    selSize?: number;
  };
  combat?: {
    armor?: Armor;
  };
  comment?: string;
  scriptname?: string;
  stackMax?: number;
  stats: {
    class: ItemClass;
    cooldownID?: string;
    drop: boolean;
    droppable: boolean;
    goldcost: number;
    HP: number;
    ignoreCD: boolean;
    Level: number;
    lumbercost: number;
    morph: boolean;
    oldLevel?: number;
    pawnable: boolean;
    perishable: boolean;
    pickRandom: boolean;
    powerup: boolean;
    prio: number;
    sellable: boolean;
    stockInitial?: number;
    stockMax?: number;
    stockRegen?: number;
    stockStart?: number;
    usable: boolean;
    uses?: number;
  };
  tech?: {
    Requires?: string[];
  };
  text?: {
    Description?: string;
    Hotkey?: string;
    Name: string;
    Tip?: string;
    Ubertip?: string;
  };
  version?: number;
}
