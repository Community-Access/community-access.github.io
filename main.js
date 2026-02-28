(function () {
  'use strict';
  var dropdown = document.querySelector('.nav-dropdown');
  var toggle = dropdown.querySelector('.nav-dropdown-toggle');
  var menu = dropdown.querySelector('.nav-dropdown-menu');

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    menu.classList.add('open');
    var first = menu.querySelector('a');
    if (first) first.focus();
  }

  function closeMenu(returnFocus) {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    if (returnFocus) toggle.focus();
  }

  toggle.addEventListener('click', function () {
    if (toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu(true);
    } else {
      openMenu();
    }
  });

  toggle.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      openMenu();
    }
  });

  menu.addEventListener('keydown', function (e) {
    var links = menu.querySelectorAll('a');
    var idx = Array.prototype.indexOf.call(links, document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (idx < links.length - 1) links[idx + 1].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (idx > 0) links[idx - 1].focus();
      else toggle.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      links[0].focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      links[links.length - 1].focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu(true);
    }
  });

  document.addEventListener('click', function (e) {
    if (!dropdown.contains(e.target)) {
      closeMenu(false);
    }
  });
})();

/* === Copy Buttons === */
(function () {
  'use strict';
  var copyStatus = document.getElementById('copy-status');
  document.querySelectorAll('.copy-btn').forEach(function(btn) {
    var originalLabel = btn.getAttribute('aria-label');
    btn.addEventListener('click', function() {
      var target = document.getElementById(btn.getAttribute('data-target'));
      var text = target ? target.textContent : '';
      navigator.clipboard.writeText(text).then(function() {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        btn.setAttribute('aria-label', originalLabel.replace(/^Copy\b/, 'Copied'));
        if (copyStatus) copyStatus.textContent = 'Command copied to clipboard';
        setTimeout(function() {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
          btn.setAttribute('aria-label', originalLabel);
          if (copyStatus) copyStatus.textContent = '';
        }, 2000);
      }).catch(function() {
        btn.textContent = 'Failed';
        setTimeout(function() {
          btn.textContent = 'Copy';
        }, 2000);
      });
    });
  });
})();

/* === Back to Top === */
(function () {
  'use strict';
  var btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 600) {
        btt.classList.add('visible');
      } else {
        btt.classList.remove('visible');
      }
    }, { passive: true });
    btt.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      var skip = document.querySelector('.skip-link');
      if (skip) {
        setTimeout(function () { skip.focus(); }, 300);
      }
    });
  }
})();

/* === Expand / Collapse All === */
(function () {
  'use strict';
  var expandBtn = document.getElementById('expand-all');
  var collapseBtn = document.getElementById('collapse-all');

  function getAllAccordions() {
    return document.querySelectorAll('.accordion-group details, .faq-list details');
  }

  if (expandBtn) {
    expandBtn.addEventListener('click', function () {
      getAllAccordions().forEach(function (d) { d.open = true; });
    });
  }
  if (collapseBtn) {
    collapseBtn.addEventListener('click', function () {
      getAllAccordions().forEach(function (d) { d.open = false; });
    });
  }
})();

