export default function (appContext) {
  return {
    // Category
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
        text: "system_info_caps",
        value: 0,
        category_id: 2,
        selected: false,
      },
      {
        text: "datewise_caps",
        value: 0,
        category_id: 3,
        selected: false,
      },
    ],
    // Steppers
    steppers: [
      {
        icon: "fa-info-circle",
        title: "general",
        slotName: "step1",
      },
      {
        icon: "mdi-list-status",
        title: "sub_system",
        slotName: "step2",
      },
      {
        icon: "fa-thumbs-up",
        title: "done",
        slotName: "step3",
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
        text: "systems",
        disabled: true,
        to: "",
        icon: "mdi-cogs",
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
    ],
    // table headers
    headers: [
      {
        text: "id",
        value: "id",
        select: false,
        id: 1,
        category_id: 1,
        sortable: false,
      },
      {
        text: "logo",
        value: "logo",
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
        text: "sub_system",
        value: "sub_systems",
        select: false,
        id: 4,
        category_id: 3,
        sortable: false,
      },
      {
        text: "created_at",
        value: "created_at",
        select: false,
        id: 5,
        category_id: 3,
        sortable: false,
      },
    ],
  };
}
