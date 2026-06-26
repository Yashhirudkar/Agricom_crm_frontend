import React from "react";
import {
  AlignLeft,
  Hash,
  Mail,
  Calendar,
  ChevronDown,
  Layers,
  CheckSquare,
  Type
} from "lucide-react";

export const ALLOWED_TYPES = [
  { value: "text", label: "Short Text" },
  { value: "textarea", label: "Long Text" },
  { value: "number", label: "Number Field" },
  { value: "email", label: "Email Address" },
  { value: "date", label: "Date Picker" },
  { value: "select", label: "Dropdown Selector" },
  { value: "multiselect", label: "Multi-Select" },
  { value: "checkbox", label: "Single Checkbox" },
];

export const getFieldTypeInfo = (type) => {
  switch (type) {
    case "textarea":
      return { label: "Long Text", icon: <AlignLeft className="h-3.5 w-3.5 text-blue-500" /> };
    case "number":
      return { label: "Number Field", icon: <Hash className="h-3.5 w-3.5 text-emerald-500" /> };
    case "email":
      return { label: "Email Address", icon: <Mail className="h-3.5 w-3.5 text-purple-500" /> };
    case "date":
      return { label: "Date Picker", icon: <Calendar className="h-3.5 w-3.5 text-amber-500" /> };
    case "select":
      return { label: "Dropdown Selector", icon: <ChevronDown className="h-3.5 w-3.5 text-orange-500" /> };
    case "multiselect":
      return { label: "Multi-Select", icon: <Layers className="h-3.5 w-3.5 text-indigo-500" /> };
    case "checkbox":
      return { label: "Single Checkbox", icon: <CheckSquare className="h-3.5 w-3.5 text-teal-500" /> };
    case "text":
    default:
      return { label: "Short Text", icon: <Type className="h-3.5 w-3.5 text-gray-500" /> };
  }
};
