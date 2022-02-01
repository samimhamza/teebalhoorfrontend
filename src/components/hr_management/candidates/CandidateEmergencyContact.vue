<template>
  <div>
    <div class="flex-column d-flex align-center mb-2">
      <v-avatar size="100">
        <svg
          id="Layer_1"
          style="enable-background: new 0 0 64 64"
          version="1.1"
          viewBox="0 0 64 64"
          xml:space="preserve"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <style type="text/css">
            .st0 {
              fill: #393938;
            }
          </style>
          <g>
            <g>
              <g>
                <path
                  class="st0"
                  d="M44.1,22.1c0,0.1-0.1,0.3-0.3,0.3h-5.1c-0.1,0-0.3,0.1-0.3,0.3v5.1c0,0.1-0.1,0.3-0.3,0.3h-3.7     c-0.1,0-0.3-0.1-0.3-0.3v-5.1c0-0.1-0.1-0.3-0.3-0.3h-5.1c-0.1,0-0.3-0.1-0.3-0.3v-3.8c0-0.1,0.1-0.3,0.3-0.3h5.1     c0.1,0,0.3-0.1,0.3-0.3v-5.1c0-0.1,0.1-0.3,0.3-0.3h3.7c0.1,0,0.3,0.1,0.3,0.3v5.1c0,0.1,0.1,0.3,0.3,0.3h5.1     c0.1,0,0.3,0.1,0.3,0.3V22.1z"
                />
                <path
                  class="st0"
                  d="M36.3,35.3c-8.3,0-15-6.7-15-15s6.7-15,15-15c8.3,0,15,6.7,15,15S44.6,35.3,36.3,35.3z M36.3,7.8     c-6.9,0-12.5,5.6-12.5,12.5s5.6,12.5,12.5,12.5s12.5-5.6,12.5-12.5S43.2,7.8,36.3,7.8z"
                />
              </g>
              <path
                class="st0"
                d="M58.7,39.9c-0.5,0.5-1,0.9-1.5,1.3c-2.3,1.8-4.8,3.4-7.3,4.9c0,0-3.7,2.5-10.2,3c0,0-6.8-0.2-11.7-0.5    c0,0-3.2-0.6-5.7,1.3l-8.9-7.6l1.3-1.2c0,0,4.7-5.5,12.3-3.6c1.5,0.4,3.1,1.1,4.8,1.4c1.9,0.3,3.7,0.5,5.6,0.6    c1.2,0.1,6.8,0.3,6.1,2.5c0,0.2-0.2,0.3-0.3,0.3c-5.6,1.5-8.6,1.3-8.6,1.3c-0.4,0-0.7,0.2-0.7,0.5c0,0.3,0.2,0.6,0.6,0.6    c0,0,0.1,0,0.3,0c1.2,0.1,2.4-0.1,3.6-0.2c3.3-0.4,6.5-1.4,9.6-2.5c3.1-1.2,6-2.9,9.2-3.7c0.5-0.1,1.1-0.3,1.7-0.1    C59.8,38.6,59.2,39.4,58.7,39.9z"
              />
              <path
                class="st0"
                d="M22.2,51.5l-11-9.3c-1-0.9-2.5-0.7-3.4,0.3l-2.5,3c-0.9,1-0.7,2.5,0.3,3.4l11,9.3c1,0.9,2.5,0.7,3.4-0.3    l2.5-3C23.3,53.9,23.2,52.4,22.2,51.5z"
              />
            </g>
          </g>
        </svg>
      </v-avatar>
      <v-btn
        color="primary"
        @click="addNewEmergencyContact"
        class="rounded-sm mt-2"
      >
        {{ $tr("add_emergency_contact") }}
      </v-btn>
    </div>

    <div
      v-for="(emergencyContact, index) in candidate.emergency_contacts.$each
        .$iter"
      :key="index"
    >
      <div class="d-flex align-center w-full justify-space-between">
        <h2 class="mb-2">{{ $tr("emergency_contact") }} {{ index * 1 + 1 }}</h2>
        <v-icon style="color: red" @click="removeEmergencyContact(index)"
          >mdi-close</v-icon
        >
      </div>

      <div class="d-flex flex-column flex-md-row">
        <div class="w-full me-2">
          <CustomInput
            v-model="emergencyContact.name.$model"
            :rules="validate(emergencyContact.name, $root, 'name')"
            :maxlength="emergencyContact.name.$params.maxLength.max"
            counter
            :label="$tr('label_required', $tr('name'))"
            placeholder="name"
            type="textfield"
          />
        </div>
        <div class="w-full">
          <CustomInput
            v-model="emergencyContact.relationship.$model"
            :rules="
              validate(emergencyContact.relationship, $root, 'relationship')
            "
            label="relationship"
            placeholder="relationship"
            type="textfield"
          />
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row">
        <div class="w-full me-2">
          <CustomInput
            v-model="emergencyContact.phone.$model"
            :rules="validate(emergencyContact.phone, $root, 'phone')"
            label="phone"
            placeholder="phone"
            type="textfield"
          />
        </div>
        <div class="w-full">
          <CustomInput
            v-model="emergencyContact.email.$model"
            :rules="validate(emergencyContact.email, $root, 'email')"
            label="email"
            placeholder="email"
            type="textfield"
          />
        </div>
      </div>
      <div class="d-flex flex-column flex-md-row">
        <div class="w-full me-2">
          <CustomInput
            v-model="emergencyContact.landline_number.$model"
            :rules="
              validate(
                emergencyContact.landline_number,
                $root,
                'landline_number'
              )
            "
            label="landline_number"
            placeholder="landline_number"
            type="textfield"
          />
        </div>
        <div class="w-full">
          <CustomInput
            v-model="emergencyContact.office_number.$model"
            :rules="
              validate(emergencyContact.office_number, $root, 'office_number')
            "
            label="office_number"
            placeholder="office_number"
            type="textfield"
          />
        </div>
      </div>
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
      showBirthDatePicker: false,
    };
  },

  methods: {
    removeEmergencyContact(index) {
      this.candidateSchema.emergency_contacts.splice(index, 1);
    },

    addNewEmergencyContact() {
      this.candidateSchema.emergency_contacts.push(
        JSON.parse(JSON.stringify(CandidateValidations.emergencyContactsSchema))
      );
    },
  },
};
</script>
