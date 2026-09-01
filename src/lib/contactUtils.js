/**
 * Resolves a contact's phone number according to strict ERP priority order:
 * 1. Primary Mobile (phone / mobile)
 * 2. Primary Phone (telephone)
 * 3. Office Phone
 * 4. Alternate Phone
 * 5. Blank fallback
 */
export function resolvePhone(contact) {
  if (!contact) return "";
  return (
    contact.phone ||
    contact.mobile ||
    contact.telephone ||
    contact.office ||
    contact.alternate ||
    ""
  );
}
