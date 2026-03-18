<template>
  <div class="content">
    <Header />
    <!--     <Transition name="fade-out">
      <Loader v-if="waitForMe.initial || waitForMe.force" />
    </Transition> -->
    <RouterView v-slot="{ Component, route }">
      <main :key="route.path" :class="{ dim }">
        <component :is="Component" />
      </main>
    </RouterView>
    <Footer />
  </div>
</template>

<script setup>
import { dim } from '../utils/state';
import Header from './Header.vue';
import Footer from './Footer.vue';
</script>

<style>
.scale-slide-enter-active,
.scale-slide-leave-active {
  position: absolute;
  transition: all 0.5s ease, opacity .4s !important;
}

.scale-slide-enter-from {
  right: -200% !important;
}

.scale-slide-enter-to {
  right: 0% !important;
}

.scale-slide-leave-from {
  /* transform: scale(1); */
}

.scale-slide-leave-to {
  /* transform: scale(0.8); */
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-out-leave-active {
  transition: opacity 0.4s ease;
}

.fade-out-leave-to {
  opacity: 0;
}
</style>

<style scoped lang="less">
.content {
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  top: 0;
  gap: 20px;
  min-height: 100vh;
  position: relative;
  color: var(--header-text-color);

  .notch {
    width: 100%;
    flex-shrink: 0;
    height: 0;
    top: 0;
    height: var(--ion-safe-area-top, 0px);
    background-color: #0f0f11;
    position: fixed;
    z-index: 999;
  }

  main {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    transition: .3s opacity;
    background-image: url('/img/bg.png');
    background-repeat: no-repeat;
    background-size: cover;

    &.dim {
      opacity: .4;
    }

    &.maintenance {
      padding: 0;
    }

  }

  .mobile {
    margin-top: var(--header-height);
    margin-bottom: calc(var(--ion-safe-area-bottom, 0px) + var(--mobile-bar-height, 0px));
  }

}
</style>
