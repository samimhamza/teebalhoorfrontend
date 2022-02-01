export default function (appContext) {
  return {
    category: [
      {
        text: 'all_caps',
        value: 0,
        category_id: 0,
        selected: true,
      },
      {
        text: 'general_info_caps',
        value: 0,
        category_id: 1,
        selected: false,
      },
      {
        text: 'country_info_caps',
        value: 0,
        category_id: 2,
        selected: false,
      },
    ],

    // breadcrumb
    breadcrumb: [
      { text: 'dashboard', exact: true, to: '/' },
      {
        text: 'countries',
        disabled: true,
        to: '',
        icon: 'mdi-earth',
      },
    ],

    // tab items
    tabItems: [
      {
        text: 'all',
        icon: 'fa-table',
        isSelected: 1,
        key: 'all',
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
    ],
    // table headers
    headers: [
      {
        text: 'id',
        value: 'code',
        select: false,
        id: 1,
        sortable: false,
        category_id: 1,
      },
      {
        text: "flag",
        value: "iso2",
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
        text: "capital",
        value: "capital",
        select: false,
        id: 4,
        category_id: 1,
      },
      {
        text: "national",
        value: "national",
        select: false,
        id: 5,
        category_id: 1,
      },
      {
        text: "native",
        value: "native",
        select: false,
        id: 6,
        category_id: 1,
      },
      {
        text: "phone_code",
        value: "phone_code",
        select: false,
        id: 7,
        category_id: 1,
      },

      {
        text: 'currency',
        value: 'currency_name',
        select: false,
        id: 9,
        category_id: 1,
      },
      {
        text: 'currency_symbol',
        value: 'currency_symbol',
        select: false,
        id: 10,
        category_id: 1,
      },
      {
        text: "region",
        value: "region",
        select: false,
        id: 11,
        category_id: 1,
      },
      {
        text: "sub_region",
        value: "subregion",
        select: false,
        id: 12,
        category_id: 1,
      },
      {
        text: "status",
        value: "status",
        select: false,
        id: 8,
        category_id: 1,
      },
      {
        text: "timezones",
        value: "timezones",
        select: false,
        id: 13,
        category_id: 1,
      },
      {
        text: 'created_at',
        value: 'created_at',
        select: false,
        id: 14,
        category_id: 2,
      },
    ],
  };
}
