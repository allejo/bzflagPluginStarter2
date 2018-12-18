import IPlugin from '../IPlugin';
import {
    CPPClass,
    CPPComment,
    CPPFunction,
    CPPHelper,
    CPPIfBlock,
    CPPSwitchBlock,
    CPPVariable,
    CPPVisibility,
    CPPWritable
} from 'aclovis';
import { IChunkWriter } from './IChunkWriter';
import { IEvent } from '../IEvent';

export default class EventChunk implements IChunkWriter {
    private fxn: CPPFunction;

    constructor(pluginClass: CPPClass, private readonly pluginDefinition: IPlugin) {
        this.fxn = new CPPFunction('void', 'Event', [new CPPVariable('bz_EventData*', 'eventData')]);
        this.fxn.setVirtual(true);
        this.fxn.setParentClass(pluginClass, CPPVisibility.Public);
    }

    process(): void {
        const events = Object.keys(this.pluginDefinition.events).sort();

        if (events.length === 0) {
            return;
        }

        let fxnBody = [];

        if (this.pluginDefinition.codeStyle.useIfStatement) {
            fxnBody = [this.buildIfStatement(events)];
        } else {
            fxnBody = [this.buildSwitchBlock(events)];
        }

        this.fxn.implementFunction(fxnBody);
    }

    private buildIfStatement(events: string[]): CPPIfBlock {
        let ifBlock = new CPPIfBlock();

        for (let i = 0; i < events.length; i++) {
            const event = this.pluginDefinition.events[events[i]];

            ifBlock.defineCondition(`eventData->eventType == ${event.name}`, this.buildEventBlock(event));
        }

        return ifBlock;
    }

    private buildSwitchBlock(events: string[]): CPPSwitchBlock {
        let switchBlock = new CPPSwitchBlock('eventData->eventType');

        for (let i = 0; i < events.length; i++) {
            const event = this.pluginDefinition.events[events[i]];

            switchBlock.defineCase(event.name, this.buildEventBlock(event));
        }

        return switchBlock;
    }

    /**
     * Build the body for an individual event.
     *
     * @param event
     */
    private buildEventBlock(event: IEvent): CPPWritable[] {
        const body: CPPWritable[] = [];

        if (this.pluginDefinition.codeStyle.showComments) {
            // Trim because these descriptions may have new lines or extra whitespace
            // Split by new lines because there may be more than one line in these descriptions
            const description = event.description.trim().split('\n');

            // Only add the first line as a description
            body.push(new CPPComment(description.shift(), false));
        }

        // This is a notification event, there's nothing to build
        if (!event.dataType) {
            return body;
        }

        // The pointer to this event's data
        body.push(new CPPVariable(event.dataType, '*data', `(${event.dataType}*)eventData`));

        // Doc blocks have been disabled, so don't render anything else
        if (!this.pluginDefinition.codeStyle.showDocBlocks) {
            return body;
        }

        body.push(CPPHelper.createEmptyLine());

        let docBlock: string[] = [];
        docBlock.push('Data');
        docBlock.push('----');

        let dataTypeMaxLength = EventChunk.maxLengthArray(event.parameters.map(value => value.dataType));
        let varNameMaxLength = EventChunk.maxLengthArray(event.parameters.map(value => value.name));

        for (let i = 0; i < event.parameters.length; i++) {
            const value = event.parameters[i];

            let dataType = EventChunk.rightPad(`(${value.dataType})`, dataTypeMaxLength + 2);
            let varName = EventChunk.rightPad(value.name, varNameMaxLength);

            docBlock.push(`${dataType} ${varName} - ${value.description}`);
        }

        body.push(new CPPComment(docBlock, false));

        return body;
    }

    /**
     * Get the length of the longest string in an array
     *
     * @param elements The array to analyze
     *
     * @returns The length of the longest string
     */
    private static maxLengthArray(elements: string[]): number {
        if (elements.length == 0) {
            return 0;
        }

        let max = elements.reduce(function(prev, curr) {
            return prev.length > curr.length ? prev : curr;
        });

        return max.length;
    }

    /**
     * Add padding to the RHS of a string
     *
     * @param str    The string to work with
     * @param length The desired length of the string
     */
    private static rightPad(str: string, length: number): string {
        // If the string is much longer than the desired length, just leave it be
        if (str.length >= length) {
            return str;
        }

        const remainLen = length - str.length;

        return str + ' '.repeat(remainLen);
    }
}
