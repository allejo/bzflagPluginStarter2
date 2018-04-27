<template>
    <div class="c-map-argument px-2 py-1 d-inline-block">
        <div class="d-flex">
            <strong class="mr-1">{</strong>
            <input v-autosize="arg.name" :disabled="arg.readonly" placeholder="xpos" :value="arg.name" />
            <strong class="px-2">:</strong>
            <select :disabled="arg.readonly">
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
.c-map-argument {
    background-color: #e1f4e4;
    border-radius: 5px;
    color: #338a42;
    font-size: 0.8em;

    input {
        background-color: rgba(#fff, 1);
        border: none;
        border-radius: 5px;
        color: inherit;
        font-size: inherit;
        font-weight: bold;
        padding: 0 5px;
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
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ArgumentType, IMapPropertyArgument } from '../lib/IMapPropertyArgument';

@Component({
    name: 'map-property-argument'
})
export default class MapPropertyArgument extends Vue {
    @Prop() arg: IMapPropertyArgument;

    argumentTypes = [ArgumentType.Integer, ArgumentType.Double, ArgumentType.String, ArgumentType.Team];
}
</script>
