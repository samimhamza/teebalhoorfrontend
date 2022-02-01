<template>
  <div>
    <div class="flex-column d-flex align-center mb-3">
      <v-avatar size="100">
        <svg
          data-name="Layer 1"
          id="Layer_1"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <style>
              .cls-1 {
                fill: #ffd34e;
              }
              .cls-2 {
                fill: #4b525f;
              }
              .cls-3 {
                fill: #304269;
              }
              .cls-4 {
                fill: #91bed4;
              }
              .cls-5 {
                fill: #ea6045;
              }
            </style>
          </defs>
          <title />
          <rect class="cls-1" height="512" rx="256" ry="256" width="512" />
          <path
            class="cls-2"
            d="M181.76,114.66V164h21.42V125.7a4.75,4.75,0,0,1,4.75-4.75h96.14a4.75,4.75,0,0,1,4.75,4.75V164H328.3V114.66a14.59,14.59,0,0,0-14.59-14.59H196.36A14.59,14.59,0,0,0,181.76,114.66Z"
          />
          <rect
            class="cls-3"
            height="260.71"
            rx="16.88"
            ry="16.88"
            width="332.76"
            x="89.62"
            y="151.22"
          />
          <path
            class="cls-4"
            d="M215.73,250a65.3,65.3,0,0,0,80.55,0L416.8,155c-3-2.71-6.95-5-11.3-5h-299c-4.35,0-8.31,2.27-11.3,5Z"
          />
          <rect
            class="cls-5"
            height="26.59"
            rx="10.7"
            ry="10.7"
            transform="translate(244.77 -111.74) rotate(45)"
            width="26.59"
            x="243.97"
            y="226.3"
          />
        </svg>
      </v-avatar>
      <v-btn @click="addNewExperience" color="primary" class="rounded-sm mt-2">
        {{ $tr("add_experience") }}
      </v-btn>
    </div>
    <div
      v-for="(experience, index) in candidate.experiences.$each.$iter"
      :key="index"
    >
      <div class="d-flex align-center w-full justify-space-between">
        <h2 class="mb-2">{{ $tr("experience") }} {{ index * 1 + 1 }}</h2>
        <v-icon style="color: red" @click="removeExperience(index)"
          >mdi-close</v-icon
        >
      </div>
      <div class="d-flex flex-column flex-md-row">
        <div class="w-full me-2">
          <CustomInput
            v-model="experience.company_name.$model"
            :rules="validate(experience.company_name, $root, 'company_name')"
            :maxlength="experience.company_name.$params.maxLength.max"
            counter
            :label="$tr('label_required', $tr('company_name'))"
            placeholder="company_name"
            type="textfield"
          />
        </div>
        <div class="w-full">
          <CustomInput
            v-model="experience.occupation_id.$model"
            :rules="validate(experience.occupation_id, $root, 'position')"
            :items="[]"
            item-value="id"
            item-text="name"
            :label="$tr('label_required', $tr('position'))"
            :placeholder="$tr('choose_item', $tr('position'))"
            type="autocomplete"
            class="mb-0"
          />
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row">
        <div class="w-full me-2">
          <p class="mb-1 custom-input-title">
            {{ $tr("label_required", $tr("start_date")) }}
          </p>
          <v-menu
            v-model="showStartDatePicker"
            transition="scale-transition"
            offset-y
            min-width="auto"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="experience.start_date.$model"
                :rules="validate(experience.start_date, $root, 'start_date')"
                class="custom-input"
                :placeholder="$tr('birth_date_format')"
                v-bind="attrs"
                v-on="on"
                dense
                readonly
                outlined
              ></v-text-field>
            </template>
            <v-date-picker
              no-title
              @input="showStartDatePicker = false"
              v-model="experience.start_date.$model"
            >
            </v-date-picker>
          </v-menu>
        </div>
        <div class="w-full">
          <p class="mb-1 custom-input-title">
            {{ $tr("end_date") }}
          </p>
          <v-menu
            v-model="showEndDatePicker"
            transition="scale-transition"
            offset-y
            min-width="auto"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="experience.end_date.$model"
                :rules="validate(experience.end_date, $root, 'end_date')"
                class="custom-input"
                :placeholder="$tr('birth_date_format')"
                v-bind="attrs"
                v-on="on"
                dense
                readonly
                outlined
              ></v-text-field>
            </template>
            <v-date-picker
              no-title
              @input="showEndDatePicker = false"
              v-model="experience.end_date.$model"
            >
            </v-date-picker>
          </v-menu>
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row">
        <div class="w-full me-2">
          <CustomInput
            v-model="experience.salary.$model"
            :rules="validate(experience.salary, $root, 'salary')"
            :label="$tr('label_required', $tr('salary'))"
            placeholder="salary"
            type="number"
          />
        </div>
        <div class="w-full">
          <CustomInput
            v-model="experience.currency_id.$model"
            :rules="validate(experience.currency_id, $root, 'currency')"
            :items="[]"
            item-value="id"
            item-text="name"
            :label="$tr('label_required', $tr('currency'))"
            :placeholder="$tr('choose_item', $tr('currency'))"
            type="autocomplete"
            class="mb-0"
          />
        </div>
      </div>
      <div class="d-flex flex-column flex-md-row">
        <div class="w-full me-2">
          <CustomInput
            v-model="experience.salary_type.$model"
            :rules="validate(experience.salary_type, $root, 'salary_type')"
            :items="[]"
            item-value="id"
            item-text="name"
            :label="$tr('label_required', $tr('salary_type'))"
            :placeholder="$tr('choose_item', $tr('salary_type'))"
            type="autocomplete"
            class="mb-0"
          />
        </div>
        <div class="w-full">
          <CustomInput
            v-model="experience.is_currently_working.$model"
            :rules="
              validate(
                experience.is_currently_working,
                $root,
                'is_currently_working'
              )
            "
            :items="currently_working"
            item-value="id"
            item-text="name"
            :label="$tr('label_required', $tr('is_currently_working'))"
            :placeholder="$tr('choose_item', $tr('from_options'))"
            type="select"
            class="mb-0"
          />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import CustomInput from "~/components/design/components/CustomInput";
import GlobleRules from "~/helpers/vuelidate";
import CandidateValidations from "~/validations/hr_management/candidate-validations";
export default {
  components: { CustomInput },
  props: {
    candidate: {
      type: Object,
      required: true,
    },
    candidateSchema: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      validate: GlobleRules.validate,
      currently_working: [
        { id: true, name: this.$tr("yes") },
        { id: false, name: this.$tr("no") },
      ],
      showEndDatePicker: false,
      showStartDatePicker: false,
    };
  },

  methods: {
    removeExperience(index) {
      this.candidateSchema.experiences.splice(index, 1);
    },

    addNewExperience() {
      this.candidateSchema.experiences.push(
        JSON.parse(JSON.stringify(CandidateValidations.experienceSchema))
      );
    },
  },
};
</script>
