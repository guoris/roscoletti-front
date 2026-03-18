<template>
  <header>
    <div class="bar">
      <RouterLink to="/" class="logo" :class="{ tiny: !!user }">
        <img :src="user ? '/logo.png' : '/full_logo.png'" alt="Logo">
      </RouterLink>
      <!-- <div class="buttons">
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
import { user } from '../utils/state';
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
  background: linear-gradient(180deg, #1d303b 0%, #17252e 100%);
  box-shadow: 0px 4px 12px 0px #1921283D;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  z-index: 999999999;
  height: 64px;
  width: 100%;
  gap: 10px;

  .bar {
    width: 100%;
    max-width: 1080px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    padding: 0 10px;
    gap: 20px;

    >* {
      width: 100%;
      display: flex;
    }

    .logo {
      width: 100%;

      &.tiny {
        max-width: 40px;
        img {
          max-width: 40px;
          height: 34px;
        }
      }

      img {
        max-width: 124px;
        width: 100%;
        object-fit: contain;
        height: 24px;
      }
    }

    .buttons {
      gap: 10px;
      width: 100%;
      max-width: 440px;

      button {
        width: 100%;
        padding: 10px 15px;
        border-radius: 6px;
        font-size: 12px;
        display: flex;
        justify-content: center;
        align-self: center;

        &.login {
          background: linear-gradient(180deg, #394E5A 0%, #2C3F4A 100%);
          font-weight: 700;
          letter-spacing: .7px;
          color: white;
        }

        &.register {
          background: #FECD04;
          font-weight: 700;
          letter-spacing: .7px;
          color: black;
        }
      }
    }


  }
}
</style>
