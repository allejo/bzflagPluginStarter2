<template>
    <footer class="py-4">
        <b-row>
            <b-col md="6">
                <span>Copyright &copy; {{ year }}</span>
            </b-col>
            <b-col md="6" class="text-right">
                <ul class="list-inline m-0">
                    <li class="list-inline-item"><a href="https://allejo.io">Author</a></li>
                    <li class="list-inline-item"><a href="http://bzflag.org">BZFlag</a></li>
                    <li class="list-inline-item"><a href="https://github.com/allejo/bzflagPluginStarter2">GitHub</a></li>
                </ul>
            </b-col>
        </b-row>
    </footer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
    name: 'site-footer'
})
export default class SiteFooter extends Vue {
    get year() {
        return (new Date()).getFullYear();
    }
}
</script>
