<template>
    <div class="c-crud-editor">
        <div>
            <label v-uni-for="'enter-crud-item'">Add New {{ label }}</label>

            <div>
                <input type="text"
                       class="w-100"
                       autocomplete="off"
                       v-uni-id="'enter-crud-item'"
                       v-model="newItem"
                       @keyup.enter="requestAddItem"
                />
            </div>

            <p class="m-0">
                <small class="text-muted">Press <kbd>Enter</kbd> to register the {{ label.toLowerCase() }}</small>
            </p>
        </div>

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

    @Prop({
        default: ''
    })
    label: string;

    @Prop() storage: any[];

    requestAddItem() {
        this.$emit('crudItemAdd', this.newItem);
        this.newItem = '';
    }
}
</script>
