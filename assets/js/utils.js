// Simple utility helpers for the IntechDigital website

/**
 * Smoothly scroll to an element by selector.
 * @param {string} selector
 */
function smoothScrollTo(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Show a lightweight toast notification.
 * Kept generic so it can be reused across pages.
 * @param {string} message
 * @param {"success"|"error"|"info"} [type]
 */
function showToastNotification(message, type = "info") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 180);
  }, 3200);
}


