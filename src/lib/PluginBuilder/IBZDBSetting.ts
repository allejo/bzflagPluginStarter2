export enum BZDBType {
    Bool,
    Double,
    Int,
    String,
}

export interface IBZDBSetting {
    name: string;
    type: BZDBType;
}
