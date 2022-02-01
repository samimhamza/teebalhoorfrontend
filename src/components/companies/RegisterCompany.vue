<template>
  <v-form lazy-validation ref="projectRegisterForm" @submit.prevent="submit">
    <CustomStepper
      :headers="steppers"
      @close="closeRegisterDialog"
      :is-submitting="isLoading"
      :can-next.sync="canNext"
      @validate="validate"
      @submit="submit"
      ref="projectStepper"
    >
      <template v-slot:step1>
        <div class="countries">
          <div class="d-flex flex-column flex-md-row">
            <div class="w-full">
              <CustomInput
                :items="countries"
                v-model="selectedCountryId"
                item-value="id"
                item-text="name"
                :label="$tr('label_required', $tr('country'))"
                :placeholder="$tr('choose_item', $tr('country'))"
                country
                type="autocomplete"
                class="me-md-4 mb-md-2 mb-0"
                ref="countryInput"
                :error-messages="countryErrorMessage"
              />
            </div>
            <div class="w-100">
              <FormBtn
                title="add_plus"
                class="mt-md-4 mb-2"
                @click="addSelectedCountry"
              />
            </div>
          </div>
          <div class="selected d-flex flex-wrap">
            <SelectedItem
              v-for="selectedCountry in selectedCountries"
              :key="selectedCountry.id"
              @close="() => removeSelectedCountry(selectedCountry.id)"
              :title="selectedCountry.name"
              :flag="`${selectedCountry.iso2.toLowerCase()}`"
            />
          </div>
          <div class="d-flex flex-column flex-md-row">
            <div class="w-full">
              <CustomInput
                :items="systems"
                v-model="selectedSystemId"
                item-value="id"
                item-text="name"
                :label="$tr('label_required', $tr('system'))"
                :placeholder="$tr('choose_item', $tr('system'))"
                type="autocomplete"
                class="me-md-4 mb-md-2 mb-0"
                :error-messages="systemErrorMessage"
                has-logo
              />
            </div>
            <div class="w-100">
              <FormBtn
                title="add_plus"
                class="mt-md-4 mb-2"
                @click="addSelectedSystems"
              />
            </div>
          </div>
          <div class="selected d-flex flex-wrap">
            <SelectedItem
              v-for="selectedSystem in selectedSystems"
              :key="selectedSystem.id"
              @close="() => removeSelectedSystem(selectedSystem.id)"
              :title="selectedSystem.name"
              :logo-url="selectedSystem.logo"
            />
          </div>
          <CustomInput
            :items="investment_types"
            item-value="id"
            item-text="name"
            :label="$tr('label_required', $tr('investment_type'))"
            :placeholder="$tr('choose_item', $tr('investment_type'))"
            type="autocomplete"
            v-model="$v.project.investment_type.$model"
            :rules="rules.investmentTypeRule($v.project, $root)"
          />
        </div>
      </template>
      <template v-slot:step2>
        <div>
          <div class="d-flex flex-column flex-md-row mt-3 mb-0 pb-0 mx-3">
            <div class="w-full">
              <CustomInput
                @blur="onBlur"
                type="textfield"
                :label="$tr('item_name_required', $tr('company'))"
                :placeholder="$tr('item_name', $tr('company'))"
                v-model="$v.project.name.$model"
                :rules="rules.nameRule($v.project, $root)"
              />
              <p v-if="isNameDublicate" class="ma-0 pa-0 dublicate-name">
                <small>{{ $tr("dublicated_Company") }}</small>
              </p>
            </div>
          </div>
          <div class="d-flex flex-column flex-md-row mt-0 pt-0 mx-3">
            <div class="w-full">
              <CustomInput
                @blur="onBlurEmail"
                type="textfield"
                :label="$tr('label_required', $tr('email'))"
                placeholder="email"
                v-model="$v.project.email.$model"
                :rules="rules.emailRule($v.project, $root)"
              />
              <p v-if="isEmailDublicate" class="ma-0 pa-0 dublicate-name">
                <small>{{ $tr("dublicated_emailCompany") }}</small>
              </p>
            </div>
          </div>
          <div class="d-flex profile mt-2 mx-3">
            <div>
              <div
                class="avatar d-flex align-center me-4 justify-center rounded-circle"
                :style="`background-image: url(${filePath});`"
              >
                <v-icon v-if="filePath === ''">fa-user</v-icon>
              </div>
            </div>
            <div class="w-full">
              <v-file-input
                class="custom-file"
                outlined
                accept="image/jpeg,image/jpg,image/png"
                prepend-icon=""
                dense
                :rules="rules.logoRule($v.project, $root)"
                @change="validateUserProfile"
                @click:clear="clearUserProfile"
                :success="filePath !== ''"
              >
                <template slot="prepend-inner">
                  <div
                    name="prepend-inner"
                    style="max-width: 260px; text-align: center"
                  >
                    <p class="ma-0">
                      <svg
                        width="30"
                        height="30"
                        viewBox="100 100 500 140"
                        fill="currentColor"
                        style="transform: translateY(4px)"
                      >
                        <g>
                          <path
                            d="m479.71 198.78h-0.86328c-6.1133-51.496-50.938-91.512-102.99-91.512-42.559 0-81.152 26.367-96.625 65.824-2.7773-0.30469-5.5078-0.44141-8.168-0.44141-33.949 0-63.816 23.754-71.656 56.746-32.059 2.8945-56.934 29.938-56.934 62.348 0 34.512 28.094 62.625 62.625 62.625h119.63c4.293 0 7.7695-3.4766 7.7695-7.793 0-4.3164-3.4766-7.793-7.7695-7.793l-119.6-0.003906c-25.922 0-47.039-21.094-47.039-47.039 0-25.898 21.023-47.016 46.828-47.016l1.0039 0.023438c3.8281 0 7.1406-2.8477 7.7227-6.6484 4.0586-28.426 28.746-49.867 57.445-49.867 3.9883 0 7.957 0.42188 11.945 1.2383l1.4023 0.13672c3.4062 0 6.4648-2.2617 7.3984-5.4375 11.738-36.656 45.5-61.32 84.023-61.32 47.414 0 86.078 37.191 88.059 84.699 0.14063 2.0781 1.0977 4.0117 2.7305 5.4375 1.5391 1.3086 3.2422 1.6562 5.9258 1.8203 2.7305-0.30469 5.0859-0.46484 7.1641-0.46484 34.301 0 62.207 27.906 62.207 62.207s-27.906 62.207-62.207 62.207h-104.42c-4.293 0-7.7695 3.4766-7.7695 7.793s3.5 7.793 7.7695 7.793h104.42c42.887 0 77.793-34.883 77.793-77.793s-34.93-77.77-77.816-77.77z"
                          />
                          <path
                            d="m413.02 318.92c0.023437 0 0.023437 0 0 0 2.125 0 4.1289-0.81641 5.5312-2.2383 2.9883-3.0352 2.9883-7.957 0-11.012l-63.047-63.047c-2.9648-2.9414-8.0273-2.918-11.012 0.070312l-63.023 62.977c-1.4688 1.4688-2.2617 3.4297-2.2617 5.5078 0 2.1016 0.81641 4.0586 2.2383 5.4609 1.3984 1.4453 3.4062 2.2852 5.4844 2.3086h0.046875c2.1016 0 4.1055-0.81641 5.5312-2.2617l49.699-49.676v177.92c0 4.3164 3.5 7.793 7.7695 7.793 4.3164 0 7.8164-3.4766 7.8164-7.793v-177.92l49.652 49.652c1.4453 1.4375 3.4492 2.2578 5.5742 2.2578z"
                          />
                        </g>
                      </svg>

                      {{ $tr("upload_profile", $tr("company")) }}
                    </p>
                    <div v-if="isFileSelected" class="ma-1">
                      <p class="mb-0">
                        name: {{ $v.project.logo.$model.name }}
                      </p>
                      <p class="mb-0" style="margin-top: 5px">
                        size:
                        {{ ($v.project.logo.$model.size / 1024).toFixed(2) }} KB
                      </p>
                    </div>
                  </div>
                </template>
              </v-file-input>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:step3>
        <div class="d-flex flex-column flex-md-row">
          <div class="w-full">
            <CustomInput
              :items="social_media"
              v-model="selectedMedias"
              item-value="id"
              item-text="name"
              :label="$tr('social_media')"
              :placeholder="$tr('choose_item', $tr('social_media'))"
              hasLogo
              logoName=""
              multiple
              type="autocomplete"
              class="me-md-4 mb-md-2 mb-0"
            />
          </div>
          <div class="w-100">
            <FormBtn
              title="add_plus"
              class="mt-md-4 mb-2"
              @click="addSelectedMedia"
            />
          </div>
        </div>
        <v-row v-if="selectedSocialMedias.length > 0">
          <v-col
            cols="12 py-0"
            sm="6"
            v-for="(media, id) in $v.selectedSocialMedias.$each.$iter"
            :key="id"
          >
            <div class="w-full">
              <div class="d-flex justify-space-between align-center">
                <div class="d-flex align-center">
                  <v-avatar size="40">
                    <img :src="media.logo.$model" alt="" />
                  </v-avatar>
                  <h4 class="ps-1">{{ $tr(media.name.$model) }}</h4>
                </div>
                <CloseBtn @click="closeSocialMedia(media.id.$model)" />
              </div>
              <CustomInput
                class="pt-1"
                type="textfield"
                :placeholder="media.sample_url_account.$model ? media.sample_url_account.$model : $tr('add_your_account_url')"
                v-model="media.url.$model"
                :rules="
                  SocialMediaRules.socialMediaRule(
                    media,
                    $root,
                    $tr(media.name.$model)
                  )
                "
              />
            </div>
          </v-col>
        </v-row>
      </template>
      <template v-slot:step4>
        <v-row>
          <v-col sm="6" class="py-0" cols="12">
            <CustomInput
              :items="labels"
              item-value="id"
              item-text="title"
              :label="$tr('label_required', $tr('label'))"
              :placeholder="$tr('choose_item', $tr('label'))"
              type="autocomplete"
              v-model="$v.project.label_id.$model"
              :rules="rules.labelRule($v.project, $root)"
            />
          </v-col>

          <v-col cols="12" class="py-0">
            <CustomInput
              :label="$tr('label_required', $tr('note'))"
              placeholder="note"
              type="textarea"
              v-model="$v.project.note.$model"
              :rules="rules.noteRule($v.project, $root)"
            />
          </v-col> </v-row
      ></template>
      <template v-slot:step5>
        <div class="topDiv">
          <DoneMessage
            :title="$tr('item_all_set', $tr('company'))"
            :subTitle="$tr('you_can_access_your_item', $tr('companies'))"
          />
        </div>
      </template>
    </CustomStepper>
  </v-form>
