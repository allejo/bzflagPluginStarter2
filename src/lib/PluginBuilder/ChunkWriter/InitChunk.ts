import IPlugin from '../IPlugin';
import { CPPClass, CPPComment, CPPFunction, CPPHelper, CPPVariable, CPPVisibility, CPPWritable } from 'aclovis';
import { IChunkWriter } from './IChunkWriter';

export default class InitChunk implements IChunkWriter {
    private readonly fxn: CPPFunction;

    constructor(private readonly pluginClass: CPPClass, private readonly pluginDefinition: IPlugin) {
        this.fxn = new CPPFunction('void', 'Init', [CPPVariable.createConstChar('config')]);
        this.fxn.setVirtual(true);
        this.fxn.setParentClass(pluginClass, CPPVisibility.Public);
    }

    process(): void {
        const fxnBody: CPPWritable[] = [];

        this.buildEventRegistration(fxnBody);
        this.buildSlashCommandRegistration(fxnBody);
        this.buildCallbackRegistration(fxnBody);
        this.buildMapObjectRegistration(fxnBody);

        this.fxn.implementFunction(fxnBody);
    }

    private buildEventRegistration(body: CPPWritable[]): void {
        for (const eventName in this.pluginDefinition.events) {
            const event = this.pluginDefinition.events[eventName];

            body.push(CPPHelper.createFunctionCall('Register', [event.name]));
        }
    }

    private buildSlashCommandRegistration(body: CPPWritable[]): void {
        const slashCommands = this.pluginDefinition.slashCommands;

        // No slash commands to register
        if (Object.keys(slashCommands).length === 0) {
            return;
        }

        // Only add an empty line if there's content in the body already. We don't
        // want to start the body of a method block with an empty line.
        if (body.length > 0) {
            body.push(CPPHelper.createEmptyLine());
        }

        for (const name in slashCommands) {
            const slashCommand = slashCommands[name];

            body.push(
                CPPHelper.createFunctionCall('bz_registerCustomSlashCommand', [`"${slashCommand.name}"`, 'this'])
            );
        }
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
                'Name()'
            ])
        );
    }

    private buildMapObjectRegistration(body: CPPWritable[]): void {
        const mapObjects = this.pluginDefinition.mapObjects;

        if (Object.keys(mapObjects).length === 0) {
            return;
        }

        if (body.length > 0) {
            body.push(CPPHelper.createEmptyLine());
        }

        for (const name in mapObjects) {
            const mapObject = mapObjects[name];

            body.push(CPPHelper.createFunctionCall('bz_registerCustomMapObject', [`"${mapObject.name}"`, 'this']));
        }
    }
}
