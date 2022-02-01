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
        text: "role_caps",
        value: 0,
        category_id: 2,
        selected: false,
      },
    ],
    steppers: [
      {
        icon: "fa-info",
        title: "general",
        slotName: "step1",
      },
      {
        icon: "fa-user-shield",
        title: "role",
        slotName: "step2",
      },
      {
        icon: "fa-user",
        title: "permissions",
        slotName: "step3",
      },
      {
        icon: "fa-users",
        title: "user",
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
        text: "role_list",
        disabled: true,
        to: "",
        icon: "mdi-shield-account",
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
        category_id: 2,
      },
      {
        text: "name",
        value: "name",
        select: false,
        id: 3,
        category_id: 1,
      },
      {
        text: "department",
        value: "departments",
        select: false,
        id: 4,
        category_id: 1,
        sortable: false,
      },
      {
        text: "label",
        value: "label.title",
        select: false,
        id: 5,
        category_id: 1,
        sortable: false,
      },
      {
        text: "note",
        value: "note",
        select: false,
        id: 6,
        category_id: 1,
      },
      {
        text: "created_by",
        value: "created_by",
        select: false,
        id: 7,
        category_id: 1,
      },
      {
        text: "updated_by",
        value: "updated_by",
        select: false,
        id: 8,
        category_id: 1,
      },
      {
        text: "status",
        value: "status",
        select: false,
        id: 9,
        category_id: 2,
      },
    ],
  };
}