</template>

<script>
import CustomStepper from "../design/FormStepper/CustomStepper";
import Projects from "../../configs/pages/projects";
import CustomInput from "../design/components/CustomInput";
import SelectedItem from "../design/components/SelectedItem";
import FormBtn from "../design/components/FormBtn";
import ProjectValidation from "../../validations/project-validations";
import { mapActions, mapGetters } from "vuex";
import Helpers from "../../helpers/helpers";
import DoneMessage from "~/components/design/components/DoneMessage.vue";
import HandleException from "../../helpers/handle-exception";
import CloseBtn from "../design/Dialog/CloseBtn.vue";
import Validations from "~/validations/validations";
import Rules from "~/validations/rules-new.js";
export default {
  name: "RegisterProject",
  components: {
    FormBtn,
    SelectedItem,
    CustomInput,
    CustomStepper,
    ProjectValidation,
    Helpers,
    DoneMessage,
    CloseBtn,
  },
  props: {
    countries: {
      require: true,
    },
    labels: {
      require: true,
    },
    systems: {
      require: true,
    },
  },
  data() {
    return {
      steppers: Projects(this).steppers,
      investment_types: [
        { id: "Main Company", name: this.$tr("main_company") },
        { id: "Other", name: this.$tr("other") },
      ],

      tab: "tab-1",
      canNext: false,
      rules: ProjectValidation.rules,
      project: ProjectValidation.schema,

      filePath: "",
      projectLogo: "",

      // selected necessary
      selectedCountries: [],
      selectedMedias: [],
      selectedSocialMedias: [],
      selectedCountryId: "",
      countryErrorMessage: "",
      selectedSystems: [],
      selectedSystemId: "",
      systemErrorMessage: "",
      isLoading: false,
      isNameDataLoaded: false,
      isNameDublicate: false,
      isEmailDataLoaded: false,
      isEmailDublicate: false,
      isFileSelected: false,
      // social_media: Projects(this).social_media,
      linkErrorMessage: "",
      SocialMediaRules: Rules,
    };
  },
  async created() {
    if (this.social_media.length == 0) {
      await this.fetchSocialMedia();
    }
  },

  computed: {
    ...mapGetters({
      social_media: "social_media/getAllItems",
    }),
  },

  validations() {
    return {
      project: ProjectValidation.validations.company,
      selectedSocialMedias: {
        $each: {
          id: {},
          name: {},
          logo: {},
          sample_url_account: {},
          url: Validations.urlValidationRequired,
        },
      },
    };
  },
  methods: {
    ...mapActions({
      fetchSocialMedia: "social_media/fetchAllSocialMedia",
      insertNewItem: "companies/insertNewItem",
    }),
    addSelectedMedia() {
      this.selectedMedias.forEach((element) => {
        let media = this.social_media?.find((media) => media?.id === element);
        if (
          this.selectedSocialMedias?.some(
            (mediaItem) => mediaItem?.id === media?.id
          )
        ) {
          return;
        }
        media = { ...media, url: "" };
        this.selectedSocialMedias?.push(media);
      });
      this.selectedMedias = "";
    },
    addSelectedCountry() {
      // this.selectedCountries = []
      const requiredText = this.$tr("item_is_required", this.$tr("country"));
      //  this.$t("item_is_required", [
      //   this.$t("country"),
      // ]);
      if (this.selectedCountryId) {
        const country = this.countries?.find(
          (country) => country?.id === this.selectedCountryId
        );
        if (
          this.selectedCountries?.some(
            (countryItem) => countryItem?.id === country?.id
          )
        ) {
          return;
        }
        this.selectedCountries?.unshift(country);
        this.selectedCountryId = "";
        this.selectedCountries?.length < 1
          ? (this.countryErrorMessage = requiredText)
          : (this.countryErrorMessage = "");
      } else {
        this.countryErrorMessage = requiredText;
      }
    },

    // check & validate user profile image
    validateUserProfile(file) {
      if (file) {
        const fileExtension = file.type;
        const allowedExtensions = ["image/jpeg", "image/jpg", "image/png"];
        if (!allowedExtensions.includes(fileExtension)) {
          this.$toastr.w(this.$tr("invalid_extension", this.$tr("image")));
          return;
        }
        this.isFileSelected = true;
        this.$v.project.logo.$model = file;
        this.filePath = URL.createObjectURL(file);
      }
    },

    // clear user profile image
    clearUserProfile() {
      this.$v.project.logo.$model = "";
      this.filePath = "";
      this.isFileSelected = false;
    },

    addSelectedSystems() {
      // this.selectedCountries = []
      const requiredText = this.$tr("item_is_required", this.$tr("system"));
      if (this.selectedSystemId) {
        const system = this.systems?.find(
          (system) => system?.id === this.selectedSystemId
        );
        if (
          this.selectedSystems?.some(
            (systemItem) => systemItem?.id === system?.id
          )
        ) {
          return;
        }
        this.selectedSystems?.unshift(system);
        this.selectedSystemId = "";
        this.selectedSystems?.length < 1
          ? (this.systemErrorMessage = requiredText)
          : (this.systemErrorMessage = "");
      } else {
        this.systemErrorMessage = requiredText;
      }
    },
    // remove selected Countries
    removeSelectedCountry(countryId) {
      this.selectedCountries = this.selectedCountries?.filter(
        (country) => country?.id !== countryId
      );

      const requiredText = this.$tr("item_is_required", this.$tr("country"));
      this.selectedCountries?.length < 1
        ? (this.countryErrorMessage = requiredText)
        : (this.countryErrorMessage = "");
    },

    // remove selected Countries
    removeSelectedSystem(systemId) {
      this.selectedSystems = this.selectedSystems?.filter(
        (system) => system?.id !== systemId
      );

      const requiredText = this.$tr("item_is_required", this.$tr("system"));
      this.selectedSystems?.length < 1
        ? (this.systemErrorMessage = requiredText)
        : (this.systemErrorMessage = "");
    },

    closeRegisterDialog() {
      this.$emit("close");
      this.$refs.projectStepper.current = 1;
      this.$refs.projectRegisterForm.resetValidation();
      this.$refs.projectRegisterForm.reset();
      this.selectedSystems = [];
      this.selectedCountries = [];
    },
    async onBlur() {
      try {
        this.isNameDataLoaded = true;
        const response = await this.$axios.post(
          `companies/validate-name?name=${this.project.name}`
        );
        if (response?.status === 200 && response?.data?.result) {
          this.isNameDublicate = false;
          this.isNameDataLoaded = false;
        }
      } catch (error) {
        this.isNameDublicate = true;
        this.isNameDataLoaded = false;
      }
    },
    async onBlurEmail() {
      try {
        this.isEmailDataLoaded = true;
        const response = await this.$axios.post(
          `companies/validate-email?email=${this.project.email}`
        );
        if (response?.status === 200 && response?.data?.result) {
          this.isEmailDublicate = true;
          this.isEmailDataLoaded = false;
        }
      } catch (error) {
        this.isEmailDublicate = false;
        this.isEmailDataLoaded = false;
      }
    },
    // validate form and data
    validate(currentStep) {
      this.$refs.projectRegisterForm.validate();
      if (currentStep == 1) {
        this.canNext = this.checkGenerateValidation();
        if (this.canNext) {
          this.$refs.projectRegisterForm.resetValidation();
        }
      } else if (currentStep == 2) {
        if (
          !(
            this.$v.project.name.$invalid ||
            this.$v.project.email.$invalid ||
            this.$v.project.logo.$invalid ||
            this.isNameDublicate ||
            this.isEmailDublicate
          )
        ) {
          this.canNext = true;
          this.$refs.projectRegisterForm.resetValidation();
        } else {
          this.canNext = false;
        }
      } else if (currentStep == 3) {
        if (!this.$v.selectedSocialMedias.$invalid) {
          this.canNext = true;
          this.$refs.projectRegisterForm.resetValidation();
        } else {
          this.$refs.projectRegisterForm.validate();
          this.canNext = false;
        }
      } else if (currentStep == 4) {
        if (
          !(
            this.$v.project.label_id.$invalid || this.$v.project.note.$invalid
          )
        ) {
          this.canNext = true;
          this.$refs.projectRegisterForm.resetValidation();
        } else {
          this.canNext = false;
        }
      }
    },

    // check general section validations
    checkGenerateValidation() {
      // validate country
      const CountryRequiredText = this.$tr(
        "item_is_required",
        this.$tr("country")
      );
      this.selectedCountries?.length < 1
        ? (this.countryErrorMessage = CountryRequiredText)
        : (this.countryErrorMessage = "");

      const SystemRequiredText = this.$tr(
        "item_is_required",
        this.$tr("system")
      );
      this.selectedSystems?.length < 1
        ? (this.systemErrorMessage = SystemRequiredText)
        : (this.systemErrorMessage = "");

      const investmentHasError = this.$v.project.investment_type.$error;

      // validate general
      const isGenerateValid =
        this.$v.project.investment_type.$invalid ||
        this.countryErrorMessage ||
        this.systemErrorMessage;

      return !isGenerateValid;
    },

    async submit() {
      try {
        this.$refs.projectRegisterForm.validate();
        this.project.country_ids = this.selectedCountries.map(
          (country) => country.id
        );
        this.project.system_ids = this.selectedSystems.map(
          (system) => system.id
        );
        this.project.socialMedias = this.selectedSocialMedias.map( (socialMedia) => {
          const data = {
            id: socialMedia.id,
            url: socialMedia.url,
          }
          return data
        });
        this.project.status = "pending";
        if (!this.$v.project.$invalid) {
          this.isLoading = true;
          let formData = Helpers.getFormData(this.project);
          const response = await this.$axios.post("companies", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          this.isLoading = false;
          if (response?.status == 201) {
            const data = response?.data?.data;
            this.insertNewItem(data);
            this.resetForm();
            this.$toastr.s(this.$tr("successfully_inserted"));
          } else {
            this.isLoading = false;
            this.$toastr.e(this.$tr("something_went_wrong"));
          }
        } else {
          this.$toastr.e(this.$tr("please_fill_all_fields_correctly"));
        }
      } catch (error) {
        this.isLoading = true;
        HandleException.handleApiException(this, error);
      }
    },
    resetForm() {
      this.$refs.projectStepper.forceNext();
      this.$refs.projectRegisterForm.reset();
      this.$v.project.$reset();
      this.$v.selectedSocialMedias.$reset();
      this.selectedCountries = [];
      this.selectedSystems = [];
      this.selectedMedias = [];
      this.selectedSocialMedias = [];
      this.filePath = "";
    },
    itemClose() {},
    profileChange(file) {
      this.projectLogo = file;
      if (file) {
        const reader = new FileReader();
        reader.addEventListener(
          "load",
          (e) => (this.filePath = e.target.result)
        );
        reader.addEventListener("error", (e) => (this.filePath = ""));
        reader.readAsDataURL(file);
      }
    },

    tabChange(num) {
      this.tab = "tab-" + num;
    },
    profileClear() {
      this.filePath = "";
    },
    closeSocialMedia(id) {
      this.$refs.projectRegisterForm.resetValidation();
      this.selectedSocialMedias = this.selectedSocialMedias.filter(
        (element) => element.id !== id
      );
      this.$refs.projectRegisterForm.validate();
    },
  },
};
</script>

<style>
.show-cursor {
  cursor: pointer;
}

.logo-container {
  width: 150px;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  background-color: #e9eff7;
  border: 2px dashed #a9b4c8;
  border-radius: 10px;
  cursor: pointer;
}

.logo-container p {
  color: #aeafb2;
  font-weight: normal;
  font-size: 1.2rem;
}

.logo-container i {
  font-size: 60px;
}
.custom-logo {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background: #edf2f9;
}
.custom-logo .v-file-input__text {
  height: 110px;
  opacity: 0;
}
.custom-logo .v-input__slot fieldset {
  border-style: dashed !important;
}
.custom-logo .v-input__slot {
  min-height: 200px !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
.upload-first-p {
  font-size: 18px;
  color: var(--upload-input-first-p);
  letter-spacing: 0.5px;
}
.upload-second-p {
  color: var(--input-border-color);
  line-height: 1.5;
}
.custom-logo .v-input__prepend-inner {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.dublicate-name {
  top: -34% !important;
  padding: 0rem !important;
  position: relative !important;
  color: red;
}

.avatar {
  height: 110px;
  width: 110px;
  background-color: var(--gray-cyan);
  border: 2px solid var(--gray-cyan);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.avatar .v-icon {
  color: var(--color-white);
  font-size: 60px;
}

.custom-file .v-file-input__text {
  height: 110px;
  opacity: 0;
}

.custom-file .v-input__slot fieldset {
  border-style: dashed !important;
}

.custom-file .v-input__slot {
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-first-p {
  font-size: 18px;
  color: var(--upload-input-first-p);
  letter-spacing: 0.5px;
}

.upload-second-p {
  color: var(--input-border-color);
  line-height: 1.5;
}

.custom-file .v-input__prepend-inner {
  position: absolute;
}
</style>
