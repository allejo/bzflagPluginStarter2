import ILanguageFormatter from '../alyssa/ILanguageFormatter';
import ILicense from './ILicense';
import { IPluginEvent } from './IPluginEvent';

export default interface IPlugin {
    name: string;
    author: string;
    license: ILicense | null;
    events: IPluginEvent[];
    slashCommands: any[];
    formatter: ILanguageFormatter | null;
};
