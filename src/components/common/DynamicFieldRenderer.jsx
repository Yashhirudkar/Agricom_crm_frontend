import React from "react";

/**
 * Utility function to automatically map option texts to icons and descriptions
 * for high-end SaaS presentation.
 */
export function getOptionMeta(optText) {
  const normalized = optText.trim().toLowerCase();
  
  if (normalized.includes("storage")) {
    return { icon: "📦", desc: "Inventory storage and management" };
  }
  if (normalized.includes("cleaning")) {
    return { icon: "🧹", desc: "Commodity cleaning facility" };
  }
  if (normalized.includes("factory stuffing") || normalized.includes("stuffing")) {
    return { icon: "🏭", desc: "Export cargo container stuffing" };
  }
  if (normalized.includes("cfs")) {
    return { icon: "🚢", desc: "Container freight station services" };
  }
  if (normalized.includes("port")) {
    return { icon: "🚢", desc: "Port transport and cargo terminal services" };
  }
  if (normalized.includes("road") || normalized.includes("truck")) {
    return { icon: "🚚", desc: "Road transport and shipping logistics" };
  }
  if (normalized.includes("wagon") || normalized.includes("rail") || normalized.includes("train")) {
    return { icon: "🚂", desc: "Rail wagon cargo transport" };
  }
  if (normalized.includes("bank")) {
    return { icon: "🏦", desc: "Banking & financial transactions" };
  }
  if (normalized.includes("export")) {
    return { icon: "🌍", desc: "International export and customs" };
  }
  if (normalized.includes("payment") || normalized.includes("pay")) {
    return { icon: "💳", desc: "Payment modes & channels" };
  }
  if (normalized.includes("warehouse")) {
    return { icon: "🏢", desc: "Warehouse infrastructure" };
  }
  
  // Fallback
  return {
    icon: "⚙️",
    desc: `Configure details for ${optText}`,
  };
}

/**
 * Reusable component to render dynamic schema-defined fields.
 * Supports: text, textarea, number, email, date, select, multiselect, checkbox.
 * Supports 1-level deep conditional child field rendering.
 *
 * Props:
 * - schema: { fields: Array }
 * - values: Object (key-value pairs of form state)
 * - onChange: Function (calls back with updated values object)
 * - isReadOnly: Boolean (disables all fields for view-only state)
 * - errors: Object (optional key-to-message mapping for field validation)
 */
