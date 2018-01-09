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

<script>
    import PluginLicenseSelector from './PluginLicenseSelector.vue';

    export default {
        name: 'PluginDefinition',
        data() {
            return {
                pluginName: '',
                pluginAuthor: '',
            };
        },
        components: {
            'plugin-license-selector': PluginLicenseSelector,
        },
    }
</script>
