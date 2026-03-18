<template>
  <ResponsiveHeader v-if="isMobileResolution" />
  <header v-else>
    <div class="bar">
      <RouterLink to="/" class="logo">
        <img src="/full_logo.png" alt="">
      </RouterLink>
      <nav>
        <RouterLink v-for="item of permissionsNav" :aria-label="item.title" :key="item.to" :to="item.to">
          <component as="svg" :is="item.icon" />
          {{ item.title }}
        </RouterLink>
      </nav>
<!--       <div class="buttons">
        <User v-if="user" class="user" />
        <template v-else>
          <button class="login" @click="openAccessModal('login')">
            Login
          </button>
          <button class="register" @click="openAccessModal('register')">
            Register
          </button>
        </template>
      </div> -->
    </div>
  </header>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { isMobileResolution, user } from '../utils/state';
import ResponsiveHeader from './ResponsiveHeader.vue';
// import User from '../components/header/User.vue';

const navigation = inject('navigation');

const permissionsNav = computed(() =>
  navigation.map(({ children, ...x }) => ({
    ...x,
    children: children ?? []
  }))
);
</script>

<style scoped lang="less">
header {
  position: fixed;
  left: 50%;
  top: 0;
  background: linear-gradient(180deg, #1B2C36 0%, #192831 100%);
  box-shadow: 0px 4px 12px 0px #1921283D;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  z-index: 999999999;
  height: 80px;
  width: 100%;
  padding: 10px;
  gap: 10px;

  .bar {
    width: 100%;
    max-width: 1080px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    gap: 20px;

    >* {
      width: 100%;
      display: flex;
    }

    >:first-child {
      justify-content: flex-start;
      max-width: 190px;
    }

    >:last-child {
      justify-content: flex-end;
      max-width: 260px;
    }

    .logo {
      width: 100%;

      img {
        max-width: 177px;
        object-fit: contain;
        height: 32px;
      }
    }

    nav {
      align-items: center;
      width: 100%;
      justify-content: space-around;
      font-family: Unageo, sans-serif;
      gap: 10px;

      a {
        display: flex;
        align-items: center;
        color: #97AFBE;
        gap: 10px;
        font-size: 16px;
        font-weight: 500;
        transition: .2s color;

        &.router-link-active {
          color: white;

          svg {
            color: #FECD04;
          }
        }

        &:hover {
          color: white;
        }
      }

      svg {
        width: 20px;
        height: 20px;
        transition: .2s color;
      }
    }

    .buttons {
      gap: 15px;
      width: 100%;
      max-width: 340px;

      button {
        width: 100%;
        padding: 10px 15px;
        border-radius: 6px;
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-self: center;
        font-family: Unageo, sans-serif;
        font-weight: 600;
        letter-spacing: 0.02em;
        transition: .2s filter;

        &:hover {
          filter: brightness(1.15);
        }

        &.login {
          background: linear-gradient(180deg, #394E5A 0%, #2C3F4A 100%);
          color: white;
        }

        &.register {
          background: #FECD04;
          color: black;
        }
      }
    }


  }
}
</style>
