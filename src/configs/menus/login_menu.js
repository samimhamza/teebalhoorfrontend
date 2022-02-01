export default [
  {
    logo: "/icons/SYSTEM ICON/system-login-logo.png",
    color: "primary",
    text: "Login Activity System",
    key: "login_activity_system",
    showForAll: true,
    items: [
      {
        icon: "mdi-earth",
        key: "login_page",
        text: "Login",
        link: "/logins",
        exact: true,
        scope: "user_activity-view",
      },
    ],
  },
];
