<template>
    <b-container id="main-app">
        <article class="border-bottom pt-4 pb-2 mb-4">
            <h1 class="mb-3">BZFlag Plug-in Starter</h1>

            <p>This tool generates the skeleton for BZFlag 2.4 compatible plug-ins. The documentation and features used on this website are always in sync with the <a href="https://github.com/bzflag-dev/bzflag/tree/2.4">latest BZFlag 2.4.x development branch</a>. If you are not using the latest and greatest version of BZFS, be sure to check minimum requirements.</p>

            <p>Enter the details of your BZFlag plug-in and start inputting information to build the skeleton for your plug-in.</p>

            <plugin-definition
                @pluginNameChanged="updateName"
                @pluginAuthorChanged="updateAuthor"
                @pluginLicenseSelected="updateLicense"
            />
        </article>

        <b-row>
            <b-col md="6">
                <div role="tablist">
                    <b-card no-body>
                        <b-card-header header-tag="header" role="tab">
                            <span v-b-toggle.coding_style>Coding Style</span>
                        </b-card-header>
                        <b-collapse id="coding_style" visible accordion="plugin-builder-accordion" role="tabpanel">
                            <b-card-body>
                                <plugin-formatter
                                    @pluginFormatterChanged="updateFormatter"
                                    @docBlocksConfigChanged="updateDocBlocks"
                                    @showCommentsChanged="updateShowComments"
                                    @useIfStatementChanged="updateEventBlock"
                                />
                            </b-card-body>
                        </b-collapse>
                    </b-card>

                    <b-card no-body>
                        <b-card-header header-tag="header" role="tab">
                            <span v-b-toggle.event_list>Plug-in Events</span>
                        </b-card-header>
                        <b-collapse id="event_list" accordion="plugin-builder-accordion" role="tabpanel">
                            <b-card-body>
                                <plugin-event-list
                                    @pluginEventSelectionUpdated="updatePluginEvent"
                                />
                            </b-card-body>
                        </b-collapse>
                    </b-card>

                    <b-card no-body>
                        <b-card-header header-tag="header" role="tab">
                            <span v-b-toggle.slash_command_editor>Custom Slash Commands</span>
                        </b-card-header>
                        <b-collapse id="slash_command_editor" accordion="plugin-builder-accordion" role="tabpanel">
                            <b-card-body>
                                <crud-editor
                                    :label="'Slash Command'"
                                    :storage="plugin.slashCommands"
                                    @crudItemAdd="addSlashCommand"
                                    @crudItemRemove="delSlashCommand"
                                />
                            </b-card-body>
                        </b-collapse>
                    </b-card>

                    <b-card no-body>
                        <b-card-header header-tag="header" role="tab">
                            <span v-b-toggle.callback_editor>Generic Callbacks</span>
                        </b-card-header>
                        <b-collapse id="callback_editor" accordion="plugin-builder-accordion" role="tabpanel">
                            <b-card-body>
                                <crud-editor
                                    :label="'Callback'"
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
        useIfStatement: false,
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

    updateEventBlock(useIfStatement: boolean) {
        this.plugin.useIfStatement = useIfStatement;
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
