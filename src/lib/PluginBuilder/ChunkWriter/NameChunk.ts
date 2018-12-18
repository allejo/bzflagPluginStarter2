import IPlugin from '../IPlugin';
import { CPPClass, CPPFunction, CPPVisibility, CPPWritableObject } from 'aclovis';
import { ChunkWriter } from './ChunkWriter';

export default class NameChunk extends ChunkWriter {
    constructor(pluginClass: CPPClass, private readonly pluginDefinition: IPlugin) {
        super();

        this.fxn = new CPPFunction('const char*', 'Name');
        this.fxn.setVirtual(true);
        this.fxn.setParentClass(pluginClass, CPPVisibility.Public);
    }

    process(): void {
        this.fxn.implementFunction([new CPPWritableObject(`return "${this.pluginDefinition.name}";`)]);
    }
}
