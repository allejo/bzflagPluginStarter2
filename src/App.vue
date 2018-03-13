<template>
    <b-container id="main-app">
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

                <plugin-formatter
                    @pluginFormatterChanged="updateFormatter"
                />

                <plugin-event-list
                    @pluginEventSelectionUpdated="updatePluginEvent"
                />
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
import PluginDefinition from './components/PluginDefinition.vue';
import PluginFormatter from './components/PluginFormatter.vue';
import PluginEventList from './components/PluginEventList.vue';
import PluginGenerator from './components/PluginGenerator.vue';
import { CPPFormatter } from 'alyssa';

@Component({
    components: {
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
        formatter: null
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
}
</script>
