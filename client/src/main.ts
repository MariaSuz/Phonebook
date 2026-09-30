import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { createPinia } from 'pinia';
import router from './router';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.use(vuetify);
app.component('VueDatePicker', VueDatePicker);

app.mount('#app');
