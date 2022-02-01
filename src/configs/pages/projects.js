export default function (appContext) {
  return {
    category: [
      {
        text: "all_caps",
        value: 0,
        category_id: 0,
        selected: true,
      },
      {
        text: "general_info_caps",
        value: 0,
        category_id: 1,
        selected: false,
      },
      {
        text: "company_information",
        value: 0,
        category_id: 2,
        selected: false,
      },
      {
        text: "location_caps",
        value: 0,
        category_id: 3,
        selected: false,
      },
      {
        text: "datewise_caps",
        value: 0,
        category_id: 4,
        selected: false,
      },
    ],

    // Register Company Steppers
    steppers: [
      {
        icon: "fa-question-circle",
        title: "general",
        slotName: "step1",
      },
      {
        icon: "fa-lock",
        title: "company",
        slotName: "step2",
      },
      {
        icon: "fa-icons",
        title: "social_media",
        slotName: "step3",
      },
      {
        icon: "fa-comment-dots",
        title: "remarks",
        slotName: "step4",
      },
      {
        icon: "fa-thumbs-up",
        title: "done",
        slotName: "step5",
      },
    ],

    // breadcrumb
    breadcrumb: [
      { text: "dashboard", exact: true, to: "/" },
      {
        text: "companies",
        disabled: true,
        to: "",
        icon: "mdi-domain",
      },
    ],

    //  tabItem
    tabItems: [
      {
        text: "all",
        icon: "fa-table",
        isSelected: 1,
        key: "all",
      },
      {
        text: "active",
        icon: "fa-thumbs-up",
        isSelected: 0,
        key: "active",
      },
      {
        text: "inactive",
        icon: "fa-ban",
        isSelected: 0,
        key: "inactive",
      },
      {
        text: "blocked",
        icon: "fa-times-circle",
        isSelected: 0,
        key: "blocked",
      },
      {
        text: "removed",
        icon: "fa-trash",
        isSelected: 0,
        key: "removed",
      },
      {
        text: "pending",
        icon: "fa-user-slash",
        isSelected: 0,
        key: "pending",
      },
    ],

    // table headers
    headers: [
      {
        text: "id",
        // text: "id",
        value: "code",
        select: false,
        id: 1,
        sortable: false,
        category_id: 1,
      },
      {
        text: "logo",
        // text: "logo",
        value: "logo",
        select: false,
        id: 2,
        category_id: 1,
      },
      {
        text: "name",
        // text: "name",
        value: "name",
        select: false,
        id: 3,
        category_id: 1,
      },
      {
        text: "email",
        // text: "email",
        value: "email",
        select: false,
        id: 4,
        category_id: 1,
      },
      {
        text: "label",
        // text:"label",
        value: "label",
        select: false,
        id: 5,
        sortable: false,
        category_id: 1,
      },
      {
        text: "countries",
        // text: "countries",
        value: "countries",
        select: false,
        id: 6,
        category_id: 1,
        sortable: false,
        // text: "departments",
        value: "departments",
        select: false,
        id: 7,
        category_id: 1,
        sortable: false,
      },
      {
        text: "systems",
        // text: "systems",
        value: "systems",
        select: false,
        id: 8,
        sortable: false,
        category_id: 1,
      },
      {
        text: "investment_type",
        // text: "investment_type",
        value: "investment_type",
        select: false,
        id: 9,
        category_id: 1,
      },
      {
        text: "note",
        // text: "note",
        value: "note",
        select: false,
        id: 11,
        category_id: 1,
      },
      {
        text: "created_by",
        // text: "created by",
        value: "created_by",
        select: false,
        id: 12,
        category_id: 1,
      },
      {
        text: "updated_by",
        // text: "updated_by",
        value: "updated_by",
        select: false,
        id: 13,
        category_id: 1,
      },
      {
        text: "status",
        // text: "status",
        value: "status",
        select: false,
        id: 10,
        category_id: 1,
      },
    ],
  };
}
