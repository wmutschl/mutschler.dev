// Shared behaviour for all redesign prototypes.
// - Copy buttons on code blocks (.codeblock → button.codeblock__copy)
// - Click-to-load YouTube (figure.video[data-video-id])
// - Search API: window.siteSearch(query) → Promise<results[]>
// Designs style the generated markup; nothing here sets colours or sizes.

(function () {
  "use strict";

  // ---------- Copy buttons ----------
  function textOf(block) {
    // a theme may decide what a listing's Copy button copies (the Handbook's line roles: commands without output)
    if (typeof window.codeText === "function") {
      const t = window.codeText(block);
      if (typeof t === "string") return t;
    }
    const code = block.querySelector("pre code") || block.querySelector("pre");
    return code ? code.innerText.replace(/\n$/, "") : "";
  }

  function addCopyButtons(root) {
    root.querySelectorAll(".codeblock").forEach(function (block) {
      if (block.querySelector(".codeblock__copy")) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "codeblock__copy";
      btn.setAttribute("aria-label", "Copy code to clipboard");
      btn.innerHTML = '<span class="codeblock__copy-text">Copy</span>';
      btn.addEventListener("click", function () {
        const text = textOf(block);
        const done = function () {
          btn.classList.add("is-copied");
          btn.querySelector(".codeblock__copy-text").textContent = "Copied";
          btn.setAttribute("aria-label", "Copied to clipboard");
          clearTimeout(btn._t);
          btn._t = setTimeout(function () {
            btn.classList.remove("is-copied");
            btn.querySelector(".codeblock__copy-text").textContent = "Copy";
            btn.setAttribute("aria-label", "Copy code to clipboard");
          }, 1600);
        };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
        } else {
          fallbackCopy(text);
          done();
        }
      });
      block.appendChild(btn);
    });
  }

  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  // ---------- Click-to-load YouTube ----------
  function wireVideos(root) {
    root.querySelectorAll("figure.video[data-video-id]").forEach(function (fig) {
      const link = fig.querySelector("a.video__open");
      if (!link || link._wired) return;
      link._wired = true;
      link.addEventListener("click", function (ev) {
        if (ev.metaKey || ev.ctrlKey || ev.shiftKey) return; // let people open YouTube in a new tab
        ev.preventDefault();
        const id = fig.getAttribute("data-video-id");
        const iframe = document.createElement("iframe");
        iframe.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0";
        iframe.title = "YouTube video player";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.className = "video__frame";
        fig.classList.add("is-playing");
        link.replaceWith(iframe);
        iframe.focus();
      });
    });
  }

  // ---------- Search ----------
  let indexPromise = null;
  function loadIndex() {
    if (!indexPromise) {
      const script = document.currentScript || document.querySelector("script[data-search-index]");
      const url = (script && script.getAttribute("data-search-index")) || "/index.json";
      indexPromise = fetch(url).then(function (r) { return r.json(); }).catch(function () { return []; });
    }
    return indexPromise;
  }
  const scriptEl = document.currentScript;

  function norm(s) {
    return (s || "").toString().toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");
  }

  // Simple ranked substring search. Every word of the query must match somewhere.
  // Returns [{title, short, url, section, platform, status, summary, tags, headings, date, updated, score, matchedHeading}]
  window.siteSearch = function (query) {
    const words = norm(query).split(/\s+/).filter(Boolean);
    if (!words.length) return Promise.resolve([]);
    if (!indexPromise && scriptEl) {
      const url = scriptEl.getAttribute("data-search-index") || "/index.json";
      indexPromise = fetch(url).then(function (r) { return r.json(); }).catch(function () { return []; });
    }
    return loadIndex().then(function (items) {
      const out = [];
      items.forEach(function (it) {
        const title = norm(it.title + " " + it.short + " " + it.platform);
        const tags = norm((it.tags || []).join(" "));
        const summary = norm(it.summary);
        const heads = (it.headings || []).map(norm);
        let score = 0;
        let matchedHeading = "";
        for (const w of words) {
          let s = 0;
          if (title.includes(w)) s += 10;
          if (tags.includes(w)) s += 6;
          const hi = heads.findIndex(function (h) { return h.includes(w); });
          if (hi >= 0) { s += 4; if (!matchedHeading) matchedHeading = it.headings[hi]; }
          if (summary.includes(w)) s += 2;
          if (s === 0) return; // every word must match
          score += s;
        }
        if (it.status === "current") score += 3;
        out.push(Object.assign({}, it, { score: score, matchedHeading: matchedHeading }));
      });
      out.sort(function (a, b) { return b.score - a.score || (b.updated > a.updated ? 1 : -1); });
      return out;
    });
  };

  // a theme that builds content from other content (the Handbook's sidenotes) arms its listings with this
  window.addCopyButtons = addCopyButtons;

  function init() {
    addCopyButtons(document);
    wireVideos(document);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
