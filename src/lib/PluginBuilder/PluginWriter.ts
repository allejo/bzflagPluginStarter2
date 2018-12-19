import IPlugin from './IPlugin';
import { CPPClass, CPPFormatter, CPPVisibility } from 'aclovis';
import NameChunk from './ChunkWriter/NameChunk';
import InitChunk from './ChunkWriter/InitChunk';
import EventChunk from './ChunkWriter/EventChunk';
import SlashCommandChunk from './ChunkWriter/SlashCommandChunk';
import CleanupChunk from './ChunkWriter/CleanupChunk';

export default class PluginWriter {
    private readonly pluginClass: CPPClass;

    constructor(private readonly plugin: IPlugin) {
        this.pluginClass = new CPPClass(this.plugin.name);
        this.pluginClass.addExtends([CPPVisibility.Public, 'bz_Plugin']);

        this.handleNameMethod();
        this.handleInitMethod();
        this.handleCleanupMethod();
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

    private handleNameMethod() {
        const nameWriter = new NameChunk(this.pluginClass, this.plugin);
        nameWriter.process();
    }

    private handleInitMethod() {
        const initWriter = new InitChunk(this.pluginClass, this.plugin);
        initWriter.process();
    }

    private handleCleanupMethod() {
        const cleanupWriter = new CleanupChunk(this.pluginClass, this.plugin);
        cleanupWriter.process();
    }

    private handleEvents() {
        const chunkWriter = new EventChunk(this.pluginClass, this.plugin);
        chunkWriter.process();
    }

    private handleSlashCommands() {
        const chunkWriter = new SlashCommandChunk(this.pluginClass, this.plugin);
        chunkWriter.process();
    }

    private handleCallbacks() {}

    private handleMapObjects() {}

    private handleFlags() {}

    private handleBZDBSettings() {}
}
