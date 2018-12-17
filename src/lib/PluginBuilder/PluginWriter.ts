import IPlugin from './IPlugin';
import {CPPClass, CPPFormatter} from 'aclovis';
import EventChunk from './ChunkWriter/EventChunk';

export default class PluginWriter {
    private pluginClass: CPPClass;

    constructor(private readonly plugin: IPlugin) {
        this.pluginClass = new CPPClass(this.plugin.name);

        this.handleEvents();
        this.handleSlashCommands();
        this.handleCallbacks();
        this.handleMapObjects();
        this.handleFlags();
        this.handleBZDBSettings();
    }

    write(): string {
        let { codeStyle } = this.plugin;
        let formatter = new CPPFormatter({
            bracesOnNewLine: codeStyle.bracesOnNewLine,
            indentWithSpaces: codeStyle.spacingType === 'tabs',
            indentSpaceCount: codeStyle.spacingType === 'twoSpace' ? 2 : 4,
        });

        return this.pluginClass.write(formatter, 0);
    }

    private handleEvents() {
        const eventChunkWriter = new EventChunk(this.pluginClass, this.plugin);
        eventChunkWriter.process();
    }

    private handleSlashCommands() {

    }

    private handleCallbacks() {

    }

    private handleMapObjects() {

    }

    private handleFlags() {

    }

    private handleBZDBSettings() {

    }
}
