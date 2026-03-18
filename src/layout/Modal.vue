<template>
  <div class="modals">
    <TransitionGroup enter-to-class="enter" name="modal">
      <div v-for="modal in modals" :key="modal.id" :class="{ ok: modal.success, warn: modal.warn, error: modal.error }" class="cell">
        <div class="modal__info">
          <span>{{ modal.message }}</span>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { provide, reactive } from 'vue';
import { modals } from '../utils/state';
</script>

<style scoped lang="less">
.modals {
  display: flex;
  flex-direction: column;
  position: fixed;
  padding: 1px;
  right: 10px;
  gap: 10px;
  z-index: 9999999999;
  bottom: 20px;
  max-height: 900px;
  overflow: hidden;
}

.modals .cell {
  // background-image: linear-gradient(145deg, #fcd4d3, #eea6a4);
  border-radius: 10px;
  position: relative;
  display: flex;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);
  gap: 8px;
  left: 100%;
  width: 310px;
  align-items: center;
  padding: 12px 15px;
  color: black;
  // background-color: #fcd4d3;
  animation: slide 0.3s forwards ease-out;
  font-weight: 400;
  color: #f0b0ae;
  outline: 1px solid #ff2f2f60;
  background-color: #3b040b;
}

.modals .cell.ok {
  color: #71ca82;
  font-weight: 500;
  outline: 1px solid #5bff842d;
  background-color: #15211b;
}

.modals .cell.warn {
  color: #cac471;
  font-weight: 500;
  outline: 1px solid #ffef5b2d;
  background-color: #211f15;
}

.modals .icon {
  width: 20px;
  flex-shrink: 0;
  display: grid;
  place-content: center;
  border-radius: 5px;

  svg {
    width: 100%;
  }
}

.modals .modal__info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.modals .modal__info span {
  margin: 0;
  font-size: 14px;
}

.modal-leave-active {
  animation: invslide 0.2s forwards ease-in !important;
}

@keyframes slide {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-100%);
  }
}

@keyframes invslide {
  to {
    transform: translateX(0);
  }

  from {
    transform: translateX(-100%);
  }
}

@media (max-width: 768px) {
  .modals {
    bottom: unset;
    top: 65px;
  }
}
</style>
