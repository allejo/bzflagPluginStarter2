export enum MapArgumentType {
    Int = 'Int',
    Float = 'Float',
    Double = 'Double',
    String = 'String',
    Team = 'Team'
}

export interface IMapPropertyArgument {
    uuid: string;
    name: string;
    type: MapArgumentType;
    readonly?: boolean;
}

export interface IMapProperty {
    uuid: string;
    name: string;
    arguments: IMapPropertyArgument[];
    readonly: boolean;
}

export interface IMapObject {
    uuid: string;
    name: string;
    properties: IMapProperty[];
}
