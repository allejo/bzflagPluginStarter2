import nanoid from 'nanoid';
import { IMapProperty } from './IMapProperty';
import { ArgumentType, IMapPropertyArgument } from './IMapPropertyArgument';
import IMapObject from './IMapObject';

export default class MapObjectHelper {
    static createMapPropertyArgument(): IMapPropertyArgument {
        return {
            uuid: nanoid(),
            name: 'arg',
            type: ArgumentType.Integer,
        };
    }

    static createMapProperty(): IMapProperty {
        return {
            uuid: nanoid(),
            name: 'property',
            readonly: false,
            arguments: [],
        };
    }

    static createMapObject(): IMapObject {
        return {
            uuid: nanoid(),
            name: 'object',
            properties: [
                {
                    uuid: nanoid(),
                    name: 'position|pos',
                    readonly: true,
                    arguments: [
                        {
                            uuid: nanoid(),
                            name: 'x-pos',
                            type: ArgumentType.Float,
                        },
                        {
                            uuid: nanoid(),
                            name: 'y-pos',
                            type: ArgumentType.Float,
                        },
                        {
                            uuid: nanoid(),
                            name: 'z-pos',
                            type: ArgumentType.Float,
                        },
                    ],
                },
                {
                    uuid: nanoid(),
                    name: 'size',
                    readonly: true,
                    arguments: [
                        {
                            uuid: nanoid(),
                            name: 'x-size',
                            type: ArgumentType.Float,
                        },
                        {
                            uuid: nanoid(),
                            name: 'y-size',
                            type: ArgumentType.Float,
                        },
                        {
                            uuid: nanoid(),
                            name: 'z-size',
                            type: ArgumentType.Float,
                        },
                    ],
                },
                {
                    uuid: nanoid(),
                    name: 'rotation|rot',
                    readonly: true,
                    arguments: [
                        {
                            uuid: nanoid(),
                            name: 'rotation',
                            type: ArgumentType.Float,
                        },
                    ],
                },
            ],
        };
    }
}
