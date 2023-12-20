// dashbaord
import Default from "../components/dashboard/default";
import Ecommerce from "../components/dashboard/ecommerce";

// starter kits
import Starterkits from "../components/starter-kits";
import Customers from "../pages/Vendor/Customers";
import CustomerSupport from "../pages/Vendor/CustomerSupport";
import Dashboard from "../pages/Vendor/Dashboard";
import Enquiry from "../pages/Vendor/Enquiry";
import Login from "../pages/Vendor/Login";
import Slots from "../pages/Vendor/Slots";
import Ingredients from "../pages/Vendor/Ingredients";
import Menus from "../pages/Vendor/Menus";
import Programs from "../pages/Vendor/Programs";
import Mealplans from "../pages/Vendor/Mealplans";
import Portion from "../pages/Vendor/Portion";
import Kitchens from "../pages/Vendor/Kitchens";
import KitchenDashboard from "../pages/Vendor/KitchenDashboard";
import KotDetails from "../pages/Vendor/KotDetails";
import Dispatch from "../pages/Vendor/Dispatch";
import Kot from "../pages/Vendor/Kot";
import DeliveryStatus from "../pages/Vendor/DeliveryStatus";
import DispatchSummary from "../pages/Vendor/DispatchSummary";
import Orders from "../pages/Vendor/Orders";
import CustomerOrder from "../pages/Vendor/CustomerOrder";
import CustomerReport from "../pages/Vendor/CustomerReport";
import CouponsReport from "../pages/Vendor/CouponsReport";
import FreezeCustomerReports from "../pages/Vendor/FreezeCustomerReport";
import MealplanReport from "../pages/Vendor/MealplanReport";
import ProgramsReport from "../pages/Vendor/ProgramsReport";
import CustomerSupportReport from "../pages/Vendor/CustomerSupportReport";
import VendorSupportReport from "../pages/Vendor/VendorSupportReport";
import VendorSupport from "../pages/Vendor/VendorSupport";
import OrderStatus from "../pages/Vendor/OrderStatus";
import VendorInformation from "../pages/Vendor/VendorInformation";
import Faq from "../pages/Vendor/Faq";
import Configurations from "../pages/Vendor/Configurations";
import Employees from "../pages/Vendor/Employees";
import Subscription from "../pages/Vendor/Subscription";
import Stores from "../pages/Vendor/Stores";
import Profile from "../pages/Vendor/Profile";
import UserRole from "../pages/Vendor/UserRole";
import CreateAccount from "../pages/Vendor/CreateAccount";
import AccountStoreInformation from "../pages/Vendor/AccountStoreInformation";
import AccountSubscriptionPlan from "../pages/Vendor/AccountSubscriptionPlan";
import OtpPage from "../pages/Vendor/OtpPage";
import CreateAccountForm from "../pages/Vendor/CreateAccountForm";

