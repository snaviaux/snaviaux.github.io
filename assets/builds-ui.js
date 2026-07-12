(function () {
  "use strict";

  const root = document.documentElement;
  const mobile = window.matchMedia("(max-width: 680px)");
  const slugs = ["talos", "openclaw", "life-hub", "brain"];
  let selectedBuild = "talos";
  const requestIntents = new WeakMap();
  let activeBuildRequest = null;
  let latestBuildSequence = 0;
  let desktopResetPending = false;
  let scrollFrame = 0;

  function fullArchiveRequested() {
    return new URLSearchParams(window.location.search).has("full");
  }

  function enhanced() {
    return root.classList.contains("builds-enhanced");
  }

  function invalidateActiveBuildRequest() {
    if (!activeBuildRequest) return;
    latestBuildSequence += 1;
    activeBuildRequest = null;
    document.getElementById("build-detail")?.setAttribute("aria-busy", "false");
  }

  function createBuildIntent(slug, options) {
    return {
      slug,
      history: options?.history || "none",
      focus: Boolean(options?.focus),
      sequence: ++latestBuildSequence,
    };
  }

  function buildIntentFor(event) {
    return event.detail?.requestConfig?.portfolioBuildIntent
      || (event.detail?.xhr && requestIntents.get(event.detail.xhr));
  }

  function announceLocation(slug) {
    selectedBuild = slug;
    document.body.dataset.activeBuild = slug;
    const detail = document.getElementById("build-detail");
    if (detail) detail.dataset.build = slug;
    document.querySelectorAll("[data-build-choice]").forEach((choice) => {
      if (choice.dataset.buildSlug === slug) choice.setAttribute("aria-current", "location");
      else choice.removeAttribute("aria-current");
    });
    document.dispatchEvent(new CustomEvent("site:locationchange", { detail: { location: slug } }));
  }

  function focusSelectedBuild() {
    const target = document.getElementById("build-detail");
    const heading = target?.querySelector("h2");
    if (!target || !heading) return;
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
    heading.addEventListener("blur", () => heading.removeAttribute("tabindex"), { once: true });
  }

  function loadBuild(slug, options) {
    if (!window.htmx || !slugs.includes(slug)) return;
    const choice = document.querySelector(`.build-index [data-build-slug="${slug}"]`);
    if (!choice) return;
    const intent = createBuildIntent(slug, options);
    const requestEvent = new CustomEvent("portfolio:buildload");
    requestEvent.portfolioBuildIntent = intent;
    window.htmx.ajax("GET", choice.getAttribute("hx-get"), {
      source: choice,
      event: requestEvent,
      target: "#build-detail-content",
      swap: "innerHTML",
    });
  }

  function setEnhancement() {
    if (!window.htmx || fullArchiveRequested()) {
      root.classList.remove("builds-enhanced");
      return;
    }

    if (mobile.matches) {
      root.classList.add("builds-enhanced");
      const hashBuild = window.location.hash.slice(1);
      if (slugs.includes(hashBuild) && hashBuild !== selectedBuild) {
        loadBuild(hashBuild, { history: "none", focus: false });
      }
      else announceLocation(selectedBuild);
      return;
    }

    invalidateActiveBuildRequest();

    if (selectedBuild !== "talos") {
      desktopResetPending = true;
      window.htmx.ajax("GET", "/partials/builds/talos.html", {
        target: "#build-detail-content",
        swap: "innerHTML",
      });
    } else {
      root.classList.remove("builds-enhanced");
    }
  }

  function updateDesktopLocation() {
    if (enhanced()) return;
    const probe = window.scrollY + Math.min(window.innerHeight * 0.3, 240);
    let current = "builds";
    slugs.forEach((slug) => {
      const section = slug === "talos" ? document.getElementById("build-detail") : document.getElementById(slug);
      if (section && probe >= section.offsetTop) current = slug;
    });
    document.body.dataset.activeBuild = current;
    document.dispatchEvent(new CustomEvent("site:locationchange", { detail: { location: current } }));
  }

  function requestDesktopLocation() {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      updateDesktopLocation();
    });
  }

  function showBuildError(slug) {
    const content = document.getElementById("build-detail-content");
    const target = document.getElementById("build-detail");
    if (!content || !target) return;
    target.setAttribute("aria-busy", "false");
    content.querySelector(".build-error")?.remove();
    content.insertAdjacentHTML("afterbegin", `
      <div class="build-error" role="alert">
        <h2>That build did not load.</h2>
        <p>The full case study is still available in the static archive.</p>
        <a class="button button-primary" href="/builds/?full=1#${slug}">Open the full section</a>
      </div>`);
    const heading = content.querySelector(".build-error h2");
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
    heading?.setAttribute("tabindex", "-1");
    heading?.focus({ preventScroll: true });
    heading?.addEventListener("blur", () => heading.removeAttribute("tabindex"), { once: true });
  }

  document.addEventListener("click", (event) => {
    const directChoice = event.target.closest("[data-build-slug][hx-get]");
    if (directChoice && enhanced()) event.preventDefault();

    const navChoice = event.target.closest("#mobile-nav-panel [data-build-slug]");
    if (navChoice && enhanced()) {
      event.preventDefault();
      loadBuild(navChoice.dataset.buildSlug, { history: "push", focus: true });
    }
  });

  document.addEventListener("htmx:beforeRequest", (event) => {
    const trigger = event.detail.elt;
    const slug = trigger?.dataset?.buildSlug;
    if (!slug || !slugs.includes(slug)) return;
    const triggeringEvent = event.detail.requestConfig?.triggeringEvent;
    const directClick = triggeringEvent?.type === "click";
    const intent = triggeringEvent?.portfolioBuildIntent
      || createBuildIntent(slug, { history: directClick ? "push" : "none", focus: directClick });
    requestIntents.set(event.detail.xhr, intent);
    event.detail.requestConfig.portfolioBuildIntent = intent;
    activeBuildRequest = event.detail.xhr;
    document.getElementById("build-detail")?.setAttribute("aria-busy", "true");
  });

  document.addEventListener("htmx:beforeSwap", (event) => {
    if (event.detail.target?.id !== "build-detail-content") return;
    const request = event.detail.xhr;
    const intent = buildIntentFor(event);
    if (intent && intent.sequence !== latestBuildSequence) {
      event.detail.shouldSwap = false;
    }
  });

  document.addEventListener("htmx:afterSwap", (event) => {
    if (event.detail.target?.id !== "build-detail-content") return;
    const request = event.detail.xhr;
    const intent = buildIntentFor(event);
    if (intent && intent.sequence !== latestBuildSequence) {
      requestIntents.delete(request);
      return;
    }
    const target = document.getElementById("build-detail");
    const selected = event.detail.target.querySelector("[data-selected-build]")?.dataset.selectedBuild || intent?.slug || "talos";
    target?.setAttribute("aria-busy", "false");
    announceLocation(selected);

    if (intent?.history === "push" && window.location.hash !== `#${selected}`) {
      window.history.pushState({ build: selected }, "", `/builds/#${selected}`);
    }

    if (desktopResetPending) {
      desktopResetPending = false;
      root.classList.remove("builds-enhanced");
    } else if (intent?.focus) {
      focusSelectedBuild();
    }
    if (request === activeBuildRequest) activeBuildRequest = null;
    if (request) requestIntents.delete(request);
  });

  function handleBuildFailure(event, showError) {
    const request = event.detail?.xhr;
    const intent = buildIntentFor(event);
    const slug = intent?.slug || event.detail?.elt?.dataset?.buildSlug;

    if (!slug || !slugs.includes(slug)) {
      if (desktopResetPending && event.detail?.target?.id === "build-detail-content") {
        desktopResetPending = false;
        root.classList.remove("builds-enhanced");
        document.getElementById("build-detail")?.setAttribute("aria-busy", "false");
      }
      return;
    }

    if (intent && intent.sequence !== latestBuildSequence) {
      requestIntents.delete(request);
      return;
    }

    if (showError) showBuildError(slug);
    else document.getElementById("build-detail")?.setAttribute("aria-busy", "false");
    if (request === activeBuildRequest) activeBuildRequest = null;
    if (request) requestIntents.delete(request);
  }

  ["htmx:responseError", "htmx:sendError", "htmx:timeout"].forEach((eventName) => {
    document.addEventListener(eventName, (event) => handleBuildFailure(event, true));
  });
  document.addEventListener("htmx:sendAbort", (event) => handleBuildFailure(event, false));
  document.addEventListener("htmx:afterRequest", (event) => {
    const request = event.detail?.xhr;
    if (!request || !requestIntents.has(request)) return;
    window.queueMicrotask(() => requestIntents.delete(request));
  });

  mobile.addEventListener("change", setEnhancement);
  window.addEventListener("popstate", () => {
    if (!enhanced()) return;
    const hashBuild = window.location.hash.slice(1);
    const nextBuild = slugs.includes(hashBuild) ? hashBuild : "talos";
    if (nextBuild !== selectedBuild) {
      loadBuild(nextBuild, { history: "none", focus: false });
    } else {
      invalidateActiveBuildRequest();
    }
  });
  window.addEventListener("scroll", requestDesktopLocation, { passive: true });
  window.addEventListener("resize", requestDesktopLocation);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setEnhancement();
      updateDesktopLocation();
    }, { once: true });
  } else {
    setEnhancement();
    updateDesktopLocation();
  }
})();
