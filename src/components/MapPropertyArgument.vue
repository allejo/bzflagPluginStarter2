<template>
    <div class="c-map-argument d-inline-block" :data-readonly="arg.readonly" :title="title">
        <div class="d-flex">
            <strong class="mr-1">{</strong>
            <editable
                :content="arg.name"
                :readonly="arg.readonly"
                :className="'c-map-argument__name'"
                @textChanged="arg.name = $event.trim()"
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
        <button
            class="c-delete"
            title="Delete argument"
            v-if="!arg.readonly"
            @click="requestArgumentDeletion"
        >
            <i class="fa fa-times" aria-hidden="false"></i>
            <span class="sr-only">Delete Argument</span>
        </button>
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
    position: relative;

    &[data-readonly='true'] {
        background-color: rgba($tag-bg, 0.5);
        cursor: not-allowed;

        select {
            cursor: not-allowed;
        }
    }

    &:hover .c-delete {
        display: block;
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

.c-delete {
    background: $color-red;
    border: none;
    border-radius: 5px;
    color: #fff;
    display: none;
    padding: 0 3px;
    position: absolute;
    right: -5px;
    top: -5px;
}
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ArgumentType, IMapPropertyArgument } from '../lib/IMapPropertyArgument';
import Editable from './Editable';

@Component({
    name: 'map-property-argument',
    components: {
        Editable,
    },
})
export default class MapPropertyArgument extends Vue {
    @Prop() arg: IMapPropertyArgument;
    @Prop() title: string;

    argumentTypes = [
        ArgumentType.Integer,
        ArgumentType.Float,
        ArgumentType.Double,
        ArgumentType.String,
        ArgumentType.Team,
    ];

    requestArgumentDeletion() {
        this.$emit('argumentDeleted', this.arg);
    }

    @Watch('arg', { deep: true })
    requestDefinitionUpdate() {
        this.$emit('valueChanged', this.arg);
    }
}
</script>
