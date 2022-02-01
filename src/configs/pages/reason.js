export default function (appContext) {
  return {

    // breadcrumb
    breadcrumb: [
      {text: "dashboard", exact: true, to: "/"},
      {text: "reasons", disabled: true, to: "", icon: "mdi-head-question"},
    ],

    // tab items
    tabItems: [
      {text: 'all', icon: "fa-table", isSelected: 1, key: "all"},
    ],

    // table headers
    headers: [
      {text: 'id',    value: "code",    select: false, id: 1, sortable: false, category_id: 1},
      {text: 'title', value: "title", select: false, id: 2, category_id: 1},
      {text: 'systems', value: "system.name", select: false, id: 3, category_id: 1},
      {text: 'created_at', value: "created_at", select: false, id: 4, category_id: 1},
    ],
  }
}
