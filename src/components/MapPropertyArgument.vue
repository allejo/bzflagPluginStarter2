<template>
    <div class="c-map-argument px-2 py-1">
        <div class="d-flex">
            <strong class="mr-1">{</strong>
            <input v-autosize="name" :disabled="readonly" placeholder="xpos" :value="name" />
            <strong class="px-2">:</strong>
            <div class="select-container">
                <select :disabled="readonly">
                    <option
                        v-for="(item, index) in argumentTypes"
                        :value="item"
                        :key="index"
                        :selected="(item === argType) && 'selected'"
                    >
                        {{ item }}
                    </option>
                </select>
            </div>
            <strong>}</strong>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.c-map-argument {
    background-color: #e1ecf4;
    border-radius: 5px;
    color: #33658a;
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
        padding-left: 13px;
    }
}

.select-container {
    position: relative;

    &::after {
        content: '\25BC';
        display: block;
        font-size: 0.8em;
        pointer-events: none;
        position: absolute;
        top: 3px;
        left: 0;
        z-index: 0;
    }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

enum ArgumentType {
    Integer = 'Int',
    Double = 'Double',
    String = 'String',
    Team = 'Team'
}

@Component({
    name: 'map-property-argument'
})
export default class MapPropertyArgument extends Vue {
    @Prop() name: string;
    @Prop() argType: ArgumentType;
    @Prop() readonly: boolean;

    argumentTypes = [ArgumentType.Integer, ArgumentType.Double, ArgumentType.String, ArgumentType.Team];
}
</script>
