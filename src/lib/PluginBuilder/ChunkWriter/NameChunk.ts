import IPlugin from '../IPlugin';
import { CPPClass, CPPFunction, CPPVisibility, CPPWritableObject } from 'aclovis';
import { IChunkWriter } from './IChunkWriter';

export default class NameChunk implements IChunkWriter {
    private fxn: CPPFunction;

    constructor(pluginClass: CPPClass, private readonly pluginDefinition: IPlugin) {
        this.fxn = new CPPFunction('const char*', 'Name');
        this.fxn.setVirtual(true);
        this.fxn.setParentClass(pluginClass, CPPVisibility.Public);
    }

    process(): void {
        this.fxn.implementFunction([new CPPWritableObject(`return "${this.pluginDefinition.name}";`)]);
    }
}
