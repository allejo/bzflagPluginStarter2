<template>
    <span :contenteditable="readonly ? 'false' : 'true'" @input="contentUpdated" :class="className" :title="title"></span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
    name: 'editable'
})
export default class Editable extends Vue {
    @Prop() content: string;
    @Prop() readonly: boolean;
    @Prop() className: string;
    @Prop() title: string;

    mounted() {
        this.$el.innerText = this.content;
    }

    contentUpdated(event) {
        this.$emit('textChanged', event.target.innerText);
    }
}
</script>
