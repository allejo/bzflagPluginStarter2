<template>
    <div id="main-app">
        <plugin-definition
            @pluginLicenseSelected="updateLicense"
        />

        <plugin-event-list
            @pluginEventSelectionUpdated="updateEvent"
        />

        <plugin-generator
            :pluginDefinition="plugin"
        />
    </div>
</template>

<script lang="ts">
    import * as _ from 'lodash';
    import Vue from 'vue';
    import {Component, Emit} from 'vue-property-decorator';
    import {ILicense} from './lib/ILicense';
    import {IPlugin} from './lib/IPlugin';
    import PluginDefinition from './components/PluginDefinition.vue';
    import PluginEventList from './components/PluginEventList.vue';
    import PluginGenerator from './components/PluginGenerator.vue';

    @Component({
        components: {
            PluginDefinition,
            PluginEventList,
            PluginGenerator,
        }
    })
    export default class App extends Vue {
        plugin: IPlugin = {
            name: '',
            author: '',
            license: null,
            events: [],
            slashCommands: [],
        };

        updateEvent(eventUpdateEvent: any) {
            if (eventUpdateEvent.checked) {
                this.plugin.events.push(eventUpdateEvent.event);
            } else {
                this.plugin.events = _.without(this.plugin.events, eventUpdateEvent.event);
            }
        };

        updateLicense(licenseUpdateEvent: ILicense) {
            this.plugin.license = licenseUpdateEvent;
        };
    };
</script>
