<template>
    <div class="c-crud-item">
        <div>
            {{ itemValue }}
        </div>
        <div>
            <a href="#" @click="requestDelete">Delete</a>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
    name: 'crud-item'
})
export default class CrudItem extends Vue {
    @Prop() itemValue: any;

    requestDelete() {
        this.$parent.$emit('crudItemRemove', this.itemValue);
    }
}
</script>
