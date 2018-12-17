export enum FlagType {
    Good,
    Bad,
}

export interface IFlag {
    name: string;
    abbreviation: string;
    helpString: string;
    type: FlagType;
}
