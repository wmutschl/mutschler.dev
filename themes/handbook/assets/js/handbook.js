// Handbook behaviour (vanilla, no dependencies). base.js provides copy buttons, video loading and window.siteSearch.
// - theme toggle (stored in localStorage as "handbook-theme")
// - search: dialog from the running head or "/", inline on the index and 404 pages
// - current section in the side TOC, the phone TOC dialog and the running head
// - labels for tables that reflow on phones; scroll regions only for tables that scroll
// - wide tables marked so that, like listings, they take the space to the right of the text from 1024 px
// - first-column labels that stay on one line; shared column widths for a series of tables
// - footnotes repeated as sidenotes in the right margin on wide screens
// - margin notes level with what they comment on; a listing, wide table or diagram beside one stays in the column

(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };

  // ---------- Theme ----------
  var darkQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function effectiveTheme() {
    var t = root.getAttribute("data-theme");
    if (t === "light" || t === "dark") return t;
    return darkQuery && darkQuery.matches ? "dark" : "light";
  }
  function syncThemeUI() {
    var t = effectiveTheme();
    $$("[data-theme-toggle]").forEach(function (b) {
      b.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
    });
    var colors = { light: "#FFFFFF", dark: "#1A1C1F" }; // the paper (round 6), as in the theme-color metas of baseof.html
    var chosen = root.getAttribute("data-theme");
    $$("meta[data-theme-color]").forEach(function (m) {
      m.setAttribute("content", chosen ? colors[chosen] : colors[m.getAttribute("data-theme-color")]);
    });
  }
  $$("[data-theme-toggle]").forEach(function (b) {
    b.addEventListener("click", function () {
      var next = effectiveTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("handbook-theme", next); } catch (e) { /* storage unavailable */ }
      syncThemeUI();
    });
  });
  if (darkQuery && darkQuery.addEventListener) darkQuery.addEventListener("change", syncThemeUI);
  syncThemeUI();

  // ---------- Dialogs ----------
  function openDialog(d) {
    if (!d) return;
    if (typeof d.showModal === "function") { if (!d.open) d.showModal(); }
    else d.setAttribute("open", "");
  }
  function closeDialog(d) {
    if (!d) return;
    if (typeof d.close === "function") d.close(); else d.removeAttribute("open");
  }
  $$("dialog").forEach(function (d) {
    // a click on the backdrop closes the dialog
    d.addEventListener("click", function (e) {
      if (e.target !== d) return;
      var r = d.getBoundingClientRect();
      var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) closeDialog(d);
    });
    $$("[data-dialog-close], [data-search-close]", d).forEach(function (b) {
      b.addEventListener("click", function () { closeDialog(d); });
    });
  });

  // ---------- Search ----------
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function headingAnchor(r) {
    if (!r.matchedHeading || !r.headings || !r.anchors) return "";
    var i = r.headings.indexOf(r.matchedHeading);
    return i >= 0 && r.anchors[i] ? "#" + r.anchors[i] : "";
  }
  function plural(n, one, many) { return n + " " + (n === 1 ? one : many); }

  function bindSearch(box) {
    var input = $("[data-search-input]", box);
    var list = $("[data-search-results]", box);
    var status = $("[data-search-status]", box);
    if (!input || !list) return;
    var timer = 0;
    var seq = 0;
    var indexHref = (doc.querySelector('.rh__nav a[href$="tags/"]') || {}).getAttribute
      ? doc.querySelector('.rh__nav a[href$="tags/"]').getAttribute("href") : "/tags/";

    function render(q, results) {
      if (!results.length) {
        list.innerHTML = "";
        status.innerHTML = "Nothing in the handbook matches “" + esc(q) + "”. Try a shorter word, or look it up in the <a href=\"" + esc(indexHref) + "\">index</a>.";
        return;
      }
      status.textContent = plural(results.length, "chapter matches", "chapters match") + " “" + q + "”.";
      // current chapters before earlier editions; within each group keep the search ranking
      var isEarlier = function (r) { return r.kind === "earlier" || r.status === "previous"; };
      results = results.filter(function (r) { return !isEarlier(r); }).concat(results.filter(isEarlier));
      list.innerHTML = results.map(function (r) {
        var earlier = isEarlier(r);
        var where = [];
        if (r.matchedHeading) where.push("Section " + esc(r.matchedHeading));
        if (earlier) where.push("Earlier edition");
        return '<li class="result' + (earlier ? " result--earlier" : "") + '">' +
          '<a href="' + esc(r.url + headingAnchor(r)) + '">' +
          '<span class="result__no">' + esc(r.num || "") + "</span> " +
          '<span class="result__title">' + esc(r.short || r.title) + "</span>" +
          (where.length ? '<span class="result__where">' + where.join(". ") + "</span>" : "") +
          "</a></li>";
      }).join("");
    }

    function run() {
      var q = input.value.trim();
      var my = ++seq;
      if (!q) { list.innerHTML = ""; status.textContent = ""; return; }
      if (typeof window.siteSearch !== "function") { status.textContent = "Search is loading. Try again in a moment."; return; }
      window.siteSearch(q).then(function (res) {
        if (my !== seq) return;
        render(q, res || []);
      }, function () {
        status.textContent = "The search index could not be loaded. Use the index of terms instead.";
      });
    }

    input.addEventListener("input", function () { clearTimeout(timer); timer = setTimeout(run, 110); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        var first = $("a", list);
        if (first) first.focus();
      }
    });
    box.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      var links = $$("a", list);
      if (!links.length) return;
      var i = links.indexOf(doc.activeElement);
      e.preventDefault();
      if (e.key === "ArrowDown") i = Math.min(i + 1, links.length - 1);
      else i = i - 1;
      if (i < 0) input.focus(); else links[i].focus();
    });
  }
  $$("[data-search]").forEach(bindSearch);

  var searchDialog = $("[data-search-dialog]");
  function openSearch() {
    var inline = $(".search--inline [data-search-input]");
    if (inline) {
      inline.scrollIntoView({ block: "center" });
      inline.focus();
      return;
    }
    openDialog(searchDialog);
    var input = searchDialog && $("[data-search-input]", searchDialog);
    if (input) { input.focus(); input.select(); }
  }
  $$("[data-search-open]").forEach(function (b) { b.addEventListener("click", openSearch); });
  doc.addEventListener("keydown", function (e) {
    if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
    var t = e.target;
    var tag = t && t.tagName;
    if (t && (t.isContentEditable || tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT")) return;
    e.preventDefault();
    openSearch();
  });

  // ---------- Phone TOC dialog ----------
  var tocDialog = $("[data-toc-dialog]");
  var tocOpeners = $$("[data-toc-open]");
  tocOpeners.forEach(function (b) {
    b.hidden = false;
    b.addEventListener("click", function () {
      openDialog(tocDialog);
      requestAnimationFrame(function () {
        // centre the current section inside the list; the dialog's title and Close button stay in view
        var list = tocDialog && $(".toc", tocDialog);
        var cur = tocDialog && $("a[aria-current]", tocDialog);
        if (!cur) return;
        if (list && list.scrollHeight > list.clientHeight) {
          var lr = list.getBoundingClientRect();
          var cr = cur.getBoundingClientRect();
          list.scrollTop += (cr.top - lr.top) - (list.clientHeight - cr.height) / 2;
        }
        cur.focus({ preventScroll: true });
      });
    });
  });
  if (tocDialog) {
    tocDialog.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a");
      if (a) closeDialog(tocDialog);
    });
  }

  // ---------- Current section ----------
  var prose = $("[data-prose]");
  var rh = $("[data-rh]");
  var opener = $("[data-opener]");
  var rhSection = $("[data-rh-section]");
  var links = {};
  $$("[data-toc] a[href^='#']").forEach(function (a) {
    var id = decodeURIComponent(a.getAttribute("href").slice(1));
    (links[id] = links[id] || []).push(a);
  });
  var heads = prose ? $$("h2[id], h3[id]", prose).filter(function (h) { return links[h.id]; }) : [];
  var active = null;

  function headLabel(h) {
    var no = h.getAttribute("data-no");
    var title = $(".sectitle", h);
    return { no: no || "", text: title ? title.textContent : h.textContent };
  }

  function setActive(h) {
    if (h === active) return;
    if (active) (links[active.id] || []).forEach(function (a) { a.removeAttribute("aria-current"); });
    $$(".toc--side li.is-open").forEach(function (li) { li.classList.remove("is-open"); });
    active = h;
    if (!h) { if (rhSection) rhSection.textContent = ""; return; }
    (links[h.id] || []).forEach(function (a) {
      a.setAttribute("aria-current", "location");
      var top = a.closest(".toc--side > ul > li");
      if (top) top.classList.add("is-open");
    });
    // keep the active entry visible inside a long side TOC
    var side = $(".toc--side");
    var sideLink = side && $('a[aria-current]', side);
    if (side && sideLink && side.scrollHeight > side.clientHeight) {
      var sr = side.getBoundingClientRect();
      var lr = sideLink.getBoundingClientRect();
      if (lr.top < sr.top + 24 || lr.bottom > sr.bottom - 24) {
        side.scrollTop += (lr.top - sr.top) - side.clientHeight / 3;
      }
    }
    if (rhSection) {
      var l = headLabel(h);
      rhSection.innerHTML = (l.no ? '<span class="secno-inline">' + esc(l.no) + "</span> " : "") + esc(l.text);
    }
  }

  var ticking = false;
  function spy() {
    ticking = false;
    var offset = (rh && getComputedStyle(rh).position === "sticky" ? rh.offsetHeight : 0) + Math.min(window.innerHeight * 0.18, 140);
    var cur = null;
    for (var i = 0; i < heads.length; i++) {
      if (heads[i].getBoundingClientRect().top <= offset) cur = heads[i]; else break;
    }
    // at the very end of the page, the last heading is current
    if (heads.length && window.innerHeight + window.scrollY >= doc.documentElement.scrollHeight - 2) cur = heads[heads.length - 1];
    setActive(cur);
    if (rh && opener) {
      var reading = opener.getBoundingClientRect().bottom < 0 && !!cur;
      rh.classList.toggle("is-reading", reading);
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }
  if (heads.length) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    spy();
  }

  // ---------- Tables ----------
  function headerSig(t) { return $$("thead th", t).map(function (th) { return th.textContent.trim(); }).join("|"); }
  var tableQuery = window.matchMedia ? window.matchMedia("(min-width: 40rem)") : null; // tables are tables (phones reflow)

  // Wide tables (round 2). From 1024 px a table whose natural width (every cell on one line) is more than the
  // text column also takes the space to its right, like a listing, but no more than it needs. Tables of one
  // series (same header row) go together, so their columns stay aligned.
  function naturalWidth(t) {
    var c = t.cloneNode(true);
    $$("colgroup", c).forEach(function (g) { g.parentNode.removeChild(g); });
    c.removeAttribute("id");
    c.style.cssText = "position:absolute;left:0;top:0;visibility:hidden;width:max-content;min-width:0;table-layout:auto";
    t.parentNode.appendChild(c);
    var w = c.getBoundingClientRect().width;
    c.parentNode.removeChild(c);
    return w;
  }
  function classifyTables() {
    var wraps = $$(".prose .table-wrap").filter(function (w) { return !w.closest(".callout") && w.querySelector("table"); });
    if (!wraps.length) return;
    wraps.forEach(function (w) { w.classList.remove("table-wrap--wide"); });
    var wide = {};
    var keys = wraps.map(function (w, i) {
      var t = w.querySelector("table");
      var key = headerSig(t) || "#" + i;
      var p = w.parentNode, ps = getComputedStyle(p);
      var col = p.clientWidth - (parseFloat(ps.paddingLeft) || 0) - (parseFloat(ps.paddingRight) || 0);
      if (naturalWidth(t) > col + 1) wide[key] = true;
      return key;
    });
    wraps.forEach(function (w, i) { if (wide[keys[i]]) w.classList.add("table-wrap--wide"); });
  }

  // First columns (round 3). Each first-column label is measured on one line, in em of the table's type. A label
  // up to LABEL_EM wide is marked is-label and never wraps (CSS), so the column is at least as wide as its longest
  // short label. A table that also has longer labels is marked has-long-labels: those wrap, and the column keeps at
  // least 9.5em for its text (CSS), so it never collapses to its longest word. 15.5em lies in the widest gap between
  // the labels of the guides: names reach 14.9em ("Advanced SSH & Web Terminal"), phrases start at 16.3em.
  var LABEL_EM = 15.5;
  function oneLine(cell) {
    var s = doc.createElement("span");
    s.style.cssText = "position:absolute;left:0;top:0;visibility:hidden;white-space:nowrap";
    s.innerHTML = cell.innerHTML;
    cell.appendChild(s);
    var w = s.getBoundingClientRect().width;
    cell.removeChild(s);
    return w;
  }
  function labelTables() {
    $$(".prose table").forEach(function (t) {
      var em = parseFloat(getComputedStyle(t).fontSize) || 16;
      var long = false;
      t.classList.remove("is-relieved");
      $$("tr > :first-child", t).forEach(function (c) {
        c.classList.remove("is-label");
        if (!c.textContent.trim()) return;
        if (oneLine(c) <= LABEL_EM * em) c.classList.add("is-label"); else long = true;
      });
      t.classList.toggle("has-long-labels", long);
    });
  }

  // Narrow tables (round 3 review). Whole labels must not cost more than they give. On tablets and small laptops
  // (640 to 1279 px) a table can be too narrow for its whole labels and for the paths and names in its other
  // columns: those then break in the middle. A table whose paths and names (code without spaces) break at fewer
  // places when its labels wrap lets them wrap, as in round 2. Every line a path runs onto counts, in every column,
  // so that a first column of paths never shrinks to a few characters. Series keep the rule (fitSeries sets their
  // columns). From 1280 px, where wide tables also take the margin, whole labels always stay.
  function codeBreaks(t) {
    var n = 0;
    $$("td code, th code", t).forEach(function (c) {
      var s = c.textContent.trim();
      if (!s || /\s/.test(s)) return;
      var r = doc.createRange(), tops = [];
      r.selectNodeContents(c); // the text itself: a code box that starts at the end of a line is not a break
      Array.prototype.forEach.call(r.getClientRects(), function (x) {
        var top = Math.round(x.top);
        if (x.width >= 1 && tops.indexOf(top) < 0) tops.push(top);
      });
      n += Math.max(0, tops.length - 1);
    });
    return n;
  }
  function relieveTables() {
    if (!tableQuery || !tableQuery.matches || (wideQuery && wideQuery.matches)) return;
    var count = {};
    var ts = $$(".prose table").filter(function (t) { return !t.closest(".callout"); });
    ts.forEach(function (t) { var sig = headerSig(t); if (sig) count[sig] = (count[sig] || 0) + 1; });
    ts.forEach(function (t) {
      if (count[headerSig(t)] > 1) return;
      var labels = $$("tr > .is-label", t);
      if (!labels.length) return;
      var whole = codeBreaks(t);
      if (!whole) return;
      var long = t.classList.contains("has-long-labels");
      labels.forEach(function (c) { c.classList.remove("is-label"); });
      t.classList.remove("has-long-labels");
      if (codeBreaks(t) < whole) { t.classList.add("is-relieved"); return; }
      labels.forEach(function (c) { c.classList.add("is-label"); });
      t.classList.toggle("has-long-labels", long);
    });
  }

  // Tables with the same header row (the eleven BIOS menus of the Wyse chapter) share their column widths, so they
  // read as one series. All their rows are laid out together in a hidden table, with the first-column rule, at the
  // width the series takes (as wide as it needs, at least the text column, no wider than its place), and every
  // table of the series takes those widths (round 3; round 2 measured once, from the tables as first laid out).
  // When the series has long labels, its first column is set to the floor of the rule: its longest short label,
  // and at least 9.5em, so that the long labels of one table (lists of settings) wrap instead of widening the
  // first column of all of them; the other columns share the rest as the browser lays them out.
  function minContent(cell) {
    var s = doc.createElement("span");
    s.style.cssText = "position:absolute;left:0;top:0;visibility:hidden;display:inline-block;width:min-content";
    s.innerHTML = cell.innerHTML;
    cell.appendChild(s);
    var w = s.getBoundingClientRect().width;
    cell.removeChild(s);
    return w;
  }
  function firstFloor(t) { // px, padding included; 0 when every label is short (they keep their own width)
    if (!t.classList.contains("has-long-labels")) return 0;
    var em = parseFloat(getComputedStyle(t).fontSize) || 16;
    var rem = parseFloat(getComputedStyle(root).fontSize) || 16;
    var f = 9.5 * em;
    $$("tr > :first-child", t).forEach(function (c) {
      if (!c.textContent.trim()) return;
      f = Math.max(f, c.classList.contains("is-label") ? oneLine(c) : minContent(c));
    });
    return Math.ceil(f + .9 * rem + 1);
  }
  function unfix(t) {
    $$("colgroup[data-series]", t).forEach(function (g) { g.parentNode.removeChild(g); });
    t.classList.remove("is-series");
    t.style.tableLayout = "";
    t.style.width = "";
  }
  function fitSeries() {
    var groups = {};
    $$(".prose table").forEach(function (t) {
      unfix(t);
      var sig = headerSig(t);
      if (sig && !t.closest(".callout")) (groups[sig] = groups[sig] || []).push(t);
    });
    if (!tableQuery || !tableQuery.matches) return;
    Object.keys(groups).forEach(function (sig) {
      var ts = groups[sig];
      if (ts.length < 2) return;
      var first = ts[0], wrap = first.parentNode;
      var place = wrap.clientWidth;
      var p = wrap.parentNode, ps = getComputedStyle(p);
      var col = p.clientWidth - (parseFloat(ps.paddingLeft) || 0) - (parseFloat(ps.paddingRight) || 0);
      var all = first.cloneNode(false);
      all.removeAttribute("id");
      if (first.tHead) all.appendChild(first.tHead.cloneNode(true));
      var body = doc.createElement("tbody");
      ts.forEach(function (t) { $$("tbody tr", t).forEach(function (tr) { body.appendChild(tr.cloneNode(true)); }); });
      all.appendChild(body);
      all.classList.toggle("has-long-labels", ts.some(function (t) { return t.classList.contains("has-long-labels"); }));
      all.style.cssText = "position:absolute;left:0;top:0;visibility:hidden;table-layout:auto;min-width:0;width:max-content";
      wrap.appendChild(all);
      var floor = firstFloor(all);
      var head = all.tHead && all.tHead.rows[0] && all.tHead.rows[0].cells[0];
      if (floor && head) head.style.width = floor + "px"; // a set width makes the column exactly that wide
      var w = wrap.classList.contains("table-wrap--wide") ? Math.min(Math.max(all.getBoundingClientRect().width, col), place) : place;
      all.style.width = w + "px";
      var row = all.tHead ? all.tHead.rows[0] : all.rows[0];
      var widths = Array.prototype.map.call(row.cells, function (c) { return c.getBoundingClientRect().width; });
      var total = all.getBoundingClientRect().width;
      var em = parseFloat(getComputedStyle(all).fontSize) || 16;
      wrap.removeChild(all);
      if (!total || !place) return;
      ts.forEach(function (t) {
        var g = doc.createElement("colgroup");
        g.setAttribute("data-series", "");
        widths.forEach(function (cw, i) {
          var c = doc.createElement("col");
          c.style.width = (100 * cw / total).toFixed(3) + "%";
          // On paper the series stays aligned: every column but the last keeps its width in em (with room for
          // the padding, which is in rem), and the last takes the rest of the page (CSS, print).
          if (i < widths.length - 1) c.style.setProperty("--print-w", (cw / em + .4).toFixed(2) + "em");
          g.appendChild(c);
        });
        t.insertBefore(g, t.firstChild);
        t.classList.add("is-series");
        t.style.tableLayout = "fixed";
        t.style.width = (100 * total / place).toFixed(3) + "%"; // a fixed layout needs a set width
      });
    });
  }

  // Labels for tables that reflow into rows on phones
  $$(".prose table").forEach(function (t) {
    var ths = $$("thead th", t);
    if (ths.length < 3) return;
    var labels = ths.map(function (th) { return th.textContent.trim(); });
    $$("tbody tr", t).forEach(function (tr) {
      Array.prototype.forEach.call(tr.children, function (td, i) {
        if (labels[i]) td.setAttribute("data-label", labels[i]);
      });
    });
    t.classList.add("is-reflow");
  });

  // A table is a focusable, labelled scroll region only while it is wider than the column; otherwise the
  // region would add a tab stop and an unnamed landmark for nothing. The label names the section it is in.
  function tableRegions() {
    $$(".table-wrap").forEach(function (w) {
      if (w.scrollWidth <= w.clientWidth + 1) {
        ["tabindex", "role", "aria-label"].forEach(function (a) { w.removeAttribute(a); });
        return;
      }
      var h = w.previousElementSibling;
      while (h && !/^H[2-4]$/.test(h.tagName)) h = h.previousElementSibling;
      w.setAttribute("tabindex", "0");
      w.setAttribute("role", "region");
      w.setAttribute("aria-label", h ? "Table: " + h.textContent.replace(/\s+/g, " ").trim() : "Table");
    });
  }

  // ---------- Footnotes as sidenotes ----------
  if (prose) {
    var footnotes = $(".footnotes", prose);
    var made = 0, noted = {};
    $$("sup[id^='fnref'] a[href^='#fn']", prose).forEach(function (ref) {
      var id = decodeURIComponent(ref.getAttribute("href").slice(1));
      var li = doc.getElementById(id);
      if (!li || noted[id]) return; // a footnote cited twice is set in the margin once, at its first reference
      noted[id] = true;
      var block = ref.closest("[data-prose] > *");
      if (!block) return;
      var note = doc.createElement("aside");
      note.className = "sidenote";
      note.setAttribute("aria-hidden", "true"); // the footnote itself stays in the document for assistive technology
      var body = li.cloneNode(true);
      $$(".footnote-backref", body).forEach(function (b) { b.remove(); });
      note.innerHTML = '<span class="sidenote__no">' + esc(ref.textContent) + "</span>" + body.innerHTML.replace(/^\s*<p>/, "").replace(/<\/p>\s*$/, "");
      note._ref = ref;
      // a listing in the footnote came over with a Copy button that has no handler: give it a working one
      $$(".codeblock__copy", note).forEach(function (b) { b.parentNode.removeChild(b); });
      block.parentNode.insertBefore(note, block.nextSibling);
      if (window.addCopyButtons) window.addCopyButtons(note);
      made++;
    });
    if (footnotes && made) footnotes.classList.add("has-sidenotes");
  }

  // ---------- Margin notes ----------
  // From 1280 px short notes (and notes marked "margin" in the Markdown) float in the right margin, and every
  // footnote is repeated there as a sidenote. A float starts where the note sits in the text, after the block it
  // comments on; it is moved to start level with that block (a sidenote level with its reference), and below the
  // note before it, 1rem apart. The margin note wins (round 3): a listing, wide table or diagram that would cross
  // the margin beside it yields and stays in the text column, where a listing scrolls inside if its lines are
  // longer and a table wraps. Only those that overlap a note's height (with 1rem to spare above and below) yield;
  // all others keep crossing the margin. Floats in the margin never move the text.
  var wideQuery = window.matchMedia ? window.matchMedia("(min-width: 80rem)") : null;
  // Every margin note and sidenote in the order of the text, also a note inside a list item: its float lands in the
  // same margin (lists have no right padding), so it is placed by the same rule (verification of round 3; until then
  // such a note floated unplaced and a listing beside it could cover it).
  function marginNotes() {
    return prose ? $$(".callout--margin, .sidenote", prose).filter(function (n) { return !n.parentNode.closest(".callout, table"); }) : [];
  }
  function crossing() { // what crosses the margin; a note or a Caution panel keeps its listings, tables and diagrams in its tinted box (round 4)
    return prose ? $$(".codeblock, pre.mermaid, .diagram__scroll, .table-wrap--wide", prose).filter(function (el) { return !el.closest(".callout--note, .callout--warning"); }) : [];
  }
  function resetNotes() {
    marginNotes().forEach(function (n) { n.style.marginTop = ""; });
    $$(".is-yielding").forEach(function (el) { el.classList.remove("is-yielding"); });
  }
  function yieldTo(el) {
    el.classList.add("is-yielding");
    var t = el.classList.contains("table-wrap--wide") && el.querySelector("table");
    if (t) unfix(t); // a table of a series leaves the shared widths: in the column it is narrower than the rest anyway
  }
  function alignNotes() {
    var notes = marginNotes();
    if (!notes.length || !wideQuery || !wideQuery.matches) return;
    var wide = crossing();
    var space = parseFloat(getComputedStyle(root).fontSize) || 16; // 1rem
    var lastBottom = -Infinity;
    notes.forEach(function (n) {
      if (getComputedStyle(n).float === "none") return;
      var anchor = n._ref || n.previousElementSibling;
      while (anchor && !n._ref && anchor.matches(".callout--margin, .sidenote")) anchor = anchor.previousElementSibling;
      // a note that opens a list item, or follows only inline text in it, goes level with the item
      if (!n._ref && n.parentNode !== prose && (!anchor || /^inline/.test(getComputedStyle(anchor).display))) anchor = n.parentNode;
      var t = 0;
      // where the note goes, and what yields to it; a table that yields may grow taller, so measure again
      for (var pass = 0; pass < 8; pass++) {
        var y = window.pageYOffset || 0;
        var box = n.getBoundingClientRect();
        t = Math.max((anchor ? anchor.getBoundingClientRect().top : box.top) + y, lastBottom + space);
        var hit = wide.filter(function (el) {
          if (el.classList.contains("is-yielding")) return false;
          var r = el.getBoundingClientRect();
          return t < r.bottom + y + space && t + box.height > r.top + y - space;
        });
        if (!hit.length) break;
        hit.forEach(yieldTo);
      }
      var natural = n.getBoundingClientRect().top + (window.pageYOffset || 0);
      if (Math.abs(t - natural) > 0.5) {
        var mt = parseFloat(getComputedStyle(n).marginTop) || 0;
        n.style.marginTop = (mt + (t - natural)) + "px";
      }
      lastBottom = n.getBoundingClientRect().bottom + (window.pageYOffset || 0);
    });
  }

  // ---------- Layout ----------
  // Wide tables, first columns, narrow tables, series, margin notes and scroll regions, in that order (each depends
  // on the one before). Again after the web fonts load (labels and notes change size), when images have loaded, and on resize.
  function layout() {
    if (prose) {
      resetNotes();
      classifyTables();
      labelTables();
      relieveTables();
      fitSeries();
      alignNotes();
    }
    tableRegions();
    shadeListings();
  }
  layout();
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(layout);
  window.addEventListener("load", layout);

  // ---------- Listings with line roles (round 7, DESIGN.md 20) ----------
  // The hook marks commands, explanations, output and files (render-codeblock.html), set as panels or, with
  // params.code = "session", as a terminal session. Their Copy button copies what can be run: commands, file
  // contents and explanations (still "# " comments), never output.
  window.codeText = function (block) {
    if (!block.hasAttribute("data-roles")) return null;
    var text = $$(".line", block).filter(function (l) { return /\br-(cmd|here|com|blank)\b/.test(l.className); })
      .map(function (l) { return l.textContent.replace(/\n$/, ""); }).join("\n").replace(/^\n+|\n+$/g, "");
    return text || null; // a listing with nothing to run copies as it always did
  };
  // The output boxes of panels cover the shading that shows a listing scrolls sideways (handbook.css draws it from
  // the listing's background), so the CSS draws it again on top, from these two classes. layout() runs it again.
  function scrollShade(pre) {
    var block = pre.closest(".codeblock"), max = pre.scrollWidth - pre.clientWidth;
    block.classList.toggle("is-more-left", pre.scrollLeft > 1);
    block.classList.toggle("is-more-right", max > 1 && pre.scrollLeft < max - 1);
  }
  function shadeListings() { $$(".codeblock[data-roles] pre").forEach(scrollShade); }
  $$(".codeblock[data-roles] pre").forEach(function (pre) {
    pre.addEventListener("scroll", function () { scrollShade(pre); }, { passive: true });
  });
  var lt = 0, lastW = window.innerWidth;
  window.addEventListener("resize", function () {
    if (window.innerWidth === lastW) return; // phones resize the height as their toolbars come and go; nothing here depends on it
    lastW = window.innerWidth;
    clearTimeout(lt);
    lt = setTimeout(layout, 150);
  }, { passive: true });
  // Mermaid draws a diagram after the page has loaded; when that changes its height, the notes below move with it
  var diagrams = prose ? $$("pre.mermaid", prose) : [];
  if (diagrams.length && window.ResizeObserver) {
    var heights = diagrams.map(function (d) { return d.offsetHeight; }).join();
    var drawn = new ResizeObserver(function () {
      var h = diagrams.map(function (d) { return d.offsetHeight; }).join();
      if (h === heights) return;
      heights = h;
      clearTimeout(lt);
      lt = setTimeout(layout, 150);
    });
    diagrams.forEach(function (d) { drawn.observe(d); });
  }
})();
