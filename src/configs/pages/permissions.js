export default function (appContext) {
  return {
    // Register Company Steppers
    steppers: [
      { icon: "fa-question-circle", title: "general", slotName: "step1" },
      { icon: "fa-lock", title: "project", slotName: "step2" },
      { icon: "fa-comment-dots", title: "remarks", slotName: "step3" },
      { icon: "fa-thumbs-up", title: "done", slotName: "step4" },
    ],

    // breadcrumb
    breadcrumb: [
      { text: "dashboard", exact: true, to: "/" },
      {
        text: "permissions",
        disabled: true,
        to: "",
        icon: "mdi-account-group",
      },
    ],

    // tab items
    tabItems: [
      { text: "all", icon: "mdi-grid", isSelected: 1, key: "all" },
      {
        text: "active",
        icon: "mdi-thumb-up-outline",
        isSelected: 0,
        key: "active",
      },
      { text: "inactive", icon: "mdi-cancel", isSelected: 0, key: "inactive" },
      {
        text: "blocked",
        icon: "mdi-alert-circle-outline",
        isSelected: 0,
        key: "warning",
      },
      { text: "removed", icon: "mdi-delete", isSelected: 0, key: "deleted" },
      {
        text: "pending",
        icon: "mdi-account-cancel",
        isSelected: 0,
        key: "request",
      },
    ],

    // table headers
    headers: [
      {
        text: "id",
        value: "id",
        select: false,
        id: 1,
        sortable: false,
        category_id: 1,
      },
      { text: "name", value: "name", select: false, id: 2, category_id: 1 },
      {
        text: "created_at",
        value: "created_at",
        select: false,
        id: 3,
        category_id: 1,
      },
    ],
  };
}
