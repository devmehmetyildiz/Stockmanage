import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { JSX } from "react";

import Layout from "@Components/Layout";
import NotfoundScreen from "@Components/Common/NotfoundScreen";

import Paths from "./Constant/path";

import Home from "@Pages/Home";
import Login from "@Pages/Login";

import Role from "@Pages/Role/Role";
import RoleCreate from "@Pages/Role/RoleCreate";
import RoleEdit from "@Pages/Role/RoleEdit";

import User from "@Pages/User/User";
import UserCreate from "@Pages/User/UserCreate";
import UserEdit from "@Pages/User/UserEdit";

import Log from "@Pages/Log/Log";

import Mailsetting from "@Pages/Mailsetting/Mailsetting";
import MailsettingCreate from "@Pages/Mailsetting/MailsettingCreate";
import MailsettingEdit from "@Pages/Mailsetting/MailsettingEdit";

import Rule from "@Pages/Rule/Rule";
import RuleDetail from "@Pages/Rule/RuleDetail";
import RuleCreate from "@Pages/Rule/RuleCreate";
import RuleEdit from "@Pages/Rule/RuleEdit";

import ChangePassword from "@Pages/ChangePassword";

import Appreport from "@Pages/Appreport";
import ForgetPassword from "@Pages/ForgetPassword";
import ResetPassword from "@Pages/ResetPassword";
import Usernotification from "@Pages/Usernotification/Usernotification";
import About from "@Pages/About";

import privileges from "@Constant/privileges";

import ProtectedRoute from "@Components/ProtectedRoute";
import Approvalrequest from "@Pages/Approvalrequests";

import Paymenttype from "@Pages/Paymenttype/Paymenttype";
import PaymenttypeCreate from "@Pages/Paymenttype/PaymenttypeCreate";
import PaymenttypeEdit from "@Pages/Paymenttype/PaymenttypeEdit";

import Case from "@Pages/Case/Case";
import CaseCreate from "@Pages/Case/CaseCreate";
import CaseEdit from "@Pages/Case/CaseEdit";

import Doctordefine from "@Pages/Doctordefine/Doctordefine";
import DoctordefineCreate from "@Pages/Doctordefine/DoctordefineCreate";
import DoctordefineEdit from "@Pages/Doctordefine/DoctordefineEdit";

import Location from "@Pages/Location/Location";
import LocationCreate from "@Pages/Location/LocationCreate";
import LocationEdit from "@Pages/Location/LocationEdit";

import Stockdefine from "@Pages/Stockdefine/Stockdefine";
import StockdefineCreate from "@Pages/Stockdefine/StockdefineCreate";
import StockdefineEdit from "@Pages/Stockdefine/StockdefineEdit";

import Warehouse from "@Pages/Warehouse/Warehouse";
import WarehouseCreate from "@Pages/Warehouse/WarehouseCreate";
import WarehouseEdit from "@Pages/Warehouse/WarehouseEdit";
import Stock from "@Pages/Stock/Stock";
import StockCreate from "@Pages/Stock/StockCreate";
import StockMovement from "@Pages/Stock/StockMovement";
import Visit from "@Pages/Visit/Visit";
import VisitCreate from "@Pages/Visit/VisitCreate";
import VisitDetail from "@Pages/Visit/VisitDetail";
import VisitUpdateDefines from "@Pages/Visit/VisitUpdateDefines";
import VisitUpdateProducts from "@Pages/Visit/VisitUpdateProducts";

interface RouteItemType {
    path: string
    element: JSX.Element
    requiredRole?: string[]
}

