export enum ArgumentType {
    Integer = 'Int',
    Double = 'Double',
    String = 'String',
    Team = 'Team'
}

export interface IMapPropertyArgument {
    name: string;
    argType: ArgumentType;
    readonly: boolean;
}
