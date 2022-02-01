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
        text: "department_info_caps",
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
    // breadcrumb
    breadcrumb: [
      {
        text: "dashboard",
        exact: true,
        to: "/",
      },
      {
        text: "departments",
        disabled: true,
        to: "",
        icon: "mdi-school",
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
        text: "label",
        value: "label",
        select: false,
        id: 4,
        category_id: 1,
      },
      {
        text: "industry",
        value: "industry",
        select: false,
        id: 5,
        category_id: 1,
      },
      {
        text: "companies",
        value: "companies",
        select: false,
        id: 6,
        category_id: 1,
      },
      {
        text: "countries",
        value: "countries",
        select: false,
        id: 7,
        category_id: 3,
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
        id: 9,
        category_id: 1,
      },
      {
        text: "updated_by",
        value: "updated_by",
        select: false,
        id: 11,
        category_id: 1,
      },
      {
        text: "status",
        value: "status",
        select: false,
        id: 10,
        category_id: 1,
      },
    ],
  };
}
