<template>
    <pre>
    /*
    {{ license }}
    */

    {{ pluginBody }}
    </pre>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import IPlugin from '../lib/IPlugin';
import CPPClass from '../alyssa/CPPClass';
import CPPHelper from '../alyssa/CPPHelper';
import CPPFunction from '../alyssa/CPPFunction';
import CPPVariable from '../alyssa/CPPVariable';
import { CPPVisibility } from '../alyssa/CPPVisibility';
import CPPFormatter from '../alyssa/CPPFormatter';

@Component({
    name: 'plugin-generator'
})
export default class PluginGenerator extends Vue {
    pluginBuilder: CPPClass;

    @Prop() pluginDefinition: IPlugin;

    created() {
        this.pluginBuilder = new CPPClass(this.className);
        this.pluginBuilder.addExtends([CPPVisibility.Public, 'bz_Plugin']);
    }

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

    get pluginBody() {
        let formatter = new CPPFormatter({
            indentWithSpaces: true,
            indentSpaceCount: 4
        });

        return this.pluginBuilder.write(this.pluginDefinition.formatter || formatter, 0);
    }

    get license() {
        let currentYear = new Date().getFullYear().toString();

        if (this.pluginDefinition.license === null) {
            return `Copyright (C) ${currentYear} ${this.pluginDefinition.author}\nAll rights reserved.`;
        }

        return this.pluginDefinition.license.body
            .replace('{year}', currentYear)
            .replace('{author}', this.pluginDefinition.author)
            .replace('{name}', this.pluginDefinition.name);
    }

    get sortedEvents() {
        return _.sortBy(this.pluginDefinition.events, ['name']);
    }

    buildInitFunction() {
        let initBody: IWritable[] = [];

        // Register events
        this.sortedEvents.forEach(function(event) {
            initBody.push(CPPHelper.createFunctionCall('Register', [event.name]));
        });

        // Register slash commands
        if (this.pluginDefinition.slashCommands.length > 0) {
            if (this.sortedEvents.length > 0) {
                initBody.push(CPPHelper.createEmptyLine());
            }

            this.pluginDefinition.slashCommands.forEach(function(command: any) {
                initBody.push(CPPHelper.createFunctionCall('bz_registerCustomSlashCommand', [`"${command}"`, 'this']));
            });
        }

        // Build our Init() function
        let fxn = new CPPFunction('void', 'name', [CPPVariable.createConstChar('config')]);
        fxn.implementFunction(initBody);
        fxn.setVirtual(true);
        fxn.setParentClass(this.pluginBuilder, CPPVisibility.Public);
    }

    @Watch('pluginDefinition.name')
    onPluginNameUpdateEvent() {
        this.buildInitFunction();
    }

    @Watch('pluginDefinition.events')
    onPluginEventUpdateEvent() {
        this.buildInitFunction();
    }
}
</script>
