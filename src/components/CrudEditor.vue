<template>
    <div class="c-crud-editor">
        <input type="text"
               autocomplete="off"
               v-model="newItem"
               @keyup.enter="requestAddItem"
        />

        <div class="c-crud-list">
            <crud-item
                v-for="(item, i) in storage"
                :itemValue="item"
                :key="i"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import CrudItem from './CrudItem';

@Component({
    name: 'crud-editor',
    components: {
        CrudItem
    }
})
export default class CrudEditor extends Vue {
    newItem: string = '';

    @Prop() storage: any[];

    requestAddItem() {
        this.$emit('crudItemAdd', this.newItem);
        this.newItem = '';
    }
}
</script>
