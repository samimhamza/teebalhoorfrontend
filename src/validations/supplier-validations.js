import Validations from "./validations";
import Rules from "./rules-new";

export default {
  headers: [
    { icon: "fa-info-circle", title: "general", slotName: "step1" },
    { icon: "fa-user", title: "supplier_information", slotName: "step2" },
    { icon: "fa-warehouse", title: "location", slotName: "step3" },
    { icon: "fa-comment-dots", title: "notes", slotName: "step4" },
    { icon: "fa-thumbs-up", title: "done", slotName: "step5" },
  ],

  schema: {
    legal_type: "",
    country_type: "",
    commercial_type: "",
    supply_type: "",
    label_id: "",
    note: "",
    supplier_trading_name: "",
    supplier_name: "",
    main_phone: "",
    email: "",
    website: "",
    purchase_order_phone: "",
    prepration_period: "",
  },

  rules: {
    labelRule: Rules.labelRule,
    emailRule: Rules.emailRule,
    noteRule: Rules.noteRule,

    supplyTypeRule(validationObject, context) {
      return [
        (_) =>
          validationObject.required ||
          context.$tr("item_required", context.$tr("supply_type")),
      ];
    },
    legalTypeRule(validationObject, context) {
      return [
        (_) =>
          validationObject.required ||
          context.$tr("item_required", context.$tr("legal_type")),
      ];
    },
    commercialTypeRule(validationObject, context) {
      return [
        (_) =>
          validationObject.required ||
          context.$tr("item_required", context.$tr("commercial_type")),
      ];
    },
    countryTypeRule(validationObject, context) {
      return [
        (_) =>
          validationObject.required ||
          context.$tr("item_required", context.$tr("country_type")),
      ];
    },
    supplierTradingNameRule(validationObject, context) {
      return [
        (_) =>
          validationObject.supplier_trading_name.required ||
          context.$tr("item_required", context.$tr("supplier_trading_name")),
      ];
    },
    supplierNameRule(validationObject, context) {
      return [
        (_) =>
          validationObject.supplier_name.required ||
          context.$tr("item_required", context.$tr("supplier_name")),
      ];
    },
    purchaseOrderPhoneRule(validationObject, context) {
      return [
        (_) =>
          validationObject.purchase_order_phone.required ||
          context.$tr("item_required", context.$tr("purchase_order_phone")),
        (_) =>
          validationObject.purchase_order_phone.phoneNumber ||
          context.$tr("item_is_invalid", context.$tr("purchase_order_phone")),
      ];
    },
    mainPhoneRule(validationObject, context) {
      return [
        (_) =>
          validationObject.main_phone.required ||
          context.$tr("item_required", context.$tr("main_phone")),
        (_) =>
          validationObject.main_phone.phoneNumber ||
          context.$tr("item_is_invalid", context.$tr("main_phone")),
      ];
    },
    websiteRule(validationObject, context) {
      return [
        (_) =>
          validationObject.website.required ||
          context.$tr("item_required", context.$tr("website")),
        (_) =>
          validationObject.website.url ||
          context.$tr("urlFormat", [context.$tr("website")]),
      ];
    },
    preprationPeriodRule(validationObject, context) {
      return [
        (_) =>
          validationObject.prepration_period.required ||
          context.$tr("item_required", context.$tr("prepration_period")),
      ];
    },
  },

  validations: {
    legal_type: Validations.requiredValidation,
    country_type: Validations.requiredValidation,
    commercial_type: Validations.requiredValidation,
    supply_type: Validations.requiredValidation,
    label_id: Validations.requiredValidation,
    supplier_trading_name: Validations.requiredValidation,
    supplier_name: Validations.requiredValidation,
    main_phone: Validations.phoneValidation,
    email: Validations.emailValidation,
    purchase_order_phone: Validations.phoneValidation,
    website: Validations.urlValidationRequired,
    prepration_period: Validations.requiredValidation,
    note: Validations.remarksValidation,
  },
};
