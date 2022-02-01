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
        text: "social_media",
        disabled: true,
        to: "",
        icon: "fa-icons",
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
        text: 'active',
        icon: 'fa-thumbs-up',
        isSelected: 0,
        key: 'active',
      },
      {
        text: 'inactive',
        icon: 'fa-ban',
        isSelected: 0,
        key: 'inactive',
      },
      {
        text: 'blocked',
        icon: 'fa-times-circle',
        isSelected: 0,
        key: 'blocked',
      },
      {
        text: 'deleted',
        icon: 'fa-trash',
        isSelected: 0,
        key: 'removed',
      },
      {
        text: 'pending',
        icon: 'fa-user-slash',
        isSelected: 0,
        key: 'pending',
      },
    ],
    // table headers
    headers: [
      {
        text: "id",
        value: "code",
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
        text: "website",
        value: "website",
        select: false,
        id: 4,
        category_id: 1,
        sortable: false,
      },
      {
        text: "created_at",
        value: "created_at",
        select: false,
        id: 5,
        category_id: 1,
        sortable: false,
      },
      {
        text: "updated_at",
        value: "updated_at",
        select: false,
        id: 5,
        category_id: 1,
        sortable: false,
      },
      {
        text: "status",
        value: "status",
        select: false,
        id: 6,
        category_id: 2,
        sortable: false,
      },
    ],
  };
}
