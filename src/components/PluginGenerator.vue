<template>
    <div>
        <div class="c-toolbar">
            <button class="btn btn-primary" @click="downloadPlugin">
                <span class="fa fa-download" aria-hidden="true"></span>
                <span class="sr-only">Download Plugin</span>
            </button>

            <button class="btn btn-primary" v-clipboard:copy="pluginOutput">
                <span class="fa fa-paste" aria-hidden="true"></span>
                <span class="sr-only">Copy to Clipboard</span>
            </button>
        </div>
        <pre><code id="plugin-body">{{ pluginOutput }}</code></pre>
    </div>
</template>

<style lang="scss" scoped>
div {
    position: relative;
}

pre {
    background-color: #e6e6e6;
    border: 1px solid #cacaca;
    padding: 10px;
}

.c-toolbar {
    position: absolute;
    top: 0;
    right: 0;
}
</style>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import IPlugin from '../lib/IPlugin';
import {
    CPPClass,
    CPPComment,
    CPPHelper,
    CPPFunction,
    CPPIfBlock,
    CPPVariable,
    CPPFormatter,
    CPPWritableObject,
    CPPVisibility,
    ILanguageWritable
} from 'aclovis';
import { IPluginEvent } from '../lib/IPluginEvent';
import CPPSwitchBlock from 'aclovis/dist/cpp/CPPSwitchBlock';
import { saveAs } from 'file-saver';

@Component({
    name: 'plugin-generator'
})
export default class PluginGenerator extends Vue {
    private plugin: CPPClass;

    @Prop() pluginDefinition: IPlugin;

    get className() {
        if (this.pluginDefinition.name.trim().length === 0) {
            return 'SAMPLE_PLUGIN';
        }

        let literalNumbers = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        let pluginClassName = this.pluginDefinition.name.replace(/[^A-Za-z0-9_]/g, '');

        let tryParse = parseInt(pluginClassName.charAt(0));

        if (!isNaN(tryParse)) {
            pluginClassName = literalNumbers[tryParse] + pluginClassName.substring(1);
        }

        return pluginClassName;
    }

    get formatter() {
        let formatter = new CPPFormatter({
            indentWithSpaces: true,
            indentSpaceCount: 4
        });

        return this.pluginDefinition.formatter || formatter;
    }

    get license() {
        let currentYear = new Date().getFullYear().toString();

        if (this.pluginDefinition.license === null) {
            return `Copyright (C) ${currentYear} ${this.pluginDefinition.author}\nAll rights reserved.`;
        }

        let license = this.pluginDefinition.license.body
            .replace('{year}', currentYear)
            .replace('{author}', this.pluginDefinition.author)
            .replace('{name}', this.pluginDefinition.name);

        let licenseBlock = new CPPComment(license.split('\n'), true);

        return licenseBlock.write(this.formatter);
    }

    get sortedEvents(): IPluginEvent[] {
        return _.sortBy(this.pluginDefinition.events, ['name']);
    }

    get pluginCode() {
        this.plugin = new CPPClass(this.className);
        this.plugin.addExtends([CPPVisibility.Public, 'bz_Plugin']);

        if (this.pluginDefinition.slashCommands.length > 0) {
            this.plugin.addExtends([CPPVisibility.Public, 'bz_CustomSlashCommandHandler']);
        }

        this.buildNameFunction();
        this.buildInitFunction(this.sortedEvents);
        this.buildCleanupFunction();
        this.buildEventFunction(
            this.sortedEvents,
            this.pluginDefinition.showComments,
            this.pluginDefinition.buildDocBlocks,
            this.pluginDefinition.useIfStatement
        );
        this.buildCallbackFunction(this.pluginDefinition.callbacks);
        this.buildSlashCommandFunction(this.pluginDefinition.slashCommands);

        let output = this.plugin.write(this.formatter, 0);
        output = output.replace('};', `};\n\nBZ_PLUGIN(${this.className})`);

        return output;
    }

    get pluginOutput() {
        return `${this.license}\n\n${this.pluginCode}`;
    }

    downloadPlugin() {
        let blob = new Blob([this.pluginOutput], {type: 'text/plain;charset=utf-8'});
        saveAs(blob, `${this.className}.cpp`);
    }

    private buildNameFunction(): void {
        let fxn = new CPPFunction('const char*', 'Name');
        fxn.implementFunction([new CPPWritableObject(`return "${this.pluginDefinition.name || 'SAMPLE PLUGIN'}";`)]);

        fxn.setVirtual(true);
        fxn.setParentClass(this.plugin, CPPVisibility.Public);
    }

    private buildInitFunction(events: IPluginEvent[]): void {
        let initBody: CPPWritableObject[] = [];

        // Register events
        events.forEach(function(event: IPluginEvent) {
            initBody.push(CPPHelper.createFunctionCall('Register', [event.name]));
        });

        // Register slash commands
        if (this.pluginDefinition.slashCommands.length > 0) {
            if (events.length > 0) {
                initBody.push(CPPHelper.createEmptyLine());
            }

            this.pluginDefinition.slashCommands.forEach(function(command: any) {
                initBody.push(CPPHelper.createFunctionCall('bz_registerCustomSlashCommand', [`"${command}"`, 'this']));
            });
        }

        // Build our Init() function
        let fxn = new CPPFunction('void', 'Init', [CPPVariable.createConstChar('config')]);
        fxn.implementFunction(initBody);
        fxn.setVirtual(true);
        fxn.setParentClass(this.plugin, CPPVisibility.Public);
    }

