export const NOTIFY_EVENT = 'erp:notify';
export const CONFIRM_EVENT = 'erp:confirm';

export function notify(message, type = 'info') {
  window.dispatchEvent(new CustomEvent(NOTIFY_EVENT, { detail: { message: String(message), type } }));
}

export function confirmAction(message, options = {}) {
  return new Promise((resolve) => {
    window.dispatchEvent(new CustomEvent(CONFIRM_EVENT, {
      detail: { message, resolve, ...options },
    }));
  });
}
