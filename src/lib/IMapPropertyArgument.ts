export enum ArgumentType {
    Integer = 'Int',
    Double = 'Double',
    String = 'String',
    Team = 'Team'
}

export interface IMapPropertyArgument {
    name: string;
    type: ArgumentType;
    readonly: boolean;
}
