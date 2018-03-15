<template>
    <b-container fluid id="main-app">
        <b-row>
            <b-col md="6">
                <article>
                    <h1>BZFlag Plug-in Starter</h1>

                    <p>This tool will always generate plug-ins including features from the <a href="https://github.com/bzflag-dev/bzflag/tree/2.4">latest BZFlag 2.4.x branch</a>.</p>

                    <p>Enter the details of your BZFlag plug-in and start inputting information to build the skeleton for your plug-in.</p>
                </article>

                <plugin-definition
                    @pluginNameChanged="updateName"
                    @pluginAuthorChanged="updateAuthor"
                    @pluginLicenseSelected="updateLicense"
                />

                <div role="tablist">
                    <b-card no-body>
                        <b-card-header header-tag="header" role="tab">
                            <span v-b-toggle.accordion1>Coding Style</span>
                        </b-card-header>
                        <b-collapse id="accordion1" visible accordion="my-accordion" role="tabpanel">
                            <b-card-body>
                                <plugin-formatter
                                    @pluginFormatterChanged="updateFormatter"
                                    @docBlocksConfigChanged="updateDocBlocks"
                                    @showCommentsChanged="updateShowComments"
                                />
                            </b-card-body>
                        </b-collapse>
                    </b-card>

                    <b-card no-body>
                        <b-card-header header-tag="header" role="tab">
                            <span v-b-toggle.accordion2>Plug-in Events</span>
                        </b-card-header>
                        <b-collapse id="accordion2" accordion="my-accordion" role="tabpanel">
                            <b-card-body>
                                <plugin-event-list
                                    @pluginEventSelectionUpdated="updatePluginEvent"
                                />
                            </b-card-body>
                        </b-collapse>
                    </b-card>

                    <b-card no-body>
                        <b-card-header header-tag="header" role="tab">
                            <span v-b-toggle.accordion3>Custom Slash Commands</span>
                        </b-card-header>
                        <b-collapse id="accordion3" accordion="my-accordion" role="tabpanel">
                            <b-card-body>
                                <crud-editor
                                    :storage="plugin.slashCommands"
                                    @crudItemAdd="addSlashCommand"
                                    @crudItemRemove="delSlashCommand"
                                />
                            </b-card-body>
                        </b-collapse>
                    </b-card>

                    <b-card no-body>
                        <b-card-header header-tag="header" role="tab">
                            <span v-b-toggle.accordion4>Generic Callbacks</span>
                        </b-card-header>
                        <b-collapse id="accordion4" accordion="my-accordion" role="tabpanel">
                            <b-card-body>
                                <crud-editor
                                    :storage="plugin.callbacks"
                                    @crudItemAdd="addCallback"
                                    @crudItemRemove="delCallback"
                                />
                            </b-card-body>
                        </b-collapse>
                    </b-card>
                </div>
            </b-col>
            <b-col md="6">
                <plugin-generator
                    :pluginDefinition="plugin"
                />
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Vue } from 'vue-property-decorator';
import ILicense from './lib/ILicense';
import IPlugin from './lib/IPlugin';
import IPluginEventSelectionEvent from './lib/IPluginEventSelectionEvent';
import CrudEditor from './components/CrudEditor.vue';
import PluginDefinition from './components/PluginDefinition.vue';
import PluginFormatter from './components/PluginFormatter.vue';
import PluginEventList from './components/PluginEventList.vue';
import PluginGenerator from './components/PluginGenerator.vue';
import { CPPFormatter } from 'aclovis';

@Component({
    components: {
        CrudEditor,
        PluginDefinition,
        PluginFormatter,
        PluginEventList,
        PluginGenerator
    }
})
export default class App extends Vue {
    plugin: IPlugin = {
        name: '',
        author: '',
        license: null,
        events: [],
        slashCommands: [],
        callbacks: [],
        formatter: null,
        buildDocBlocks: true,
        showComments: true
    };

    updateName(name: string) {
        this.plugin.name = name;
    }

    updateAuthor(author: string) {
        this.plugin.author = author;
    }

    updateLicense(licenseUpdateEvent: ILicense) {
        this.plugin.license = licenseUpdateEvent;
    }

    updatePluginEvent(eventUpdateEvent: IPluginEventSelectionEvent) {
        if (eventUpdateEvent.selected) {
            this.plugin.events.push(eventUpdateEvent.event);
        } else {
            this.plugin.events = _.without(this.plugin.events, eventUpdateEvent.event);
        }
    }

    updateFormatter(formatter: CPPFormatter) {
        this.plugin.formatter = formatter;
    }

    updateDocBlocks(buildDocBlocks: boolean) {
        this.plugin.buildDocBlocks = buildDocBlocks;
    }

    updateShowComments(showComments: boolean) {
        this.plugin.showComments = showComments;
    }

    addSlashCommand(command: string) {
        command = command.replace(/^\/*|\s/g, '');

        this.plugin.slashCommands.push(command);
    }

    delSlashCommand(command: string) {
        this.plugin.slashCommands = _.without(this.plugin.slashCommands, command);
    }

    addCallback(callback: string) {
        this.plugin.callbacks.push(callback);
    }

    delCallback(callback: string) {
        this.plugin.callbacks = _.without(this.plugin.callbacks, callback);
    }
}
</script>