/* === Search / Filter === */
(function () {
  'use strict';
  var searchInput = document.getElementById('agent-search');
  var searchStatus = document.getElementById('search-status');

  if (searchInput) {
    var debounceTimer;
    searchInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(filterAccordions, 200);
    });
  }

  function filterAccordions() {
    var query = searchInput.value.trim().toLowerCase();
    var visibleCount = 0;
    var totalCount = 0;

    var groups = document.querySelectorAll('.accordion-group');
    groups.forEach(function (group) {
      var details = group.querySelectorAll(':scope > details');
      details.forEach(function (det) {
        var rows = det.querySelectorAll('.agent-table tr:not(.method-row), .agent-table tbody tr:not(.method-row)');

        if (!query) {
          det.style.display = '';
          rows.forEach(function (r) { r.style.display = ''; });
          return;
        }

        var groupHasMatch = false;
        rows.forEach(function (row) {
          var text = row.textContent.toLowerCase();
          totalCount++;
          if (text.indexOf(query) !== -1) {
            row.style.display = '';
            groupHasMatch = true;
            visibleCount++;
          } else {
            row.style.display = 'none';
          }
        });

        var summaryText = det.querySelector('summary').textContent.toLowerCase();
        if (summaryText.indexOf(query) !== -1) groupHasMatch = true;

        var bodyPs = det.querySelectorAll('.accordion-body > p');
        bodyPs.forEach(function (p) {
          if (p.textContent.toLowerCase().indexOf(query) !== -1) groupHasMatch = true;
        });

        if (groupHasMatch) {
          det.style.display = '';
          det.open = true;
        } else {
          det.style.display = 'none';
        }
      });
    });

    var faqs = document.querySelectorAll('.faq-list details');
    faqs.forEach(function (faq) {
      if (!query) {
        faq.style.display = '';
        return;
      }
      var text = faq.textContent.toLowerCase();
      if (text.indexOf(query) !== -1) {
        faq.style.display = '';
      } else {
        faq.style.display = 'none';
      }
    });

    if (searchStatus) {
      if (!query) {
        searchStatus.textContent = '';
      } else if (visibleCount > 0) {
        searchStatus.textContent = visibleCount + ' result' + (visibleCount !== 1 ? 's' : '') + ' found.';
      } else {
        searchStatus.textContent = 'No results found for \u201C' + searchInput.value.trim() + '\u201D.';
      }
    }
  }
})();

/* === Scroll Spy === */
(function () {
  'use strict';
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.header-nav a[href^="#"], .nav-dropdown-menu a[href^="#"]');

  function updateScrollSpy() {
    var scrollPos = window.scrollY + 120;
    var currentId = '';

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === '#' + currentId) {
        link.classList.add('nav-active');
        link.setAttribute('aria-current', 'location');
      } else {
        link.classList.remove('nav-active');
        link.removeAttribute('aria-current');
      }
    });

    var dropdownToggle = document.querySelector('.nav-dropdown-toggle');
    var dropdownLinks = document.querySelectorAll('.nav-dropdown-menu a[href^="#"]');
    var anyDropdownActive = false;
    dropdownLinks.forEach(function (dl) {
      if (dl.classList.contains('nav-active')) anyDropdownActive = true;
    });
    if (anyDropdownActive) {
      dropdownToggle.classList.add('nav-active');
    } else {
      dropdownToggle.classList.remove('nav-active');
    }
  }

  var scrollSpyTimer;
  window.addEventListener('scroll', function () {
    cancelAnimationFrame(scrollSpyTimer);
    scrollSpyTimer = requestAnimationFrame(updateScrollSpy);
  }, { passive: true });
  updateScrollSpy();
})();

