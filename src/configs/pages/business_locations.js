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
        text: "user_info_caps",
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
        text: "business_locations",
        disabled: true,
        to: "/users",
        icon: "mdi-map-marker-radius",
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
        category_id: 1,
        sortable: false,
      },
      {
        text: "logo",
        value: "logoAvatar",
        select: false,
        id: 2,
        category_id: 1,
        sortable: false,
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
        value: "country.name",
        select: false,
        id: 4,
        category_id: 3,
        sortable: false,
      },
      {
        text: "company",
        value: "company.name",
        select: false,
        id: 5,
        category_id: 2,
        sortable: false,
      },
      {
        text: "state",
        value: "state.name",
        select: false,
        id: 6,
        category_id: 3,
        sortable: false,
      },
      {
        text: "address",
        value: "address",
        select: false,
        id: 7,
        category_id: 3,
      },
      {
        text: "title",
        value: "label.title",
        select: false,
        id: 8,
        category_id: 1,
        sortable: false,
      },
      {
        text: "note",
        value: "note",
        select: false,
        id: 9,
        category_id: 1,
      },
      {
        text: "map_link",
        value: "map_link",
        select: false,
        id: 11,
        category_id: 3,
        sortable: false,
      },

      {
        text: "created_by",
        value: "created_by",
        select: false,
        id: 12,
        category_id: 4,
      },
      {
        text: "created_at",
        value: "created_at",
        select: false,
        id: 13,
        category_id: 4,
      },
      {
        text: "status",
        value: "status",
        select: false,
        id: 10,
        category_id: 2,
      },
    ],
  };
}
