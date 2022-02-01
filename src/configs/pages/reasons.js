export default function (appContext) {
  return {
    // breadcrumb
    breadcrumb: [
      { text: "dashboard", exact: true, to: "/" },
      { text: "status_event_list", disabled: true, to: "", icon: "mdi-svg" },
    ],
    category: [
      { text: "all_caps", value: 0, category_id: 0, selected: true },
      { text: "general_info_caps", value: 0, category_id: 1, selected: false },
      { text: "system_info_caps", value: 0, category_id: 2, selected: false },
      { text: "datewise_caps", value: 0, category_id: 3, selected: false },
    ],
    // tab items
    tabItems: [{ text: "all", icon: "fa-table", isSelected: 1, key: "all" }],

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
      { text: "reason", value: "title", select: false, id: 2, category_id: 1 },
      { text: "types", value: "types", select: false, id: 3, category_id: 1 },
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
    ],
  };
}
