import { createApp } from 'vue';
import BootstrapVue3 from 'bootstrap-vue-3';
import { createRouter as createVueRouter, createWebHashHistory, Router } from "vue-router";
import './style.css';
// @ts-ignore  
import App from './App.vue';

const router: Router = createVueRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: App },
  ],
});

createApp(App)
.use(router)
.use(BootstrapVue3)
.mount('#app');

