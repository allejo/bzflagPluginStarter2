import * as _ from 'lodash';
import CPPClass from 'aclovis/dist/cpp/CPPClass';
import CPPCodeBlock from 'aclovis/dist/cpp/CPPCodeBlock';
import CPPFunction from 'aclovis/dist/cpp/CPPFunction';
import CPPHelper from 'aclovis/dist/cpp/CPPHelper';
import CPPIfBlock from 'aclovis/dist/cpp/CPPIfBlock';
import CPPVariable from 'aclovis/dist/cpp/CPPVariable';
import CPPVisibility from 'aclovis/dist/cpp/CPPVisibility';
import CPPWritable from 'aclovis/dist/cpp/CPPWritable';
import CPPWritableObject from 'aclovis/dist/cpp/CPPWritableObject';
import { ArgumentType, IMapPropertyArgument } from './IMapPropertyArgument';
import IMapObject from './IMapObject';

interface MapObjectStorage {
    cppClass: CPPClass;
    mapDef: IMapObject;
}

export default class MapObjectBuilder {
    static propertyBlacklist = [
        'position|pos',
        'position',
        'pos',
        'size',
        'rotation|rot',
        'rotation',
        'rot',
        'height',
        'radius'
    ];

    private readonly mapObjectDefinitions: { [key: string]: MapObjectStorage } = {};

    readonly mapObjectClasses: CPPClass[] = [];

    constructor(readonly mapObjects: IMapObject[]) {
        this.mapObjects.forEach((object: IMapObject) => {
            let mapObjectClass = this.buildMapObjectClass(object);

            this.mapObjectClasses.push(mapObjectClass);
            this.mapObjectDefinitions[object.name] = {
                cppClass: mapObjectClass,
                mapDef: object
            };
        });
    }

    getMapObjectParseFunction(): CPPFunction | null {
        if (this.mapObjects.length == 0) {
            return null;
        }

        // Storage
        let fxn = new CPPFunction('bool', 'MapObject', [
            new CPPVariable('bz_ApiString', 'object'),
            new CPPVariable('bz_CustomMapObjectInfo*', 'data')
        ]);
        let fxnBody: CPPWritable[] = [new CPPWritableObject('// Note, this value will be in uppercase')];

        fxnBody.push(this.buildShortCircuit());
        fxnBody.push(CPPHelper.createEmptyLine());
        fxnBody.push(...this.buildObjectParsers());
        fxnBody.push(CPPHelper.createEmptyLine());
        fxnBody.push(new CPPWritableObject('return true;'));

        // Finish off the function and register it as a method
        fxn.setVirtual(true);
        fxn.implementFunction(fxnBody);

        return fxn;
    }

    private buildShortCircuit(): CPPWritable {
        let shortCircuitConditions: string[] = [];

        // Main loop of all the objects
        this.mapObjects.forEach(
            function(object: IMapObject) {
                // Register conditions for our short circuit
                shortCircuitConditions.push(`object != "${object.name.toUpperCase()}"`);
            }.bind(this)
        );

        // Build a short circuit condition to ignore all other map objects we didn't register
        shortCircuitConditions.push('!data');

        let shortCircuit = new CPPIfBlock();
        shortCircuit.defineCondition(shortCircuitConditions.join(' || '), [new CPPWritableObject('return false;')]);

        return shortCircuit;
    }

    private buildObjectParsers() {
        let block: CPPWritable[] = [];

        if (Object.keys(this.mapObjectDefinitions).length === 1) {
            _.forEach(this.mapObjectDefinitions, value => {
                block.push(...this.buildObjectParser(value));
            });
        } else {
            let ifBlock: CPPIfBlock = new CPPIfBlock();

            _.forEach(this.mapObjectDefinitions, (value, key) => {
                ifBlock.defineCondition(`object == "${key.toUpperCase()}"`, this.buildObjectParser(value));
            });

            block.push(ifBlock);
        }

        return block;
    }

