<template>
    <li>
        <label>
            <input type="checkbox" v-model="selected"> {{ event.name }}
        </label>
    </li>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from "vue-property-decorator";

    @Component({
        name: 'plugin-event-list-item'
    })
    export default class PluginEventListItem extends Vue {
        selected: boolean = false;

        @Prop()
        event: IPluginEvent;

        @Watch('selected')
        onSelectedChange() {
            this.$parent.$emit('pluginEventSelectionUpdated', {
                checked: this.selected,
                event: this.event,
            });
        }
    }
</script>
