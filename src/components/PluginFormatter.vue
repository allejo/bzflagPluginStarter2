<template>
    <div>
        <section>
            <b-form-group label="Spacing Preferences">
                <b-form-radio-group v-model="spacingFormat" stacked>
                    <b-form-radio value="2-spaces">2 Spaces</b-form-radio>
                    <b-form-radio value="4-spaces">4 Spaces</b-form-radio>
                    <b-form-radio value="tabs">Tabs</b-form-radio>
                </b-form-radio-group>
            </b-form-group>
        </section>

        <section>
            <h3>Coding Style</h3>

            <b-form-checkbox v-model="bracesOnNewLine">
                Braces on new line
            </b-form-checkbox>
        </section>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { CPPFormatter } from 'alyssa';

@Component({
    name: 'plugin-formatter'
})
export default class PluginFormatter extends Vue {
    spacingFormat: string = '4-spaces';
    bracesOnNewLine: boolean = true;

    get formatterSettings() {
        return this.spacingFormat, this.bracesOnNewLine, Date.now();
    }

    get formatter() {
        return new CPPFormatter({
            indentWithSpaces: this.spacingFormat != 'tabs',
            indentSpaceCount: this.spacingFormat == '2-spaces' ? 2 : 4,
            bracesOnNewLine: this.bracesOnNewLine
        });
    }

    @Watch('formatterSettings')
    onPluginFormatterChange() {
        this.$emit('pluginFormatterChanged', this.formatter);
    }
}
</script>
