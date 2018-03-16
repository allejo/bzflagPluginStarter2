import Vue from 'vue';
import VueUniqIds from 'vue-uniq-ids';
import Bootstrap from 'bootstrap-vue';
import App from './App.vue';

// Styles!
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'font-awesome/css/font-awesome.css';
import './scss/main.scss';

Vue.use(Bootstrap);
Vue.use(VueUniqIds);

new Vue({
    el: '#app',
    render: h => h(App)
});
