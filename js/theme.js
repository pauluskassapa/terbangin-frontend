(() => {
  const storageKey = "terbangin-theme";

  try {
    const savedTheme = localStorage.getItem(storageKey);
    document.documentElement.dataset.theme = savedTheme === "dark" ? "dark" : "light";
  } catch {
    document.documentElement.dataset.theme = "light";
  }
})();
