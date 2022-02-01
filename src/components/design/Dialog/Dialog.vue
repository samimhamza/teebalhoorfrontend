<template>
  <v-card
    elevation="2"
    v-bind="$attrs"
    v-on="$listeners"
    class="position-relative"
  >
    <DialogCloseBtn class="close-dialog-btn" @click="closeDialog" />
    <slot />
  </v-card>
</template>
<script>
import DialogCloseBtn from "./CloseBtn.vue";
export default {
  components: {
    DialogCloseBtn,
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
</script>

<style scoped>
.close-dialog-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 400000000000;
}
</style>
