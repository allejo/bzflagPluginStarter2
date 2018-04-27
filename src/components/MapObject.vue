<template>
    <div class="c-map-object">
        <p class="m-0">
            <input type="text" v-autosize="definition.name" :value="definition.name" />
        </p>
        <div class="ml-3 c-map-object__properties">
            <MapProperty v-for="(property, index) in definition.properties" :key="index" :definition="property" />
        </div>
        <p class="m-0">end</p>
    </div>
</template>

<style lang="scss" scoped>
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import IMapObject from '../lib/IMapObject';
import MapProperty from './MapProperty';

@Component({
    name: 'map-object',
    components: {
        MapProperty
    }
})
export default class MapObject extends Vue {
    @Prop() definition: IMapObject;
}
</script>
