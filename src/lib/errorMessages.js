/**
 * Translates raw backend error strings into user-friendly, business-context messages.
 * Never show raw NestJS exception names to users.
 */
export function getFriendlyError(raw) {
  if (!raw) return "Something went wrong. Please try again.";

  const msg = typeof raw === "string" ? raw : (raw?.message || JSON.stringify(raw));
  const lower = msg.toLowerCase();

  // Leave specific
  if (lower.includes("overlap") || lower.includes("overlaps"))
    return "You already have leave applied for the selected dates.";
  if (lower.includes("insufficient leave balance") || lower.includes("insufficient balance"))
    return "You do not have enough leave balance for this request.";
  if (lower.includes("payroll lock") || lower.includes("payroll-lock") || lower.includes("payroll locked") || lower.includes("payroll processing"))
    return "This date is locked after payroll processing. Contact HR for changes.";
  if (lower.includes("backdated"))
    return "Backdated leave applications are not allowed by company policy.";
  if (lower.includes("half day") && lower.includes("not allowed"))
    return "Half day leave is not permitted for this leave type.";
  if (lower.includes("minimum service"))
    return "You have not completed the minimum service period required for this leave type.";
  if (lower.includes("probation"))
    return "This leave type is only available after your probation period ends.";
  if (lower.includes("cross") && lower.includes("year"))
    return "Leave cannot span across two calendar years. Please apply separately.";
  if (lower.includes("zero") && lower.includes("days"))
    return "Selected dates fall on holidays or weekly offs. Please choose working days.";
  if (lower.includes("no manager") || lower.includes("no approver"))
    return "No approver is configured for your account. Please contact HR.";
  if (lower.includes("cannot approve your own"))
    return "You cannot approve your own leave request.";
  if (lower.includes("not the designated approver"))
    return "You are not the designated approver for this leave request.";
  if (lower.includes("already") && lower.includes("pending or approved"))
    return "You already have a leave applied for the selected dates.";

  // Attendance specific
  if (lower.includes("already checked in") || lower.includes("you are already checked in"))
    return "You are already checked in for today.";
  if (lower.includes("cannot check out without"))
    return "You must check in before checking out.";
  if (lower.includes("not currently checked in"))
    return "You are not currently checked in.";
  if (lower.includes("geo-fence") || lower.includes("outside the branch"))
    return "You are outside the office boundary. Check-in is restricted to the office premises.";
  if (lower.includes("company holiday"))
    return "Today is a company holiday. Check-in is not available.";
  if (lower.includes("approved leave for today"))
    return "You have an approved leave for today. Cancel your leave first to mark attendance.";
  if (lower.includes("payroll locked") || lower.includes("attendance locked"))
    return "This attendance record is locked after payroll processing.";
  if (lower.includes("already a pending correction"))
    return "You already have a pending correction request for this date.";
  if (lower.includes("correction requests are limited"))
    return "Attendance corrections can only be requested within the allowed window.";

  // Correction specific
  if (lower.includes("regularization blocked"))
    return "Regularization not allowed — you have an approved leave for this date.";

  // Auth / permission
  if (lower.includes("forbidden") || lower.includes("access denied") || lower.includes("unauthorized"))
    return "You do not have permission to perform this action.";
  if (lower.includes("not found"))
    return "The requested record was not found.";
  if (lower.includes("conflict"))
    return "A conflict occurred with an existing record. Please refresh and try again.";
  if (lower.includes("validation"))
    return "Please check the form fields and try again.";
  if (lower.includes("bad request"))
    return "Invalid request. Please check the provided information.";
  if (lower.includes("internal server"))
    return "A server error occurred. Please try again or contact support.";
  if (lower.includes("network") || lower.includes("econnrefused"))
    return "Unable to connect to the server. Please check your connection.";

  // Fallback — return the raw message if it's already short and doesn't look like a technical error
  if (msg.length < 120 && !msg.includes("Exception") && !msg.includes("Error:")) {
    return msg;
  }

  return "Something went wrong. Please try again or contact support.";
}
