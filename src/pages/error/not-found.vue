\<template>
  <v-card class="text-center w-full error-page pa-3">
    <v-img src="/images/illustrations/404-illustration.svg" max-height="400" contain />
    <div class="display-2 mt-10">How did you get here?</div>
    <div class="mt-3 mb-6">Sorry we can't seem to find the page you're looking for.</div>
    <v-text-field solo placeholder="Search website" large></v-text-field>
    <v-btn :to="localePath('/')" block large color="primary">Send me Back</v-btn>
  </v-card>
</template>

<script>
export default {
  layout: 'simple'
}
</script>

<style>
.error-page {
  max-width: 500px;
}
</style>
