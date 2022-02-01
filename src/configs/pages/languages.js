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
        text: "language_info_caps",
        value: 0,
        category_id: 2,
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
        text: "languages",
        disabled: true,
        to: "",
        icon: "mdi-earth",
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
        text: "pending",
        icon: "fa-ban",
        isSelected: 0,
        key: "pending",
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
        text: "flag",
        value: "country_language.country.iso2",
        select: false,
        id: 2,
        category_id: 2,
      },
      {
        text: "name",
        value: "country_language.language.name",
        select: false,
        id: 3,
        category_id: 1,
      },
      {
        text: "native",
        value: "country_language.language.native",
        select: false,
        id: 4,
        category_id: 2,
      },
      {
        text: "frontend",
        value: "frontendCount",
        select: false,
        id: 5,
        category_id: 2,
      },
      {
        text: "backend",
        value: "backendCount",
        select: false,
        id: 6,
        category_id: 2,
      },
      {
        text: "translated",
        value: "translatedCount",
        select: false,
        id: 7,
        category_id: 2,
      },
      {
        text: "percentage",
        value: "percentage",
        select: false,
        id: 8,
        category_id: 2,
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
        id: 10,
        category_id: 1,
      },
      {
        text: "created_at",
        value: "created_at",
        select: false,
        id: 11,
        category_id: 4,
      },
      {
        text: "status",
        value: "status",
        select: false,
        id: 12,
        category_id: 1,
      },
    ],
  };
}
