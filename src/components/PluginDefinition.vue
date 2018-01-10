<template>
    <div>
        <div>
            <label for="plugin-name">Plug-in Name</label>
            <input type="text" id="plugin-name" v-model="pluginName">
        </div>

        <div>
            <label for="plugin-author">Plug-in Author</label>
            <input type="text" id="plugin-author" v-model="pluginAuthor">
        </div>

        <plugin-license-selector />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Watch } from "vue-property-decorator";
    import PluginLicenseSelector from './PluginLicenseSelector.vue';

    @Component({
        name: 'plugin-definition',
        components: {
            PluginLicenseSelector
        }
    })
    export default class PluginDefinition extends Vue {
        pluginName: string = '';
        pluginAuthor: string = '';

        @Watch('pluginName')
        onPluginNameChange() {
            this.$emit('pluginNameChanged', this.pluginName);
        }

        @Watch('pluginAuthor')
        onPluginAuthorChange() {
            this.$emit('pluginAuthorChanged', this.pluginAuthor);
        }
    }
</script>
