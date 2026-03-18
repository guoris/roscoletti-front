<template>
  <Base @close="close" id="confirmation">
  <div class="content">
    <div class="row">
      <h2>{{ text || 'Are you sure?' }}</h2>
    </div>
    <button @click="confirm">Confirm</button>
  </div>
  </Base>
</template>

<script setup>
import { ref } from 'vue';
import Base from './Base.vue';

const props = defineProps(['text']);
const emit = defineEmits(['close', 'success']);

const code = ref('');

const confirm = async () => {
  emit('success');
};

const close = () => {
  emit('close');
};
</script>

<style scoped lang="less">
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto 0;
  gap: 50px;

  .row {
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    gap: 15px;

    h2 {
      font-size: 18px;
      letter-spacing: 0.02em;
      font-weight: 400;
      text-align: center;
      color: #F6F6F6;
    }

    p {
      color: #5f8eaa;
      font-weight: 400;
    }

    .secret {
      padding: 12px 25px;
      border-radius: 8px;
      font-family: Unageo, sans-serif;
      font-weight: 500;
      letter-spacing: 1.5px;
      background: #0C1418A3;
      outline: 1px solid #97AFBE;
      color: #97AFBE;
    }

    .qr {
      width: 180px;
      height: 180px;
      border-radius: 8px;
      overflow: hidden;
      background-color: #a5bcca;
      transition: .2s opacity, .2s filter;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        pointer-events: none;
      }

      &.loading {
        img {
          filter: blur(6px);
          opacity: .4;
        }
      }
    }

    input {
      padding: 8px 15px;
      width: 140px;
      font-size: 20px;
      color: #97AFBE;
      border-radius: 8px;
      background: #0C1418A3;
      letter-spacing: 6px;
      font-weight: 500;
      text-align: center;
    }
  }

  button {
    background-color: #FECD04;
    font-family: Unageo, sans-serif;
    flex-shrink: 1;
    border-radius: 6px;
    font-size: 16px;
    letter-spacing: 0.3px;
    font-weight: 600;
    max-width: 120px;
    width: 100%;
    padding: 10px 10px;
    transition: 0.2s filter, .2s opacity;

    &.disabled {
      opacity: .5;
      cursor: not-allowed;
    }

    &:not(.disabled):hover {
      filter: brightness(1.25)
    }
  }
}
</style>