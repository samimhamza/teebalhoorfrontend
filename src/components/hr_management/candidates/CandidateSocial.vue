<template>
  <div>
    <div class="flex-column d-flex align-center mb-2">
      <v-avatar size="100">
        <svg
          enable-background="new 0 0 32 32"
          height="32px"
          id="Layer_1"
          version="1.0"
          viewBox="0 0 32 32"
          width="32px"
          xml:space="preserve"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <g>
            <circle
              clip-rule="evenodd"
              cx="16"
              cy="16"
              fill="#E02F2F"
              fill-rule="evenodd"
              r="16"
            />
            <g>
              <path
                d="M19,5.998c0,0-4.592,0-6.164,0c-2.82,0-5.475,1.979-5.475,4.453c0,2.528,1.922,4.494,4.791,4.494    c0.2,0,0.394-0.045,0.584-0.059c-0.188,0.355-0.318,0.737-0.318,1.154c0,0.703,0.377,1.264,0.854,1.729    c-0.358,0-0.709,0.005-1.09,0.005C8.689,17.775,6,19.998,6,22.305C6,24.577,8.948,26,12.441,26c3.983,0,6.183-2.262,6.183-4.534    c0-1.821-0.538-2.913-2.199-4.091c-0.569-0.401-1.656-1.38-1.656-1.956c0-0.674,0.192-1.006,1.208-1.8    c1.039-0.812,1.776-1.781,1.776-3.111c0-1.581-0.68-3.51-2.003-3.51H18L19,5.998z M16.931,21.072    c0.048,0.212,0.077,0.429,0.077,0.649c0,1.836-1.185,3.271-4.58,3.271c-2.415,0-4.158-1.528-4.158-3.364    c0-1.799,2.163-3.298,4.579-3.271c0.562,0.006,1.088,0.097,1.564,0.249C15.724,19.519,16.664,20.034,16.931,21.072z     M13.063,14.223c-1.621-0.047-3.162-1.813-3.441-3.94c-0.279-2.13,0.808-3.759,2.428-3.711c1.62,0.05,3.162,1.758,3.441,3.886    C15.771,12.586,14.684,14.271,13.063,14.223z"
                fill="#FFFFFF"
              />
              <polygon
                fill="#FFFFFF"
                points="24,13.991 24,10.991 22,10.991 22,13.991 19,13.991 19,15.991 22,15.991 22,18.991 24,18.991     24,15.991 27,15.991 27,13.991   "
              />
            </g>
          </g>
          <g />
          <g />
          <g />
          <g />
          <g />
          <g />
        </svg>
      </v-avatar>
      <v-btn color="primary" @click="addNewSocialMedia" class="rounded-sm mt-2">
        {{ $tr("add_social_media") }}
      </v-btn>
    </div>

    <div
      v-for="(socialMedia, index) in candidate.social_media.$each.$iter"
      :key="index"
    >
      <div class="d-flex align-center w-full justify-space-between">
        <h2 class="mb-2">{{ $tr("social_media") }} {{ index * 1 + 1 }}</h2>
        <v-icon style="color: red" @click="removeSocialMedia(index)"
          >mdi-close</v-icon
        >
      </div>

      <div class="d-flex flex-column flex-md-row">
        <div class="w-full me-2">
          <CustomInput
            v-model="socialMedia.social_media_id.$model"
            :rules="
              validate(socialMedia.social_media_id, $root, 'social_media')
            "
            :items="[]"
            item-value="id"
            item-text="name"
            :label="$tr('label_required', $tr('social_media'))"
            :placeholder="$tr('choose_item', $tr('social_media'))"
            type="autocomplete"
            class="mb-0"
          />
        </div>
        <div class="w-full">
          <CustomInput
            v-model="socialMedia.url.$model"
            :rules="validate(socialMedia.url, $root, 'url')"
            :label="$tr('label_required', $tr('url'))"
            placeholder="url"
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
    };
  },

  methods: {
    removeSocialMedia(index) {
      this.candidateSchema.social_media.splice(index, 1);
    },

    addNewSocialMedia() {
      this.candidateSchema.social_media.push(
        JSON.parse(JSON.stringify(CandidateValidations.socialMediaSchema))
      );
    },
  },
};
</script>

