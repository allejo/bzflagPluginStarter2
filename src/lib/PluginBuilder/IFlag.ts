export enum FlagType {
    Good = 'eGoodFlag',
    Bad = 'eBadFlag',
}

export interface IFlag {
    name: string;
    abbreviation: string;
    helpString: string;
    type: FlagType;
}
