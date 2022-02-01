import Validations from "./validations";
import Rules from "./rules-new";

export default {
  form: {
    file: "",
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
  schema: {},

  rules: {
    nameRule: Rules.nameRule,
    labelRule: Rules.labelRule,
    noteRule: Rules.noteRule,
    fileRule: Rules.fileRule,
    departmentRule: Rules.departmentRule,
    schedule_typeRule: Rules.schedule_typeRule,
    sub_systemRule: Rules.sub_systemRule,
    userRule: Rules.userRule,
    roleRule: Rules.roleRule,
    actionRule: Rules.actionRule,
  },

  validations: {
    team_role: {
      name: Validations.name100Validation,
      label_id: Validations.requiredValidation,
      note: Validations.remarksValidation,
    },
    file: Validations.fileValidation,
    action_id: Validations.requiredValidation,
    sub_system_id: Validations.requiredValidation,
    department_id: Validations.requiredValidation,
    user_id: Validations.requiredValidation,
    schedule_type: Validations.requiredValidation,
  },
};
