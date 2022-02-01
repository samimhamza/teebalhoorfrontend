<template>
  <div>
    <div class="flex-column d-flex align-center mb-2">
      <v-avatar size="100">
        <svg
          enable-background="new 0 0 512 512"
          height="512px"
          id="Relationship"
          version="1.1"
          viewBox="0 0 512 512"
          width="512px"
          xml:space="preserve"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="SVGID_1_"
            x1="67.9395"
            x2="184.4797"
            y1="392.2939"
            y2="275.7537"
          >
            <stop offset="0" style="stop-color: #b3b3b3" />
            <stop offset="0.0161" style="stop-color: #b7b7b7" />
            <stop offset="0.152" style="stop-color: #d1d1d1" />
            <stop offset="0.3016" style="stop-color: #e5e5e5" />
            <stop offset="0.4698" style="stop-color: #f4f4f4" />
            <stop offset="0.6721" style="stop-color: #fcfcfc" />
            <stop offset="1" style="stop-color: #ffffff" />
          </linearGradient>
          <path
            d="M208.166,368.605H44.251v-49.008c0-26.878,21.789-48.666,48.667-48.666h66.581  c26.878,0,48.667,21.788,48.667,48.666V368.605z"
            fill="url(#SVGID_1_)"
          />
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="SVGID_2_"
            x1="92.3213"
            x2="170.2849"
            y1="243.1074"
            y2="165.1438"
          >
            <stop offset="0" style="stop-color: #b3b3b3" />
            <stop offset="0.0161" style="stop-color: #b7b7b7" />
            <stop offset="0.152" style="stop-color: #d1d1d1" />
            <stop offset="0.3016" style="stop-color: #e5e5e5" />
            <stop offset="0.4698" style="stop-color: #f4f4f4" />
            <stop offset="0.6721" style="stop-color: #fcfcfc" />
            <stop offset="1" style="stop-color: #ffffff" />
          </linearGradient>
          <circle cx="131.303" cy="204.125" fill="url(#SVGID_2_)" r="55.129" />
          <path
            d="M467.749,368.605H303.834v-49.008c0-26.878,21.789-48.666,48.667-48.666h66.581  c26.878,0,48.667,21.788,48.667,48.666V368.605z"
            fill="#3F5EAB"
          />
          <circle cx="390.886" cy="204.125" fill="#3F5EAB" r="55.129" />
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="SVGID_3_"
            x1="97.2925"
            x2="1008.9116"
            y1="435.2168"
            y2="435.2168"
          >
            <stop offset="0" style="stop-color: #ff7bac" />
            <stop offset="0.0431" style="stop-color: #fa7dae" />
            <stop offset="0.0924" style="stop-color: #ec85b2" />
            <stop offset="0.1447" style="stop-color: #d590ba" />
            <stop offset="0.1991" style="stop-color: #b5a1c4" />
            <stop offset="0.2553" style="stop-color: #8cb7d1" />
            <stop offset="0.3128" style="stop-color: #59d1e2" />
            <stop offset="0.3703" style="stop-color: #1feff5" />
            <stop offset="0.398" style="stop-color: #00ffff" />
          </linearGradient>
          <path
            d="M409.754,381.531c-6.459-4.252-15.14-2.465-19.392,3.994  c-28.103,42.685-75.338,68.168-126.354,68.168c-31.121,0-60.731-9.315-85.74-26.625l40.025,4l-25.534-31.186l-66.799-6.658  l-6.658,66.799l25.533,31.188l5.025-50.574c32.035,26.595,71.92,41.057,114.147,41.057c60.465,0,116.442-30.195,149.741-80.771  C418.001,394.465,416.212,385.783,409.754,381.531z"
            fill="url(#SVGID_3_)"
          />
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="SVGID_4_"
            x1="430.7236"
            x2="-480.8985"
            y1="76.7827"
            y2="76.7826"
          >
            <stop offset="0" style="stop-color: #ff7bac" />
            <stop offset="0.0431" style="stop-color: #fa7dae" />
            <stop offset="0.0924" style="stop-color: #ec85b2" />
            <stop offset="0.1447" style="stop-color: #d590ba" />
            <stop offset="0.1991" style="stop-color: #b5a1c4" />
            <stop offset="0.2553" style="stop-color: #8cb7d1" />
            <stop offset="0.3128" style="stop-color: #59d1e2" />
            <stop offset="0.3703" style="stop-color: #1feff5" />
            <stop offset="0.398" style="stop-color: #00ffff" />
          </linearGradient>
          <path
            d="M383.181,20.789l-5.026,50.574c-32.034-26.595-71.919-41.057-114.146-41.057  c-60.464,0-116.442,30.194-149.742,80.771c-4.252,6.458-2.463,15.14,3.994,19.392c2.372,1.562,5.044,2.309,7.687,2.309  c4.552,0,9.016-2.217,11.706-6.303c28.104-42.685,75.34-68.168,126.355-68.168c31.121,0,60.731,9.316,85.74,26.626l-40.025-4.001  l25.533,31.187l66.8,6.657l6.658-66.799L383.181,20.789z"
            fill="url(#SVGID_4_)"
          />
        </svg>
      </v-avatar>
      <v-btn color="primary" @click="addNewDependent" class="rounded-sm mt-2">
        {{ $tr("add_dependent") }}
      </v-btn>
    </div>

    <div
      v-for="(dependent, index) in candidate.dependents.$each.$iter"
      :key="index"
    >
      <div class="d-flex align-center w-full justify-space-between">
        <h2 class="mb-2">{{ $tr("dependent") }} {{ index * 1 + 1 }}</h2>
        <v-icon style="color: red" @click="removeDependent(index)"
          >mdi-close</v-icon
        >
      </div>

      <div class="d-flex flex-column flex-md-row">
        <div class="w-full me-2">
          <CustomInput
            v-model="dependent.name.$model"
            :rules="validate(dependent.name, $root, 'name')"
            :maxlength="dependent.name.$params.maxLength.max"
            counter
            :label="$tr('label_required', $tr('dependent_name'))"
            placeholder="dependent_name"
            type="textfield"
          />
        </div>
        <div class="w-full">
          <CustomInput
            v-model="dependent.relationship.$model"
            :rules="validate(dependent.relationship, $root, 'relationship')"
            :maxlength="dependent.relationship.$params.maxLength.max"
            counter
            label="relationship"
            placeholder="relationship"
            type="textfield"
          />
        </div>
      </div>
      <div class="d-flex flex-column flex-md-row">
        <div class="w-full me-2">
          <CustomInput
            v-model="dependent.gender.$model"
            :rules="validate(dependent.gender, $root, 'gender')"
            :items="gender"
            item-value="id"
            item-text="name"
            :label="$tr('label_required', $tr('gender'))"
            :placeholder="$tr('choose_item', $tr('gender'))"
            type="select"
            class="mb-0"
          />
        </div>
        <div class="w-full">
          <div class="w-full me-2">
            <p class="mb-1 custom-input-title">
              {{ $tr("birth_date") }}
            </p>
            <v-menu
              v-model="showBirthDatePicker"
              transition="scale-transition"
              offset-y
              min-width="auto"
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dependent.birth_date.$model"
                  :rules="validate(dependent.birth_date, $root, 'birth_date')"
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
                @input="showBirthDatePicker = false"
                v-model="dependent.birth_date.$model"
              >
              </v-date-picker>
            </v-menu>
          </div>
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row">
        <div class="w-full me-2">
          <CustomInput
            v-model="dependent.email.$model"
            :rules="validate(dependent.email, $root, 'email')"
            :label="$tr('label_required', $tr('email'))"
            placeholder="email"
            type="textfield"
          />
        </div>
        <div class="w-full">
          <CustomInput
            v-model="dependent.phone.$model"
            :rules="validate(dependent.phone, $root, 'phone')"
            label="phone"
            placeholder="phone"
            type="textfield"
          />
        </div>
      </div>
      <CustomInput
        v-model="dependent.address_id.$model"
        :rules="validate(dependent.address_id, $root, 'address')"
        :items="[]"
        item-value="id"
        item-text="name"
        :label="$tr('label_required', $tr('address'))"
        :placeholder="$tr('choose_item', $tr('address'))"
        type="autocomplete"
        class="mb-0"
      />
    </div>
  </div>
</template>


<script>
import CustomInput from "~/components/design/components/CustomInput";
import CandidateValidations from "~/validations/hr_management/candidate-validations";
import GlobleRules from "~/helpers/vuelidate";
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
      gender: [
        { id: "male", name: this.$tr("male") },
        { id: "female", name: this.$tr("female") },
      ],
      showBirthDatePicker: false,
    };
  },

  methods: {
    removeDependent(index) {
      this.candidateSchema.dependents.splice(index, 1);
    },

    addNewDependent() {
      this.candidateSchema.dependents.push(
        JSON.parse(JSON.stringify(CandidateValidations.dependentsSchema))
      );
    },
  },
};
</script>