    private buildCleanupFunction(): void {
        let fxn = new CPPFunction('void', 'Cleanup');
        let body = [new CPPWritableObject('Flush();')];

        if (this.pluginDefinition.slashCommands.length > 0) {
            body.push(CPPHelper.createEmptyLine());

            this.pluginDefinition.slashCommands.forEach(function(value) {
                body.push(CPPHelper.createFunctionCall('bz_removeCustomSlashCommand', [`"${value}"`]));
            });
        }

        fxn.implementFunction(body);
        fxn.setVirtual(true);
        fxn.setParentClass(this.plugin, CPPVisibility.Public);
    }

    private buildEventFunction(
        events: IPluginEvent[],
        showComments: boolean,
        buildDocBlocks: boolean,
        useIfStatement: boolean
    ): void {
        let fxn = new CPPFunction('void', 'Event', [new CPPVariable('bz_EventData*', 'eventData')]);
        fxn.setVirtual(true);
        fxn.implementFunction(this.buildEventLoop(events, useIfStatement, showComments, buildDocBlocks));

        fxn.setParentClass(this.plugin, CPPVisibility.Public);
    }

    private buildEventLoop(
        events: IPluginEvent[],
        buildWithIfBlock: boolean,
        showComments: boolean,
        buildDocBlocks: boolean
    ): ILanguageWritable[] {
        if (events.length == 0) {
            return [];
        }

        let block = null;

        if (buildWithIfBlock) {
            block = new CPPIfBlock();

            events.forEach(function(event) {
                block.defineCondition(
                    `eventData->eventType == ${event.name}`,
                    PluginGenerator.buildEventBlock(event, showComments, buildDocBlocks)
                );
            });
        } else {
            block = new CPPSwitchBlock('eventData->eventType');

            events.forEach(function(event) {
                block.defineCase(event.name, PluginGenerator.buildEventBlock(event, showComments, buildDocBlocks));
            });
        }

        return [block];
    }

    private buildCallbackFunction(callbacks: string[]): void {
        if (callbacks.length == 0) {
            return;
        }

        let fxn = new CPPFunction('int', 'GeneralCallback', [
            CPPVariable.createConstChar('name'),
            new CPPVariable('void*', 'data')
        ]);

        let body: ILanguageWritable[] = [
            new CPPVariable('std::string', 'callback', 'name'),
            CPPHelper.createEmptyLine()
        ];

        let callbackMatching = new CPPIfBlock();

        callbacks.forEach(function(value) {
            callbackMatching.defineCondition(`callback == "${value}"`, [
                CPPHelper.createEmptyLine(),
                new CPPWritableObject('return 1;')
            ]);
        });

        body.push(callbackMatching);
        body.push(CPPHelper.createEmptyLine());
        body.push(new CPPWritableObject('return 0;'));

        fxn.setVirtual(true);
        fxn.implementFunction(body);
        fxn.setParentClass(this.plugin, CPPVisibility.Public);
    }

    private buildSlashCommandFunction(slashCommands: string[]): void {
        if (slashCommands.length == 0) {
            return;
        }

        let fxn = new CPPFunction('bool', 'SlashCommand', [
            CPPVariable.createInt('playerID'),
            new CPPVariable('bz_ApiString', 'command'),
            new CPPVariable('bz_ApiString', '/*message*/'),
            new CPPVariable('bz_APIStringList', '*params')
        ]);

        let commandBlock = new CPPIfBlock();

        slashCommands.forEach(function(value) {
            commandBlock.defineCondition(`command == "${value}"`, [
                CPPHelper.createEmptyLine(),
                new CPPWritableObject('return true;')
            ]);
        });

        fxn.setVirtual(true);
        fxn.implementFunction([commandBlock, CPPHelper.createEmptyLine(), new CPPWritableObject('return false;')]);
        fxn.setParentClass(this.plugin, CPPVisibility.Public);
    }

    private static buildEventBlock(
        event: IPluginEvent,
        showComments: boolean,
        buildDocBlock: boolean
    ): ILanguageWritable[] {
        let body: ILanguageWritable[] = [];

        if (showComments) {
            // Trim because these descriptions may have new lines or extra whitespace
            // Split by new lines because there may be more than one line in these descriptions
            let description = event.description.trim().split('\n');

            // Don't output empty lines, so compact the description array
            body.push(new CPPComment(_.compact(description), false));
        }

        // If this is a notification only event, don't build a doc block
        if (!event.dataType) {
            return body;
        }

        // The pointer to this event's data
        body.push(new CPPVariable(event.dataType, '*data', `(${event.dataType}*)eventData`));

        if (buildDocBlock) {
            body.push(CPPHelper.createEmptyLine());

            let docBlock: string[] = [];

            docBlock.push('Data');
            docBlock.push('----');

            let dataTypeMaxLength = PluginGenerator.maxLengthArray(_.map(event.parameters, 'dataType'));
            let varNameMaxLength = PluginGenerator.maxLengthArray(_.map(event.parameters, 'name'));

            event.parameters.forEach(function(value) {
                let dataType = _.padEnd(`(${value.dataType})`, dataTypeMaxLength + 2);
                let varName = _.padEnd(value.name, varNameMaxLength);

                docBlock.push(`${dataType} ${varName} - ${value.description}`);
            });

            body.push(new CPPComment(docBlock, false));
        }

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
}
</script>
