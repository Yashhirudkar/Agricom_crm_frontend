import { useMemo } from "react";
import { usePermissions } from "./usePermissions";

/**
 * Reusable hook to manage finalization locking state across modules.
 * Implements the Enterprise Decision Table:
 * - Pending/Draft -> Editable
 * - Completed with EDIT_COMPLETED override -> Unlimited Edit Allowed
 * - Completed without EDIT_COMPLETED & oneTimeEditUsed == false -> 1 Edit Allowed (isOneTimeAllowed = true, isReadOnly = false)
 * - Completed without EDIT_COMPLETED & oneTimeEditUsed == true -> Locked Forever (isReadOnly = true)
 *
 * @param {Object} options
 * @param {boolean} [options.isCompleted] - Direct boolean flag indicating completion
 * @param {string} [options.status] - Status string (e.g. 'Completed', 'Finalized', 'Stuffed', 'Executed')
 * @param {string} [options.resource] - e.g. 'cargo_allocation', 'freight_allocation', 'shipment_stuffing_execution'
 * @param {string} [options.module] - Alias for resource
 * @param {boolean} [options.oneTimeEditUsed=false] - Whether the single allowed completed correction has already been saved
 * @returns {{ isCompleted: boolean, canOverride: boolean, isOneTimeAllowed: boolean, isReadOnly: boolean, oneTimeEditUsed: boolean }}
 */
export function useFinalizationLock({
  isCompleted,
  status,
  resource = "",
  module = "",
  oneTimeEditUsed = false,
  allowOneTimeEdit = false,
}) {
  const targetResource = resource || module;
  const recordCompleted =
    isCompleted !== undefined
      ? Boolean(isCompleted)
      : ["Completed", "Finalized", "Stuffed", "Executed"].includes(status);

  const { hasPermission, canEditCompleted } = usePermissions();

  const canOverride = useMemo(() => {
    if (!targetResource) return false;
    return canEditCompleted
      ? canEditCompleted(targetResource)
      : hasPermission(`${targetResource}:edit_completed`);
  }, [targetResource, canEditCompleted, hasPermission]);

  const hasOneTimeEditBeenUsed = Boolean(oneTimeEditUsed);

  // If completed and user does NOT have override:
  // - If allowOneTimeEdit is false: strict locking -> isReadOnly = true, viewMode = true
  // - If allowOneTimeEdit is true:
  //     - If oneTimeEditUsed == false: 1 Edit allowed (isOneTimeAllowed = true, isReadOnly = false)
  //     - If oneTimeEditUsed == true: Permanently locked (isReadOnly = true)
  const isOneTimeAllowed = Boolean(
    allowOneTimeEdit && recordCompleted && !canOverride && !hasOneTimeEditBeenUsed
  );
  const isReadOnly = Boolean(
    recordCompleted && !canOverride && (!allowOneTimeEdit || hasOneTimeEditBeenUsed)
  );

  return {
    isCompleted: Boolean(recordCompleted),
    canOverride,
    isOneTimeAllowed,
    isReadOnly,
    viewMode: isReadOnly,
    oneTimeEditUsed: hasOneTimeEditBeenUsed,
  };
}

export default useFinalizationLock;
