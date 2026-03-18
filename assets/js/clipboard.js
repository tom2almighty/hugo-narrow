export async function copyText(text) {
  if (!navigator.clipboard?.writeText || !window.isSecureContext) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (_) {
    return false;
  }
}
