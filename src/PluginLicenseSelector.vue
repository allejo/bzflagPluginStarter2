<template>
    <div>
        <label for="plugin-license">Plug-in License</label>
        <select v-model="selected">
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

<script>
    import _ from 'lodash';

    var licensesAsText = require.context('../_licenses/', true, /\.txt$/);
    var licenseDictionary = {};

    licensesAsText.keys().forEach(key => {
        let sanitizedKey = key.substr(2, key.length - 6);

        licenseDictionary[sanitizedKey] = {
            name: sanitizedKey,
            body: licensesAsText(key),
        };
    });

    export default {
        name: 'PluginLicenseSelector',
        data() {
            return {
                selected: '',
                licenses: licenseDictionary,
            };
        },
        watch: {
            selected() {
                this.$parent.$emit('pluginLicenseSelected', this.licenses[this.selected]);
            },
        },
    }
</script>
