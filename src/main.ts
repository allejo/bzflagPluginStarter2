import Vue from 'vue';
import Bootstrap from 'bootstrap-vue';
import VueClipboard from 'vue-clipboard2';
import App from './App.vue';

// Styles!
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'font-awesome/css/font-awesome.css';
import 'balloon-css/balloon.css';
import './scss/main.scss';

Vue.use(Bootstrap);
Vue.use(VueClipboard);

new Vue({
    el: '#app',
    render: h => h(App)
});
