export const METHOD_GET = 'GET';

export const METHOD_POST = 'POST';

export const METHOD_PUT = 'PUT';

export const METHOD_DELETE = 'DELETE';

//Routes

export const LOGIN = 'Auth/Oauth/Login';

export const LOGOUT = 'Auth/Oauth/Logout';

export const PASSWORD_FORGETREQUEST = 'Auth/Password/Createrequest';

export const PASSWORD_RESETREQUEST = 'Auth/Password/Resetpassword';

export const PASSWORD_GET_RESETUSER = 'Auth/Password/Getrequestbyuser';

export const LOG = 'Log/Logs'

export const LOG_GETBYQUERY = 'Log/Logs/GetByQuerry'

export const LOG_GETBYUSER = 'Log/Logs/GetLogByUser'

export const LOG_USAGECOUNT_MONTHLY = 'Log/Logs/GetUsagecountbyUserMontly'

export const LOG_PROCESSCOUNT = 'Log/Logs/GetProcessCount'

export const LOG_SERVICEUSAGECOUNT = 'Log/Logs/GetServiceUsageCount'

export const LOG_SERVICEUSAGECOUNT_DAILY = 'Log/Logs/GetServiceUsageCountDaily'

export const ROLE = 'Userrole/Roles'

export const USER = 'Userrole/Users'

export const USER_COUNT = 'Userrole/Users/Counts'

export const USER_LIST = 'Userrole/Users/List'

export const USER_REMOVE = 'Userrole/Users/RemoveUsers'

export const ROLE_PRIVILEGEGROUPS = 'Userrole/Roles/Getprivilegegroups'

export const ROLE_PRIVILEGE = 'Userrole/Roles/Getprivileges'

export const PROFILE_META = 'Userrole/Profile/Getmeta'

export const PROFILE_USER_PRIVILEGES = 'Userrole/Roles/GetActiveuserprivileges'

export const PROFILE_GET_TABLEMETA = 'Userrole/Profile/GetTableConfig'

export const PROFILE_SAVE_TABLEMETA = 'Userrole/Profile/SaveTableConfig'

export const PROFILE_DELETE_TABLEMETA = 'Userrole/Profile/ResetTableConfig'

export const PROFILE_CHANGEPASSWORD = 'Userrole/Profile/Changepassword'

export const PASSWORD_RESET = 'Auth/Password/Resetpassword'

export const RULE = 'System/Rules'

export const RULE_GETLOG = 'System/Rules/Getrulelogs'

export const RULE_STOP = 'System/Rules/StopRule'

export const RULE_CLEAR = 'System/Rules/Clearrulelogs'

export const APPROVALREQUEST_COUNT = 'System/Approvalrequests/Counts'

export const APPROVALREQUEST = 'System/Approvalrequests'

export const APPROVALREQUEST_APPROVE = 'System/Approvalrequests/Approve'

export const APPROVALREQUEST_REJECT = 'System/Approvalrequests/Reject'

export const MAILSETTING = 'System/Mailsettings'

export const USERNOTIFICATION = 'Userrole/Usernotifications'

export const USERNOTIFICATION_GET_ALL = 'Userrole/Usernotifications/GetUsernotificationsbyUserid'

export const USERNOTIFICATION_GET_LAST = 'Userrole/Usernotifications/GetLastUsernotificationsbyUserid'

export const USERNOTIFICATION_READ_ALL = 'Userrole/Usernotifications/ReadAllNotificationByUser'

export const USERNOTIFICATION_SHOW_ALL = 'Userrole/Usernotifications/ShowAllNotificationByUser'

export const USERNOTIFICATION_GET_UNREAD = 'Userrole/Usernotifications/GetUnreadNotificationCountByUser'

export const USERNOTIFICATION_GET_UNSHOWED = 'Userrole/Usernotifications/GetUnshowedNotificationCountByUser'

export const USERNOTIFICATION_EDIT_RECORD = 'Userrole/Usernotifications/Editrecord'

export const USERNOTIFICATION_DELETE_BY_USERID = 'Userrole/Usernotifications/DeleteUsernotificationbyid'

