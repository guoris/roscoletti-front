<template>
  <div class="wrapper">

    <Body />
    <Modal />
  </div>
</template>

<script setup>
import { inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Modal from './layout/Modal.vue';
import Body from './layout/Body.vue';
import { dim } from './utils/state';

const routes = inject('routes');

const router = useRouter();
const route = useRoute();

router.beforeEach(async g => {
  if (!g.hash) window.scrollTo(0, 0);
  dim.value = false;
  const found = routes.get(g.path);
  if (found) {
    document.title = `${found.title} | Baux`;
  }
});
</script>