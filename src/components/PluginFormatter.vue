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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import CPPFormatter from '../alyssa/CPPFormatter';

@Component({
    name: 'plugin-formatter'
})
export default class PluginFormatter extends Vue {
    @Prop() spacingFormat: string = '4-spaces';

    @Prop() bracesOnNewLine: boolean = true;

    get formatterSettings() {
        return this.spacingFormat, this.bracesOnNewLine, Date.now();
    }

    get formatter() {
        let indentWithSpaces: boolean = this.spacingFormat != 'tabs';
        let indentSpaceCount: number = this.spacingFormat == '2-spaces' ? 2 : 4;
        let bracesExist: boolean = true;
        let bracesOnNewLine: boolean = this.bracesOnNewLine;

        return new CPPFormatter({
            indentWithSpaces,
            indentSpaceCount,
            bracesExist,
            bracesOnNewLine
        });
    }

    @Watch('formatterSettings')
    onPluginFormatterChange() {
        this.$emit('pluginFormatterChanged', this.formatter);
    }
}
</script>