export default function DynamicFieldRenderer({
  schema,
  values = {},
  onChange,
  isReadOnly = false,
  errors = {},
}) {
  if (!schema || !Array.isArray(schema.fields) || schema.fields.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-gray-400 font-medium italic">
        No additional information fields configured for this role.
      </div>
    );
  }

  // Sort fields by displayOrder (or order) ascending
  const sortedFields = [...schema.fields].sort((a, b) => {
    const orderA = a.displayOrder !== undefined ? a.displayOrder : (a.order || 0);
    const orderB = b.displayOrder !== undefined ? b.displayOrder : (b.order || 0);
    return orderA - orderB;
  });

  const handleFieldChange = (key, val) => {
    if (isReadOnly) return;
    onChange({
      ...values,
      [key]: val,
    });
  };

  const renderFieldInput = (field) => {
    const value = values[field.key] !== undefined ? values[field.key] : "";
    const isRequired = !!field.required;

    const baseInputClass =
      "w-full border border-gray-250 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 bg-white placeholder-gray-400 focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/20 outline-none transition-all duration-150 disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200";

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            disabled={isReadOnly}
            placeholder={field.placeholder || ""}
            rows={3}
            className={`${baseInputClass} resize-y`}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) =>
              handleFieldChange(
                field.key,
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            disabled={isReadOnly}
            placeholder={field.placeholder || ""}
            className={baseInputClass}
          />
        );

      case "email":
        return (
          <input
            type="email"
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            disabled={isReadOnly}
            placeholder={field.placeholder || ""}
            className={baseInputClass}
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            disabled={isReadOnly}
            className={baseInputClass}
          />
        );

      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            disabled={isReadOnly}
            className={baseInputClass}
          >
            <option value="">Select option...</option>
            {Array.isArray(field.options) &&
              field.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
          </select>
        );

      case "multiselect":
        const selectedList = Array.isArray(value) ? value : [];
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-1.5">
            {Array.isArray(field.options) && field.options.map((opt) => {
              const isChecked = selectedList.includes(opt);
              const meta = getOptionMeta(opt);
              return (
                <div
                  key={opt}
                  onClick={() => {
                    if (isReadOnly) return;
                    const nextVal = isChecked
                      ? selectedList.filter((x) => x !== opt)
                      : [...selectedList, opt];
                    handleFieldChange(field.key, nextVal);
                  }}
                  className={`flex items-start gap-3 p-4 rounded-xl border select-none transition-all duration-200 cursor-pointer ${
                    isChecked
                      ? "bg-blue-50/40 border-[#007aff] shadow-xs"
                      : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-xs"
                  } ${isReadOnly ? "opacity-75 cursor-not-allowed" : ""}`}
                >
                  <span className="text-xl leading-none pt-0.5">{meta.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-extrabold ${isChecked ? "text-blue-900" : "text-gray-800"}`}>
                        {opt}
                      </span>
                      {isChecked && (
                        <div className="h-4 w-4 rounded-full bg-[#007aff] flex items-center justify-center text-white text-[9px] font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 font-semibold leading-relaxed">
                      {meta.desc}
                    </p>
                  </div>
                </div>
              );
            })}
            {(!field.options || field.options.length === 0) && (
              <span className="text-gray-400 italic text-[11px] col-span-2">No options configured.</span>
            )}
          </div>
        );

      case "checkbox":
        return (
          <label className={`flex items-center gap-2.5 py-1 select-none ${isReadOnly ? "cursor-not-allowed opacity-75" : "cursor-pointer"}`}>
            <input
              type="checkbox"
              checked={!!value}
              disabled={isReadOnly}
              onChange={(e) => handleFieldChange(field.key, e.target.checked)}
              className="h-4.5 w-4.5 rounded border-gray-300 text-[#007aff] focus:ring-[#007aff]"
            />
            <span className="text-xs font-medium text-gray-700">
              {field.placeholder || "Enable / Active"}
            </span>
          </label>
        );

      case "text":
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            disabled={isReadOnly}
            placeholder={field.placeholder || ""}
            className={baseInputClass}
          />
        );
    }
  };

  const renderField = (field, isChild = false) => {
    const isRequired = !!field.required;
    const hasError = !!errors[field.key];
    const value = values[field.key];

    return (
      <div key={field.key} className="space-y-1.5 animate-in fade-in duration-200">
        {/* Label & Required Star */}
        {field.type !== "checkbox" && (
          <div className="flex items-center justify-between">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              {field.label} {isRequired && <span className="text-red-500">*</span>}
            </label>
          </div>
        )}

        {/* Input Control */}
        {renderFieldInput(field)}

        {/* Help Text */}
        {field.helpText && (
          <p className="text-[10px] text-gray-400 font-medium">{field.helpText}</p>
        )}

        {/* Validation Error */}
        {hasError && (
          <p className="text-red-500 text-[10px] font-semibold">{errors[field.key]}</p>
        )}

        {/* Conditional Children Render */}
        {field.children && typeof field.children === "object" && (
          <div className="space-y-4">
            {Object.keys(field.children).map((optionKey) => {
              const childFields = field.children[optionKey];
              if (!Array.isArray(childFields) || childFields.length === 0) return null;

              // Check if option triggers children display
              let shouldRenderChildren = false;
              if (field.type === "select") {
                shouldRenderChildren = value === optionKey;
              } else if (field.type === "multiselect") {
                shouldRenderChildren = Array.isArray(value) && value.includes(optionKey);
              }

              if (!shouldRenderChildren) return null;

              const optMeta = getOptionMeta(optionKey);

              return (
                <div
                  key={optionKey}
                  className="border-l-4 border-[#007aff] bg-blue-50/20 p-4.5 mt-3 space-y-4 rounded-r-2xl border border-y border-r border-blue-100/30 animate-in fade-in slide-in-from-top duration-300"
                >
                  <div className="flex items-center justify-between border-b border-blue-100/40 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{optMeta.icon}</span>
                      <span className="text-[11px] font-extrabold text-blue-900 uppercase tracking-wider">
                        {optionKey} Details
                      </span>
                    </div>
                    <span className="bg-blue-100 text-[#007aff] px-2 py-0.5 text-[9px] font-extrabold rounded-full uppercase">
                      Selected
                    </span>
                  </div>
                  <div className="space-y-4">
                    {childFields.map((childField) => renderField(childField, true))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {sortedFields.map((field) => renderField(field, false))}
    </div>
  );
}
