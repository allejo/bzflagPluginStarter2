<template>
    <div class="c-map-object py-2 px-3" :class="className">
        <p class="m-0">
            <strong>
                <editable
                    :content="definition.name"
                    @textChanged="definition.name = $event"
                />
            </strong>
        </p>
        <div class="ml-3 c-map-object__properties">
            <MapProperty
                v-for="(property, key) in definition.properties"
                :key="key"
                :aid="key"
                :definition="property"
                class="my-1"
            />
        </div>

        <button class="mx-1 py-1 text-muted" @click="addNewProperty">
            + Add New Property
        </button>

        <p class="m-0">end</p>
    </div>
</template>

<style lang="scss" scoped>
@import '../scss/variables';

.c-map-object {
    border: 1px dashed #c7c7c7;
    font-family: monospace;
}

.c-map-object__properties {
    overflow: auto;
}

button {
    background-color: transparent;
    border: 1px dashed $color-light-green;
    cursor: pointer;
    font-size: 0.8em;
    text-align: center;
    width: 100%;

    &:hover {
        background-color: $tag-bg;
    }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Editable from './Editable';
import IMapObject from '../lib/IMapObject';
import MapProperty from './MapProperty';
import MapObjectHelper from '../lib/MapObjectHelper';

@Component({
    name: 'map-object',
    components: {
        MapProperty,
        Editable
    }
})
export default class MapObject extends Vue {
    @Prop() aid: number;
    @Prop() definition: IMapObject;

    @Prop({
        default: ''
    })
    className: string;

    addNewProperty() {
        this.definition.properties.push(MapObjectHelper.createMapProperty());
    }
}
</script>
