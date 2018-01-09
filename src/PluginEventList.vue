<template>
    <ul>
        <plugin-event
            v-for="(item, i) in events"
            :event="item"
            :key="i"
        />
    </ul>
</template>

<script>
    import PluginEventListItem from './PluginEventListItem.vue';

    var eventsAsYaml = require.context("../_events/", true, /\.md$/);
    var eventDictionary = {};

    eventsAsYaml.keys().forEach(key => {
        let sanitizedKey = key.substr(2, key.length - 5);

        eventDictionary[sanitizedKey] = _.merge(eventsAsYaml(key), {
            name: sanitizedKey,
        });
    });

    export default {
        name: 'PluginEventList',
        data() {
            return {
                events: eventDictionary,
            };
        },
        components: {
            'plugin-event': PluginEventListItem,
        },
    }
</script>
