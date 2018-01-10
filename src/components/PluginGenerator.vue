<template>
    <pre>
    /*
    {{ license }}
    */
    </pre>
</template>

<script lang="ts">
    import * as _ from 'lodash';
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {IPlugin} from '../lib/IPlugin';

    @Component({
        name: 'plugin-generator'
    })
    export default class PluginGenerator extends Vue {
        pluginBuilder: any;

        @Prop()
        pluginDefinition: IPlugin;

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

        get license() {
            let currentYear = new Date().getFullYear().toString();

            if (this.pluginDefinition.license === null) {
                return `Copyright (C) ${currentYear} ${this.pluginDefinition.author}\nAll rights reserved.`;
            }

            return this.pluginDefinition.license.body
                .replace('{year}', currentYear)
                .replace('{author}', this.pluginDefinition.author)
                .replace('{name}', this.pluginDefinition.name)
            ;
        }

        get sortedEvents() {
            return _.sortBy(this.pluginDefinition.events, ['name']);
        }

        buildInitFunction() {
            let initBody = [];

            this.sortedEvents.forEach(function (event) {
                // @todo generate a Register();
                // initBody.push(event['name']);
            });

            if (this.pluginDefinition.slashCommands.length > 0) {
                if (this.sortedEvents.length > 0) {
                    // @todo generate a new line
                    // initBody.push()
                }

                this.pluginDefinition.slashCommands.forEach(function (command: any) {
                    // @todo create a function call to bz_registerCustomSlashCommand
                    // initBody.push(LanguageHelpers.createFunctionCall('bz_registerCustomSlashCommand', [
                    //     LanguageHelpers.createString(command),
                    //     'this'
                    // ]));
                });
            }

            // @todo convert this into a CppClass instance
            // this.pluginBuilder.implementFunction('void', 'Init', initBody);
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
