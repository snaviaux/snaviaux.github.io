(function () {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const status = form.querySelector("[data-form-status]");
  const endpoint = form.dataset.endpoint || form.action || "";
  const isConfigured = endpoint && !endpoint.includes("REPLACE_WITH_FORM_ID");
  const projectTypeKeys = {
    "Hiring or full-time role": "hiring",
    "AI deployment in a regulated environment": "regulated-ai",
    "Identity or access engineering": "identity-access",
    "Cloud or infrastructure review": "cloud-infrastructure",
    "Automation or agent operations": "agent-operations",
    "Writing, advising, or other": "advising-other",
  };
  let hasStarted = false;

  const track = (name, data) => {
    try {
      const pending = window.umami?.track?.(name, data);
      if (pending && typeof pending.catch === "function") pending.catch(() => {});
    } catch (error) {
      // Analytics must never affect the contact path.
    }
  };

  const markStarted = (event) => {
    if (hasStarted || event?.target?.closest(".honeypot")) return;
    hasStarted = true;
    track("contact-form-start");
  };

  const setStatus = (message, state) => {
    if (!status) return;
    status.textContent = message;
    status.dataset.state = state;
  };

  if (!isConfigured) {
    setStatus("The form is temporarily offline. Reach me on LinkedIn instead.", "pending");
  }

  form.addEventListener("input", markStarted, { passive: true });
  form.addEventListener("change", markStarted, { passive: true });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    markStarted();

    const formData = new FormData(form);
    const projectType = projectTypeKeys[formData.get("project_type")] || "unknown";

    if (!isConfigured) {
      setStatus("The form is temporarily offline. Reach me on LinkedIn instead.", "pending");
      track("contact-form-submit", {
        result: "failure",
        project_type: projectType,
        failure_type: "configuration",
      });
      return;
    }

    const button = form.querySelector("button[type='submit']");
    if (button) button.disabled = true;
    setStatus("Sending...", "sending");

    let failureType = "network";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        failureType = "http";
        throw new Error("Lead form request failed");
      }

      form.reset();
      setStatus("Received. I will follow up if there is a fit.", "success");
      track("contact-form-submit", { result: "success", project_type: projectType });
    } catch (error) {
      setStatus("Something failed. Use LinkedIn for now.", "error");
      track("contact-form-submit", {
        result: "failure",
        project_type: projectType,
        failure_type: failureType,
      });
    } finally {
      if (button) button.disabled = false;
    }
  });
})();
