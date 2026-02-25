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
        link.setAttribute('aria-current', 'true');
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
