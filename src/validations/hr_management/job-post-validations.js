import { minLength, minValue, maxLength, required } from "vuelidate/lib/validators";

export default {
  steppers: [
    { icon: "fa-lock",            title: "general",         slotName: "step1" },
    { icon: "fa-check-double",    title: "specifications",  slotName: "step2" },
    { icon: "fa-hand-holding-usd",title: "scores",          slotName: "step3" },
    { icon: "fa-calendar-alt",    title: "date",            slotName: "step4" },
    { icon: "fa-thumbs-up",       title: "done",            slotName: "step5" },
  ],

  stepFields: {
    step1:        ['department_id', 'occupation_id', 'location', 'descriptions'],
    step2:        ['contract_type', 'minimum_experience_level', 'headcount', 'is_remote'],
    step3:        ['min_salary', 'max_salary', 'currency_id', 'details', 'salary_type'],
    step4:        ['expected_close_date', 'close_date', 'open_date'],
  },

  schema: {
    // Step 1
    department_id:            '',
    occupation_id:            '',
    descriptions:             '',
    location:                 '',

    // Step 2
    contract_types:           ['Part Time', 'Full Time', 'Temporary', 'Contract', 'Intern', 'Nightly', 'Freelance'],
    contract_type:            '',
    experience_levels:        ['Senior', 'Middle', 'Junior'],
    minimum_experience_level: '',
    headcount:                '',
    is_remotes:               [
      { value: 1, name: 'Yes' },
      { value: 0, name:'No' }
    ],
    is_remote:                '',

    // Step 3
    min_salary:               '',
    max_salary:               '',
    currency_id:              '',
    salary_types:             ['Hourly', 'Daily', 'Weekly', 'Monthly', 'Annually'],
    salary_type:              '',
    details:                  '',

    // Step 4
    showOpenDate:             false,
    showCloseDate:            false,
    showExpectedCloseDate:    false,
    expected_close_date:      '',
    close_date:               '',
    open_date:                '',

    // Others
    salaryMinMaxError:        '',
  },

  validations: {
    // Step 1
    department_id:            { required },
    occupation_id:            { required },
    descriptions:             { required },
    location:                 { required, minLength: minLength(3), maxLength: maxLength(100) },

    // Step 2
    contract_type:            { required },
    minimum_experience_level: { required },
    headcount:                { required, minValue: minValue(1) },
    is_remote:                { required },

    // Step 3
    min_salary:               { required, minValue: minValue(10) },
    max_salary:               { required, minValue: minValue(10) },
    currency_id:              { required },
    salary_type:              { required },
    details:                  {  },

    // Step 4
    expected_close_date:      { required },
    close_date:               { required },
    open_date:                { required },
  },
};
