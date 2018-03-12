<template>
    <div>
        <section>
            <h3>Spacing Preferences</h3>
            <ul>
                <li>
                    <label>
                        <input type="radio"
                               name="spacing"
                               value="2-spaces"
                               v-model="spacingFormat"
                        > 2 Spaces
                    </label>
                </li>
                <li>
                    <label>
                        <input type="radio"
                               name="spacing"
                               value="4-spaces"
                               v-model="spacingFormat"
                        >
                        4 Spaces
                    </label>
                </li>
                <li>
                    <label>
                        <input type="radio"
                               name="spacing"
                               value="tabs"
                               v-model="spacingFormat"
                        >
                        Tabs
                    </label>
                </li>
            </ul>
        </section>

        <section>
            <h3>Coding Style</h3>
            <ul>
                <li>
                    <label>
                        <input type="checkbox"
                               name="braces"
                               v-model="bracesOnNewLine"
                        >
                        Braces on new line
                    </label>
                </li>
            </ul>
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
