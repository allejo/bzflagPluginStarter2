<template>
    <b-container id="main-app">
        <article class="c-setup pt-4 pb-2">
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
                    <article class="c-accordion">
                        <header v-b-toggle.coding_style role="tab">
                            <h2>Coding Style</h2>
                        </header>

                        <b-collapse id="coding_style" class="c-accordion__body" visible accordion="plugin-builder-accordion" role="tabpanel">
                            <plugin-formatter
                                @pluginFormatterChanged="updateFormatter"
                                @docBlocksConfigChanged="updateDocBlocks"
                                @showCommentsChanged="updateShowComments"
                                @useIfStatementChanged="updateEventBlock"
                            />
                        </b-collapse>
                    </article>

                    <article class="c-accordion">
                        <header v-b-toggle.event_list role="tab">
                            <h2>Plug-in Events</h2>
                        </header>

                        <b-collapse id="event_list" class="c-accordion__body" accordion="plugin-builder-accordion" role="tabpanel">
                            <plugin-event-list
                                @pluginEventSelectionUpdated="updatePluginEvent"
                            />
                        </b-collapse>
                    </article>

                    <article class="c-accordion">
                        <header v-b-toggle.slash_command_editor role="tab">
                            <h2>Custom Slash Commands</h2>
                        </header>

                        <b-collapse id="slash_command_editor" class="c-accordion__body" accordion="plugin-builder-accordion" role="tabpanel">
                            <crud-editor
                                :label="'Slash Command'"
                                :storage="plugin.slashCommands"
                                @crudItemAdd="addSlashCommand"
                                @crudItemRemove="delSlashCommand"
                            />
                        </b-collapse>
                    </article>

                    <article class="c-accordion">
                        <header v-b-toggle.callback_editor role="tab">
                            <h2>Custom Callbacks</h2>
                        </header>

                        <b-collapse id="callback_editor" class="c-accordion__body" accordion="plugin-builder-accordion" role="tabpanel">
                            <crud-editor
                                :label="'Callback'"
                                :storage="plugin.callbacks"
                                @crudItemAdd="addCallback"
                                @crudItemRemove="delCallback"
                            />
                        </b-collapse>
                    </article>
                </div>

                <site-footer />
            </b-col>
            <b-col md="6" class="plugin-preview">
                <plugin-generator
                    :pluginDefinition="plugin"
                />
            </b-col>
        </b-row>
    </b-container>
</template>

<style lang="scss" scoped>
@import 'scss/variables';

$_border: 1px solid $color-light-green;

.c-setup,
.c-accordion {
    border-bottom: $_border;
}

.c-accordion {
    header {
        cursor: pointer;
        padding-bottom: 10px;
        padding-top: 10px;

        h2::before {
            content: '\f107';
            font-family: FontAwesome;
            display: inline-block;
            text-align: center;
            width: 1.5em;
        }

        &.collapsed {
            h2::before {
                content: '\f105';
            }
        }
    }

    h2 {
        color: $color-green;
        font-size: 1.25em;
        font-weight: bold;
        margin: 0;
    }
}

.c-accordion__body {
    border-top: $_border;
    padding: 10px;
}

.plugin-preview {
    position: relative;
}
</style>

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
import SiteFooter from './components/SiteFooter.vue';
import { CPPFormatter } from 'aclovis';

@Component({
    components: {
        CrudEditor,
        PluginDefinition,
        PluginFormatter,
        PluginEventList,
        PluginGenerator,
        SiteFooter
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
