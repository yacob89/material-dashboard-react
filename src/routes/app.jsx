import DashboardPage from "views/Dashboard/Dashboard.jsx";
import UserProfile from "views/UserProfile/UserProfile.jsx";
import TableList from "views/TableList/TableList.jsx";
import UploadList from "views/UploadList/UploadList.jsx";
import Typography from "views/Typography/Typography.jsx";
import Community from "views/Community/Community.jsx";
import Icons from "views/Icons/Icons.jsx";
import Maps from "views/Maps/Maps.jsx";
import NotificationsPage from "views/Notifications/Notifications.jsx";
import InternetOfThings from "views/InternetOfThings/InternetOfThings.jsx";
import PaymentPage from "views/Payment/PaymentPage.jsx";
import BankForm from "views/BankForm/BankForm.jsx";

import {
  Dashboard,
  Person,
  ContentPaste,
  LibraryBooks,
  BubbleChart,
  LocationOn,
  FileUpload,
  Notifications,
  CardMembership
} from "material-ui-icons";
import Upload from "../views/Upload/Upload";

const appRoutes = [
  /*{
    path: "/dashboard",
    sidebarName: "Dashboard",
    navbarName: "Material Dashboard",
    icon: Dashboard,
    component: DashboardPage
  },*/
  {
    path: "/user",
    sidebarName: "User Profile",
    navbarName: "Profile",
    icon: Person,
    component: UserProfile
  },
  /*{
    path: "/table",
    sidebarName: "Table List",
    navbarName: "Table List",
    icon: ContentPaste,
    component: TableList
  },*/
  {
    path: "/uploadlist",
    sidebarName: "Layer List",
    navbarName: "Layer List",
    icon: ContentPaste,
    component: UploadList
  },
  {
    path: "/typography",
    sidebarName: "Uploads",
    navbarName: "Uploads",
    icon: LibraryBooks,
    component: Typography
  },
  /*{
    path: "/icons",
    sidebarName: "Icons",
    navbarName: "Icons",
    icon: BubbleChart,
    component: Icons
  },*/
  {
    path: "/maps",
    sidebarName: "Preview",
    navbarName: "Preview",
    icon: LocationOn,
    component: Maps
  },
  {
    path: "/iot",
    sidebarName: "InternetOfThings",
    navbarName: "InternetOfThings",
    icon: BubbleChart,
    component: InternetOfThings
  },
  {
    path: "/community",
    sidebarName: "Community",
    navbarName: "Community",
    icon: LibraryBooks,
    component: Community
  },
  {
    path: "/bankform",
    sidebarName: "Upgrade",
    navbarName: "Upgrade",
    icon: CardMembership,
    component: BankForm
  },
  /*{
    path: "/upload",
    sidebarName: "Upload",
    navbarName: "Upload",
    icon: FileUpload,
    component: Upload
  },*/
  /*{
    path: "/notifications",
    sidebarName: "Notifications",
    navbarName: "Notifications",
    icon: Notifications,
    component: NotificationsPage
  },*/
  { redirect: true, path: "/", to: "/user", navbarName: "Redirect" }
];

export default appRoutes;
