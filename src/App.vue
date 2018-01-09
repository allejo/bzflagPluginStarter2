<template>
    <div id="main-app">
        <plugin-definition
            @pluginLicenseSelected="updateLicense"
        />

        <plugin-event-list
            @pluginEventSelectionUpdated="updateEvent"
        />

        <plugin-generator />
    </div>
</template>

<script>
    import _ from 'lodash';
    import PluginDefinition from './PluginDefinition.vue';
    import PluginEventList from './PluginEventList.vue';
    import Plugin from './Plugin.vue';

    export default {
        name: 'MainApp',
        data() {
            return {
                plugin: {
                    name: 'Sample Plugin',
                    license: {},
                    events: [],
                    slashcommands: [],
                },
            };
        },
        components: {
            'plugin-definition': PluginDefinition,
            'plugin-event-list': PluginEventList,
            'plugin-generator': Plugin,
        },
        methods: {
            updateEvent(eventUpdateEvent) {
                if (eventUpdateEvent.checked) {
                    this.plugin.events.push(eventUpdateEvent.event);
                } else {
                    this.plugin.events = _.without(this.plugin.events, eventUpdateEvent.event);
                }
            },
            updateLicense(licenseUpdateEvent) {
                this.plugin.license = licenseUpdateEvent;
            },
        },
    }
</script>
