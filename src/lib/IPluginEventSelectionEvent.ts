import { IPluginEvent } from './IPluginEvent';

export default interface IPluginEventSelectionEvent {
    selected: boolean;
    event: IPluginEvent;
};
