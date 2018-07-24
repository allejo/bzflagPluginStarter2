<template>
    <div class="c-map-property" :data-readonly="definition.readonly">
        <div class="d-flex">
            <div :class="definition.readonly ? 'readonly-pad' : ''">
                <button class="c-map-property__delete" v-if="!definition.readonly" @click="requestValueDeletion">
                    <span class="sr-only">Delete property</span>
                    <i class="fa fa-trash-o"></i>
                </button>
            </div>
            <div class="c-map-property__name mr-1">
                <editable
                    :content="definition.name"
                    :readonly="definition.readonly"
                    :title="definition.readonly ? lockedPropertyMsg : ''"
                    @textChanged="definition.name = $event.trim()"
                />
            </div>
            <div class="c-map-property__arguments">
                <MapPropertyArgument
                    class="ml-2"
                    v-for="argument in definition.arguments"
                    :arg="Object.assign(argument, { readonly: definition.readonly })"
                    :key="argument.uuid"
                    :title="definition.readonly ? lockedPropertyMsg : ''"
                    @argumentDeleted="handleArgumentDeletion"
                    @valueChanged="requestDefinitionUpdate"
                />

                <button class="c-map-property__add-argument ml-1 px-1 py-0 text-muted" @click="handleArgumentAddition" v-if="!definition.readonly">
                    + Add Argument
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../scss/variables';

.readonly-pad {
    margin-right: 26px;
}

.c-map-property {
    white-space: nowrap;

    &[data-readonly='true'] {
        .c-map-property__name {
            cursor: not-allowed;
            opacity: 0.55;
        }
    }
}

.c-map-property__add-argument {
    background: none;
    border: 1px solid $color-light-green;
    border-radius: 5px;
    font-size: 0.8em;
}

.c-map-property__delete {
    background: none;
    border: none;
    color: $color-red;
}
</style>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Provide, Vue, Watch } from 'vue-property-decorator';
import Editable from './Editable';
import MapPropertyArgument from './MapPropertyArgument';
import { IMapProperty } from '../lib/IMapProperty';
import MapObjectHelper from '../lib/MapObjectHelper';
import { IMapPropertyArgument } from '../lib/IMapPropertyArgument';

@Component({
    name: 'map-property',
    components: {
        Editable,
        MapPropertyArgument
    }
})
export default class MapProperty extends Vue {
    @Provide() lockedPropertyMsg: string = 'This is a property all map objects natively support and cannot be edited.';

    @Prop() aid: number;
    @Prop() definition: IMapProperty;

    handleArgumentAddition() {
        this.definition.arguments.push(MapObjectHelper.createMapPropertyArgument());
    }

    handleArgumentDeletion(arg: IMapPropertyArgument) {
        this.definition.arguments = _.without(this.definition.arguments, arg);
    }

    requestValueDeletion() {
        this.$emit('valueDeleted', this.aid);
    }

    @Watch('definition', { deep: true })
    requestDefinitionUpdate() {
        this.$emit('mapPropertyChange', {
            id: this.aid,
            definition: this.definition
        });
    }
}
</script>
