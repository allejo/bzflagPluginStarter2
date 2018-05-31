<template>
    <div>
        <label for="plugin-license">Plug-in License</label>
        <b-form-select id="plugin-license" v-model="selected" class="mb-3">
            <option
                v-for="(license, i) in licenses"
                :value="license.name"
                :key="i"
            >
                {{ license.name }}
            </option>
        </b-form-select>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import ILicense from '../lib/ILicense';

interface ILicenseDictionary {
    [key: string]: ILicense;
}

let licensesAsText = require.context('../licenses/', true, /\.txt$/);
let licensesDictionary: ILicenseDictionary = {};

licensesAsText.keys().forEach(key => {
    let sanitizedKey = key.substr(2, key.length - 6);

    licensesDictionary[sanitizedKey] = {
        name: sanitizedKey,
        body: licensesAsText(key)
    };
});

@Component({
    name: 'plugin-license-selector'
})
export default class PluginLicenseSelector extends Vue {
    selected: string = 'Proprietary';
    licenses: ILicenseDictionary = licensesDictionary;

    created() {
        this.requestSelectionUpdate();
    }

    @Watch('selected')
    requestSelectionUpdate() {
        this.$parent.$emit('pluginLicenseSelected', this.licenses[this.selected]);
    }
}
</script>
