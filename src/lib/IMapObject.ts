import { IMapProperty } from './IMapProperty';

export default interface IMapObject {
    uuid: string;
    name: string;
    properties: IMapProperty[];
};
