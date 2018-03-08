<template>
    <div id="main-app">
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

        <plugin-generator
            :pluginDefinition="plugin"
        />
    </div>
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
import ILanguageFormatter from './alyssa/ILanguageFormatter';

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

    updateFormatter(formatter: ILanguageFormatter) {
        this.plugin.formatter = formatter;
    }
}
</script>
