import {ILicense} from './ILicense';
import {IPluginEvent} from './IPluginEvent';

export interface IPlugin {
    name: string;
    author: string;
    license: ILicense|null;
    events: IPluginEvent[];
    slashCommands: any[];
}
