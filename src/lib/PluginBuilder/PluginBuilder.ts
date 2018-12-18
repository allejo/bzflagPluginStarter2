import IPlugin from './IPlugin';
import { IBZDBSetting } from './IBZDBSetting';
import { ICallback } from './ICallback';
import { IEvent } from './IEvent';
import { IFlag } from './IFlag';
import { IMapObject } from './IMapObject';
import { ISlashCommand } from './ISlashCommand';
import { NullLicense } from './ILicense';

export default class PluginBuilder {
    public definition: IPlugin;

    constructor() {
        this.definition = {
            name: 'Sample Plugin',
            author: {
                copyright: '',
                callsign: ''
            },
            license: NullLicense,
            codeStyle: {
                useIfStatement: false,
                bracesOnNewLine: true,
                spacingType: 'fourSpace',
                showDocBlocks: true,
                showComments: true
            },
            events: {},
            slashCommands: {},
            callbacks: {},
            mapObjects: {},
            flags: {},
            bzdbSettings: {}
        };

        Object.seal(this.definition);
    }

    addEvent(event: IEvent) {
        this.definition.events[event.name] = event;
    }

    removeEvent(event: IEvent | String | string) {
        this.safeRemove('events', event, 'name');
    }

    addSlashCommand(command: ISlashCommand) {
        this.definition.slashCommands[command.name] = command;
    }

    removeSlashCommand(command: ISlashCommand | String | string) {
        this.safeRemove('slashCommands', command, 'name');
    }

    addCallback(callback: ICallback) {
        this.definition.callbacks[callback.name] = callback;
    }

    removeCallback(callback: ICallback | String | string) {
        this.safeRemove('callbacks', callback, 'name');
    }

    addMapObject(mapObject: IMapObject) {
        this.definition.mapObjects[mapObject.name] = mapObject;
    }

    removeMapObject(mapObject: IMapObject | String | string) {
        this.safeRemove('mapObjects', mapObject, 'name');
    }

    addFlag(flag: IFlag) {
        this.definition.flags[flag.abbreviation] = flag;
    }

    removeFlag(flag: IFlag | String | string) {
        this.safeRemove('flags', flag, 'abbreviation');
    }

    addBZDBSetting(bzdbSetting: IBZDBSetting) {
        this.definition.bzdbSettings[bzdbSetting.name] = bzdbSetting;
    }

    removeBZDBSetting(bzdbSetting: IBZDBSetting | String | string) {
        this.safeRemove('bzdbSettings', bzdbSetting, 'name');
    }

    private safeRemove(namespace: string, key: Object | String | string, secondaryKey: string = null) {
        let targetToRemove: string = null;

        if (typeof key === 'string') {
            targetToRemove = key;
        } else if (key instanceof String) {
            targetToRemove = key.valueOf();
        } else if (secondaryKey != null) {
            targetToRemove = key[secondaryKey];
        }

        if (targetToRemove === null) {
            throw Error('Cannot safely remove a value if the target key is null');
        }

        delete this.definition[namespace][targetToRemove];
    }
}
