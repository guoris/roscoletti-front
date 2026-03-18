import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { RouteManager } from './utils/routing';
import { createGtag } from 'vue-gtag';
import './assets/style.less';
import App from './App.vue';

const manager = new RouteManager()
  .add('/').file('Home').title('Home').icon('FullTicket').description('Home.').config({ onHeader: false }).unauth()
  .add('/terms-of-service').file('Terms').icon('Chip').title('Terms').description('Terms.').config({ onHeader: false }).unauth()
  .add('/privacy-policy').file('PrivacyPolicy').icon('Chip').title('Privacy Policy').description('Terms.').config({ onHeader: false }).unauth()
  .add('*').file('Redirect').config({ offHeader: true })
  .wrap();

const router = createRouter({
  history: createWebHistory(),
  routes: manager.getRoutes(),
});

// createGtag({
//   tagId: 'G-4BSCH5XR6Z',
//   pageTracker: {
//     router,
//   }
// })

createApp(App)
  .provide('navigation', manager.navigation)
  .provide('routes', manager.routes)
  .use(router)
  .mount('#app');