/* === Contributors from GitHub API === */
(function () {
  'use strict';
  var ORG = 'Community-Access';
  var BOTS = ['github-actions[bot]', 'actions-user', 'Copilot', 'opencode-agent[bot]', 'dependabot[bot]'];
  var ISSUE_REPOS = ['accessibility-agents', 'community-access.github.io', 'git-going-with-github'];
  var grid = document.getElementById('contributors-grid');
  var thanksGrid = document.getElementById('thanks-grid');

  function isBotLogin(login) {
    return BOTS.indexOf(login) !== -1 || login.indexOf('[bot]') !== -1;
  }

  function renderCard(c, label) {
    return '<div role="listitem">' +
      '<a href="' + c.url + '" class="contributor-card" target="_blank" rel="noopener noreferrer">' +
      '<img class="contributor-avatar" src="' + c.avatar + '&s=128" alt="" width="64" height="64" loading="lazy">' +
      '<span class="contributor-name">' + c.login + '</span>' +
      '<span class="contributor-contributions">' + label + '</span>' +
      '<span class="sr-only">, GitHub profile (opens in new tab)</span></a></div>';
  }

  // Fetch code contributors from non-fork repos
  var codeContributorLogins = {};
  var codePromise = grid ? fetch('https://api.github.com/orgs/' + ORG + '/repos?per_page=100')
    .then(function (r) { return r.json(); })
    .then(function (repos) {
      var ownRepos = repos.filter(function (repo) { return !repo.fork; });
      return Promise.all(ownRepos.map(function (repo) {
        return fetch('https://api.github.com/repos/' + repo.full_name + '/contributors?per_page=100')
          .then(function (r) { return r.json(); })
          .catch(function () { return []; });
      }));
    })
    .then(function (results) {
      var map = {};
      results.forEach(function (contributors) {
        if (!Array.isArray(contributors)) return;
        contributors.forEach(function (c) {
          if (!c.login || isBotLogin(c.login)) return;
          if (c.type && c.type !== 'User') return;
          if (map[c.login]) {
            map[c.login].contributions += c.contributions;
          } else {
            map[c.login] = { login: c.login, avatar: c.avatar_url, url: c.html_url, contributions: c.contributions };
          }
        });
      });
      var list = Object.keys(map).map(function (k) { return map[k]; });
      list.sort(function (a, b) { return b.contributions - a.contributions; });
      list.forEach(function (c) { codeContributorLogins[c.login] = true; });

      if (list.length === 0) {
        grid.innerHTML = '<p class="contributors-loading">No contributors found.</p>';
      } else {
        var html = '';
        list.forEach(function (c) {
          html += renderCard(c, c.contributions + ' contribution' + (c.contributions !== 1 ? 's' : ''));
        });
        grid.innerHTML = html;
      }
    })
    .catch(function () {
      grid.innerHTML = '<p class="contributors-loading">Unable to load contributors.</p>';
    }) : Promise.resolve();

  // Fetch issue creators from specific repos
  if (thanksGrid) {
    codePromise.then(function () {
      var fetches = ISSUE_REPOS.map(function (repo) {
        return fetch('https://api.github.com/repos/' + ORG + '/' + repo + '/issues?state=all&per_page=100')
          .then(function (r) { return r.json(); })
          .catch(function () { return []; });
      });
      return Promise.all(fetches);
    })
    .then(function (results) {
      var map = {};
      results.forEach(function (issues) {
        if (!Array.isArray(issues)) return;
        issues.forEach(function (issue) {
          var u = issue.user;
          if (!u || !u.login || isBotLogin(u.login)) return;
          if (codeContributorLogins[u.login]) return;
          if (map[u.login]) {
            map[u.login].issues += 1;
          } else {
            map[u.login] = { login: u.login, avatar: u.avatar_url, url: u.html_url, issues: 1 };
          }
        });
      });
      var list = Object.keys(map).map(function (k) { return map[k]; });
      list.sort(function (a, b) { return b.issues - a.issues; });

      if (list.length === 0) {
        thanksGrid.innerHTML = '<p class="contributors-loading">No issue contributors found.</p>';
      } else {
        var html = '';
        list.forEach(function (c) {
          html += renderCard(c, c.issues + ' issue' + (c.issues !== 1 ? 's' : ''));
        });
        thanksGrid.innerHTML = html;
      }
    })
    .catch(function () {
      thanksGrid.innerHTML = '<p class="contributors-loading">Unable to load issue contributors.</p>';
    });
  }
})();

