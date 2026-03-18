<template>
  <div class="popout">
    <div class="slide">
      <div v-if="info" class="head">
        <button v-if="isMobileResolution" @click="close" class="back">
          <Cross />
        </button>
        <div class="icon">
          <component as="svg" :is="info.icon" />
        </div>
        <span>{{ info.title }}</span>
        <button v-if="!isMobileResolution" @click="close" class="close">
          <Cross />
        </button>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ArrowBack, Cross } from '../../icons';
import { modalInfo } from '../../utils/vars';
import { isMobileResolution } from '../../utils/state';

const props = defineProps(['id']);
const emit = defineEmits(['close', 'confirm']);

const info = computed(() => modalInfo[props.id] || {});

const close = () => {
  emit('close');
};
</script>

<style scoped lang="less">
.popout {
  overflow-y: scroll;
  position: fixed;
  z-index: 9999999;
  left: 50%;
  top: 50%;
  width: 100%;
  max-width: 500px;
  padding: 25px 25px;
  border-radius: 8px;
  transform: translate(-50%, -47.7%);
  max-height: calc(100vh - (80px * 1.5));
  box-shadow: 0px 4px 24px 0px #00000088;
  background: linear-gradient(180deg, #273843 0%, #24343E 100%);

  @media (max-width: 768px) {
    max-width: unset;
    border-radius: 0;
    padding: 20px 10px 50px;
    margin-bottom: 20px;
    top: 64px;
    height: 100%;
    max-height: calc(100vh - (60px + 64px));
    max-height: calc(100vh - calc(100vh - 100%) - (60px + 64px));
    background: url(/img/bg.png), linear-gradient(180deg, #152129 0%, #0D161C 100%);
    transform: translateX(-50%);
  }

  .slide {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 20px;

    @media (max-height: 900px) {
      margin-bottom: 120px;
    }

    .head {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      gap: 10px;

      .icon {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        color: #97AFBE;

        @media (max-width: 768px) {
          width: 22px;
          height: 22px;
        }
      }

      >span {
        font-size: 18px;
        font-family: Unageo;
        font-weight: 500;
        letter-spacing: 1.3px;

        @media (max-width: 768px) {
          font-size: 20px;
        }
      }

      button.close {
        width: 23px;
        height: 23px;
        padding: 0;
        display: grid;
        place-content: center;
        margin-left: auto;
        color: #708999;

        svg {
          width: 100%;
          height: 100%;
        }
      }

      button.back {
        width: 30px;
        height: 30px;
        padding: 6px 0;
        flex-shrink: 0;
        margin-right: -6px;
        display: grid;
        place-content: center;
        color: #97AFBE;

        svg {
          width: 100%;
          height: 100%;
        }
      }

    }
  }
}
</style>