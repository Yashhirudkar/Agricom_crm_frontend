import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import rolesReducer from "./slices/rolesSlice";
import permissionsReducer from "./slices/permissionsSlice";
import companiesReducer from "./slices/companiesSlice";
import usersReducer from "./slices/usersSlice";
import clientsReducer from "./slices/clientsSlice";

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
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    roles: rolesReducer,
    permissions: permissionsReducer,
    companies: companiesReducer,
    users: usersReducer,
    clients: clientsReducer,
    entities: entitiesReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

injectStore(store);
