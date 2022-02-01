<template>
  <div
    :class="`loading-page d-flex align-center justify-center ${
      $vuetify.theme.dark ? 'dark' : ''
    } ${loading || loadingProps ? 'show' : 'hide'}`"
  >
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        style="margin: auto; display: block; shape-rendering: auto"
        width="300px"
        height="300px"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <path
          fill="none"
          class="svg"
          stroke-width="8"
          stroke-dasharray="42.76482137044271 42.76482137044271"
          d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
          stroke-linecap="round"
          style="transform: scale(0.8); transform-origin: 50px 50px"
        >
          <animate
            attributeName="stroke-dashoffset"
            repeatCount="indefinite"
            dur="1.2s"
            keyTimes="0;1"
            values="0;256.58892822265625"
          ></animate>
        </path>
      </svg>

      <!-- <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        style="margin: auto; display: block; shape-rendering: auto"
        width="300px"
        height="300px"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <circle
          cx="50"
          cy="50"
          r="32"
          stroke-width="8"
          class="svg2"
          stroke-dasharray="50.26548245743669 50.26548245743669"
          fill="none"
          stroke-linecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="1s"
            repeatCount="indefinite"
            keyTimes="0;1"
            values="0 50 50;360 50 50"
          ></animateTransform>
        </circle>
        <circle
          cx="50"
          cy="50"
          r="23"
          stroke-width="8"
          class="svg"
          stroke-dasharray="36.12831551628262 36.12831551628262"
          stroke-dashoffset="36.12831551628262"
          fill="none"
          stroke-linecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="1s"
            repeatCount="indefinite"
            keyTimes="0;1"
            values="0 50 50;-360 50 50"
          ></animateTransform>
        </circle>
      </svg> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loadingProps: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    loading: false,
  }),
  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.loading-page {
  position: fixed;
  z-index: 1000000000000000;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: #f2f5f8;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dark.loading-page {
  background: #111b27 !important;
}
.svg {
  stroke: var(--v-primary-base);
}
.svg2 {
  stroke: #f8a036;
}
.show {
  opacity: 1;
  transition: all 0.5s;
}
.hide {
  opacity: 0;
  z-index: -100000000;
  transition: all 0.5s, z-index 0.6s;
}
</style>