/* === Latest News Feed === */
(function () {
  'use strict';
  var ORG = 'Community-Access';

  function formatDate(dateStr) {
    var d = new Date(dateStr + 'T12:00:00');
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  function renderNews(items) {
    var el = document.getElementById('latest-news');
    if (!el || items.length === 0) {
      if (el) el.innerHTML = '<p style="text-align:center;color:var(--ca-gray-700);">No news yet.</p>';
      return;
    }
    var html = '<div class="news-grid">';
    items.forEach(function (item) {
      html += '<article class="news-card">';
      html += '<div class="news-card-meta">';
      html += '<time class="news-card-date" datetime="' + item.date + '">' + formatDate(item.date) + '</time>';
      if (item.type) html += '<span class="news-badge news-badge-type">' + item.type + '</span>';
      if (item.repo) html += '<span class="news-badge news-badge-repo">' + item.repo + '</span>';
      html += '</div>';
      html += '<h3 class="news-card-title"><a href="' + item.url + '">' + item.title + '</a></h3>';
      html += '<p class="news-card-summary">' + item.summary + '</p>';
      html += '</article>';
    });
    html += '</div>';
    el.innerHTML = html;
  }

  // Fetch manual posts from posts.json
  var postsPromise = fetch('posts/posts.json')
    .then(function (r) { return r.json(); })
    .then(function (posts) {
      return posts.map(function (p) {
        return { date: p.date, title: p.title, summary: p.summary, type: p.type || '', repo: '', url: 'news.html#post/' + p.slug };
      });
    })
    .catch(function () { return []; });

  // Fetch releases from all org repos
  var releasesPromise = fetch('https://api.github.com/orgs/' + ORG + '/repos?type=sources&per_page=100', {
      headers: { 'Accept': 'application/vnd.github+json' }
    })
    .then(function (r) { return r.json(); })
    .then(function (repos) {
      var fetches = repos
        .filter(function (r) { return !r.fork; })
        .map(function (repo) {
          return fetch('https://api.github.com/repos/' + repo.full_name + '/releases?per_page=5', {
            headers: { 'Accept': 'application/vnd.github+json' }
          })
          .then(function (r) { return r.json(); })
          .then(function (releases) {
            if (!Array.isArray(releases)) return [];
            return releases.map(function (rel) {
              var date = rel.published_at ? rel.published_at.slice(0, 10) : rel.created_at.slice(0, 10);
              var body = rel.body || '';
              var summary = body.length > 150 ? body.slice(0, 150) + '...' : body;
              summary = summary.replace(/[#*_`\[\]]/g, '').replace(/\n/g, ' ').trim();
              return { date: date, title: rel.name || rel.tag_name, summary: summary || 'New release published.', type: 'Release', repo: repo.name, url: rel.html_url };
            });
          })
          .catch(function () { return []; });
        });
      return Promise.all(fetches).then(function (results) {
        return results.reduce(function (acc, arr) { return acc.concat(arr); }, []);
      });
    })
    .catch(function () { return []; });

  Promise.all([postsPromise, releasesPromise])
    .then(function (results) {
      var posts = results[0];
      var releases = results[1];
      var postTitlesLower = posts.map(function (p) { return p.title.toLowerCase(); });
      releases = releases.filter(function (rel) {
        var t = rel.title.toLowerCase();
        return !postTitlesLower.some(function (pt) { return pt.indexOf(t) !== -1; });
      });
      var all = posts.concat(releases);
      all.sort(function (a, b) { return b.date.localeCompare(a.date); });
      renderNews(all.slice(0, 8));
    })
    .catch(function () {
      var el = document.getElementById('latest-news');
      if (el) el.innerHTML = '<p style="text-align:center;color:var(--ca-gray-700);">Unable to load news.</p>';
    });
})();

/* === Community Calendar === */
(function () {
  'use strict';

  var agenda = document.getElementById('cal-agenda');
  var monthLabel = document.getElementById('cal-month-label');
  var monthAnnounce = document.getElementById('cal-month-announce');
  var prevBtn = document.getElementById('cal-prev');
  var nextBtn = document.getElementById('cal-next');
  var exportAllEl = document.getElementById('cal-export-all');
  var exportIcsBtn = document.getElementById('cal-export-ics');
  var exportOutlookBtn = document.getElementById('cal-export-outlook');
  var countdownEl = document.getElementById('cal-countdown');
  var countdownText = document.getElementById('cal-countdown-text');

  if (!agenda || !monthLabel) return;

  var allEvents = [];
  var currentYear, currentMonth;
  var today = new Date();
  today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  var MONTH_NAMES = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  var DAY_NAMES = [
    'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'
  ];

  /* --- Format helpers --- */
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function dateStr(y, m, d) {
    return y + '-' + pad(m + 1) + '-' + pad(d);
  }

  function formatTime(timeStr) {
    var parts = timeStr.split(':');
    var h = parseInt(parts[0], 10);
    var m = parts[1];
    var suffix = h >= 12 ? 'PM' : 'AM';
    if (h === 0) h = 12;
    else if (h > 12) h -= 12;
    return h + ':' + m + ' ' + suffix;
  }

  function formatFullDate(y, m, d) {
    var dt = new Date(y, m, d);
    return DAY_NAMES[dt.getDay()] + ', ' + MONTH_NAMES[m] + ' ' + d + ', ' + y;
  }

  /* --- Recurrence expansion --- */
  function expandRecurrence(ev) {
    var rec = ev.recurrence;
    if (!rec) return [ev];

    var results = [ev];
    var start = new Date(ev.date + 'T12:00:00');
    var until = rec.until ? new Date(rec.until + 'T12:00:00') : new Date(start.getTime() + 365 * 24 * 60 * 60 * 1000);
    var interval = rec.interval || 1;
    var current = new Date(start);

    for (var i = 0; i < 52; i++) {
      if (rec.frequency === 'weekly') {
        current = new Date(current.getTime() + 7 * interval * 24 * 60 * 60 * 1000);
      } else if (rec.frequency === 'monthly') {
        current = new Date(current.getFullYear(), current.getMonth() + interval, current.getDate());
      } else if (rec.frequency === 'daily') {
        current = new Date(current.getTime() + interval * 24 * 60 * 60 * 1000);
      } else {
        break;
      }

      if (current > until) break;

      var copy = {};
      for (var k in ev) { if (ev.hasOwnProperty(k)) copy[k] = ev[k]; }
      copy.date = dateStr(current.getFullYear(), current.getMonth(), current.getDate());
      copy.uid = ev.uid + '-' + copy.date;
      copy.recurrence = null;
      results.push(copy);
    }

    return results;
  }

  /* --- Fetch events --- */
  function fetchEvents() {
    return fetch('events/events.json')
      .then(function (r) { return r.json(); })
      .then(function (events) {
        allEvents = [];
        events.forEach(function (ev) {
          var expanded = expandRecurrence(ev);
          allEvents = allEvents.concat(expanded);
        });
      })
      .catch(function () {
        allEvents = [];
      });
  }

  /* --- Get events for a month, grouped by date --- */
  function getMonthEvents(year, month) {
    var prefix = year + '-' + pad(month + 1);
    var matching = allEvents.filter(function (ev) {
      return ev.date.indexOf(prefix) === 0;
    });
    matching.sort(function (a, b) {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    });

    var grouped = [];
    var dateMap = {};
    matching.forEach(function (ev) {
      if (!dateMap[ev.date]) {
        dateMap[ev.date] = [];
        grouped.push(ev.date);
      }
      dateMap[ev.date].push(ev);
    });

    return { dates: grouped, byDate: dateMap };
  }

  /* --- Render agenda list --- */
  function renderAgenda(year, month, moveFocus) {
    currentYear = year;
    currentMonth = month;

    var label = MONTH_NAMES[month] + ' ' + year;
    monthLabel.textContent = label;
    if (monthAnnounce) monthAnnounce.textContent = label;

    var data = getMonthEvents(year, month);
    var todayStr = dateStr(today.getFullYear(), today.getMonth(), today.getDate());

    if (data.dates.length === 0) {
      agenda.innerHTML = '<p class="cal-agenda-empty">No events scheduled for ' + label + '.</p>';
      if (exportAllEl) exportAllEl.hidden = true;
      if (moveFocus) monthLabel.focus();
      return;
    }

    var html = '';

    data.dates.forEach(function (ds) {
      var parts = ds.split('-');
      var y = parseInt(parts[0], 10);
      var m = parseInt(parts[1], 10) - 1;
      var d = parseInt(parts[2], 10);
      var isToday = ds === todayStr;
      var events = data.byDate[ds];
      var dateLabel = formatFullDate(y, m, d);

      html += '<div class="cal-day-group">';
      html += '<h4 class="cal-day-heading' + (isToday ? ' cal-day-heading--today' : '') + '">';
      html += dateLabel;
      if (isToday) html += '<span class="cal-today-badge">Today</span>';
      html += '</h4>';

      events.forEach(function (ev) {
        html += '<article class="cal-event-card">';
        html += '<h5>';
        if (ev.url) {
          html += '<a href="' + ev.url + '">' + ev.title + '</a>';
        } else {
          html += ev.title;
        }
        html += '</h5>';
        html += '<div class="cal-event-meta">';
        html += '<span class="cal-event-type cal-event-type--' + ev.type + '">' + ev.type + '</span>';
        html += '<span>' + formatTime(ev.startTime) + ' – ' + formatTime(ev.endTime) + '</span>';
        if (ev.locationType) {
          html += '<span>' + (ev.locationType === 'virtual' ? 'Virtual' : 'In Person') + '</span>';
        }
        html += '</div>';
        html += '<p class="cal-event-description">' + ev.description + '</p>';
        html += '<div class="cal-event-subscribe">';
        html += '<a href="' + buildGoogleCalUrl(ev) + '" target="_blank" rel="noopener noreferrer" class="cal-subscribe-link" aria-label="Add ' + ev.title + ' to Google Calendar (opens in new tab)">Add to Google Calendar</a>';
        html += '<a href="' + buildOutlookUrl(ev) + '" target="_blank" rel="noopener noreferrer" class="cal-subscribe-link" aria-label="Add ' + ev.title + ' to Outlook (opens in new tab)">Add to Outlook</a>';
        html += '</div>';
        html += '</article>';
      });

      html += '</div>';
    });

    agenda.innerHTML = html;

    if (exportAllEl) exportAllEl.hidden = false;
    if (moveFocus) monthLabel.focus();
  }

  /* --- Subscribe URL builders --- */
  function toGoogleDate(ds, timeStr) {
    return ds.replace(/-/g, '') + 'T' + timeStr.replace(':', '') + '00';
  }

  function buildGoogleCalUrl(ev) {
    var start = toGoogleDate(ev.date, ev.startTime);
    var end = toGoogleDate(ev.date, ev.endTime);
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent(ev.title) +
      '&dates=' + start + '/' + end +
      '&ctz=' + encodeURIComponent(ev.timezone) +
      '&details=' + encodeURIComponent(ev.description) +
      (ev.location ? '&location=' + encodeURIComponent(ev.location) : '');
  }

  function buildOutlookUrl(ev) {
    var start = ev.date + 'T' + ev.startTime + ':00';
    var end = ev.date + 'T' + ev.endTime + ':00';
    return 'https://outlook.live.com/calendar/0/action/compose?rru=addevent' +
      '&subject=' + encodeURIComponent(ev.title) +
      '&startdt=' + encodeURIComponent(start) +
      '&enddt=' + encodeURIComponent(end) +
      '&body=' + encodeURIComponent(ev.description) +
      (ev.location ? '&location=' + encodeURIComponent(ev.location) : '');
  }

  /* --- ICS generation --- */
  function toICSDate(ds, timeStr) {
    var parts = ds.split('-');
    var timeParts = timeStr.split(':');
    return parts[0] + parts[1] + parts[2] + 'T' + timeParts[0] + timeParts[1] + '00';
  }

  function toUTCDate(ds, timeStr) {
    var parts = ds.split('-');
    var timeParts = timeStr.split(':');
    var d = new Date(Date.UTC(
      parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10),
      parseInt(timeParts[0], 10) + 6, parseInt(timeParts[1], 10)
    ));
    return d.getUTCFullYear() +
      pad(d.getUTCMonth() + 1) +
      pad(d.getUTCDate()) + 'T' +
      pad(d.getUTCHours()) +
      pad(d.getUTCMinutes()) + '00Z';
  }

  function escapeICS(str) {
    return str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  }

  function buildICS(events, useUTC) {
    var lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Community Access//Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    events.forEach(function (ev) {
      lines.push('BEGIN:VEVENT');
      lines.push('UID:' + ev.uid + '@community-access.github.io');
      if (useUTC) {
        lines.push('DTSTART:' + toUTCDate(ev.date, ev.startTime));
        lines.push('DTEND:' + toUTCDate(ev.date, ev.endTime));
      } else {
        lines.push('DTSTART;TZID=' + ev.timezone + ':' + toICSDate(ev.date, ev.startTime));
        lines.push('DTEND;TZID=' + ev.timezone + ':' + toICSDate(ev.date, ev.endTime));
      }
      lines.push('SUMMARY:' + escapeICS(ev.title));
      lines.push('DESCRIPTION:' + escapeICS(ev.description));
      if (ev.location) lines.push('LOCATION:' + escapeICS(ev.location));
      if (ev.url) lines.push('URL:' + ev.url);
      lines.push('END:VEVENT');
    });

    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  function downloadBlob(content, filename) {
    var blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportMonth(useUTC) {
    var data = getMonthEvents(currentYear, currentMonth);
    var events = [];
    data.dates.forEach(function (ds) {
      events = events.concat(data.byDate[ds]);
    });
    if (events.length === 0) return;

    var monthStr = currentYear + '-' + pad(currentMonth + 1);
    var suffix = useUTC ? '-outlook' : '';
    downloadBlob(buildICS(events, useUTC), 'community-access-' + monthStr + suffix + '.ics');
  }

  /* --- Countdown --- */
  function parseEventDate(ev) {
    // Convert "date + startTime in ev.timezone" to an absolute UTC timestamp
    var iso = ev.date + 'T' + ev.startTime + ':00';
    try {
      var refUTC = new Date(iso + 'Z');
      var fmt = new Intl.DateTimeFormat('en-US', {
        timeZone: ev.timezone,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
      });
      var p = {};
      fmt.formatToParts(refUTC).forEach(function (part) {
        if (part.type !== 'literal') p[part.type] = parseInt(part.value, 10);
      });
      var tzAsUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour === 24 ? 0 : p.hour, p.minute, p.second || 0);
      var offsetMs = tzAsUTC - refUTC.getTime();
      return new Date(refUTC.getTime() - offsetMs);
    } catch (e) {
      return new Date(iso);
    }
  }

  function updateCountdown() {
    if (!countdownEl || !countdownText) return;

    var now = new Date();
    var weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    var nearest = null;
    var nearestTime = Infinity;

    allEvents.forEach(function (ev) {
      var evDate = parseEventDate(ev);

      if (evDate > now && evDate <= weekFromNow) {
        var diff = evDate.getTime() - now.getTime();
        if (diff < nearestTime) {
          nearestTime = diff;
          nearest = ev;
        }
      }
    });

    if (nearest) {
      var days = Math.floor(nearestTime / (24 * 60 * 60 * 1000));
      var hours = Math.floor((nearestTime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      var mins = Math.floor((nearestTime % (60 * 60 * 1000)) / (60 * 1000));

      var timeStr = '';
      if (days > 0) timeStr += days + ' day' + (days !== 1 ? 's' : '') + ', ';
      if (hours > 0 || days > 0) timeStr += hours + ' hour' + (hours !== 1 ? 's' : '') + ', ';
      timeStr += mins + ' minute' + (mins !== 1 ? 's' : '');

      var newText = 'Next up: ' + nearest.title + ' in ' + timeStr;
      if (countdownText.textContent !== newText) {
        countdownText.textContent = newText;
      }
      countdownEl.hidden = false;
    } else {
      countdownEl.hidden = true;
    }
  }

  /* --- Month navigation --- */
  function navigateMonth(dir) {
    var m = currentMonth + dir;
    var y = currentYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    renderAgenda(y, m, true);
  }

  prevBtn.addEventListener('click', function () { navigateMonth(-1); });
  nextBtn.addEventListener('click', function () { navigateMonth(1); });

  if (exportIcsBtn) {
    exportIcsBtn.addEventListener('click', function () { exportMonth(false); });
  }
  if (exportOutlookBtn) {
    exportOutlookBtn.addEventListener('click', function () { exportMonth(true); });
  }

  /* --- Init --- */
  fetchEvents().then(function () {
    renderAgenda(today.getFullYear(), today.getMonth(), false);
    updateCountdown();
    setInterval(updateCountdown, 60000);
  });
})();

/* === Feedback Form === */
(function () {
  'use strict';

  var REPO = 'Community-Access/community-access.github.io';
  var TYPE_LABELS = {
    bug: 'bug',
    enhancement: 'enhancement',
    accessibility: 'accessibility',
    feedback: 'feedback'
  };
  var TYPE_TITLES = {
    bug: 'Bug Report',
    enhancement: 'Feature Request',
    accessibility: 'Accessibility Issue',
    feedback: 'General Feedback'
  };

  var form = document.getElementById('feedback-form');
  if (!form) return;

  var typeSelect = document.getElementById('feedback-type');
  var messageInput = document.getElementById('feedback-message');
  var nameInput = document.getElementById('feedback-name');
  var errorsRegion = document.getElementById('feedback-errors');

  function showError(input, errorId, msg) {
    input.setAttribute('aria-invalid', 'true');
    document.getElementById(errorId).textContent = msg;
  }

  function clearErrors() {
    form.querySelectorAll('.feedback-error').forEach(function (el) { el.textContent = ''; });
    form.querySelectorAll('[aria-invalid]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
    if (errorsRegion) errorsRegion.textContent = '';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    var type = typeSelect.value;
    var message = messageInput.value.trim();
    var name = nameInput.value.trim();
    var firstInvalid = null;
    var errorMessages = [];

    if (!type) {
      showError(typeSelect, 'feedback-type-error', 'Please select a feedback type.');
      firstInvalid = firstInvalid || typeSelect;
      errorMessages.push('Please select a feedback type.');
    }
    if (!message) {
      showError(messageInput, 'feedback-message-error', 'Please enter a message.');
      firstInvalid = firstInvalid || messageInput;
      errorMessages.push('Please enter a message.');
    }

    if (firstInvalid) {
      if (errorsRegion) errorsRegion.textContent = errorMessages.join(' ');
      firstInvalid.focus();
      return;
    }

    var title = '[' + TYPE_TITLES[type] + '] ';
    var bodyParts = [];
    if (name) bodyParts.push('**From:** ' + name);
    bodyParts.push(message);
    var body = bodyParts.join('\n\n');
    var label = TYPE_LABELS[type];

    var url = 'https://github.com/' + REPO + '/issues/new'
      + '?title=' + encodeURIComponent(title)
      + '&body=' + encodeURIComponent(body)
      + '&labels=' + encodeURIComponent(label);

    window.open(url, '_blank', 'noopener,noreferrer');
    form.reset();
    if (errorsRegion) errorsRegion.textContent = 'Your feedback has been opened in a new GitHub tab. If the tab did not open, check your popup blocker.';
  });
})();