    private buildObjectParser(definition: MapObjectStorage) {
        let varName = _.lowerFirst(definition.cppClass.getClassName());
        let parserBlock: CPPWritable[] = [];

        parserBlock.push(new CPPVariable(definition.cppClass.getClassName(), varName));
        parserBlock.push(new CPPWritableObject(`${varName}.handleDefaultOptions(data);`));
        parserBlock.push(CPPHelper.createEmptyLine());

        let loop = new CPPCodeBlock('for (unsigned int i = 0; i < data->data.size(); i++)', [
            new CPPVariable('std::string', 'line', 'data->data.get(i)'),
            CPPHelper.createEmptyLine(),
            new CPPVariable('bz_APIStringList', 'nubs'),
            new CPPWritableObject('nubs.tokenize(line.c_str(), " ", 0, true);'),
            CPPHelper.createEmptyLine()
        ]);

        let ifBlock: CPPIfBlock = new CPPIfBlock();

        ifBlock.defineCondition('nubs.size() > 0', [
            new CPPVariable('std::string', 'key', 'bz_toupper(nubs.get(0).c_str())'),
            CPPHelper.createEmptyLine(),
            this.buildPropertyParser(varName, definition.mapDef)
        ]);
        ifBlock.defineElseCondition([]);

        loop.body.push(ifBlock);

        parserBlock.push(loop);

        return parserBlock;
    }

    private buildPropertyParser(varName: string, mapObj: IMapObject): CPPIfBlock {
        let block: CPPIfBlock = new CPPIfBlock();

        mapObj.properties.forEach(value => {
            let body: CPPWritable[] = this.buildPropertyArgumentParsers(varName, value.arguments);

            let propertyNames = value.name.split('|');
            let conditions: string[] = [];

            propertyNames.forEach(propertyName => {
                if (MapObjectBuilder.propertyBlacklist.indexOf(propertyName) >= 0) {
                    return;
                }

                conditions.push(`key == "${propertyName.toUpperCase()}"`);
            });

            if (conditions.length > 0) {
                block.defineCondition(conditions.join(' || '), body);
            }
        });

        return block;
    }

    private buildPropertyArgumentParsers(varName: string, args: IMapPropertyArgument[]) {
        let body: CPPWritable[] = [];

        args.forEach((value, index) => {
            body.push(this.buildPropertyArgumentParser(varName, index + 1, value));
        });

        return body;
    }

    private buildPropertyArgumentParser(
        mapObjName: string,
        index: number,
        argument: IMapPropertyArgument
    ): CPPWritable {
        let line: CPPWritable;

        switch (argument.type) {
            case ArgumentType.Integer:
                line = new CPPWritableObject(`${mapObjName}.${argument.name} = atoi(nubs.get(${index}).c_str());`);
                break;

            case ArgumentType.Float:
                line = new CPPWritableObject(`${mapObjName}.${argument.name} = atof(nubs.get(${index}).c_str());`);
                break;

            case ArgumentType.Double:
                line = new CPPWritableObject(
                    `${mapObjName}.${argument.name} = (double)atof(nubs.get(${index}).c_str());`
                );
                break;

            case ArgumentType.String:
                line = new CPPWritableObject(`${mapObjName}.${argument.name} = nubs.get(${index}).c_str();`);
                break;

            case ArgumentType.Team:
                line = new CPPWritableObject(
                    `${mapObjName}.${argument.name} = (bz_eTeamType)atoi(nubs.get(${index}).c_str());`
                );
                break;

            default:
                break;
        }

        return line;
    }

    private buildMapObjectClass(object: IMapObject): CPPClass {
        let className = _.upperFirst(`${object.name}Zone`);
        let objClass = new CPPClass(className);

        objClass.addExtends([CPPVisibility.Public, 'bz_CustomZoneObject']);
        objClass.setConstructor([], ['bz_CustomZoneObject()']);

        object.properties.forEach(function(property) {
            let namespace = property.name;

            if (MapObjectBuilder.propertyBlacklist.indexOf(namespace) >= 0) {
                return;
            }

            if (property.arguments.length === 0) {
                objClass.addVariable(CPPVariable.createBoolean(namespace), CPPVisibility.Public);
                return;
            }

            property.arguments.forEach(function(argument) {
                let name = `${namespace}_${argument.name}`;
                let variable = null;

                switch (argument.type) {
                    case ArgumentType.Integer:
                        variable = CPPVariable.createInt(name);
                        break;

                    case ArgumentType.Float:
                        variable = CPPVariable.createFloat(name);
                        break;

                    case ArgumentType.Double:
                        variable = CPPVariable.createDouble(name);
                        break;

                    case ArgumentType.String:
                        variable = CPPVariable.createString(name);
                        break;

                    case ArgumentType.Team:
                        variable = new CPPVariable('bz_eTeamType', name);
                        break;

                    default:
                        break;
                }

                objClass.addVariable(variable, CPPVisibility.Public);
            });
        });

        return objClass;
    }
}
