import ILicense from './ILicense';
import { IPluginEvent } from './IPluginEvent';
import { CPPFormatter } from 'aclovis';
import IMapObject from './IMapObject';

export default interface IPlugin {
    name: string;
    author: string;
    license: ILicense | null;
    callsign: string;
    events: IPluginEvent[];
    useIfStatement: boolean;
    slashCommands: string[];
    mapObjects: IMapObject[];
    callbacks: string[];
    formatter: CPPFormatter;
    buildDocBlocks: boolean;
    showComments: boolean;
};
