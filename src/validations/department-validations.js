import Validations from "./validations";
import Rules from "./rules-new";

export default {
  form: {
    file: '',
  },
  fileExtension:
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  perpageDropdown: [
    //  10, 20, 50, 100 , 200, 500 , 100 , all
    {
      text: "5",
      value: 5,
    },
    {
      text: "10",
      value: 10,
    },
    {
      text: "20",
      value: 20,
    },
    {
      text: "50",
      value: 50,
    },
    {
      text: "100",
      value: 100,
    },
    {
      text: "200",
      value: 200,
    },
    {
      text: "500",
      value: 500,
    },
    {
      text: "1000",
      value: 1000,
    },
    {
      text: "All",
      value: -1,
    },
  ],
  // model schema
  schema: {
    name: "",
    country_id: "",
    company_id: "",
    label_id: "",
    industry_id: "",
    note: "",
  },

  // roles
  rules: {
    nameRule: Rules.nameRule,
    countryRule: Rules.countryRule,
    companyRule: Rules.companyRule,
    labelRule: Rules.labelRule,
    industryRule: Rules.industryRule,
    noteRule: Rules.noteRule,
    fileRule: Rules.fileRule,
  },

  // validations
  validations: {
    department: {
      name: Validations.name100Validation,
      country_id: Validations.requiredValidation,
      company_id: Validations.requiredValidation,
      note: Validations.remarksValidation,
      label_id: Validations.requiredValidation,
      industry_id: Validations.requiredValidation,
    },
    file: Validations.fileValidation,
  },
};
