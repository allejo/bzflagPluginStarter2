<template>
    <pre>
    /*
    {{ license }}
    */
    </pre>
</template>

<script>
    import _ from 'lodash';

    export default {
        name: 'PluginBody',
        props: [
            'pluginDefinition',
        ],
        data() {
            return {
                pluginBuilder: {},
            };
        },
        computed: {
            className() {
                if (this.pluginDefinition.name.trim().length === 0) {
                    return 'SAMPLE_PLUGIN';
                }

                let literalNumbers = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
                let pluginClassName = this.pluginDefinition.name.replace(/[^A-Za-z0-9_]/g, '');

                if (!isNaN(parseInt(pluginClassName.charAt(0)))) {
                    pluginClassName = literalNumbers[pluginClassName.charAt(0)] + pluginClassName.substring(1);
                }

                return pluginClassName;
            },
            license() {
                return this.pluginDefinition.license.body
                    .replace('{year}', new Date().getFullYear())
                    .replace('{author}', this.pluginDefinition.author)
                    .replace('{name}', this.pluginDefinition.name)
                ;
            },
            sortedEvents() {
                return _.sortBy(this.pluginDefinition.events, ['name']);
            }
        },
        methods: {
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

                    this.pluginDefinition.slashCommands.forEach(function (command) {
                        // @todo create a function call to bz_registerCustomSlashCommand
                        // initBody.push(LanguageHelpers.createFunctionCall('bz_registerCustomSlashCommand', [
                        //     LanguageHelpers.createString(command),
                        //     'this'
                        // ]));
                    });
                }

                // @todo convert this into a CppClass instance
                // this.pluginBuilder.implementFunction('void', 'Init', initBody);
            },
        },
        watch: {
            'pluginDefinition.events': function (newValue, oldValue) {
                this.buildInitFunction();
            }
        }
    }
</script>
