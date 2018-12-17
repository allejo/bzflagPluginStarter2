import IPlugin from '../IPlugin';
import { IChunkWriter } from './IChunkWriter';
import { CPPClass, CPPFunction, CPPHelper, CPPIfBlock, CPPVariable, CPPVisibility, CPPWritableObject } from 'aclovis';

export default class SlashCommandChunk implements IChunkWriter {
    private fxn: CPPFunction;
    private readonly notNeeded: boolean = false;

    constructor(pluginClass: CPPClass, private readonly pluginDefinition: IPlugin) {
        const slashCommands = Object.keys(this.pluginDefinition.slashCommands);

        // Don't do anything if this plug-in doesn't have slash commands
        if (slashCommands.length === 0) {
            this.notNeeded = true;
            return;
        }

        pluginClass.addExtends([CPPVisibility.Public, 'bz_CustomSlashCommandHandler']);

        this.fxn = new CPPFunction('bool', 'SlashCommand', [
            CPPVariable.createInt('playerID'),
            new CPPVariable('bz_ApiString', 'command'),
            new CPPVariable('bz_ApiString', '/*message*/'),
            new CPPVariable('bz_APIStringList', '*params')
        ]);
        this.fxn.setVirtual(true);
        this.fxn.setParentClass(pluginClass, CPPVisibility.Public);
    }

    process(): void {
        if (this.notNeeded) {
            return;
        }

        let ifBlock = new CPPIfBlock();

        for (const commandName in this.pluginDefinition.slashCommands) {
            const slashCommand = this.pluginDefinition.slashCommands[commandName];

            ifBlock.defineCondition(`command == "${slashCommand.name}"`, [
                CPPHelper.createEmptyLine(),
                new CPPWritableObject('return true;'),
            ]);
        }

        this.fxn.implementFunction([
            ifBlock,
            CPPHelper.createEmptyLine(),
            new CPPWritableObject('return false;'),
        ]);
    }
}
