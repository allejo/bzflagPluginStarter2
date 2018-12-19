import IPlugin from '../IPlugin';
import { CPPClass, CPPComment, CPPFunction, CPPHelper, CPPVariable, CPPVisibility, CPPWritable } from 'aclovis';
import { ChunkWriter } from './ChunkWriter';
import { ISlashCommand } from '../ISlashCommand';
import { IEvent } from '../IEvent';
import { BZDBType, IBZDBSetting } from '../IBZDBSetting';
import { IFlag } from '../IFlag';
import { IMapObject } from '../IMapObject';

export default class InitChunk extends ChunkWriter {
    constructor(private readonly pluginClass: CPPClass, private readonly pluginDefinition: IPlugin) {
        super();

        this.fxn = new CPPFunction('void', 'Init', [CPPVariable.createConstChar('config')]);
        this.fxn.setVirtual(true);
        this.fxn.setParentClass(pluginClass, CPPVisibility.Public);
    }

    process(): void {
        const fxnBody: CPPWritable[] = [];

        this.buildCallbackRegistration(fxnBody);
        this.buildEventRegistration(fxnBody);
        this.buildSlashCommandRegistration(fxnBody);
        this.buildBZDBSettingRegistration(fxnBody);
        this.buildFlagRegistration(fxnBody);
        this.buildMapObjectRegistration(fxnBody);

        this.fxn.implementFunction(fxnBody);
    }

    private buildEventRegistration(body: CPPWritable[]): void {
        this.registerFunctionRepeater('events', 'Register', (object: IEvent) => [object.name], body);
    }

    private buildSlashCommandRegistration(body: CPPWritable[]): void {
        this.registerFunctionRepeater(
            'slashCommands',
            'bz_registerCustomSlashCommand',
            (object: ISlashCommand) => [`"${object.name}"`, 'this'],
            body
        );
    }

    private buildBZDBSettingRegistration(body: CPPWritable[]): void {
        this.registerFunctionRepeater(
            'bzdbSettings',
            (object: IBZDBSetting) => {
                switch (object.type) {
                    case BZDBType.Bool:
                        return 'bz_registerCustomBZDBBool';

                    case BZDBType.Double:
                        return 'bz_registerCustomBZDBDouble';

                    case BZDBType.Int:
                        return 'bz_registerCustomBZDBInt';

                    case BZDBType.String:
                        return 'bz_registerCustomBZDBString';
                }
            },
            (object: IBZDBSetting) => {
                let defaultValue = object.value;

                if (object.type === BZDBType.String) {
                    defaultValue = `"${defaultValue}"`;
                } else if (object.type === BZDBType.Bool) {
                    defaultValue = object.type ? 'true' : 'false';
                } else {
                    defaultValue = `${+object.value}`;
                }

                return [`"${object.name}"`, defaultValue, '0', 'false'];
            },
            body
        );
    }

    private buildFlagRegistration(body: CPPWritable[]): void {
        this.registerFunctionRepeater(
            'flags',
            'bz_RegisterCustomFlag',
            (object: IFlag) => [
                `"${object.abbreviation}"`,
                `"${object.name}"`,
                `"${object.helpString}"`,
                '0',
                object.type,
            ],
            body
        );
    }

    private buildMapObjectRegistration(body: CPPWritable[]): void {
        this.registerFunctionRepeater(
            'mapObjects',
            'bz_registerCustomMapObject',
            (object: IMapObject) => [`"${object.name}"`, 'this'],
            body
        );
    }

    private buildCallbackRegistration(body: CPPWritable[]): void {
        const callbacks = this.pluginDefinition.callbacks;

        if (Object.keys(callbacks).length === 0) {
            return;
        }

        if (body.length > 0) {
            body.push(CPPHelper.createEmptyLine());
        }

        if (this.pluginDefinition.codeStyle.showComments) {
            body.push(new CPPComment('Namespace our clip fields to avoid plug-in conflicts', false));
        }

        body.push(
            CPPHelper.createFunctionCall('bz_setclipFieldString', [
                `"${this.pluginDefinition.author.callsign}/${this.pluginClass.getClassName()}"`,
                'Name()',
            ])
        );
    }

    private registerFunctionRepeater(
        namespace: string,
        functionCall: ((object: Object) => string) | string,
        functionParams: (object: Object) => string[],
        body: CPPWritable[]
    ): void {
        const objects = this.pluginDefinition[namespace];

        if (Object.keys(objects).length === 0) {
            return;
        }

        if (body.length > 0) {
            body.push(CPPHelper.createEmptyLine());
        }

        for (const name in objects) {
            const object = objects[name];
            const fxnLiteral = typeof functionCall === 'function' ? functionCall(object) : functionCall;

            body.push(CPPHelper.createFunctionCall(fxnLiteral, functionParams(object)));
        }
    }
}
