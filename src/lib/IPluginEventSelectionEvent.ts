import {IPluginEvent} from './IPluginEvent';

export interface IPluginEventSelectionEvent {
    selected: boolean;
    event: IPluginEvent;
}
