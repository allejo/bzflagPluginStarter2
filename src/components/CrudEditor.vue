<template>
    <div class="c-crud-editor">
        <div>
            <label :for="uid">Add New {{ label }}</label>

            <div>
                <input type="text"
                       class="w-100"
                       autocomplete="off"
                       :id="uid"
                       :aria-describedby="uid + '-desc'"
                       v-model="newItem"
                       @keyup.enter="requestItemAddition"
                />
            </div>

            <p class="m-0" :id="uid + '-desc'">
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
        CrudItem,
    },
})
export default class CrudEditor extends Vue {
    newItem: string = '';

    @Prop({
        default: '',
    })
    label: string;

    @Prop() storage: any[];

    get uid() {
        return 'crud-' + this.label.replace(/\s/, '-').toLowerCase();
    }

    requestItemAddition() {
        this.$emit('valueAdded', this.newItem);
        this.newItem = '';
    }
}
</script>
