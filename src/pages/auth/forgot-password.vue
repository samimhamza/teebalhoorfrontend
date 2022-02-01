<template>
  <div>
    <!-- The video -->
    <video autoplay muted loop id="myVideo">
      <source src="/videos/bg-login-video.mp4" type="video/mp4" />
    </video>

    <v-card class="text-center pa-1">
      <v-card-title class="justify-center display-1 mb-2">{{
        $tr("forgot_password")
      }}</v-card-title>
      <v-card-subtitle>
        {{ $tr("enter_email_to_reset_password") }}
      </v-card-subtitle>

      <!-- reset form -->
      <v-card-text>
        <v-form ref="form" @submit.prevent="submit">
          <TextField
            :label="$tr('label_required', $tr('email'))"
            type="email"
            v-model.trim="$v.form.email.$model"
            :rules="Rules.emailRule($v.form, $root)"
            :invalid="$v.form.email.$invalid"
          />
          <div class="text-left mb-2">
            <router-link :to="localePath('/auth/signin')">
              {{ $tr("back_to_sign_in") }}
            </router-link>
          </div>
          <v-btn
            :loading="isLoading"
            :disabled="isLoading"
            block
            x-large
            color="primary"
            @click="submit"
            >{{ $tr("send_otp_code") }}</v-btn
          >
          <!-- </div> -->
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
/*
|---------------------------------------------------------------------
| Forgot Page Component
|---------------------------------------------------------------------
|
| Template to send email to remember/replace password
|
*/
import TextField from "../../components/common/TextField";
import Validations from "~/validations/validations";
import Rules from "~/validations/rules";

export default {
  meta: {
    hasAuth: false,
  },
  auth: false,
  layout: "auth",
  components: { TextField },
  data() {
    return {
      Rules: Rules,
      // reset button
      isLoading: false,

      // form
      isFormValid: true,

      form: {
        email: "",
      },
    };
  },
  validations: {
    form: {
      email: Validations.emailValidation,
    },
  },
  methods: {
    checkValidations() {
      if (this.$v.form.$invalid) {
        this.$toastr.e(this.$tr("please_fill_all_fields_correctly"));
        return false;
      }
      return true;
    },
    async submit() {
      if (!this.checkValidations()) {
        return;
      }
      try {
        this.isLoading = true;
        const response = await this.$axios.post("forgot-password", this.form);
        if (response.status === 200 && response.data.result) {
          // const data = response.data.data
          this.$toastr.s(this.$tr("reset_link_sent"));
          this.$router.push("/");
        }
      } catch (error) {
        if (error.response.status == 422) {
          // return server errors
          const errors = error.response.data.errors;
          for (let error in errors) {
            for (let er in errors[error]) {
              this.$toastr.e(this.$tr(errors[error][er]));
            }
          }
        } else {
          this.$toastr.e(this.$tr(error.response.statusText));
        }
      }
      this.isLoading = false;
    },
    emailRules(data) {
      return [
        (_) =>
          data.email.required ||
          this.$tr("item_is_required", [this.$tr("email")]),
        (_) =>
          data.email.email || this.$tr("item_is_invalid", [this.$tr("email")]),
      ];
    },
  },
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
