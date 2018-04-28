<template>
    <div class="c-map-object">
        <p class="m-0">
            <editable
                :content="definition.name"
                @textChanged="definition.name = $event"
            />
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

        <button class="mt-1 py-1 text-muted" @click="addNewProperty">
            + Add New Property
        </button>

        <p class="m-0">end</p>
    </div>
</template>

<style lang="scss" scoped>
.c-map-object {
    font-family: monospace;
}

.c-map-object__properties {
    overflow: auto;
}

button {
    background-color: transparent;
    border: 1px dashed #c7c7c7;
    font-size: 0.8em;
    text-align: center;
    width: 100%;
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
    @Prop() definition: IMapObject;

    addNewProperty() {
        this.definition.properties.push(MapObjectHelper.createMapProperty());
    }
}
</script>
