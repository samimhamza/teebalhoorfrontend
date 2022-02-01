<template>
  <div>
    <!-- The video -->
    <video autoplay muted loop id="myVideo">
      <source src="/videos/bg-login-video.mp4" type="video/mp4" />
    </video>

    <v-card class="pa-2">
      <v-card-title class="justify-center display-1 mb-2"
        >{{ $tr("reset_title") }}
      </v-card-title>
      <div class="overline">{{ status }}</div>
      <div class="error--text mt-2 mb-4">{{ error }}</div>

      <TextField
        label="password"
        :type="showPass ? 'text' : 'password'"
        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPass = !showPass"
        v-model.trim="$v.newPassword.password.$model"
        :rules="Rules.passwordRule($v.newPassword, $root)"
        :invalid="$v.newPassword.password.$invalid"
      />
      <TextField
        label="confirm_password"
        :type="showPass2 ? 'text' : 'password'"
        :append-icon="showPass2 ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPass2 = !showPass2"
        v-model.trim="$v.newPassword.confirm_password.$model"
        :rules="Rules.password2Rule($v.newPassword, $root)"
        :invalid="$v.newPassword.confirm_password.$invalid"
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
        depressed
        x-large
        color="primary"
        @click="confirmPasswordReset"
        >{{ $tr("reset_password") }}
      </v-btn>
    </v-card>
  </div>
</template>
<script>
/*
|---------------------------------------------------------------------
| Reset Page Component
|---------------------------------------------------------------------
|
| Page Form to insert new password and proceed to sign in
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
  async asyncData({ query, error, $axios }) {
    if (query && query.email && query.token) {
      const token = query.token;
      const email = query.email;
      try {
        const url = `reset-password?has-reset-token=true&token=${token}&email=${email}`;
        const response = await $axios.post(url);
        if (response.status === 200 && response.data.result) {
          return { token, email };
        }
        error({
          statusCode: response.status,
          message: this.$tr("invalid_email_or_token"),
        });
      } catch (exception) {
        error({
          statusCode: exception.response.status,
          message: this.$tr("invalid_email_or_token"),
        });
      }
    }
    error({
      statusCode: "401",
      message: this.$tr("unauthorized_to_access_this_page"),
    });
  },

  data() {
    return {
      Rules: Rules,
      isLoading: false,
      showPass: false,
      showPass2: false,
      showNewPassword: true,
      newPassword: {
        password: "",
        confirm_password: "",
        email: "",
        token: "",
      },
      // form error
      errorNewPassword: false,
      errorNewPasswordMessage: "",

      // show password field
      showPassword: false,

      status: this.$tr("Resetting password"),
      error: null,

      // input rules
      rules: {
        required: (value) => (value && Boolean(value)) || "Required",
      },
    };
  },
  validations: {
    newPassword: {
      password: Validations.passwordValidation,
      confirm_password: Validations.password2Validation,
      email: Validations.requiredValidation,
      token: Validations.requiredValidation,
    },
  },
  methods: {
    checkValidations() {
      this.$v.newPassword.token.$model = this.token;
      this.$v.newPassword.email.$model = this.email;

      if (this.$v.newPassword.$invalid) {
        this.$toastr.e(this.$tr("please_fill_all_fields_correctly"));
        return false;
      }

      return true;
    },

    async confirmPasswordReset() {
      if (this.checkValidations()) {
        try {
          this.isLoading = true;
          const response = await this.$axios.post(
            "reset-password",
            this.newPassword
          );
          if (response.status === 202) {
            const data = response.data.data;
            this.$router.push("/");
            this.$toastr.s(this.$tr("password_reset"));
          }
          if (response.status === 200) {
            this.$toastr.e(this.$tr("login_failed"));
            this.$toastr.e(
              this.$tr("account_in_warning_because_reseting_3_times_in_an_hour")
            );
            this.$router.push("/");
          }
        } catch (error) {
          if (error.response.status === 400) {
            this.$toastr.e(this.$tr("token_expired"));
          } else if (error.response.status == 422) {
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
      }
    },
    resetErrors() {
      this.errorNewPassword = false;
      this.errorNewPasswordMessage = "";
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
