<template>
  <div>
    <div class="flex-column d-flex align-center mb-2">
      <v-avatar size="100">
        <svg id="fill" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M49,7.1A4.1,4.1,0,0,0,44.9,3H19.1A4.1,4.1,0,0,0,15,7.1V57a4,4,0,0,0,4,4H45a4,4,0,0,0,4-4Z"
            style="fill: #cfcfd9"
          />
          <path
            d="M23,57V7.1A4.1,4.1,0,0,1,27.1,3h-8A4.1,4.1,0,0,0,15,7.1V57a4,4,0,0,0,4,4h8A4,4,0,0,1,23,57Z"
            style="fill: #e5e6eb"
          />
          <rect height="43" width="34" x="15" y="10" />
          <rect height="43" style="fill: #444" width="8" x="15" y="10" />
          <polyline
            points="53 17 56 17 56 49 8 49 8 17 11 17"
            style="fill: #027de5"
          />
          <path
            d="M11,14H24.757A10.43,10.43,0,0,1,32,16.9h0A10.43,10.43,0,0,1,39.243,14H53V46H11Z"
            style="fill: #85b4e0"
          />
          <rect height="32" style="fill: #cceaff" width="12" x="11" y="14" />
          <path
            d="M53,14V46H41V19.95A5.95,5.95,0,0,1,46.95,14Z"
            style="fill: #cceaff"
          />
          <rect height="4" style="fill: #85b4e0" width="42" x="11" y="42" />
          <rect height="2" style="fill: #e5e6eb" width="4" x="30" y="56" />
          <path
            d="M46.5,17.5,40,24l3,3,6.5-6.5a2.122,2.122,0,0,0,0-3h0A2.122,2.122,0,0,0,46.5,17.5Z"
            style="fill: #027de5"
          />
          <polygon points="40 24 38 29 43 27 40 24" style="fill: #fff" />
          <rect height="1" style="fill: #444" width="10" x="39" y="31.5" />
          <rect height="1" style="fill: #444" width="8" x="39" y="34.5" />
          <rect height="1" style="fill: #444" width="5" x="39" y="37.5" />
          <rect height="1" style="fill: #444" width="10" x="17" y="28.5" />
          <rect height="1" style="fill: #444" width="10" x="17" y="31.5" />
          <rect height="1" style="fill: #444" width="10" x="17" y="34.5" />
          <rect height="1" style="fill: #444" width="10" x="17" y="37.5" />
          <rect height="1" style="fill: #444" width="2" x="35" y="31.5" />
          <rect height="1" style="fill: #444" width="2" x="35" y="34.5" />
          <rect height="1" style="fill: #444" width="2" x="35" y="37.5" />
          <path
            d="M48,14h2V7.1A5.106,5.106,0,0,0,44.9,2H19.1A5.106,5.106,0,0,0,14,7.1V14h2V11H48ZM16,9V7.1A3.1,3.1,0,0,1,19.1,4H44.9A3.1,3.1,0,0,1,48,7.1V9Z"
          />
          <path
            d="M48,49v3H16V49H14v8a5.007,5.007,0,0,0,5,5H45a5.007,5.007,0,0,0,5-5V49ZM45,60H19a3,3,0,0,1-3-3V54H48v3A3,3,0,0,1,45,60Z"
          />
          <rect height="2" width="4" x="30" y="56" />
        </svg>
      </v-avatar>
      <v-btn color="primary" @click="addNewSkill" class="rounded-sm mt-2">
        {{ $tr("add_skill") }}
      </v-btn>
    </div>

    <div v-for="(skill, index) in candidate.skills.$each.$iter" :key="index">
      <div class="d-flex align-center w-full justify-space-between">
        <h2 class="mb-2">{{ $tr("skill") }} {{ index * 1 + 1 }}</h2>
        <v-icon style="color: red" @click="removeSkill(index)"
          >mdi-close</v-icon
        >
      </div>

      <div class="d-flex flex-column flex-md-row">
        <div class="w-full me-2">
          <CustomInput
            v-model="skill.skill_id.$model"
            :rules="validate(skill.skill_id, $root, 'skill_name')"
            :items="[]"
            item-value="id"
            item-text="name"
            :label="$tr('label_required', $tr('skill_name'))"
            :placeholder="$tr('choose_item', $tr('skill_name'))"
            type="autocomplete"
            class="mb-0"
          />
        </div>
        <div class="w-full">
          <CustomInput
            v-model="skill.level.$model"
            :rules="validate(skill.level, $root, 'skill_level')"
            :label="$tr('label_required', $tr('skill_level'))"
            placeholder="skill_level"
            type="number"
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
    };
  },

  methods: {
    removeSkill(index) {
      this.candidateSchema.skills.splice(index, 1);
    },

    addNewSkill() {
      this.candidateSchema.skills.push(
        JSON.parse(JSON.stringify(CandidateValidations.skillsSchema))
      );
    },
  },
};
</script>

