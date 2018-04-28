import { IMapProperty } from './IMapProperty';
import { ArgumentType, IMapPropertyArgument } from './IMapPropertyArgument';
import IMapObject from './IMapObject';

export default class MapObjectHelper {
    static createMapPropertyArgument(): IMapPropertyArgument {
        return {
            name: 'arg',
            type: ArgumentType.Integer
        };
    }

    static createMapProperty(): IMapProperty {
        return {
            name: 'property',
            readonly: false,
            arguments: []
        };
    }

    static createMapObject(): IMapObject {
        return {
            name: 'object',
            properties: [
                {
                    name: 'position|pos',
                    readonly: true,
                    arguments: [
                        {
                            name: 'x-pos',
                            type: ArgumentType.Float
                        },
                        {
                            name: 'y-pos',
                            type: ArgumentType.Float
                        },
                        {
                            name: 'z-pos',
                            type: ArgumentType.Float
                        }
                    ]
                },
                {
                    name: 'size',
                    readonly: true,
                    arguments: [
                        {
                            name: 'x-size',
                            type: ArgumentType.Float
                        },
                        {
                            name: 'y-size',
                            type: ArgumentType.Float
                        },
                        {
                            name: 'z-size',
                            type: ArgumentType.Float
                        }
                    ]
                },
                {
                    name: 'rotation|rot',
                    readonly: true,
                    arguments: [
                        {
                            name: 'rotation',
                            type: ArgumentType.Float
                        }
                    ]
                }
            ]
        };
    }
}
