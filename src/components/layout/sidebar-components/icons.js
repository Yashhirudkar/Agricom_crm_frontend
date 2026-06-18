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
  Check,
  Building,
  LayoutGrid,
  UserCircle,
  UsersRound,
  Badge,
  MapPin,
  Network,
  FileText,
  CalendarDays,
  ClipboardList,
  Plane,
  CheckCircle,
  FolderCheck,
  Timer,
  CalendarClock,
  ClipboardEdit,
  BarChart,
  Layout,
  Grid,
  Settings,
} from "lucide-react";

export const iconMap = {
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
  Layout,
  Grid,
  Settings,
  UserCircle,
  MapPin,
  Network,
  FileText,
  CalendarDays,
  ClipboardList,
};

export const getSidebarCategory = (name = "", route = "") => {
  const n = (name || "").toLowerCase();
  const r = (route || "").toLowerCase();

  if (r.includes("/companies") || r.includes("/users") || r.includes("/roles") || n.includes("compan") || n.includes("user") || n.includes("role")) return "admin";
  if (r === "/" || r.includes("/profile") || n === "dashboard" || n === "my dashboard" || n === "overview") return "workspace";
  if (r.includes("/employees") || n.includes("employee")) return "hr";
  if (r.includes("/departments") || r.includes("/designations") || r.includes("/branches") || r.includes("org-chart") || n.includes("department") || n.includes("designation") || n.includes("branch") || n.includes("org chart")) return "organization";
  if (r.includes("/hr-policies") || r.includes("/holidays") || n.includes("policy") || n.includes("holiday")) return "policies";
  if (r.includes("/leave") || n.includes("leave")) return "leave";
  if (r.includes("/attendance") || r.includes("/shifts") || r.includes("/corrections") || n.includes("attendance") || n.includes("shift") || n.includes("regularization")) return "attendance";
  if (r.includes("/payroll") || r.includes("/finance") || n.includes("salary") || n.includes("finance") || n.includes("payroll")) return "finance";
  if (r.includes("/analytics") || r.includes("/reports") || n.includes("report") || n.includes("analytic")) return "reports";

  return "default";
};

export const getDynamicIconColor = (name, route) => {
  const category = getSidebarCategory(name, route);
  switch (category) {
    case "admin": return "text-blue-500";
    case "workspace": return "text-indigo-500";
    case "hr": return "text-emerald-500";
    case "organization": return "text-violet-500";
    case "policies": return "text-amber-500";
    case "leave": return "text-orange-500";
    case "attendance": return "text-teal-500";
    case "finance": return "text-green-500";
    case "reports": return "text-purple-500";
    default: return "text-gray-500";
  }
};

export const getDynamicIcon = (name, route, originalIconStr) => {
  const n = (name || "").toLowerCase();
  const r = (route || "").toLowerCase();

  if (r.includes("/companies") || n.includes("companies")) return Building;
  if (r.includes("/users") || n.includes("users")) return Users;
  if (r.includes("/roles") || n.includes("roles")) return Shield;

  if (r === "/" || n === "dashboard" || n === "my dashboard") return LayoutGrid;
  if (r.includes("/profile") || n.includes("profile")) return UserCircle;
  if (n.includes("sidebar builder") || n.includes("sidebar")) return Layout;
  if (n.includes("matrix builder") || n.includes("matrix")) return Grid;
  if (n.includes("clients") || r.includes("/clients")) return Globe;

  if (r.includes("/employees") || n === "employees") return UsersRound || Users;
  
  if (r.includes("/departments") || n.includes("department")) return Building2;
  if (r.includes("/designations") || n.includes("designation")) return Badge || Shield;
  if (r.includes("/branches") || n.includes("branch")) return MapPin;
  if (r.includes("org-chart") || n.includes("org chart")) return Network;

  if (r.includes("/hr-policies") || n.includes("policy")) return FileText;
  if (r.includes("/holidays") || n.includes("holiday")) return CalendarDays || Calendar;

  if (r.includes("/leave-types") || n.includes("leave type")) return ClipboardList;
  if (r.includes("/my-leaves") || n.includes("my leaves") || n.includes("my leave")) return Plane;
  if (r.includes("/leave-approvals") || n.includes("leave approval")) return CheckCircle;
  if (r.includes("/leaves") || n === "leave management") return FolderCheck;

  if (r.includes("/attendance/my-attendance") || n.includes("attendance activity") || n.includes("my attendance")) return Timer || Clock;
  if (r.includes("/attendance/shifts") || n.includes("shift")) return CalendarClock || Calendar;
  if (r.includes("/attendance/corrections") || n.includes("regularization") || n.includes("correction")) return ClipboardEdit;
  if (r.includes("/attendance/reports") || n.includes("attendance summary")) return BarChart;
  if (r.endsWith("/attendance") || n === "dashboard") return LayoutDashboard;

  const category = getSidebarCategory(name, route);
  if (category === "admin") return Building;
  if (category === "workspace") return LayoutGrid;
  if (category === "hr") return Users;
  if (category === "organization") return Network;
  if (category === "policies") return FileText;
  if (category === "leave") return Calendar;
  if (category === "attendance") return Clock;
  if (category === "finance") return DollarSign;
  if (category === "reports") return BarChart;

  if (originalIconStr && iconMap[originalIconStr]) return iconMap[originalIconStr];

  return LayoutDashboard;
};
