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
                v-for="(property, index) in definition.properties"
                :key="index"
                :definition="property"
            />
        </div>
        <p class="m-0">end</p>
    </div>
</template>

<style lang="scss" scoped>
.c-map-object {
    font-family: monospace;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Editable from './Editable';
import IMapObject from '../lib/IMapObject';
import MapProperty from './MapProperty';

@Component({
    name: 'map-object',
    components: {
        MapProperty,
        Editable
    }
})
export default class MapObject extends Vue {
    @Prop() definition: IMapObject;
}
</script>
