import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import rolesReducer from "./slices/rolesSlice";
import companiesReducer from "./slices/companiesSlice";
import usersReducer from "./slices/usersSlice";
import clientsReducer from "./slices/clientsSlice";
import notificationsReducer from "./slices/notificationsSlice";
import companyContextReducer from "./slices/companyContextSlice";
import chatReducer from "@/modules/chat/store/chatSlice";

// Entity reducers
import departmentsReducer from "./entities/departmentsSlice";
import designationsReducer from "./entities/designationsSlice";
import employeesReducer from "./entities/employeesSlice";
import branchesReducer from "./entities/branchesSlice";
import companyHrPoliciesReducer from "./entities/companyHrPoliciesSlice";
import holidaysReducer from "./entities/holidaysSlice";
import leaveTypesReducer from "./entities/leaveTypesSlice";
import leaveRequestsReducer from "./entities/leaveRequestsSlice";
import leaveBalancesReducer from "./entities/leaveBalancesSlice";
import attendanceReducer from "./entities/attendanceSlice";
import shiftsReducer from "./entities/shiftsSlice";
import categoriesReducer from "./entities/categoriesSlice";
import partnerRolesReducer from "./entities/partnerRoleSlice";
import productsReducer from "./entities/productSlice";
import partnersReducer from "./entities/partnerSlice";
import tasksReducer from "./entities/taskSlice";
import bagSpecsReducer from "./entities/bagSpecsSlice";

import shipmentTypeReducer from "./entities/shipmentTypeSlice";
import paymentTermReducer from "./entities/paymentTermSlice";
import tradeDocumentReducer from "./entities/tradeDocumentSlice";

import { injectStore } from "../lib/axios";

const entitiesReducer = combineReducers({
  departments: departmentsReducer,
  designations: designationsReducer,
  employees: employeesReducer,
  branches: branchesReducer,
  companyHrPolicies: companyHrPoliciesReducer,
  holidays: holidaysReducer,
  leaveTypes: leaveTypesReducer,
  leaveRequests: leaveRequestsReducer,
  leaveBalances: leaveBalancesReducer,
  attendance: attendanceReducer,
  shifts: shiftsReducer,
  categories: categoriesReducer,
  partnerRoles: partnerRolesReducer,
  products: productsReducer,
  partners: partnersReducer,
  tasks: tasksReducer,
  bagSpecs: bagSpecsReducer,

  shipmentTypes: shipmentTypeReducer,
  paymentTerms: paymentTermReducer,
  tradeDocuments: tradeDocumentReducer,
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    companyContext: companyContextReducer,
    roles: rolesReducer,
    companies: companiesReducer,
    users: usersReducer,
    clients: clientsReducer,
    notifications: notificationsReducer,
    entities: entitiesReducer,
    chat: chatReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

injectStore(store);
