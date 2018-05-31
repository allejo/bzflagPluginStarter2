<template>
    <div class="c-map-object py-2 px-3" :class="className">
        <div class="c-toolbar">
            <button class="c-map-object__close-button" data-balloon="Delete map object" data-balloon-pos="up" @click="requestValueDeletion">
                <span class="sr-only">Delete Object</span>
                <i class="fa fa-trash-o" aria-hidden="true"></i>
            </button>
        </div>
        <p class="m-0">
            <strong>
                <editable
                    :content="definition.name"
                    @textChanged="definition.name = $event"
                />
            </strong>
        </p>
        <div class="c-map-object__properties">
            <MapProperty
                class="my-1"
                v-for="(property, key) in definition.properties"
                :aid="key"
                :definition="property"
                :key="key"
                @valueDeleted="handleMapPropertyDeletion"
            />
        </div>

        <button class="c-map-object__add-property mx-1 py-1 text-muted" @click="requestPropertyAddition">
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
    position: relative;
}

.c-map-object__properties {
    overflow: auto;
}

.c-map-object__add-property {
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

.c-map-object__close-button {
    background: none;
    border: none;
    color: $color-red;
    position: absolute;
    top: 0.5rem;
    right: 1rem;
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

    requestPropertyAddition() {
        this.definition.properties.push(MapObjectHelper.createMapProperty());
    }

    requestValueDeletion() {
        this.$emit('valueDeleted', this.aid);
    }

    handleMapPropertyDeletion(aid: number) {
        this.definition.properties.splice(aid, 1);
    }
}
</script>
