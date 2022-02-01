import UserMenu from "./menus/user_menu";
import FileMenu from "./menus/file_menu";
import MasterMenu from "./menus/master_menu";
import SupplierMenu from "./menus/supplier_menu";
import HrMenu from "./menus/hr_menu";
import LoginMenu from "./menus/login_menu";

export default {
  // main navigation - side menu
  menu: [
    {
      text: "",
      key: "",
      items: [
        {
          logo: "/icons/SYSTEM ICON/dashboard-logo.svg",
          key: "dashboard",
          text: "Dashboard",
          meta:{
            data: "janem asty"
          },
          link: "/",
          showForAll: true,
        },
      ],
    },
    {
      text: "",
      key: "",
      items: MasterMenu,
    },
    {
      text: "",
      key: "",
      items: LoginMenu,
    },
    {
      text: "",
      key: "",
      items: FileMenu,
    },
    {
      text: "",
      key: "",
      items: UserMenu,
    },
    {
      text: "",
      key: "",
      items: SupplierMenu,
    },
    {
      text: "",
      key: "",
      items: HrMenu,
    },
  ],
};
