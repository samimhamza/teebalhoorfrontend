<template>
  <div>
    <!-- The video -->
    <video autoplay muted loop id="myVideo">
      <source src="/videos/bg-login-video.mp4" type="video/mp4" />
    </video>
    <v-card class="text-center pa-1 py-5" :evaluation="0">
      <v-card-title class="justify-center display-1 mb-2">{{
        $tr("welcome")
      }}</v-card-title>
      <v-card-subtitle>{{ $tr("sign_in_to_your_account") }}</v-card-subtitle>
      <!-- sign in form -->
      <v-card-text>
        <SignInForm />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import SignInForm from "../../components/signin/SigninForm.vue";
export default {
  meta: {
    hasAuth: false,
  },
  components: { SignInForm },
  layout: "auth",
  auth: false,
};
</script>

<style scoped>
.v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: unset;
}
.theme--light.v-card {
  background-color: rgba(232, 221, 221, 0.804);
  color: rgba(0, 0, 0, 0.87);
}
#myVideo {
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
}
</style>
