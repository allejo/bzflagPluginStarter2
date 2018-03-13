<template>
    <div>
        <b-form-group label="Plug-in Name" label-form="plugin-name">
            <b-form-input type="text" id="plugin-name" v-model="pluginName" />
        </b-form-group>

        <b-form-group label="Plug-in Author" label-form="plugin-author">
            <b-form-input type="text" id="plugin-author" v-model="pluginAuthor" />
        </b-form-group>

        <plugin-license-selector />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
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
