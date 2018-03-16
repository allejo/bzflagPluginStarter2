<template>
    <b-row>
        <b-col md="6">
            <b-form-group label="Plug-in Name" label-form="plugin-name">
                <b-form-input type="text" id="plugin-name" v-model="pluginName" placeholder="SAMPLE PLUGIN" />
            </b-form-group>

            <b-form-group label="Plug-in Author" label-form="plugin-author">
                <b-form-input type="text" id="plugin-author" v-model="pluginAuthor" placeholder="John Doe" />
            </b-form-group>
        </b-col>

        <b-col md="6">
            <plugin-license-selector />

            <b-form-group label="BZFlag Callsign" label-form="bzflag-callsign">
                <b-form-input type="text" id="bzflag-callsign" v-model="callsign" placeholder="" />
            </b-form-group>
        </b-col>
    </b-row>
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
    callsign: string = '';

    @Watch('pluginName')
    onPluginNameChange() {
        this.$emit('pluginNameChanged', this.pluginName);
    }

    @Watch('pluginAuthor')
    onPluginAuthorChange() {
        this.$emit('pluginAuthorChanged', this.pluginAuthor);
    }

    @Watch('callsign')
    onCallsignChange() {
        this.$emit('callsignChanged', this.callsign);
    }
}
</script>
