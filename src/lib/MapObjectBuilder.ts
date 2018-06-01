import * as _ from 'lodash';
import CPPClass from 'aclovis/dist/cpp/CPPClass';
import CPPFunction from 'aclovis/dist/cpp/CPPFunction';
import CPPHelper from 'aclovis/dist/cpp/CPPHelper';
import CPPIfBlock from 'aclovis/dist/cpp/CPPIfBlock';
import CPPVariable from 'aclovis/dist/cpp/CPPVariable';
import CPPVisibility from 'aclovis/dist/cpp/CPPVisibility';
import CPPWritable from 'aclovis/dist/cpp/CPPWritable';
import CPPWritableObject from 'aclovis/dist/cpp/CPPWritableObject';
import { ArgumentType } from './IMapPropertyArgument';
import IMapObject from './IMapObject';

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

    constructor(readonly mapObjects: IMapObject[]) {}

    getMapObjectClasses(): CPPClass[] {
        let classes: CPPClass[] = [];

        this.mapObjects.forEach(function(object: IMapObject) {
            classes.push(MapObjectBuilder.buildMapObjectClass(object));
        });

        return classes;
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

    static buildMapObjectClass(object: IMapObject): CPPClass {
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
