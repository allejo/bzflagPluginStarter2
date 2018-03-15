import ILicense from './ILicense';
import { IPluginEvent } from './IPluginEvent';
import { CPPFormatter } from 'aclovis';

export default interface IPlugin {
    name: string;
    author: string;
    license: ILicense | null;
    events: IPluginEvent[];
    slashCommands: string[];
    formatter: CPPFormatter;
    buildDocBlocks: boolean;
    showComments: boolean;
};
