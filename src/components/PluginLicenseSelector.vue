<template>
    <div>
        <label for="plugin-license">Plug-in License</label>
        <select id="plugin-license" v-model="selected">
            <option
                v-for="(license, i) in licenses"
                :value="license.name"
                :key="i"
            >
                {{ license.name }}
            </option>
        </select>
    </div>
</template>

<script lang="ts">
    import * as _ from 'lodash';
    import {Vue, Component, Provide, Watch} from 'vue-property-decorator';
    import {ILicense} from "../lib/ILicense";

    interface ILicenseDictionary {
        [key: string]: ILicense;
    }

    let licensesAsText = require.context('../../_licenses/', true, /\.txt$/);
    let licensesDictionary: ILicenseDictionary = {};

    licensesAsText.keys().forEach(key => {
        let sanitizedKey = key.substr(2, key.length - 6);

        licensesDictionary[sanitizedKey] = {
            name: sanitizedKey,
            body: licensesAsText(key),
        };
    });

    @Component({
        name: 'plugin-license-selector'
    })
    export default class PluginLicenseSelector extends Vue {
        selected: string = '';
        licenses: ILicenseDictionary = licensesDictionary;

        @Watch('selected')
        onSelectedChange() {
            this.$parent.$emit('pluginLicenseSelected', this.licenses[this.selected]);
        }
    }
</script>
