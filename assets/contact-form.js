(function () {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const status = form.querySelector("[data-form-status]");
  const endpoint = form.dataset.endpoint || form.action || "";
  const isConfigured = endpoint && !endpoint.includes("REPLACE_WITH_FORM_ID");

  const setStatus = (message, state) => {
    if (!status) return;
    status.textContent = message;
    status.dataset.state = state;
  };

  if (!isConfigured) {
    setStatus("The form is temporarily offline. Reach me on LinkedIn instead.", "pending");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!isConfigured) {
      setStatus("The form is temporarily offline. Reach me on LinkedIn instead.", "pending");
      return;
    }

    const button = form.querySelector("button[type='submit']");
    if (button) button.disabled = true;
    setStatus("Sending...", "sending");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Lead form request failed");
      }

      form.reset();
      setStatus("Received. I will follow up if there is a fit.", "success");
    } catch (error) {
      setStatus("Something failed. Use LinkedIn for now.", "error");
    } finally {
      if (button) button.disabled = false;
    }
  });
})();
