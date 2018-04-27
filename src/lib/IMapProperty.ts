import { IMapPropertyArgument } from './IMapPropertyArgument';

export interface IMapProperty {
    name: string;

    arguments: IMapPropertyArgument[];

    readonly: boolean;
}
