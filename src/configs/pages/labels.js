export default function (appContext) {
  return {
    // breadcrumb
    category: [
      { text: "all_caps", value: 0, category_id: 0, selected: true },
      { text: "general_info_caps", value: 0, category_id: 1, selected: false },
      { text: "system_info_caps", value: 0, category_id: 2, selected: false },
      { text: "datewise_caps", value: 0, category_id: 3, selected: false },
    ],
    breadcrumb: [
      { text: "dashboard", exact: true, to: "/" },
      {
        text: "labels",
        disabled: true,
        to: "",
        icon: "mdi-head-question",
      },
    ],

    // tab items
    tabItems: [
      { text: "all", icon: "fa-table", isSelected: 1, key: "all" },
      { text: "archive", icon: "fa-thumbs-up", isSelected: 0, key: "archive" },
      { text: "live", icon: "fa-ban", isSelected: 0, key: "live" },
      { text: "removed", icon: "fa-trash", isSelected: 0, key: "removed" },
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
      { text: "label", value: "label", select: false, id: 2, category_id: 1 },
      { text: "title", value: "title", select: false, id: 3, category_id: 1 },
      {
        text: "sub_systems",
        value: "sub_systems",
        select: false,
        id: 4,
        category_id: 1,
      },
      {
        text: "created_at",
        value: "created_at",
        select: false,
        id: 5,
        category_id: 1,
      },
      { text: "status", value: "status", select: false, id: 6, category_id: 1 },
    ],
  };
}
