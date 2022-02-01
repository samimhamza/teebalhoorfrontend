export default function (appContext) {
  return {
    category: [
      { text: "all_caps", value: 0, category_id: 0, selected: true },
      {
        text: "general_info_caps",
        value: 0,
        category_id: 1,
        selected: false,
      },
      {
        text: "team_caps",
        value: 0,
        category_id: 2,
        selected: false,
      },
      { text: "location_caps", value: 0, category_id: 3, selected: false },
      { text: "datewise_caps", value: 0, category_id: 4, selected: false },
    ],
    steppers: [
      {
        icon: "fa-info",
        title: "general",
        slotName: "step1",
      },
      {
        icon: "fa-lock",
        title: "team",
        slotName: "step2",
      },
      {
        icon: "fa-user-shield",
        title: "permissions",
        slotName: "step3",
      },
      {
        icon: "fa-users",
        title: "members",
        slotName: "step4",
      },
      {
        icon: "fa-comment-dots",
        title: "remarks",
        slotName: "step5",
      },
      {
        icon: "fa-thumbs-up",
        title: "done",
        slotName: "step6",
      },
    ],

    // breadcrumb
    breadcrumb: [
      { text: "dashboard", exact: true, to: "/" },
      {
        text: "team_list",
        disabled: true,
        to: "",
        icon: "mdi-account-group",
      },
    ],

    // tab items
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
        key: "deleted",
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
        value: "code",
        select: false,
        id: 1,
        sortable: false,
        category_id: 1,
      },
      {
        text: "logo",
        value: "logoAvatar",
        select: false,
        id: 2,
        category_id: 1,
      },
      {
        text: "name",
        value: "name",
        select: false,
        id: 3,
        category_id: 1,
      },
      {
        text: "country",
        value: "department_company_country",
        select: false,
        id: 4,
        category_id: 3,
        sortable: false,
      },
      {
        text: "label",
        value: "label.title",
        select: false,
        id: 5,
        category_id: 1,
      },
      {
        text: "restriction_type",
        value: "schedule_type",
        select: false,
        id: 6,
        category_id: 2,
      },
      {
        text: "number_of_people",
        value: "number_of_people",
        select: false,
        id: 7,
        category_id: 3,
        sortable: false,
      },
      {
        text: "note",
        value: "note",
        select: false,
        id: 8,
        category_id: 1,
      },
      {
        text: "created_by",
        value: "created_by",
        select: false,
        id: 10,
        category_id: 2,
      },
      {
        text: "start_date",
        value: "start_time",
        select: false,
        id: 11,
        category_id: 2,
      },

      {
        text: "end_date",
        value: "end_time",
        select: false,
        id: 12,
        category_id: 4,
      },
      {
        text: "status",
        value: "status",
        select: false,
        id: 9,
        category_id: 1,
      },
    ],
  };
}
