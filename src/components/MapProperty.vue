<template>
    <div class="c-map-property">
        <div class="d-flex">
            <div class="c-map-property__name">
                <editable
                    :content="definition.name"
                    :readonly="definition.readonly"
                    @textChange="definition.name = $update"
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

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Editable from './Editable';
import MapPropertyArgument from './MapPropertyArgument';
import { IMapProperty } from '../lib/IMapProperty';

@Component({
    name: 'map-property',
    components: {
        Editable,
        MapPropertyArgument
    }
})
export default class MapProperty extends Vue {
    @Prop() definition: IMapProperty;
}
</script>
