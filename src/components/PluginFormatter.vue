<template>
    <div>
        <article class="mb-3">
            <h3 class="section-header m-0">Code Preferences</h3>

            <div class="mb-2">
                <b-form-checkbox v-model="useIfStatement">
                    Use an if statement for event handling
                </b-form-checkbox>
            </div>

            <div>
                <b-form-checkbox v-model="bracesOnNewLine">
                    Put braces on new line
                </b-form-checkbox>
            </div>
        </article>

        <b-row>
            <b-col md="5">
                <b-form-group label="Spacing Preferences">
                    <b-form-radio-group v-model="spacingFormat" stacked>
                        <b-form-radio value="2-spaces">2 Spaces</b-form-radio>
                        <b-form-radio value="4-spaces">4 Spaces</b-form-radio>
                        <b-form-radio value="tabs">Tabs</b-form-radio>
                    </b-form-radio-group>
                </b-form-group>
            </b-col>
            <b-col md="7">
                <article>
                    <h3 class="section-header m-0">Documentation</h3>

                    <div class="mb-2">
                        <b-form-checkbox v-model="buildDocBlocks" aria-describedby="event-doc-block-desc">
                            Build event doc blocks
                        </b-form-checkbox>
                        <p id="event-doc-block-desc" class="m-0 line-height-1">
                            <small class="text-muted">A block of documentation containing information about each event's data</small>
                        </p>
                    </div>

                    <div class="mb-2">
                        <b-form-checkbox v-model="showComments" aria-describedby="helpful-comments-desc">
                            Add helpful comments
                        </b-form-checkbox>
                        <p id="helpful-comments-desc" class="m-0 line-height-1">
                            <small class="text-muted">Add miscellaneous comments explaining pieces of code</small>
                        </p>
                    </div>
                </article>
            </b-col>
        </b-row>
    </div>
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
