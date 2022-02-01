export default [
  {
    logo: "/icons/SYSTEM ICON/System Icone-04.svg",
    color: "red",
    text: "Supplier Management System",
    key: "supplier_management_system",
    showForAll: true,
    items: [
      {
        icon: "mdi-earth",
        key: "suppliers_list",
        text: "Suppliers List",
        link: "/supplier",
        exact: true,
        scope: "suppliers-view",
      },

      {
        icon: "mdi-cog",
        key: "menu.settings",
        text: "Settings",
        scope: ["labels-view"],
        items: [
          {
            icon: "mdi-svg",
            key: "status_event_list",
            text: "Status Event List",
            link: "/status_management/status_event/supplier",
            exact: true,
            scope: "reasons-view",
          },
          {
            icon: "mdi-head-question",
            key: "reason_list",
            text: "Reasons List",
            link: "/status_management/reasons/supplier",
            exact: true,
            scope: "reasons-view",
          },
          {
            icon: "mdi-shuffle",
            key: "labels",
            text: "Labels List",
            link: "/labels/supplier",
            exact: true,
            scope: "labels-view",
          },
        ],
      },
    ],
  },
];
