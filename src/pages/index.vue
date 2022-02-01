<template>
  <v-container fluid class="pa-0">
    <client-only>
      <system-card></system-card>
    </client-only>
  </v-container>
</template>

<script>
import SystemCard from "../components/dashboard/SystemCard.vue";

export default {
  components: {
    SystemCard,
  },

};
</script>

<style></style>
