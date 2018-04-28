<template>
    <div class="c-map-argument d-inline-block" :data-readonly="arg.readonly">
        <div class="d-flex">
            <strong class="mr-1">{</strong>
            <editable
                :content="arg.name"
                :readonly="arg.readonly"
                :className="'c-map-argument__name'"
                @textChanged="arg.name = $event"
            />
            <strong class="px-2">:</strong>
            <select :disabled="arg.readonly" v-model="arg.type">
                <option
                    v-for="(item, index) in argumentTypes"
                    :value="item"
                    :key="index"
                    :selected="(item === arg.type) && 'selected'"
                >
                    {{ item }}
                </option>
            </select>
            <strong>}</strong>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../scss/variables';

.c-map-argument {
    background-color: $tag-bg;
    border-radius: 5px;
    color: $tag-text;
    font-size: 0.8em;
    padding-left: 3px;
    padding-right: 3px;

    &[data-readonly="true"] {
        background-color: rgba($tag-bg, 0.5);
        cursor: not-allowed;

        select {
            cursor: not-allowed;
        }
    }
}

select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: transparent;
    border: none;
    color: inherit;
    font-size: inherit;
    padding: 0;
}

.c-map-argument__name {
    border: none;
    border-radius: 5px;
    color: inherit;
    font-size: inherit;
    font-weight: bold;
    padding: 0;
}
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ArgumentType, IMapPropertyArgument } from '../lib/IMapPropertyArgument';
import Editable from './Editable';

@Component({
    name: 'map-property-argument',
    components: {
        Editable
    }
})
export default class MapPropertyArgument extends Vue {
    @Prop() aid: number;
    @Prop() arg: IMapPropertyArgument;

    argumentTypes = [
        ArgumentType.Integer,
        ArgumentType.Float,
        ArgumentType.Double,
        ArgumentType.String,
        ArgumentType.Team
    ];

    @Watch('arg', { deep: true })
    argumentDefinitionChanged() {
        this.$emit('mapPropertyArgumentChanged', this.arg);
    }
}
</script>
