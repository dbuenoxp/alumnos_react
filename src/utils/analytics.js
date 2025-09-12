// utils/analytics.js
export const gtagEvent = (action, params = {}) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", action, params);
  } else {
    console.warn("gtag no está disponible aún");
  }
};
