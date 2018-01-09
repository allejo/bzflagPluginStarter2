<template>
    <li>
        <label>
            <input type="checkbox" v-model="selected"> {{ event.name }}
        </label>
    </li>
</template>

<script>
    export default {
        name: 'PluginEventListItem',
        props: ['event'],
        data() {
            return {
                selected: false,
            };
        },
        watch: {
            selected() {
                this.$parent.$emit('pluginEventSelectionUpdated', {
                    checked: this.selected,
                    event: this.event,
                });
            },
        },
    }
</script>
