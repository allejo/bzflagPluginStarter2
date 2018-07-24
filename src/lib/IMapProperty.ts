import { IMapPropertyArgument } from './IMapPropertyArgument';

export interface IMapProperty {
    uuid: string;
    name: string;
    arguments: IMapPropertyArgument[];
    readonly: boolean;
}