const AppRouter = () => {

    const { t } = useTranslation()
    const routes: RouteItemType[] = [
        { path: Paths.Roles, element: <Role />, requiredRole: [privileges.roleview] },
        { path: Paths.RolesCreate, element: <RoleCreate />, requiredRole: [privileges.roleview, privileges.roleadd] },
        { path: Paths.RolesEdit, element: <RoleEdit />, requiredRole: [privileges.roleview, privileges.roleupdate] },
        { path: Paths.Users, element: <User />, requiredRole: [privileges.userview] },
        { path: Paths.UsersCreate, element: <UserCreate />, requiredRole: [privileges.userview, privileges.useradd] },
        { path: Paths.UsersEdit, element: <UserEdit />, requiredRole: [privileges.userview, privileges.userupdate] },
        { path: Paths.Logs, element: <Log />, requiredRole: [privileges.admin] },
        { path: Paths.Mailsettings, element: <Mailsetting />, requiredRole: [privileges.mailsettingview] },
        { path: Paths.MailsettingsCreate, element: <MailsettingCreate />, requiredRole: [privileges.mailsettingview, privileges.mailsettingadd] },
        { path: Paths.MailsettingsEdit, element: <MailsettingEdit />, requiredRole: [privileges.mailsettingview, privileges.mailsettingupdate] },
        { path: Paths.Rules, element: <Rule />, requiredRole: [privileges.ruleview] },
        { path: Paths.RulesDetail, element: <RuleDetail />, requiredRole: [privileges.ruleview] },
        { path: Paths.RulesCreate, element: <RuleCreate />, requiredRole: [privileges.ruleview, privileges.ruleadd] },
        { path: Paths.RulesEdit, element: <RuleEdit />, requiredRole: [privileges.ruleview, privileges.ruleupdate] },
        { path: Paths.ChangePassword, element: <ChangePassword />, requiredRole: [privileges.basic] },
        { path: Paths.Appreports, element: <Appreport />, requiredRole: [privileges.admin] },
        { path: Paths.UserNotifications, element: <Usernotification />, requiredRole: [privileges.basic] },
        { path: Paths.About, element: <About />, requiredRole: [privileges.basic] },
        { path: Paths.Approvalrequests, element: <Approvalrequest />, requiredRole: [privileges.approvalrequestview] },
        { path: Paths.Paymenttypes, element: <Paymenttype />, requiredRole: [privileges.paymenttypeview] },
        { path: Paths.PaymenttypesCreate, element: <PaymenttypeCreate />, requiredRole: [privileges.paymenttypeview, privileges.paymenttypeadd] },
        { path: Paths.PaymenttypesEdit, element: <PaymenttypeEdit />, requiredRole: [privileges.paymenttypeview, privileges.paymenttypeupdate] },
        { path: Paths.Cases, element: <Case />, requiredRole: [privileges.caseview] },
        { path: Paths.CasesCreate, element: <CaseCreate />, requiredRole: [privileges.caseview, privileges.caseadd] },
        { path: Paths.CasesEdit, element: <CaseEdit />, requiredRole: [privileges.caseview, privileges.caseupdate] },
        { path: Paths.Doctordefines, element: <Doctordefine />, requiredRole: [privileges.doctordefineview] },
        { path: Paths.DoctordefinesCreate, element: <DoctordefineCreate />, requiredRole: [privileges.doctordefineview, privileges.doctordefineadd] },
        { path: Paths.DoctordefinesEdit, element: <DoctordefineEdit />, requiredRole: [privileges.doctordefineview, privileges.doctordefineupdate] },
        { path: Paths.Locations, element: <Location />, requiredRole: [privileges.locationview] },
        { path: Paths.LocationsCreate, element: <LocationCreate />, requiredRole: [privileges.locationview, privileges.locationadd] },
        { path: Paths.LocationsEdit, element: <LocationEdit />, requiredRole: [privileges.locationview, privileges.locationupdate] },
        { path: Paths.Stockdefines, element: <Stockdefine />, requiredRole: [privileges.stockdefineview] },
        { path: Paths.StockdefinesCreate, element: <StockdefineCreate />, requiredRole: [privileges.stockdefineview, privileges.stockdefineadd] },
        { path: Paths.StockdefinesEdit, element: <StockdefineEdit />, requiredRole: [privileges.stockdefineview, privileges.stockdefineupdate] },
        { path: Paths.Warehouses, element: <Warehouse />, requiredRole: [privileges.warehouseview] },
        { path: Paths.WarehousesCreate, element: <WarehouseCreate />, requiredRole: [privileges.warehouseview, privileges.warehouseadd] },
        { path: Paths.WarehousesEdit, element: <WarehouseEdit />, requiredRole: [privileges.warehouseview, privileges.warehouseupdate] },
        { path: Paths.Stocks, element: <Stock />, requiredRole: [privileges.stockview] },
        { path: Paths.StocksCreate, element: <StockCreate />, requiredRole: [privileges.stockview, privileges.stockadd] },
        { path: Paths.StocksMovement, element: <StockMovement />, requiredRole: [privileges.stockview, privileges.stockview] },
        { path: Paths.Visits, element: <Visit />, requiredRole: [privileges.visitview] },
        { path: Paths.VisitsCreate, element: <VisitCreate />, requiredRole: [privileges.visitview, privileges.visitadd] },
        { path: Paths.VisitsDetail, element: <VisitDetail />, requiredRole: [privileges.visitview] },
        { path: Paths.VisitsUpdateDefines, element: <VisitUpdateDefines />, requiredRole: [privileges.visitview, privileges.visitupdate] },
        { path: Paths.VisitsUpdateProducts, element: <VisitUpdateProducts />, requiredRole: [privileges.visitview, privileges.visitupdate] },
    ]

    const nonProtectedRoutes: RouteItemType[] = [
        { path: Paths.Login, element: <Login />, },
        { path: Paths.ForgetPassword, element: <ForgetPassword />, },
        { path: Paths.ResetPassword, element: <ResetPassword />, },
    ]

    return (
        <Router>
            <Routes>
                {nonProtectedRoutes.map(route => {
                    return <Route key={route.path} path={route.path} element={route.element} />
                })}
                <Route path={Paths.Main} element={<Layout />}>
                    <Route path={Paths.Main} element={<Home />} />
                    {routes.map(route => <Route
                        key={route.path}
                        path={route.path}
                        element={<ProtectedRoute
                            requiredRole={route.requiredRole}
                        >
                            {route.element}
                        </ProtectedRoute>} />
                    )}
                    <Route path="*" element={<NotfoundScreen fullScreen text={t('Common.NoPageFound')} />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRouter;