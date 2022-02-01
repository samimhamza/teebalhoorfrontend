export default {
  // apps quick menu

  apps: [
    {
      icon: "mdi-email-outline",
      text: "Profile",
      key: "profile",
      subtitle: "Hey!",
      link: "/users/edit",
    },
    {
      icon: "mdi-format-list-checkbox",
      title: "Tasks",
      key: "todo",
      subtitle: "TODO",
      link: "/apps/todo",
    },
    {
      icon: "mdi-message-outline",
      title: "Chat",
      key: "chat",
      subtitle: "#general",
      link: "/apps/chat/channel/general",
    },
    {
      icon: "mdi-view-column-outline",
      title: "Board",
      key: "board",
      subtitle: "Kanban",
      link: "/apps/board",
    },
  ],

  // user dropdown menu
  user: [
    {
      icon: "mdi-account-box-outline",
      key: "profile",
      text: "Profile",
      link: "/users/edit",
    },
    {
      icon: "mdi-format-list-checkbox",
      key: "todo",
      text: "Todo",
      link: "/apps/todo",
    },
  ],
};
