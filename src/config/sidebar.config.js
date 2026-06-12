import {
  LayoutDashboard,
  Handshake,
  ShoppingCart,
  Users,
  Shield,
  Building2,
  Globe,
  Clock,
  Calendar,
  DollarSign,
} from "lucide-react";

export const MENU_CONFIG = [
  {
    id: "overview",
    title: "OVERVIEW",
    type: "parent",
    items: [
      { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, href: "/", permission: null },
    ],
  },
  {
    id: "system_admin",
    title: "SYSTEM ADMIN",
    type: "parent",
    requiredUserType: "super_admin",
    items: [
      { id: "clients", name: "Clients", icon: Globe, href: "/clients" },
      { id: "all_companies", name: "All Companies", icon: Building2, href: "/companies" },
      { id: "all_users", name: "All Users", icon: Users, href: "/users" },
      { id: "roles", name: "Roles", icon: Shield, href: "/roles" },
    ],
  },
  {
    id: "tenant_admin",
    title: "TENANT ADMIN",
    type: "parent",
    requiredUserType: "client_admin",
    items: [
      { id: "my_companies", name: "My Companies", icon: Building2, href: "/companies" },
      { id: "my_users", name: "My Users", icon: Users, href: "/users" },
      { id: "custom_roles", name: "Custom Roles", icon: Shield, href: "/roles" },
    ],
  },
  {
    id: "crm_workspace",
    title: "CRM WORKSPACE",
    type: "parent",
    excludeUserTypes: ["super_admin", "client_admin"],
    items: [
      { id: "leads", name: "Leads", icon: Handshake, href: "/leads" },
      { id: "customers", name: "Customers", icon: Users, href: "/customers" },
      { id: "orders", name: "Orders", icon: ShoppingCart, href: "/orders" },
    ],
  },
  {
    id: "hr_department",
    title: "HR DEPARTMENT",
    type: "parent_collapsible",
    excludeUserTypes: ["super_admin"],
    modules: [
      {
        id: "employee_management",
        title: "EMPLOYEE MANAGEMENT",
        items: [
          { id: "departments", name: "Departments", icon: Building2, href: "/departments", permission: "departments.view" },
          { id: "designations", name: "Designations", icon: Shield, href: "/designations", permission: "designations.view" },
          { id: "employees", name: "Employees", icon: Users, href: "/employees", permission: "employees.view" },
        ],
      },
      {
        id: "attendance_management",
        title: "ATTENDANCE MANAGEMENT",
        items: [
          { id: "daily_log", name: "Daily Log", icon: Clock, href: "#", permission: "attendance.view" },
          { id: "leave_requests", name: "Leave Requests", icon: Calendar, href: "#", permission: "leaves.view" },
        ],
      },
      {
        id: "payroll_management",
        title: "PAYROLL MANAGEMENT",
        items: [
          { id: "salary_details", name: "Salary Details", icon: DollarSign, href: "#", permission: "payroll.view" },
        ],
      },
    ],
  },
];
