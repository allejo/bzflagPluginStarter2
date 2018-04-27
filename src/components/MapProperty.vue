<template>
    <div class="c-map-property">
        <div class="d-flex">
            <div class="c-map-property__name">
                <input type="text"
                       v-autosize="definition.name"
                       :value="definition.name"
                       :readonly="definition.readonly"
                />
            </div>
            <div class="c-map-property__arguments">
                <MapPropertyArgument
                    v-for="(argument, index) in definition.arguments"
                    :arg="Object.assign(argument, { readonly: definition.readonly })"
                    :key="index"
                    class="mx-1"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.c-map-property {
    input {
        background-color: #fff;
        min-width: 100px;
    }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MapPropertyArgument from './MapPropertyArgument';
import { IMapProperty } from '../lib/IMapProperty';

@Component({
    name: 'map-property',
    components: {
        MapPropertyArgument
    }
})
export default class MapProperty extends Vue {
    @Prop() definition: IMapProperty;
}
</script>