export const routes = [
  {
    path: `${process.env.PUBLIC_URL}/dashboard/default/:layout`,
    Component: Default,
  },
  {
    path: `${process.env.PUBLIC_URL}/dashboard/ecommerce/:layout`,
    Component: Ecommerce,
  },
  {
    path: `${process.env.PUBLIC_URL}/starter-kits/sample-page/:layout`,
    Component: Starterkits,
  },

  // { path: `${process.env.PUBLIC_URL}/vendor/login`, Component: Login },
  { path: `${process.env.PUBLIC_URL}/`, Component: Login },
  { path: `${process.env.PUBLIC_URL}/vendor/dashboard`, Component: Dashboard },
  { path: `${process.env.PUBLIC_URL}/vendor/customers`, Component: Customers },
  { path: `${process.env.PUBLIC_URL}/vendor/enquiry`, Component: Enquiry },
  {
    path: `${process.env.PUBLIC_URL}/vendor/customersupport`,
    Component: CustomerSupport,
  },
  {
    path: `${process.env.PUBLIC_URL}/vendor/vendorsupport`,
    Component: VendorSupport,
  },
  { path: `${process.env.PUBLIC_URL}/vendor/slots`, Component: Slots },
  { path: `${process.env.PUBLIC_URL}/vendor/menus`, Component: Menus },
  {
    path: `${process.env.PUBLIC_URL}/vendor/ingredients`,
    Component: Ingredients,
  },
  { path: `${process.env.PUBLIC_URL}/vendor/programs`, Component: Programs },
  { path: `${process.env.PUBLIC_URL}/vendor/mealplans`, Component: Mealplans },
  { path: `${process.env.PUBLIC_URL}/vendor/kitchen`, Component: Kitchens },
  {
    path: `${process.env.PUBLIC_URL}/vendor/kdashboard`,
    Component: KitchenDashboard,
  },
  {
    path: `${process.env.PUBLIC_URL}/vendor/kotdetails`,
    Component: KotDetails,
  },
  { path: `${process.env.PUBLIC_URL}/vendor/dispatch`, Component: Dispatch },
  {
    path: `${process.env.PUBLIC_URL}/vendor/dispatchsummary`,
    Component: DispatchSummary,
  },
  { path: `${process.env.PUBLIC_URL}/vendor/kot`, Component: Kot },
  {
    path: `${process.env.PUBLIC_URL}/vendor/delivery-status`,
    Component: DeliveryStatus,
  },
  { path: `${process.env.PUBLIC_URL}/vendor/portion`, Component: Portion },
  {
    path: `${process.env.PUBLIC_URL}/vendor/ordermealplan`,
    Component: CustomerOrder,
  },
  { path: `${process.env.PUBLIC_URL}/vendor/orders`, Component: Orders },
  {
    path: `${process.env.PUBLIC_URL}/vendor/customerreport`,
    Component: CustomerReport,
  },
  {
    path: `${process.env.PUBLIC_URL}/vendor/couponreports`,
    Component: CouponsReport,
  },
  {
    path: `${process.env.PUBLIC_URL}/vendor/freezereports`,
    Component: FreezeCustomerReports,
  },
  {
    path: `${process.env.PUBLIC_URL}/vendor/mealplanreport`,
    Component: MealplanReport,
  },
  {
    path: `${process.env.PUBLIC_URL}/vendor/programsreport`,
    Component: ProgramsReport,
  },
  {
    path: `${process.env.PUBLIC_URL}/vendor/customersupportreport`,
    Component: CustomerSupportReport,
  },
  {
    path: `${process.env.PUBLIC_URL}/vendor/vendorsupportreport`,
    Component: VendorSupportReport,
  },
  {
    path: `${process.env.PUBLIC_URL}/vendor/orderstatus`,
    Component: OrderStatus,
  },
  {
    path: `${process.env.PUBLIC_URL}/vendor/information`,
    Component: VendorInformation,
  },
  { path: `${process.env.PUBLIC_URL}/vendor/faq`, Component: Faq },
  {
    path: `${process.env.PUBLIC_URL}/vendor/configuration`,
    Component: Configurations,
  },
  { path: `${process.env.PUBLIC_URL}/vendor/employees`, Component: Employees },
  { path: `${process.env.PUBLIC_URL}/vendor/role`, Component: UserRole },
  {
    path: `${process.env.PUBLIC_URL}/vendor/subscription`,
    Component: Subscription,
  },
  { path: `${process.env.PUBLIC_URL}/vendor/stores`, Component: Stores },
  { path: `${process.env.PUBLIC_URL}/vendor/profile`, Component: Profile },
  // {
  //   path: `${process.env.PUBLIC_URL}/create-account`,
  //   Component: CreateAccount,
  // },
  {
    path: `${process.env.PUBLIC_URL}/create-accountForm`,
    Component: CreateAccountForm,
  },
  // {
  //   path: `${process.env.PUBLIC_URL}/account-store-information`,
  //   Component: AccountStoreInformation,
  // },
  {
    path: `${process.env.PUBLIC_URL}/account-sub-plan`,
    Component: AccountSubscriptionPlan,
  },
  // {
  //   path: `${process.env.PUBLIC_URL}/otp`,
  //   Component: OtpPage,
  // },
];
