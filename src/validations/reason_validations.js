import Validations from "./validations";
import Rules from "./rules-new";

export default {

  // model schema
  schema: {
    name: '',
  },

  // roles
  rules: {
    nameRule: Rules.nameRule,
  },

  // validations
  validations: {
    name: Validations.name100Validation,
  }
}