export const USERNOTIFICATION_DELETE_READ_BY_USERID = 'Userrole/Usernotifications/DeleteUsernotificationbyidreaded'

export const CASE = 'Setting/Cases'

export const CASE_COUNT = 'Setting/Cases/Counts'

export const LOCATION = 'Setting/Locations'

export const LOCATION_COUNT = 'Setting/Locations/Counts'

export const PAYMENTTYPE = 'Setting/Paymenttypes'

export const PAYMENTTYPE_COUNT = 'Setting/Paymenttypes/Counts'

export const DOCTORDEFINE = 'Setting/Doctordefines'

export const DOCTORDEFINE_COUNT = 'Setting/Doctordefines/Counts'

export const STOCKDEFINE = 'Setting/Stockdefines'

export const STOCKDEFINE_COUNT = 'Setting/Stockdefines/Counts'

export const WAREHOUSE = 'Warehouse/Warehouses'

export const WAREHOUSE_COUNT = 'Warehouse/Warehouses/Counts'

export const STOCK_GET_STOCK = 'Warehouse/Stocks/GetStocks'

export const STOCK_GET_MOVEMENT = 'Warehouse/Stocks/GetMovements'

export const STOCK_CREATE_STOCK = 'Warehouse/Stocks/CreateStock'

export const STOCK_USE_STOCK = 'Warehouse/Stocks/UseStock'

export const STOCK_INSERT_STOCK = 'Warehouse/Stocks/InsertStock'

export const STOCK_GET_LAST_MOVEMENT = 'Warehouse/Stocks/GetLast5MovementsByWarehouse'

export const STOCK_DELETE_STOCK = 'Warehouse/Stocks/DeleteStock'

export const STOCK_DELETE_MOVEMENT = 'Warehouse/Stocks/DeleteMovement'

export const VISIT = 'Business/Visits'

export const VISIT_GETCOUNT = 'Business/Visits/Counts'

export const VISIT_UPDATE_STOCKS = 'Business/Visits/UpdateVisitStocks'

export const VISIT_UPDATE_DEFINES = 'Business/Visits/UpdateVisitDefines'

export const VISIT_WORK = 'Business/Visits/Work'

export const VISIT_UPDATE_PAYMENTDEFINE = 'Business/Visits/UpdateVisitPaymentDefines'

export const VISIT_COMPLETE = 'Business/Visits/Complete'

export const VISIT_SEND_APPROVE = 'Business/Visits/SendApprove'

export const PAYMENTPLAN = 'Business/Paymentplans'

export const PAYMENTPLAN_TRANSACTION = 'Business/Paymentplans/Transactions'

export const PAYMENTPLAN_TRANSACTION_COUNT = 'Business/Paymentplans/TransactionsCounts'

export const PAYMENTPLAN_COUNT = 'Business/Paymentplans/Counts'


//Tags

export const TABLE_CONFIG_TAG = 'TABLE_CONFIG_TAG'

export const META_TAG = 'META_TAG'

export const APPROVALREQUEST_TAG = 'APPROVALREQUEST_TAG'

export const RULE_TAG = 'RULE_TAG'

export const RULE_LOG_TAG = 'RULE_LOG_TAG'

export const USER_TAG = 'USER_TAG'

export const MAILSETTING_TAG = 'MAILSETTING_TAG'

export const ROLE_TAG = 'ROLE_TAG'

export const NOTIFICATION_UPDATE_TAG = 'NOTIFICATION_UPDATE_TAG'

export const CASE_TAG = 'CASE_TAG'

export const LOCATION_TAG = 'LOCATION_TAG'

export const PAYMENTTYPE_TAG = 'PAYMENTTYPE_TAG'

export const DOCTORDEFINE_TAG = 'DOCTORDEFINE_TAG'

export const STOCKDEFINE_TAG = 'STOCKDEFINE_TAG'

export const WAREHOUSE_TAG = 'WAREHOUSE_TAG'

export const STOCK_TAG = 'STOCK_TAG'

export const VISIT_TAG = 'VISIT_TAG'

export const PAYMENTPLAN_TAG = 'PAYMENTPLAN_TAG'


