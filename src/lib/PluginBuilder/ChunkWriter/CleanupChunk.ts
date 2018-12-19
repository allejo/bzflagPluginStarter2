import IPlugin from '../IPlugin';
import { CPPClass, CPPFunction, CPPHelper, CPPVisibility, CPPWritable, CPPWritableObject } from 'aclovis';
import { ChunkWriter } from './ChunkWriter';
import { IMapObject } from '../IMapObject';
import { ISlashCommand } from '../ISlashCommand';
import { IBZDBSetting } from '../IBZDBSetting';
import { IPollType } from '../IPollType';

export default class CleanupChunk extends ChunkWriter {
    constructor(pluginClass: CPPClass, private readonly pluginDefinition: IPlugin) {
        super();

        this.fxn = new CPPFunction('void', 'Cleanup');
        this.fxn.setVirtual(true);
        this.fxn.setParentClass(pluginClass, CPPVisibility.Public);
    }

    process(): void {
        let fxnBody: CPPWritable[] = [new CPPWritableObject('Flush();')];

        this.buildSlashCommandRemoval(fxnBody);
        this.buildMapObjectRemoval(fxnBody);
        this.buildBZDBSettingsRemoval(fxnBody);
        this.buildPollTypeRemoval(fxnBody);

        this.fxn.implementFunction(fxnBody);
    }

    private buildSlashCommandRemoval(body: CPPWritable[]): void {
        this.unregisterFunctionRepeater(
            'slashCommands',
            'bz_removeCustomSlashCommand',
            (object: ISlashCommand): string[] => [`"${object.name}"`],
            body
        );
    }

    private buildMapObjectRemoval(body: CPPWritable[]): void {
        this.unregisterFunctionRepeater(
            'mapObjects',
            'bz_removeCustomMapObject',
            (object: IMapObject): string[] => [`"${object.name}"`],
            body
        );
    }

    private buildBZDBSettingsRemoval(body: CPPWritable[]): void {
        this.unregisterFunctionRepeater(
            'bzdbSettings',
            'bz_removeCustomBZDBVariable',
            (object: IBZDBSetting): string[] => [`"${object.name}"`],
            body
        );
    }

    private buildPollTypeRemoval(body: CPPWritable[]): void {
        this.unregisterFunctionRepeater(
            'pollTypes',
            'bz_removeCustomPollType',
            (object: IPollType): string[] => [`"${object.name}"`],
            body
        );
    }

    private unregisterFunctionRepeater(
        namespace: string,
        functionCall: string,
        functionParams: (object: Object) => string[],
        body: CPPWritable[]
    ): void {
        const objects = this.pluginDefinition[namespace];

        if (Object.keys(objects).length === 0) {
            return;
        }

        body.push(CPPHelper.createEmptyLine());

        for (const name in objects) {
            const object = objects[name];

            body.push(CPPHelper.createFunctionCall(functionCall, functionParams(object)));
        }
    }
}
