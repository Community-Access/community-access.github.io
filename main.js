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
    return '<a href="' + c.url + '" class="contributor-card" role="listitem" target="_blank" rel="noopener noreferrer">' +
      '<img class="contributor-avatar" src="' + c.avatar + '&s=128" alt="" width="64" height="64" loading="lazy">' +
      '<span class="contributor-name">' + c.login + '</span>' +
      '<span class="contributor-contributions">' + label + '</span>' +
      '<span class="sr-only">(opens in new tab)</span></a>';
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
  function formatDate(dateStr) {
    var d = new Date(dateStr + 'T12:00:00');
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }
  fetch('posts/posts.json')
    .then(function (r) { return r.json(); })
    .then(function (posts) {
      posts.sort(function (a, b) { return b.date.localeCompare(a.date); });
      var latest = posts.slice(0, 5);
      var el = document.getElementById('latest-news');
      if (!el || latest.length === 0) return;
      var html = '<ol class="changelog-list">';
      latest.forEach(function (post) {
        html += '<li class="changelog-item">';
        html += '<time class="changelog-date" datetime="' + post.date + '">' + formatDate(post.date) + '</time>';
        if (post.type) html += '<span style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;background:var(--ca-indigo);color:#fff;padding:0.15rem 0.5rem;border-radius:3px;margin-left:0.5rem;vertical-align:middle;">' + post.type + '</span>';
        html += '<p style="margin-top:0.35rem;"><a href="news.html#post/' + post.slug + '" style="color:var(--ca-gray-800);text-decoration:none;font-weight:700;">' + post.title + '</a></p>';
        html += '<p style="margin-top:0.25rem;font-size:0.92rem;color:var(--ca-gray-700);">' + post.summary + '</p>';
        html += '</li>';
      });
      html += '</ol>';
      el.innerHTML = html;
    })
    .catch(function () {
      var el = document.getElementById('latest-news');
      if (el) el.innerHTML = '<p style="text-align:center;color:var(--ca-gray-700);">Unable to load news.</p>';
    });
})();
