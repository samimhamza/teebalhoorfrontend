export default function (appContext) {
  return {
    // breadcrumb
    breadcrumb_items_user: [
      { text: "dashboard", exact: true, to: "/" },
      {
        text: "user_activity",
        disabled: true,
        to: "/users/logs",
        icon: "mdi-account-details",
      },
    ],

    breadcrumb_items_master: [
      { text: "dashboard", exact: true, to: "/" },
      {
        text: "master_activity",
        disabled: true,
        to: "/masters/logs",
        icon: "mdi-account-details",
      },
    ],

    // tab items user
    tabItems_user: [
      {
        text: "all",
        icon: "fa fa-table",
        isSelected: 1,
        key: "all",
      },
      {
        text: "user",
        icon: "fa fa-user",
        isSelected: 0,
        key: "user",
      },
      {
        text: "team",
        icon: "mdi-account-group ",
        isSelected: 0,
        key: "team",
      },
      {
        text: "roles",
        icon: "mdi-shield-account",
        isSelected: 0,
        key: "role",
      },
      {
        text: "status_event",
        icon: "mdi-shield-account",
        isSelected: 0,
        key: "status_event",
      },
    ],

    category: [
      { text: "all_caps", value: 0, category_id: 0, selected: true },
      {
        text: "general_info_caps",
        value: 0,
        category_id: 1,
        selected: false,
      },
      {
        text: "activity_information",
        value: 0,
        category_id: 2,
        selected: false,
      },
      { text: "location_caps", value: 0, category_id: 3, selected: false },
      { text: "datewise_caps", value: 0, category_id: 4, selected: false },
    ],

    // tab items master
    tabItems_master: [
      {
        text: appContext.$tr("all"),
        icon: "fa fa-table",
        isSelected: 1,
        key: "all",
      },
      {
        text: appContext.$tr("country"),
        icon: "mdi-earth",
        isSelected: 0,
        key: "country",
      },
      {
        text: appContext.$tr("department"),
        icon: "mdi-school ",
        isSelected: 0,
        key: "department",
      },
      {
        text: appContext.$tr("company"),
        icon: "mdi-domain",
        isSelected: 0,
        key: "company",
      },
      {
        text: appContext.$tr("system"),
        icon: "mdi-domain",
        isSelected: 0,
        key: "system",
      },
      {
        text: appContext.$tr("business_locations"),
        icon: "mdi-domain",
        isSelected: 0,
        key: "business_location",
      },
      {
        text: appContext.$tr("language"),
        icon: "mdi-domain",
        isSelected: 0,
        key: "language",
      },
      {
        text: appContext.$tr("translation"),
        icon: "mdi-domain",
        isSelected: 0,
        key: "translation",
      },
      {
        text: appContext.$tr("status_event_list"),
        icon: "mdi-shield-account",
        isSelected: 0,
        key: "status_event",
      },
    ],

    // table headers
    headers: [
      {
        text: "id",
        value: "user_id",
        align: "left",
        select: false,
        id: 1,
        category_id: 1,
      },
      {
        text: "username",
        value: "username",
        align: "left",
        select: true,
        id: 2,
        category_id: 1,
      },
      {
        text: "location",
        width: "300px",
        value: "location",
        align: "left",
        select: false,
        id: 3,
        category_id: 3,
      },
      {
        text: "event",
        value: "event",
        width: "120px",
        align: "left",
        select: false,
        id: 4,
        category_id: 2,
      },
      {
        text: "content",
        value: "content",
        align: "left",
        select: false,
        id: 5,
        category_id: 2,
      },
      {
        text: "page",
        value: "page",
        align: "left",
        select: false,
        id: 6,
        category_id: 2,
      },
      {
        text: "date",
        width: "200px",
        value: "date",
        align: "left",
        select: false,
        id: 7,
        category_id: 4,
      },
      {
        text: "time",
        width: "200px",
        value: "time",
        align: "left",
        select: false,
        id: 8,
        category_id: 4,
      },
    ],
  };
}
