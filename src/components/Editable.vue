<template>
    <span
        :contenteditable="readonly ? 'false' : 'true'"
        :class="className"
        :title="title"
        @input="contentUpdated"
        @keydown="keyWatcher"
    ></span>
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

    keyWatcher(event: KeyboardEvent) {
        switch (event.code) {
            case 'Enter':
            case 'Space':
                event.preventDefault();
                break;

            default:
                break;
        }
    }
}
</script>
