<template>
  <div
    class="h-100 d-flex align-center justify-center"
    style="min-height: 250px"
  >
    <div class="text-center">
      <div class="svg-wrapper">
        <div class="svg">
          <lottie-player
            src="/assets/error.json"
            background="transparent"
            speed="1"
            style="width: 200px; height: 150px"
            loop
            autoplay
          ></lottie-player>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'error', 
}
</script>