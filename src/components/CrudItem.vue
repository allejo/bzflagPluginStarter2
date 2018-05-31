<template>
    <div class="c-crud-item py-2">
        <b-row>
            <b-col class="align-self-center">
                {{ itemValue }}
            </b-col>
            <b-col class="text-right">
                <button class="btn btn-danger"
                        data-balloon-pos="up"
                        data-balloon="Delete"
                        @click="requestValueDeletion"
                >
                    <span aria-hidden="true" class="fa fa-trash-o"></span>
                    <span class="sr-only">Delete</span>
                </button>
            </b-col>
        </b-row>
    </div>
</template>

<style lang="scss" scoped>
@import '../scss/variables';

.c-crud-item {
    $_border: 1px solid $color-light-green;

    border-bottom: $_border;

    &:first-child {
        border-top: $_border;
        margin-top: 1.5em;
    }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
    name: 'crud-item'
})
export default class CrudItem extends Vue {
    @Prop() itemValue: any;

    requestValueDeletion() {
        this.$parent.$emit('valueDeleted', this.itemValue);
    }
}
</script>
