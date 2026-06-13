import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import rolesReducer from "./slices/rolesSlice";
import permissionsReducer from "./slices/permissionsSlice";
import companiesReducer from "./slices/companiesSlice";
import usersReducer from "./slices/usersSlice";
import clientsReducer from "./slices/clientsSlice";
import departmentsReducer from "./slices/departmentsSlice";
import designationsReducer from "./slices/designationsSlice";
import employeesReducer from "./slices/employeesSlice";

import { injectStore } from "../lib/axios";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    roles: rolesReducer,
    permissions: permissionsReducer,
    companies: companiesReducer,
    users: usersReducer,
    clients: clientsReducer,
    departments: departmentsReducer,
    designations: designationsReducer,
    employees: employeesReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

injectStore(store);
