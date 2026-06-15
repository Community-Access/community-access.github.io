(function () {
  'use strict';

  var MARKETPLACE_URL = 'https://raw.githubusercontent.com/Community-Access/accessibility-agents-marketplace/main/marketplace.json';
  var RAW_BASE = 'https://raw.githubusercontent.com/Community-Access/accessibility-agents-marketplace/main/';
  var REPO_URL = "https://github.com/Community-Access/accessibility-agents-marketplace";

  function cacheBust(url) {
    var separator = url.indexOf("?") === -1 ? "?" : "&";
    return url + separator + "cache=" + Math.floor(Date.now() / 300000);
  }

  var state = {
    catalog: null,
    extensions: [],
    query: '',
    domain: 'all',
    status: 'all',
    selectedName: ''
  };

  var list = document.getElementById('extensions-list');
  var detail = document.getElementById('extension-detail');
  var status = document.getElementById('extension-results-status');
  var search = document.getElementById('extension-search');
  var domainFilter = document.getElementById('domain-filter');
  var statusFilter = document.getElementById('status-filter');

  if (!list || !detail || !status || !search || !domainFilter || !statusFilter) return;

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
    });
  }

  function normalize(value) {
    return String(value || '').toLowerCase();
  }

  function uniqueSorted(values) {
    var seen = {};
    values.forEach(function (value) {
      if (value) seen[value] = true;
    });
    return Object.keys(seen).sort(function (a, b) { return a.localeCompare(b); });
  }

  function extensionDomains(extension) {
    return extension.domains || extension.manifestDomains || [];
  }

  function extensionText(extension) {
    return [
      extension.name,
      extension.displayName,
      extension.author,
      extension.description,
      extension.status,
      extension.visibility,
      extensionDomains(extension).join(' ')
    ].join(' ');
  }

  function hydrateListing(extension) {
    var hydrated = Object.assign({}, extension);
    if (!hydrated.domains) hydrated.domains = [];
    if (!hydrated.displayName) hydrated.displayName = hydrated.name;
    if (!hydrated.status) hydrated.status = 'community';
    if (!hydrated.visibility) hydrated.visibility = 'public';
    return hydrated;
  }

  function populateFilters() {
    var domains = [];
    var statuses = [];
    state.extensions.forEach(function (extension) {
      domains = domains.concat(extensionDomains(extension));
      statuses.push(extension.status);
    });

    domainFilter.innerHTML = '<option value="all">All domains</option>' + uniqueSorted(domains).map(function (domain) {
      return '<option value="' + escapeHtml(domain) + '">' + escapeHtml(domain) + '</option>';
    }).join('');

    statusFilter.innerHTML = '<option value="all">All statuses</option>' + uniqueSorted(statuses).map(function (item) {
      return '<option value="' + escapeHtml(item) + '">' + escapeHtml(item) + '</option>';
    }).join('');
  }

  function filteredExtensions() {
    return state.extensions.filter(function (extension) {
      var matchesQuery = !state.query || normalize(extensionText(extension)).indexOf(state.query) !== -1;
      var matchesDomain = state.domain === 'all' || extensionDomains(extension).indexOf(state.domain) !== -1;
      var matchesStatus = state.status === 'all' || extension.status === state.status;
      return matchesQuery && matchesDomain && matchesStatus;
    });
  }

  function sourceUrl(extension) {
    if (extension.repository) return extension.repository;
    if (extension.source && extension.source.repository) return extension.source.repository;
    return '';
  }

  function manifestUrl(extension) {
    if (extension.localPath) return cacheBust(RAW_BASE + extension.localPath);
    if (extension.source && extension.source.repository && extension.source.path) {
      return cacheBust(extension.source.repository.replace("github.com/", "raw.githubusercontent.com/") + "/main/" + extension.source.path);
    }
    return '';
  }

  function renderCard(extension) {
    var selected = extension.name === state.selectedName;
    var domains = extensionDomains(extension).map(function (domain) {
      return '<span class="extension-chip">' + escapeHtml(domain) + '</span>';
    }).join('');
    return '<article class="extension-card' + (selected ? ' selected' : '') + '">' +
      '<div class="extension-card-header">' +
        '<h3><a class="extension-select" href="#extension=' + encodeURIComponent(extension.name) + '" data-extension="' + escapeHtml(extension.name) + '">' + escapeHtml(extension.displayName || extension.name) + '</a></h3>' +
        '<span class="extension-status">' + escapeHtml(extension.status || 'community') + '</span>' +
      '</div>' +
      '<p>' + escapeHtml(extension.description || 'No description provided.') + '</p>' +
      '<dl class="extension-meta">' +
        '<div><dt>Author</dt><dd>' + escapeHtml(extension.author || 'Unknown') + '</dd></div>' +
        '<div><dt>Visibility</dt><dd>' + escapeHtml(extension.visibility || 'public') + '</dd></div>' +
      '</dl>' +
      '<div class="extension-chips">' + domains + '</div>' +
    '</article>';
  }

  function renderList() {
    var results = filteredExtensions();
    if (results.length === 0) {
      list.innerHTML = '<p class="marketplace-empty">No extensions match the current filters.</p>';
      status.textContent = 'No extensions found.';
      return;
    }
    list.innerHTML = results.map(renderCard).join('');
    status.textContent = results.length + ' extension' + (results.length === 1 ? '' : 's') + ' shown.';
  }

  function selectedExtension() {
    return state.extensions.find(function (extension) { return extension.name === state.selectedName; }) || state.extensions[0];
  }

  function renderExtensionDetail(extension, manifest) {
    if (!extension) {
      detail.innerHTML = '<h3 id="extension-detail-heading">Extension Details</h3><p>Select an extension to view its metadata, source links, and review status.</p>';
      return;
    }
    var domains = extensionDomains(extension).map(function (domain) {
      return '<span class="extension-chip">' + escapeHtml(domain) + '</span>';
    }).join('');
    var repo = sourceUrl(extension);
    var manifestLink = manifestUrl(extension);
    var agentCount = manifest && Array.isArray(manifest.agents) ? manifest.agents.length : null;
    detail.innerHTML = '<h3 id="extension-detail-heading">' + escapeHtml(extension.displayName || extension.name) + '</h3>' +
      '<p>' + escapeHtml(extension.description || 'No description provided.') + '</p>' +
      '<dl class="extension-detail-list">' +
        '<div><dt>Name</dt><dd><code>' + escapeHtml(extension.name) + '</code></dd></div>' +
        '<div><dt>Author</dt><dd>' + escapeHtml(extension.author || 'Unknown') + '</dd></div>' +
        '<div><dt>Status</dt><dd>' + escapeHtml(extension.status || 'community') + '</dd></div>' +
        '<div><dt>Visibility</dt><dd>' + escapeHtml(extension.visibility || 'public') + '</dd></div>' +
        (agentCount === null ? '' : '<div><dt>Agents</dt><dd>' + agentCount + '</dd></div>') +
      '</dl>' +
      '<div class="extension-chips">' + domains + '</div>' +
      '<div class="extension-actions">' +
        (repo ? '<a class="btn btn-outline" href="' + escapeHtml(repo) + '">GitHub Repository</a>' : '') +
        (manifestLink ? '<a class="btn btn-outline" href="' + escapeHtml(manifestLink) + '">View Manifest</a>' : '') +
        '<a class="btn btn-primary" href="' + REPO_URL + '/pulls">Submit or Review PRs</a>' +
      '</div>';
  }

  function loadManifest(extension) {
    var url = manifestUrl(extension);
    if (!url) {
      renderExtensionDetail(extension, null);
      return;
    }
    fetch(url, { cache: "no-store" }).then(function (response) {
      if (!response.ok) throw new Error('Manifest failed');
      return response.json();
    }).then(function (manifest) {
      renderExtensionDetail(extension, manifest);
    }).catch(function () {
      renderExtensionDetail(extension, null);
    });
  }

  function selectExtension(name, moveFocus) {
    state.selectedName = name;
    var extension = selectedExtension();
    if (!extension) return;
    if (location.hash !== '#extension=' + encodeURIComponent(extension.name)) {
      history.replaceState(null, '', '#extension=' + encodeURIComponent(extension.name));
    }
    renderList();
    loadManifest(extension);
    if (moveFocus) detail.focus();
  }

  function bindHashChanges() {
    window.addEventListener('hashchange', function () {
      var name = initialSelection();
      if (name) selectExtension(name, true);
    });
  }

  function bindFilters() {
    search.addEventListener('input', function () {
      state.query = normalize(search.value.trim());
      renderList();
    });
    domainFilter.addEventListener('change', function () {
      state.domain = domainFilter.value;
      renderList();
    });
    statusFilter.addEventListener('change', function () {
      state.status = statusFilter.value;
      renderList();
    });
  }

  function initialSelection() {
    var match = location.hash.match(/^#extension=(.+)$/);
    if (match) {
      var name = decodeURIComponent(match[1]);
      if (state.extensions.some(function (extension) { return extension.name === name; })) return name;
    }
    return state.extensions[0] ? state.extensions[0].name : '';
  }

  function loadMarketplace() {
    fetch(cacheBust(MARKETPLACE_URL), { cache: "no-store" }).then(function (response) {
      if (!response.ok) throw new Error('Marketplace failed');
      return response.json();
    }).then(function (catalog) {
      state.catalog = catalog;
      state.extensions = (catalog.extensions || []).map(hydrateListing);
      populateFilters();
      state.selectedName = initialSelection();
      renderList();
      loadManifest(selectedExtension());
    }).catch(function () {
      status.textContent = 'The live marketplace could not be loaded. Use the GitHub repository link to browse extensions.';
      list.innerHTML = '<p class="marketplace-empty">Unable to load the marketplace catalog from GitHub.</p>';
      detail.innerHTML = '<h3 id="extension-detail-heading">Marketplace Unavailable</h3><p>The live catalog could not be loaded from GitHub. You can still browse the repository directly.</p><p><a class="btn btn-primary" href="' + REPO_URL + '">Open Marketplace Repository</a></p>';
    });
  }

  bindHashChanges();
  bindFilters();
  loadMarketplace();
})();
