<template>
    <b-row>
        <b-col md="6">
            <b-form-group label="Spacing Preferences">
                <b-form-radio-group v-model="spacingFormat" stacked>
                    <b-form-radio value="2-spaces">2 Spaces</b-form-radio>
                    <b-form-radio value="4-spaces">4 Spaces</b-form-radio>
                    <b-form-radio value="tabs">Tabs</b-form-radio>
                </b-form-radio-group>
            </b-form-group>
        </b-col>
        <b-col md="6">
            <b-form-checkbox v-model="useIfStatement">
                Use an if statement for event handling
            </b-form-checkbox>

            <b-form-checkbox v-model="bracesOnNewLine">
                Braces on new line
            </b-form-checkbox>

            <b-form-checkbox v-model="buildDocBlocks">
                Build doc blocks
            </b-form-checkbox>

            <b-form-checkbox v-model="showComments">
                Show comments
            </b-form-checkbox>
        </b-col>
    </b-row>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { CPPFormatter } from 'aclovis';

@Component({
    name: 'plugin-formatter'
})
export default class PluginFormatter extends Vue {
    spacingFormat: string = '4-spaces';
    useIfStatement: boolean = false;
    bracesOnNewLine: boolean = true;
    buildDocBlocks: boolean = true;
    showComments: boolean = true;

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

    @Watch('buildDocBlocks')
    onDocBlocksConfigChange() {
        this.$emit('docBlocksConfigChanged', this.buildDocBlocks);
    }

    @Watch('showComments')
    onShowCommentsChange() {
        this.$emit('showCommentsChanged', this.showComments);
    }

    @Watch('useIfStatement')
    onUseIfStatementChange() {
        this.$emit('useIfStatementChanged', this.useIfStatement);
    }
}
</script>
