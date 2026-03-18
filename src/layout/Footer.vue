<template>
  <footer>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
</script>

<style scoped lang="less">
footer {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  padding: 0 50px;
  bottom: 0;
  z-index: 10;

  .ctn {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    max-width: 1080px;
    width: 100%;

    &::before {
      content: "";
      width: 100%;
      height: 100%;
      pointer-events: none;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0.18;
      z-index: -1;
      background: linear-gradient(180deg, #436071 0%, #294251 100%) border-box;
    }

    .pos {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      flex-direction: row;
      padding: 55px 0;

      @media (max-width: 900px) {
        flex-direction: column;
      }

      .left {
        display: flex;
        flex-direction: column;
        gap: 25px;

        @media (max-width: 900px) {
          justify-content: center;
          align-items: center;
        }

        img {
          width: 210px;
        }

        .legal {
          display: flex;
          flex-direction: row;
          gap: 20px;
          align-items: center;

          @media (max-width: 900px) {
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          svg {
            width: 40px;
            height: 40px;
          }

          .text {
            font-size: 18px;
            color: #8491a3;
            width: 320px;

            @media (max-width: 900px) {
              text-align: center;
            }
          }
        }

        .lang {
          margin-top: 10px;
          width: 140px;
        }
      }

      .cols {
        display: flex;
        gap: 40px;

        .col {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 120px;

          .label {
            color: #ffffff;
            font-weight: 600;
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;

            @media (min-width: 901px) {
              cursor: default;
            }

            .arrow {
              width: 16px;
              height: 16px;
              transition: transform 0.3s ease;
              transform: rotate(180deg);
            }

            .arrow.rotated {
              transform: rotate(0deg);
            }
          }

          .link {
            color: #708999;
            text-decoration: none;
            cursor: pointer;
            transition: color 0.2s;

            &:hover {
              color: #ffffff;
            }
          }
        }

        &.mobile-faq {
          flex-direction: column;
          width: 100%;
          gap: 25px;
          margin-top: 40px;

          .col {
            border-bottom: 1px solid #43607156;
            padding-bottom: 10px;

            .faq-content {
              display: flex;
              flex-direction: column;
              gap: 12px;
              animation: fadeIn 0.3s ease-in-out;
              margin-bottom: 15px;
            }
          }
        }
      }
    }

    .bottom {
      width: 100%;
      padding: 30px 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
      text-align: center;
      border-top: 1px solid #43607156;

      @media (max-width: 900px) {
        border: unset;
        padding: unset;
        margin-bottom: 120px;
      }

      .copy {
        font-size: 14px;
        color: #6e7a91;

        .brand {
          color: #f9c442;
          font-weight: 600;
        }
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
