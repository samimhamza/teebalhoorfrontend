export default [
  {
    logo: "/icons/SYSTEM ICON/System Icone-08.svg",
    color: "cyan",
    text: "HR Management System",
    key: "hr_management_system",
    showForAll: true,
    items: [
      {
        icon: "mdi-earth",
        key: "job_posts",
        text: "Job Posts",
        link: "/hr-management/job-posts",
        exact: true,
        scope: "employees-view",
      },

      {
        key: "candidates",
        text: "Candidates",
        icon: "mdi-account-outline",
        link: "/hr-management/candidates",
        exact: true,
        scope: "users-view",
      },

      {
        icon: "mdi-cog",
        key: "settings",
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
            link: "/status_management/status_event/supplier",
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
