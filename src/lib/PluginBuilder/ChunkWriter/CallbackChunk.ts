import IPlugin from '../IPlugin';
import {
    CPPClass,
    CPPFunction,
    CPPHelper,
    CPPIfBlock,
    CPPVariable,
    CPPVisibility,
    CPPWritable,
    CPPWritableObject
} from 'aclovis';
import { ChunkWriter } from './ChunkWriter';

export default class CallbackChunk extends ChunkWriter {
    private readonly notNeeded: boolean = false;

    constructor(pluginClass: CPPClass, private readonly pluginDefinition: IPlugin) {
        super();

        const callbacks = Object.keys(this.pluginDefinition.callbacks);

        if (callbacks.length === 0) {
            this.notNeeded = true;
            return;
        }

        this.fxn = new CPPFunction('int', 'GeneralCallback', [
            CPPVariable.createConstChar('name'),
            new CPPVariable('void*', 'data'),
        ]);
        this.fxn.setVirtual(true);
        this.fxn.setParentClass(pluginClass, CPPVisibility.Public);
    }

    process(): void {
        if (this.notNeeded) {
            return;
        }

        // Write a short-circuit in case `name` is undefined
        const nullCheck = new CPPIfBlock();
        nullCheck.defineCondition('!name', [new CPPWritableObject('return -1;')]);

        // Starting lines of the callback method
        const fxnBody: CPPWritable[] = [
            nullCheck,
            CPPHelper.createEmptyLine(),
            new CPPVariable('std::string', 'callback', 'name'),
            CPPHelper.createEmptyLine(),
        ];

        // Create an if statement for handling each separate callback
        const callbackMatcher = new CPPIfBlock();
        for (const name in this.pluginDefinition.callbacks) {
            const callback = this.pluginDefinition.callbacks[name];

            callbackMatcher.defineCondition(
                `callback == "${callback.name}"`,
                [
                    CPPHelper.createEmptyLine(),
                    new CPPWritableObject('return 1;'),
                ]
            );
        }

        fxnBody.push(callbackMatcher);
        fxnBody.push(CPPHelper.createEmptyLine());
        fxnBody.push(new CPPWritableObject('return 0;'));

        this.fxn.implementFunction(fxnBody);
    }
}
