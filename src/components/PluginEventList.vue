<template>
    <ul>
        <plugin-event-list-item
            v-for="(item, i) in events"
            :event="item"
            :key="i"
        />
    </ul>
</template>

<script lang="ts">
    /// <reference path="../lib/IPluginEvent.ts" />

    import Vue from 'vue';
    import {Component} from 'vue-property-decorator';
    import PluginEventListItem from './PluginEventListItem.vue';

    let eventsAsYaml = require.context("../../_events/", true, /\.md$/);
    let eventsDictionary: { [key: string]: IPluginEvent } = {};

    eventsAsYaml.keys().forEach(key => {
        let sanitizedKey = key.substr(2, key.length - 5);
        let eventDefinition = eventsAsYaml(key);

        eventsDictionary[sanitizedKey] = {
            name: sanitizedKey,
            since: eventDefinition.attributes.since,
            dataType: eventDefinition.attributes.dataType,
            description: eventDefinition.body,
            parameters: eventDefinition.attributes.parameters,
        };
    });

    @Component({
        components: {
            PluginEventListItem
        }
    })
    export default class PluginEventList extends Vue {
        events = eventsDictionary;
    }
</script>
