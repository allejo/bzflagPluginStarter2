<template>
    <li>
        <label>
            <input type="checkbox" v-model="selected"> {{ event.name }}
        </label>
    </li>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {IPluginEvent} from "../lib/IPluginEvent";
    import {IPluginEventSelectionEvent} from "../lib/IPluginEventSelectionEvent";

    @Component({
        name: 'plugin-event-list-item'
    })
    export default class PluginEventListItem extends Vue {
        selected: boolean = false;

        @Prop()
        event: IPluginEvent;

        @Watch('selected')
        onSelectedChange() {
            let event: IPluginEventSelectionEvent = {
                selected: this.selected,
                event: this.event,
            };

            this.$parent.$emit('pluginEventSelectionUpdated', event);
        }
    }
</script>
