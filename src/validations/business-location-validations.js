import Validations from './validations';
import Rules from './rules-new';

export default {
  steppers: [
    { icon: 'fa-lock', title: 'general', slotName: 'step1' },
    { icon: 'fa-info-circle', title: 'information', slotName: 'step2' },
    { icon: 'fa-comment-dots', title: 'remarks', slotName: 'step3' },
    { icon: 'fa-thumbs-up', title: 'done', slotName: 'step4' },
  ],

  // model schema
  schema: {
    name: '',
    email: '',
    location_type: '',
    map_link: '',
    address: '',
    note: '',

    // relations
    country_id: '',
    company_id: '',
    state_id: '',
    label_id: '',
  },

  // roles
  rules: {
    nameRule: Rules.nameRule,
    emailRule: Rules.emailRule,
    addressRule: Rules.addressRule,
    noteRule: Rules.noteRule,

    // relations
    countryRule: Rules.countryRule,
    companyRule: Rules.companyRule,
    countryStateRule: Rules.countryStateRule,
    labelRule: Rules.labelRule,
    mapLinkRule: Rules.mapLinkRule,

    locationTypeRule(validationObject, context) {
      const requiredText = context.$tr('required', [
        context.$tr('location_type'),
      ]);

      return [(_) => validationObject.location_type.required || requiredText];
    },
  },

  // validations
  validations: {
    name: Validations.name100Validation,
    email: Validations.emailValidation,
    location_type: Validations.requiredValidation,
    map_link: Validations.urlValidation,
    address: Validations.requiredValidation,
    note: Validations.remarksValidation,

    // relations
    country_id: Validations.requiredValidation,
    company_id: Validations.requiredValidation,
    state_id: Validations.requiredValidation,
    label_id: Validations.requiredValidation,
  },
};
