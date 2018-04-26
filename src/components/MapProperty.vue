<template>

</template>

<style scoped>
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IMapPropertyArgument } from '../lib/IMapPropertyArgument';

@Component({
    name: 'map-property'
})
export default class MapProperty extends Vue {
    @Prop() name;
    @Prop() fields: IMapPropertyArgument[];
}
</script>
