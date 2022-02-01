<template>
  <v-form @submit.prevent="submit" lazy-validation>
    <TextField
      label="email_or_username"
      :error="this.error.email || this.invalidCreds ? true : false"
      v-model.trim="email"
      :error-messages="emailErrors"
      @input="$v.email.$touch()"
      @blur="$v.email.$touch()"
    />
    <TextField
      label="password"
      :type="showPass ? 'text' : 'password'"
      :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
      v-model.trim="password"
      :error="this.error.password || this.invalidCreds ? true : false"
      :error-messages="passwordErrors"
      @click:append="showPass = !showPass"
      @input="$v.password.$touch()"
      @blur="$v.password.$touch()"
    />

    <div class="mb-2">
      <NuxtLink to="/auth/forgot-password">{{
        $tr("forgot_password")
      }}</NuxtLink>
    </div>
    <v-btn
      type="submit"
      block
      x-large
      color="primary"
      :disabled="isLoading"
      @click="submit"
      :loading="isLoading"
    >
      {{ $tr("sign_in") }}
    </v-btn>
  </v-form>
</template>
<script>
import TextField from "../common/TextField.vue";
import { validationMixin } from "vuelidate";
import { required, email, minLength } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  components: { TextField },
  validations: {
    email: { required },
    password: { required, minLength: minLength(4) },
  },
  data() {
    return {
      disableLoginButton: true,
      error: {},
      invalidCreds: "",
      networkError: false,
      email: "",
      password: "",
      isLoading: false,
      showPass: false,
    };
  },
  methods: {
    async submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        await this.signIn();
      }
    },
    async signIn() {
      this.isLoading = true;
      await this.$auth
        .loginWith("local", {
          data: {
            email_username: this.email,
            password: this.password,
          },
        })
        .then(() => {
          this.$router.push("/");
          this.$toastr.s(this.$tr("successfully_logged_in"));
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          if (err.response) {
            if (err.response.status == 422) {
              this.error = err.response.data.errors;
              if (this.error.password) {
                this.$toastr.e(this.$tr(this.error.password[0]));
              }
              if (this.error.email) {
                this.$toastr.e(this.$tr(this.error.email[0]));
              }
            } else if (err.response.status == 401) {
              this.invalidCreds = err.response.data.message;
              this.$toastr.e(this.$tr("invalid_login_details"));
            } else if (err.response.status == 406) {
              this.$toastr.e(this.$tr("account_not_activated"));
            } else if (err.response.status == 500) {
              this.networkError = true;
              this.invalidCreds = err.response.data.message;
              this.$toastr.e(this.$tr("server_error_please_try_again"));
            } else if (err.response.status == 404) {
              this.invalidCreds = err.response.data.message;
              this.$toastr.e(
                this.$tr("account_warning_password_incorrect_5_times")
              );
            } else if (err.response.status == 405) {
              this.invalidCreds = err.response.data.message;
              this.$toastr.e(this.$tr("account_in_warning_cant_login"));
            } else if (err.response.status == 406) {
              this.invalidCreds = err.response.data.message;
              this.$toastr.e(this.$tr("account_in_inactive_cant_login"));
            } else if (err.response.status == 307) {
              this.invalidCreds = err.response.data.message;
              this.$toastr.e(
                this.$tr("account_in_warning_because_country_changes")
              );
            }
          } else if (err.message == "Network Error") {
            this.networkError = true;
            this.$toastr.e(this.$tr("network_error_please_try_again"));
          }
        });
    },
  },
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.required &&
        errors.push(
          this.$tr("item_is_required", this.$tr("email_or_username"))
        );
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required &&
        errors.push(this.$tr("item_is_required", this.$tr("password")));
      return errors;
    },
  },
};
</script>
