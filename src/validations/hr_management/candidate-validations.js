import Validations, { phoneNumber } from '../validations';
import {
  maxLength,
  minLength,
  email,
  url,
  alpha,
} from 'vuelidate/lib/validators';

export default {
  steppers: [
    { icon: 'fa-lock', title: 'general', slotName: 'step1' },
    { icon: 'fa-info-circle', title: 'information', slotName: 'step2' },
    { icon: 'fa-comment-dots', title: 'details', slotName: 'step3' },
    { icon: 'fa-thumbs-up', title: 'experience', slotName: 'step4' },
    { icon: 'fa-lock', title: 'education', slotName: 'step5' },
    { icon: 'fa-info-circle', title: 'depedent', slotName: 'step6' },
    { icon: 'fa-comment-dots', title: 'emergency_contact', slotName: 'step7' },
    { icon: 'fa-thumbs-up', title: 'skill', slotName: 'step8' },
    { icon: 'fa-thumbs-up', title: 'social_media', slotName: 'step9' },
    { icon: 'fa-thumbs-up', title: 'done', slotName: 'step10' },
  ],

  stepFields: {
    step1: ['current_company', 'current_occupation_id', 'diploma'],
    step2: [
      'image',
      'firstname',
      'lastname',
      'display_name',
      'gender',
      'location',
      'birth_date',
    ],

    step3: ['email', 'phone', 'skype', 'other_contact', 'resume_url'],
    step4: [
      'company_name',
      'start_date',
      'end_date',
      'is_currently_working',
      'salary',
      'currency_id',
      'salary_type',
      'occupation_id',
    ],
    step5: [
      'name',
      'type',
      'gpa',
      'start_date',
      'end_date',
      'education_field_id',
      'education_degree_id',
    ],
    step6: [
      'name',
      'relationship',
      'gender',
      'phone',
      'birth_date',
      'email',
      'address_id',
    ],
    step7: [
      'name',
      'relationship',
      'phone',
      'email',
      'office_number',
      'landline_numer',
    ],
    step8: ['skill_id', 'level'],
  },

  // model schema
  schema: {
    // step 1
    current_company: '',
    current_occupation_id: '',
    diploma: '',

    // step 2
    image: '',
    firstname: '',
    lastname: '',
    display_name: '',
    gender: '',
    location: '',
    birth_date: '',

    // step 3
    email: '',
    phone: '',
    skype: '',
    other_contact: '',
    resume_url: '',

    // step 4
    experiences: [],

    // step 5
    educations: [],

    // step 6
    dependents: [],

    // step 7
    emergency_contacts: [],

    // step 8
    skills: [],

    // step 9
    social_media: [],
  },

  experienceSchema: {
    company_name: '',
    start_date: '',
    end_date: '',
    is_currently_working: false,
    salary: '',
    currency_id: '',
    salary_type: '',
    occupation_id: '',
  },

  educationsSchema: {
    name: '',
    type: 'school',
    gpa: '',
    start_date: '',
    end_date: '',
    education_field_id: '',
    education_degree_id: '',
  },

  dependentsSchema: {
    name: '',
    relationship: '',
    gender: '',
    phone: '',
    birth_date: '',
    email: '',
    address_id: '',
  },

  emergencyContactsSchema: {
    name: '',
    relationship: '',
    phone: '',
    email: '',
    office_number: '',
    landline_numer: '',
  },

  skillsSchema: {
    skill_id: '',
    level: '',
  },

  socialMediaSchema: {
    social_media_id: '',
    url: '',
  },

  // validations
  validations: {
    // step 1
    current_company: { minLength: minLength(2), maxLength: maxLength(100) },
    current_occupation_id: {},
    diploma: {
      minLength: minLength(2),
      maxLength: maxLength(60),
    },

    // step 2
    image: Validations.imageValidation,
    firstname: Validations.nameValidation,
    lastname: Validations.nameValidation,
    display_name: Validations.nameValidation,
    gender: Validations.requiredValidation,
    location: {
      minLength: minLength(2),
      maxLength: maxLength(200),
    },
    birth_date: {},

    // step 3
    email: Validations.emailValidation,
    phone: Validations.phoneValidation,
    skype: { url, minLength: minLength(2) },
    other_contact: { phoneNumber },
    resume_url: Validations.requiredValidation,

    // step 4
    experiences: {
      $each: {
        company_name: Validations.name100Validation,
        start_date: Validations.requiredValidation,
        end_date: {},
        is_currently_working: {},
        salary: Validations.decimalValidation,
        currency_id: Validations.requiredValidation,
        salary_type: Validations.requiredValidation,
        occupation_id: Validations.requiredValidation,
      },
    },

    // step 5
    educations: {
      $each: {
        name: Validations.name100Validation,
        type: Validations.requiredValidation,
        gpa: Validations.decimalValidation,
        start_date: Validations.requiredValidation,
        end_date: {},
        education_field_id: Validations.requiredValidation,
        education_degree_id: Validations.requiredValidation,
      },
    },

    // step 6
    dependents: {
      $each: {
        name: Validations.name100Validation,
        relationship: {
          minLength: minLength(2),
          maxLength: maxLength(50),
        },
        gender: Validations.requiredValidation,
        phone: {
          phoneNumber,
        },
        birth_date: {},
        email: Validations.emailValidation,
        address_id: Validations.requiredValidation,
      },
    },

    // step 7
    emergency_contacts: {
      $each: {
        name: Validations.name100Validation,
        relationship: {
          minLength: minLength(2),
          maxLength: maxLength(50),
        },
        phone: Validations.phoneValidation,
        email: {
          email,
        },
        office_number: {
          phoneNumber,
        },
        landline_number: {
          phoneNumber,
        },
      },
    },

    // step 8
    skills: {
      $each: {
        skill_id: Validations.requiredValidation,
        level: Validations.numberValidation,
      },
    },

    // step 9
    social_media: {
      $each: {
        social_media_id: Validations.requiredValidation,
        url: Validations.urlValidationRequired,
      },
    },
  },
};
