import RouteKeys from "./routeKeys"

const Login = RouteKeys.Main + RouteKeys.Login

const Main = RouteKeys.Main

const UserNotifications = RouteKeys.Main + RouteKeys.UserNotifications

const Roles = RouteKeys.Main + RouteKeys.Roles
const RolesCreate = RouteKeys.Main + RouteKeys.Roles + "/Create"
const RolesEdit = RouteKeys.Main + RouteKeys.Roles + "/:Id/edit"

const Users = RouteKeys.Main + RouteKeys.Users
const UsersCreate = RouteKeys.Main + RouteKeys.Users + "/Create"
const UsersEdit = RouteKeys.Main + RouteKeys.Users + "/:Id/edit"

const Logs = RouteKeys.Main + RouteKeys.Logs

const Mailsettings = RouteKeys.Main + RouteKeys.Mailsettings
const MailsettingsCreate = RouteKeys.Main + RouteKeys.Mailsettings + "/Create"
const MailsettingsEdit = RouteKeys.Main + RouteKeys.Mailsettings + "/:Id/edit"

const Rules = RouteKeys.Main + RouteKeys.Rules
const RulesDetail = RouteKeys.Main + RouteKeys.Rules + "/:Id"
const RulesCreate = RouteKeys.Main + RouteKeys.Rules + "/Create"
const RulesEdit = RouteKeys.Main + RouteKeys.Rules + "/:Id/edit"

const ChangePassword = RouteKeys.Main + RouteKeys.ChangePassword

const Appreports = RouteKeys.Main + RouteKeys.Appreports

const ForgetPassword = RouteKeys.Main + RouteKeys.ForgetPassword

const ResetPassword = RouteKeys.Main + RouteKeys.ResetPassword + "/:Id"

const About = RouteKeys.Main + RouteKeys.About

const Approvalrequests = RouteKeys.Main + RouteKeys.Approvalrequests

const Cases = RouteKeys.Main + RouteKeys.Cases
const CasesCreate = RouteKeys.Main + RouteKeys.Cases + "/Create"
const CasesEdit = RouteKeys.Main + RouteKeys.Cases + "/:Id/edit"

const Locations = RouteKeys.Main + RouteKeys.Locations
const LocationsCreate = RouteKeys.Main + RouteKeys.Locations + "/Create"
const LocationsEdit = RouteKeys.Main + RouteKeys.Locations + "/:Id/edit"

const Doctordefines = RouteKeys.Main + RouteKeys.Doctordefines
const DoctordefinesCreate = RouteKeys.Main + RouteKeys.Doctordefines + "/Create"
const DoctordefinesEdit = RouteKeys.Main + RouteKeys.Doctordefines + "/:Id/edit"

const Stockdefines = RouteKeys.Main + RouteKeys.Stockdefines
const StockdefinesCreate = RouteKeys.Main + RouteKeys.Stockdefines + "/Create"
const StockdefinesEdit = RouteKeys.Main + RouteKeys.Stockdefines + "/:Id/edit"

const Paymenttypes = RouteKeys.Main + RouteKeys.Paymenttypes
const PaymenttypesCreate = RouteKeys.Main + RouteKeys.Paymenttypes + "/Create"
const PaymenttypesEdit = RouteKeys.Main + RouteKeys.Paymenttypes + "/:Id/edit"

const Warehouses = RouteKeys.Main + RouteKeys.Warehouses
const WarehousesDetail = RouteKeys.Main + RouteKeys.Warehouses + "/:Id/Detail"
const WarehousesCreate = RouteKeys.Main + RouteKeys.Warehouses + "/Create"
const WarehousesEdit = RouteKeys.Main + RouteKeys.Warehouses + "/:Id/edit"

const Stocks = RouteKeys.Main + RouteKeys.Stocks
const StocksCreate = RouteKeys.Main + RouteKeys.Stocks + "/Create"
const StocksMovement = RouteKeys.Main + RouteKeys.Stocks + "/:Id/Movements"

const Visits = RouteKeys.Main + RouteKeys.Visits
const VisitsCreate = RouteKeys.Main + RouteKeys.Visits + "/Create"
const VisitsDetail = RouteKeys.Main + RouteKeys.Visits + "/:Id/Detail"
const VisitsUpdateDefines = RouteKeys.Main + RouteKeys.Visits + "/:Id/edit-defines"
const VisitsUpdateProducts = RouteKeys.Main + RouteKeys.Visits + "/:Id/edit-products"
const VisitsUpdatePaymentdefines = RouteKeys.Main + RouteKeys.Visits + "/:Id/edit-payment-defines"
const VisitComplete = RouteKeys.Main + RouteKeys.Visits + "/:Id/complete"

const Paymentplans = RouteKeys.Main + RouteKeys.Paymentplans

const Paymentplantransactions = RouteKeys.Main + RouteKeys.Paymentplantransactions

const Paths = {
    Login,
    UserNotifications,
    Roles,
    RolesCreate,
    RolesEdit,
    Users,
    UsersCreate,
    UsersEdit,
    Logs,
    Mailsettings,
    MailsettingsCreate,
    MailsettingsEdit,
    Rules,
    RulesDetail,
    RulesCreate,
    RulesEdit,
    ChangePassword,
    ForgetPassword,
    Main,
    Appreports,
    ResetPassword,
    About,
    Approvalrequests,
    Cases,
    CasesCreate,
    CasesEdit,
    Locations,
    LocationsCreate,
    LocationsEdit,
    Doctordefines,
    DoctordefinesCreate,
    DoctordefinesEdit,
    Stockdefines,
    StockdefinesCreate,
    StockdefinesEdit,
    Paymenttypes,
    PaymenttypesCreate,
    PaymenttypesEdit,
    Warehouses,
    WarehousesCreate,
    WarehousesEdit,
    Stocks,
    StocksCreate,
    StocksMovement,
    Visits,
    VisitsCreate,
    VisitsDetail,
    VisitsUpdateDefines,
    VisitsUpdateProducts,
    VisitsUpdatePaymentdefines,
    VisitComplete,
    Paymentplans,
    Paymentplantransactions,
    WarehousesDetail
}

export default Paths