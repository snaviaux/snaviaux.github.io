(function () {
  "use strict";

  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const homeOrder = ["top", "signal", "lab", "patterns", "footprint", "writing", "contact"];
  const labels = {
    top: "Start",
    signal: "Signal",
    lab: "Lab",
    patterns: "Failure modes",
    footprint: "Footprint",
    writing: "Field notes",
    contact: "Contact",
    builds: "Builds",
    talos: "Talos",
    openclaw: "OpenClaw",
    "life-hub": "Life Hub",
    brain: "Brain",
  };
  let navSwapFocus = "none";
  let lockedHomeLocation = null;
  let locationFrame = 0;

  function isBuildPage() {
    return document.body.classList.contains("build-page");
  }

  function currentHomeLocation() {
    if (lockedHomeLocation && homeOrder.includes(lockedHomeLocation)) {
      return lockedHomeLocation;
    }
    const probe = window.scrollY + Math.min(window.innerHeight * 0.3, 240);
    let current = "top";
    homeOrder.forEach((id) => {
      const section = document.getElementById(id);
      if (section && probe >= section.offsetTop) current = id;
    });
    return current;
  }

  function currentLocation() {
    if (isBuildPage()) return document.body.dataset.activeBuild || "builds";
    return currentHomeLocation();
  }

  function updateLocation() {
    const current = currentLocation();
    document.querySelectorAll("[data-nav-target]").forEach((link) => {
      if (link.dataset.navTarget === current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    document.querySelectorAll("[data-nav-current]").forEach((node) => {
      node.textContent = labels[current] || labels.builds;
    });
  }

  function requestLocationUpdate() {
    if (locationFrame) return;
    locationFrame = window.requestAnimationFrame(() => {
      locationFrame = 0;
      updateLocation();
    });
  }

  function closeMobileNav(options) {
    const slot = document.getElementById("mobile-nav-slot");
    if (!slot || !window.htmx || !slot.dataset.closeUrl) return;
    navSwapFocus = options?.restoreFocus ? "toggle" : "preserve";
    window.htmx.ajax("GET", slot.dataset.closeUrl, {
      target: "#mobile-nav-slot",
      swap: "outerHTML",
    });
  }

  function focusSection(section) {
    const focusTarget = section.matches("h1,h2,h3") ? section : section.querySelector("h1,h2,h3");
    if (!focusTarget) return;
    const hadTabindex = focusTarget.hasAttribute("tabindex");
    if (!hadTabindex) focusTarget.setAttribute("tabindex", "-1");
    focusTarget.focus({ preventScroll: true });
    if (!hadTabindex) {
      focusTarget.addEventListener("blur", () => focusTarget.removeAttribute("tabindex"), { once: true });
    }
  }

  function enableEnhancement() {
    if (!window.htmx) return;
    root.classList.add("htmx-ready");
    updateLocation();
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("#mobile-nav-slot .mobile-nav-toggle")) {
      navSwapFocus = "toggle";
      return;
    }

    const link = event.target.closest("#mobile-nav-panel a");
    if (!link) return;

    if (link.dataset.buildSlug) {
      closeMobileNav();
      return;
    }

    const href = link.getAttribute("href") || "";
    if (href.startsWith("#")) {
      const section = document.querySelector(href);
      if (section) {
        event.preventDefault();
        lockedHomeLocation = href.slice(1);
        updateLocation();
        if (window.location.hash !== href) window.history.pushState(null, "", href);
        section.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
        focusSection(section);
      }
    }
    closeMobileNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.getElementById("mobile-nav-panel")) {
      event.preventDefault();
      closeMobileNav({ restoreFocus: true });
    }
  });

  document.addEventListener("htmx:afterSwap", (event) => {
    enableEnhancement();
    if (event.detail.target?.id === "mobile-nav-slot") {
      if (navSwapFocus === "toggle") {
        document.getElementById("mobile-nav-toggle")?.focus();
      }
      navSwapFocus = "none";
    }
  });

  function handleNavigationFailure(event) {
    const target = event.detail?.target;
    const trigger = event.detail?.elt;
    if (target?.id === "mobile-nav-slot" || trigger?.closest?.("#mobile-nav-slot")) {
      root.classList.remove("htmx-ready");
      navSwapFocus = "none";
      document.querySelector("header.site nav.links a")?.focus();
    }
  }

  ["htmx:responseError", "htmx:sendError", "htmx:sendAbort", "htmx:timeout"].forEach((eventName) => {
    document.addEventListener(eventName, handleNavigationFailure);
  });

  document.addEventListener("site:locationchange", updateLocation);
  window.addEventListener("scroll", requestLocationUpdate, { passive: true });
  window.addEventListener("wheel", () => {
    lockedHomeLocation = null;
    requestLocationUpdate();
  }, { passive: true });
  window.addEventListener("touchmove", () => {
    lockedHomeLocation = null;
    requestLocationUpdate();
  }, { passive: true });
  window.addEventListener("pointerdown", (event) => {
    if (!event.target.closest?.("#mobile-nav-slot")) {
      lockedHomeLocation = null;
      requestLocationUpdate();
    }
  }, { passive: true });
  window.addEventListener("scrollend", () => {
    const section = lockedHomeLocation && document.getElementById(lockedHomeLocation);
    if (section && Math.abs(section.getBoundingClientRect().top) <= 160) {
      lockedHomeLocation = null;
      requestLocationUpdate();
    }
  }, { passive: true });
  window.addEventListener("popstate", () => {
    lockedHomeLocation = null;
    requestLocationUpdate();
  });
  window.addEventListener("keydown", (event) => {
    const scrollKeys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "];
    const editable = event.target.closest?.("input, textarea, select, [contenteditable='true']");
    if (!editable && scrollKeys.includes(event.key)) {
      lockedHomeLocation = null;
      requestLocationUpdate();
    }
  });
  window.addEventListener("resize", requestLocationUpdate);
  window.addEventListener("hashchange", () => {
    lockedHomeLocation = null;
    requestLocationUpdate();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enableEnhancement, { once: true });
  } else {
    enableEnhancement();
  }
})();
