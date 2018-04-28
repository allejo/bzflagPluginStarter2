<template>
    <div class="c-map-property" :data-readonly="definition.readonly">
        <div class="d-flex">
            <div class="c-map-property__name mr-1">
                <editable
                    :content="definition.name"
                    :readonly="definition.readonly"
                    @textChanged="definition.name = $event"
                />
            </div>
            <div class="c-map-property__arguments">
                <MapPropertyArgument
                    v-for="(argument, key) in definition.arguments"
                    @mapPropertyArgumentChanged="propertyDefinitionChanged"
                    :aid="key"
                    :arg="Object.assign(argument, { readonly: definition.readonly })"
                    :key="key"
                    class="ml-2"
                />

                <button class="ml-1 px-1 py-0 text-muted" @click="addNewArgument" v-if="!definition.readonly">
                    + Add Argument
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../scss/variables';

.c-map-property {
    white-space: nowrap;

    &[data-readonly='true'] {
        .c-map-property__name {
            cursor: not-allowed;
            opacity: 0.55;
        }
    }
}

button {
    background: none;
    border: 1px solid $color-light-green;
    border-radius: 5px;
    font-size: 0.8em;
}
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Editable from './Editable';
import MapPropertyArgument from './MapPropertyArgument';
import { IMapProperty } from '../lib/IMapProperty';
import MapObjectHelper from '../lib/MapObjectHelper';

@Component({
    name: 'map-property',
    components: {
        Editable,
        MapPropertyArgument
    }
})
export default class MapProperty extends Vue {
    @Prop() aid: number;
    @Prop() definition: IMapProperty;

    addNewArgument() {
        this.definition.arguments.push(MapObjectHelper.createMapPropertyArgument());
    }

    @Watch('definition', { deep: true })
    propertyDefinitionChanged() {
        this.$emit('mapPropertyChange', {
            id: this.aid,
            definition: this.definition
        });
    }
}
</script>
