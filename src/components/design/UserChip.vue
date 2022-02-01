<template>
  <div class="ma-0 d-flex justify-center align-center user-created pe-1">
    <v-avatar class="me-1" color="primary" size="24">
      <span class="white--text">{{ avatar }}</span>
    </v-avatar>
    <p class="ma-0">{{ name }}</p>
  </div>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
  },
};
</script>
<style scoped>
.user-created {
  padding: 2px;
  border: 1px solid rgba(144, 144, 144, 0.5);
  border-radius: 14px;
}
.user-created p {
  text-decoration: none !important;
  font-size: 14px;
  font-weight: 500;
  color: unset !important;
}
</style>
