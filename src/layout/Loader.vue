<template>
  <div class="loader">
    <div class="logo">
      <img src="/full_logo.png">
    </div>
  </div>
</template>

<style scoped lang="less">
.loader {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99999999999999;
  width: 100%;
  height: 100%;
  background: #0F1922;
  background-image: url('/img/bg.png');
  display: flex;
  justify-content: center;
  align-items: center;

  .logo {
    display: flex;
    align-items: center;
    mask-image: linear-gradient(90deg, #000 0%, #000000 25%,  rgba(0, 0, 0, 0), #000000 75%, #000 100%);
    mask-size: 300%;
    mask-position: -30% 0%;
    gap: 15px;
    animation: mask 1s ease-in alternate-reverse infinite;

    @keyframes mask {
      from {
        mask-position: 0% 0%;
        transform: scale(1.05);
      }

      to {
        // mask-position: 100% 0%;
        mask-position: 120% 0%;
      }
    }

    img {
      max-width: 250px;
      width: 100%;
      height: 80px;
      object-fit: contain;
    }
  }
}
</style>
