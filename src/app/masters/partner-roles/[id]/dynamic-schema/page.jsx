/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectUserType } from "@/store/slices/authSlice";
import { selectActiveCompanyId } from "@/store/slices/companyContextSlice";
import axiosClient from "@/lib/axios";
import { toast } from "sonner";
import {
  History,
  Building2
} from "lucide-react";

// Subcomponents
import Header from "@/components/masters/partner-roles/dynamic-schema/Header";
import FormGroupSettings from "@/components/masters/partner-roles/dynamic-schema/FormGroupSettings";
import ConfiguredFieldsTable from "@/components/masters/partner-roles/dynamic-schema/ConfiguredFieldsTable";
import PublicationHistory from "@/components/masters/partner-roles/dynamic-schema/PublicationHistory";
import AddFieldDrawer from "@/components/masters/partner-roles/dynamic-schema/AddFieldDrawer";
import EditFieldDrawer from "@/components/masters/partner-roles/dynamic-schema/EditFieldDrawer";
import ReplicaPreviewDrawer from "@/components/masters/partner-roles/dynamic-schema/ReplicaPreviewDrawer";

export default function DynamicSchemaPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const roleId = parseInt(params.id, 10);
  const router = useRouter();
  const dispatch = useDispatch();

  const userType = useSelector(selectUserType);
  const activeCompanyId = useSelector(selectActiveCompanyId) || "";

  // Role Metadata
  const [role, setRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  // Active Layout Config State
  const [hasConfig, setHasConfig] = useState(false);
  const [configId, setConfigId] = useState(null);
  const [configName, setConfigName] = useState("");
  const [configVersion, setConfigVersion] = useState(0);
  const [isConfigActive, setIsConfigActive] = useState(false);
  const [fields, setFields] = useState([]); // [{ key, label, type, required, placeholder, helpText, options: [], children: { optionVal: [...] } }]
  const [changeNote, setChangeNote] = useState("");
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Baseline copies to track unsaved edits
  const [originalFields, setOriginalFields] = useState([]);
  const [originalConfigName, setOriginalConfigName] = useState("");
  const [originalChangeNote, setOriginalChangeNote] = useState("");

  // Publication History State
  const [historyList, setHistoryList] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Interactive Live Preview form state
  const [previewValues, setPreviewValues] = useState({});

  // Builder UX navigation state
  const [activeLeftTab, setActiveLeftTab] = useState("builder"); // builder | history
  const [editingFieldKey, setEditingFieldKey] = useState(null); // Key of field being edited in drawer
  
  // Drawer / overlay visibility states
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  
  // Tabs for configuration drawers
  const [editActiveTab, setEditActiveTab] = useState("basic"); // basic | choices | rules | preview
  const [activeRuleOption, setActiveRuleOption] = useState(""); // active select option being mapped in rules tab
  const [previewActiveTab, setPreviewActiveTab] = useState("additional"); // replica drawer active tab

  // Advanced collapsible settings visibility
  const [isAddAdvancedOpen, setIsAddAdvancedOpen] = useState(false);
  const [isEditAdvancedOpen, setIsEditAdvancedOpen] = useState(false);

  // State for adding new field
  const [addFieldName, setAddFieldName] = useState("");
  const [addFieldKey, setAddFieldKey] = useState("");
  const [addFieldType, setAddFieldType] = useState("text");
  const [addFieldRequired, setAddFieldRequired] = useState(false);
  const [addFieldPlaceholder, setAddFieldPlaceholder] = useState("");
  const [addFieldHelpText, setAddFieldHelpText] = useState("");
  const [addFieldDefaultValue, setAddFieldDefaultValue] = useState("");
  const [addFieldValidationRules, setAddFieldValidationRules] = useState("");

  // Save/Delete execution state
  const [isSaving, setIsSaving] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  // Load basic role data
  useEffect(() => {
    if (!roleId || !activeCompanyId) return;
    const fetchRoleData = async () => {
      try {
        const res = await axiosClient.get(`/masters/partner-roles/${roleId}`);
        setRole(res.data);
      } catch (err) {
        toast.error("Failed to load partner role details");
        console.error(err);
      } finally {
        setLoadingRole(false);
      }
    };
    fetchRoleData();
  }, [roleId, activeCompanyId]);

  // Load config details
  const fetchConfig = async () => {
    setLoadingConfig(true);
    try {
      const res = await axiosClient.get(`/masters/partner-roles/${roleId}/dynamic-config`);
      if (res.data && res.data.hasConfig) {
        const conf = res.data.config;
        setHasConfig(true);
        setConfigId(conf.id);
        setConfigName(conf.configName);
        setConfigVersion(conf.version);
        setIsConfigActive(conf.isActive);
        const fetchedFields = conf.schemaJson?.fields || [];
        setFields(fetchedFields);
        
        // Populate baseline data
        setOriginalFields(fetchedFields);
        setOriginalConfigName(conf.configName);
        setOriginalChangeNote("");
      } else {
        setHasConfig(false);
        setConfigId(null);
        setConfigName("");
        setConfigVersion(0);
        setIsConfigActive(false);
        setFields([]);
        
        setOriginalFields([]);
        setOriginalConfigName("");
        setOriginalChangeNote("");
      }
    } catch (err) {
      toast.error("Failed to load active form layout configuration");
      console.error(err);
    } finally {
      setLoadingConfig(false);
    }
  };

  // Load publication history list
  const fetchHistory = async (page = 1) => {
    setLoadingHistory(true);
    try {
      const res = await axiosClient.get(`/masters/partner-roles/${roleId}/dynamic-config/history`, {
        params: { page, limit: 8 },
      });
      setHistoryList(res.data.data || []);
      setHistoryPage(res.data.page || 1);
      setHistoryTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error("Failed to load publication history logs");
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (roleId && activeCompanyId) {
      fetchConfig();
      fetchHistory(1);
    }
  }, [roleId, activeCompanyId]);

  // Track modification dirty state
  const isDirty =
    JSON.stringify(fields) !== JSON.stringify(originalFields) ||
    configName !== originalConfigName ||
    changeNote !== originalChangeNote;

  // Unified save logic
  const saveConfig = async (isPublish = true) => {
    if (!configName.trim()) {
      toast.warning("Section Name is required.");
      return;
    }
    if (fields.length === 0) {
      toast.warning("Please add at least one custom field.");
      return;
    }

    // Basic frontend verification for duplicate keys before calling backend
    const keys = fields.map((f) => f.key?.trim());
    if (new Set(keys).size !== keys.length) {
      toast.error("Duplicate field keys detected at root level.");
      return;
    }

    setIsSaving(true);
    const schemaJson = { fields };
    const payload = {
      configName: configName.trim(),
      schemaJson,
      changeNote: changeNote.trim() || undefined,
    };

    try {
      if (hasConfig) {
        // Update (PUT)
        await axiosClient.put(`/masters/partner-roles/${roleId}/dynamic-config`, payload);
      } else {
        // Create (POST)
        await axiosClient.post(`/masters/partner-roles/${roleId}/dynamic-config`, payload);
      }
      
      if (isPublish) {
        toast.success("Changes published successfully. Active version updated.");
      } else {
        toast.success("Draft layout saved successfully.");
      }

      setChangeNote("");
      await fetchConfig();
      await fetchHistory(1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save configuration layout.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Deactivate
  const handleDeactivate = async () => {
    setIsDeactivating(true);
    try {
      await axiosClient.delete(`/masters/partner-roles/${roleId}/dynamic-config`);
      toast.success("Custom form layout deactivated successfully.");
      await fetchConfig();
      await fetchHistory(1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to deactivate custom form.");
      console.error(err);
    } finally {
      setIsDeactivating(false);
    }
  };

  // Handle Activate
  const handleActivate = async () => {
    if (historyList.length === 0) {
      toast.warning("No configuration history found to reactivate.");
      return;
    }

    const latestHistory = historyList[0];
    const latestConfigName = latestHistory.config?.configName || latestHistory.configName || "Custom Form";
    const latestFields = latestHistory.schemaJson?.fields || [];

    if (latestFields.length === 0) {
      toast.warning("No fields found in history to reactivate.");
      return;
    }

    setIsDeactivating(true);
    try {
      const payload = {
        configName: latestConfigName,
        schemaJson: { fields: latestFields },
        changeNote: "Re-activated form layout from history",
      };
      await axiosClient.post(`/masters/partner-roles/${roleId}/dynamic-config`, payload);
      toast.success("Custom form layout reactivated successfully.");
      await fetchConfig();
      await fetchHistory(1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reactivate custom form.");
      console.error(err);
    } finally {
      setIsDeactivating(false);
    }
  };

  // Field Reordering Helpers
  const moveField = (index, direction) => {
    const newFields = [...fields];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFields.length) return;

    // Swap fields
    const temp = newFields[index];
    newFields[index] = newFields[targetIndex];
    newFields[targetIndex] = temp;

    // Reassign displayOrder and order properties
    newFields.forEach((field, i) => {
      field.displayOrder = i + 1;
      field.order = i + 1;
    });

    setFields(newFields);
  };

  // Field Addition Helper
  const handleSaveNewField = (e) => {
    e.preventDefault();
    const label = addFieldName.trim();
    let key = addFieldKey.trim().toLowerCase();

    if (!label) {
      toast.warning("Field Name is required.");
      return;
    }

    // Auto-generate key in lowercase with underscores
    if (!key) {
      key = label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    }

    if (!/^[a-z0-9_]+$/.test(key)) {
      toast.warning("Internal key must only contain lowercase alphanumeric characters and underscores.");
      return;
    }
    if (fields.some((f) => f.key === key)) {
      toast.error(`A field with key "${key}" already exists.`);
      return;
    }

    const newField = {
      key,
      label,
      type: addFieldType,
      required: addFieldRequired,
      placeholder: addFieldPlaceholder,
      helpText: addFieldHelpText,
      defaultValue: addFieldDefaultValue,
      validationRules: addFieldValidationRules,
      displayOrder: fields.length + 1,
      order: fields.length + 1,
      options: ["select", "multiselect"].includes(addFieldType) ? [] : undefined,
      children: ["select", "multiselect"].includes(addFieldType) ? {} : undefined,
    };

    setFields([...fields, newField]);
    
    // Reset Form
    setAddFieldName("");
    setAddFieldKey("");
    setAddFieldType("text");
    setAddFieldRequired(false);
    setAddFieldPlaceholder("");
    setAddFieldHelpText("");
    setAddFieldDefaultValue("");
    setAddFieldValidationRules("");
    setIsAddAdvancedOpen(false);
    setIsAddDrawerOpen(false);
    toast.success("Added new custom field.");
  };

  // Field Updates Helper
  const handleUpdateFieldProperty = (fieldKey, property, value) => {
    setFields(
      fields.map((f) => {
        if (f.key === fieldKey) {
          const updated = { ...f, [property]: value };

          // Reset options if field type changes
          if (property === "type") {
            if (["select", "multiselect"].includes(value)) {
              updated.options = updated.options || [];
              updated.children = updated.children || {};
            } else {
              delete updated.options;
              delete updated.children;
            }
          }
          return updated;
        }
        return f;
      })
    );
  };

  const handleDeleteField = (fieldKey) => {
    setFields(fields.filter((f) => f.key !== fieldKey));
    if (editingFieldKey === fieldKey) setEditingFieldKey(null);
    toast.info("Field removed.");
  };

  // Select Options and Children logic
  const handleAddOption = (fieldKey, optionText) => {
    const text = optionText.trim();
    if (!text) return;
    const targetField = fields.find((f) => f.key === fieldKey);
    if (!targetField) return;

    const currentOptions = targetField.options || [];
    if (currentOptions.includes(text)) {
      toast.warning("Option choice already exists.");
      return;
    }

    const updatedOptions = [...currentOptions, text];
    const updatedChildren = { ...(targetField.children || {}), [text]: [] };

    setFields(
      fields.map((f) => {
        if (f.key === fieldKey) {
          return { ...f, options: updatedOptions, children: updatedChildren };
        }
        return f;
      })
    );
    setActiveRuleOption(text);
  };

  const handleRemoveOption = (fieldKey, optionText) => {
    const targetField = fields.find((f) => f.key === fieldKey);
    if (!targetField) return;

    const updatedOptions = (targetField.options || []).filter((o) => o !== optionText);
    const updatedChildren = { ...(targetField.children || {}) };
    delete updatedChildren[optionText];

    setFields(
      fields.map((f) => {
        if (f.key === fieldKey) {
          return { ...f, options: updatedOptions, children: updatedChildren };
        }
        return f;
      })
    );
    if (activeRuleOption === optionText) {
      setActiveRuleOption(updatedOptions[0] || "");
    }
  };

  // Nested Dependent Field Helpers
  const handleAddChildField = (parentFieldKey, optionKey, childName, childType) => {
    const label = childName.trim();
    if (!label) {
      toast.warning("Dependent field name is required.");
      return;
    }

    // Auto-generate key in lowercase with underscores
    const key = label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

    // Check uniqueness across ALL keys (root keys and other dependent keys)
    const allExistingKeys = new Set();
    fields.forEach((f) => {
      allExistingKeys.add(f.key);
      if (f.children) {
        Object.keys(f.children).forEach((opt) => {
          f.children[opt].forEach((child) => allExistingKeys.add(child.key));
        });
      }
    });

    if (allExistingKeys.has(key)) {
      toast.error(`Key "${key}" is already in use in the form builder.`);
      return;
    }

    const parentField = fields.find((f) => f.key === parentFieldKey);
    const childrenMap = { ...(parentField.children || {}) };
    const childList = childrenMap[optionKey] || [];

    const newChild = {
      key,
      label,
      type: childType,
      required: false,
      placeholder: "",
      helpText: "",
      displayOrder: childList.length + 1,
      order: childList.length + 1,
    };

    childrenMap[optionKey] = [...childList, newChild];

    setFields(
      fields.map((f) => {
        if (f.key === parentFieldKey) {
          return { ...f, children: childrenMap };
        }
        return f;
      })
    );
    toast.success(`Added dependent field under choice "${optionKey}".`);
  };

  const handleUpdateChildProperty = (parentFieldKey, optionKey, childKey, property, value) => {
    const parentField = fields.find((f) => f.key === parentFieldKey);
    const childrenMap = { ...(parentField.children || {}) };
    const childList = childrenMap[optionKey] || [];

    childrenMap[optionKey] = childList.map((c) => {
      if (c.key === childKey) {
        return { ...c, [property]: value };
      }
      return c;
    });

    setFields(
      fields.map((f) => {
        if (f.key === parentFieldKey) {
          return { ...f, children: childrenMap };
        }
        return f;
      })
    );
  };

  const handleDeleteChildField = (parentFieldKey, optionKey, childKey) => {
    const parentField = fields.find((f) => f.key === parentFieldKey);
    const childrenMap = { ...(parentField.children || {}) };
    const childList = childrenMap[optionKey] || [];

    childrenMap[optionKey] = childList.filter((c) => c.key !== childKey);

    setFields(
      fields.map((f) => {
        if (f.key === parentFieldKey) {
          return { ...f, children: childrenMap };
        }
        return f;
      })
    );
    toast.info("Dependent field removed.");
  };

  const editingField = fields.find((f) => f.key === editingFieldKey) || null;

  if (activeCompanyId && (loadingRole || loadingConfig)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading Form Configurator...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1250px] mx-auto space-y-6 pb-12">
      <Header
        router={router}
        role={role}
        userType={userType}
        activeCompanyId={activeCompanyId}
        hasConfig={hasConfig || historyList.length > 0}
        configVersion={isConfigActive ? configVersion : (historyList[0]?.configId || 0)}
        isConfigActive={isConfigActive}
        handleDeactivate={handleDeactivate}
        handleActivate={handleActivate}
        isDeactivating={isDeactivating}
        setIsPreviewOpen={setIsPreviewOpen}
        setPreviewActiveTab={setPreviewActiveTab}
      />

      <div className="space-y-6">
          {/* Sub Navigation tabs */}
          <div className="flex border-b border-gray-200 shrink-0">
            <button
              onClick={() => setActiveLeftTab("builder")}
              className={`pb-3 text-xs font-extrabold uppercase tracking-wider transition-all border-b-2 -mb-[2px] pr-6 ${
                activeLeftTab === "builder"
                  ? "border-[#007aff] text-[#007aff]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Extra Information Form
            </button>
            <button
              onClick={() => setActiveLeftTab("history")}
              className={`pb-3 text-xs font-extrabold uppercase tracking-wider transition-all border-b-2 -mb-[2px] pr-6 flex items-center gap-1.5 ${
                activeLeftTab === "history"
                  ? "border-[#007aff] text-[#007aff]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <History className="h-4 w-4" /> Publication History
            </button>
          </div>

          {activeLeftTab === "builder" ? (
            <div className="space-y-6">
              <FormGroupSettings
                configName={configName}
                setConfigName={setConfigName}
                changeNote={changeNote}
                setChangeNote={setChangeNote}
              />

              <ConfiguredFieldsTable
                fields={fields}
                onAddFieldClick={() => {
                  setAddFieldName("");
                  setAddFieldKey("");
                  setAddFieldType("text");
                  setAddFieldRequired(false);
                  setAddFieldPlaceholder("");
                  setAddFieldHelpText("");
                  setAddFieldDefaultValue("");
                  setAddFieldValidationRules("");
                  setIsAddAdvancedOpen(false);
                  setIsAddDrawerOpen(true);
                }}
                moveField={moveField}
                setEditingFieldKey={setEditingFieldKey}
                setEditActiveTab={setEditActiveTab}
                setActiveRuleOption={setActiveRuleOption}
                handleDeleteField={handleDeleteField}
              />

              {/* NORMAL FORM ACTION BUTTONS */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                {isDirty && (
                  <span className="text-xs text-amber-500 font-semibold mr-auto flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    Unsaved changes in form settings
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => saveConfig(false)}
                  disabled={isSaving || !isDirty}
                  className="px-5 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => saveConfig(true)}
                  disabled={isSaving || !isDirty}
                  className="px-5 py-2 bg-[#007aff] hover:bg-blue-650 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Publishing..." : "Publish Changes"}
                </button>
              </div>
            </div>
          ) : (
            <PublicationHistory
              historyList={historyList}
              loadingHistory={loadingHistory}
              historyPage={historyPage}
              historyTotalPages={historyTotalPages}
              setHistoryPage={setHistoryPage}
              fetchHistory={fetchHistory}
            />
          )}
        </div>

      <AddFieldDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => {
          setIsAddDrawerOpen(false);
          setAddFieldName("");
          setAddFieldKey("");
          setAddFieldType("text");
          setAddFieldRequired(false);
          setAddFieldPlaceholder("");
          setAddFieldHelpText("");
          setAddFieldDefaultValue("");
          setAddFieldValidationRules("");
          setIsAddAdvancedOpen(false);
        }}
        addFieldName={addFieldName}
        setAddFieldName={setAddFieldName}
        addFieldKey={addFieldKey}
        setAddFieldKey={setAddFieldKey}
        addFieldType={addFieldType}
        setAddFieldType={setAddFieldType}
        addFieldRequired={addFieldRequired}
        setAddFieldRequired={setAddFieldRequired}
        addFieldPlaceholder={addFieldPlaceholder}
        setAddFieldPlaceholder={setAddFieldPlaceholder}
        addFieldHelpText={addFieldHelpText}
        setAddFieldHelpText={setAddFieldHelpText}
        isAddAdvancedOpen={isAddAdvancedOpen}
        setIsAddAdvancedOpen={setIsAddAdvancedOpen}
        handleSaveNewField={handleSaveNewField}
      />

      <EditFieldDrawer
        isOpen={!!editingFieldKey}
        onClose={() => setEditingFieldKey(null)}
        editingField={editingField}
        setEditingFieldKey={setEditingFieldKey}
        editActiveTab={editActiveTab}
        setEditActiveTab={setEditActiveTab}
        activeRuleOption={activeRuleOption}
        setActiveRuleOption={setActiveRuleOption}
        isEditAdvancedOpen={isEditAdvancedOpen}
        setIsEditAdvancedOpen={setIsEditAdvancedOpen}
        handleUpdateFieldProperty={handleUpdateFieldProperty}
        handleAddOption={handleAddOption}
        handleRemoveOption={handleRemoveOption}
        handleAddChildField={handleAddChildField}
        handleUpdateChildProperty={handleUpdateChildProperty}
        handleDeleteChildField={handleDeleteChildField}
        previewValues={previewValues}
        setPreviewValues={setPreviewValues}
      />

      <ReplicaPreviewDrawer
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        role={role}
        configName={configName}
        fields={fields}
        previewActiveTab={previewActiveTab}
        setPreviewActiveTab={setPreviewActiveTab}
        previewValues={previewValues}
        setPreviewValues={setPreviewValues}
      />
    </div>
  );
}
