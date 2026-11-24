const root = document.documentElement;
const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

/**
 * Two-state theme toggle per modern-web-guidance:
 * State 1: System preference ("light dark")
 * State 2: Pinned opposite of current system preference ("light" or "dark")
 */
const themeToggleBtn = document.getElementById('theme-toggle');

const getSystemTheme = () => (darkQuery.matches ? 'dark' : 'light');

const getStoredTheme = () => {
  try {
    const val = localStorage.getItem('color-scheme');
    return val === 'light' || val === 'dark' ? val : null;
  } catch {
    return null;
  }
};

const applyTheme = (pinnedTheme) => {
  root.classList.remove('theme-light', 'theme-dark');

  if (pinnedTheme === 'light' || pinnedTheme === 'dark') {
    if (colorSchemeMeta) colorSchemeMeta.content = pinnedTheme;
    root.classList.add(`theme-${pinnedTheme}`);
  } else {
    if (colorSchemeMeta) colorSchemeMeta.content = 'light dark';
  }

  const effectiveTheme = pinnedTheme ?? getSystemTheme();
  if (themeToggleBtn) {
    const nextTheme = effectiveTheme === 'dark' ? 'light' : 'dark';
    themeToggleBtn.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
    themeToggleBtn.setAttribute('title', `Switch to ${nextTheme} theme`);
  }
};

applyTheme(getStoredTheme());

darkQuery.addEventListener('change', () => {
  applyTheme(getStoredTheme());
});

themeToggleBtn?.addEventListener('click', () => {
  const systemTheme = getSystemTheme();
  const stored = getStoredTheme();
  const effectiveTheme = stored ?? systemTheme;
  const targetTheme = effectiveTheme === 'dark' ? 'light' : 'dark';

  try {
    if (targetTheme === systemTheme) {
      localStorage.removeItem('color-scheme');
      applyTheme(null);
    } else {
      localStorage.setItem('color-scheme', targetTheme);
      applyTheme(targetTheme);
    }
  } catch {
    applyTheme(targetTheme === systemTheme ? null : targetTheme);
  }
});

/**
 * Mobile Navigation Drawer
 */
const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
const primaryNav = document.getElementById('primary-nav');

const setMobileMenuOpen = (isOpen) => {
  if (!mobileMenuBtn || !primaryNav) return;
  primaryNav.classList.toggle('is-open', isOpen);
  mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
};

mobileMenuBtn?.addEventListener('click', () => {
  const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
  setMobileMenuOpen(!isExpanded);
});

primaryNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMobileMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileMenuBtn?.getAttribute('aria-expanded') === 'true') {
    setMobileMenuOpen(false);
    mobileMenuBtn.focus();
  }
});

/**
 * Native Modal Dialogs with Safari Fallback for <dialog closedby="any">
 */
const dialogs = document.querySelectorAll('dialog.modal');
const supportsClosedBy = 'closedBy' in HTMLDialogElement.prototype;

dialogs.forEach((dialog) => {
  if (!supportsClosedBy) {
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (isDialogContent) return;
      dialog.close();
    });
  }
});

document.querySelectorAll('[data-open-dialog]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const targetId = trigger.getAttribute('data-open-dialog');
    const dialog = targetId ? document.getElementById(targetId) : null;
    if (dialog instanceof HTMLDialogElement && !dialog.open) {
      dialog.showModal();
    }
  });
});

document.querySelectorAll('[data-close-dialog]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const dialog = btn.closest('dialog');
    if (dialog instanceof HTMLDialogElement && dialog.open) {
      dialog.close();
    }
  });
});

document.getElementById('print-cv-btn')?.addEventListener('click', () => {
  const cvDialog = document.getElementById('cv-dialog');
  if (cvDialog instanceof HTMLDialogElement && cvDialog.open) {
    cvDialog.close();
  }
  window.print();
});

/**
 * Interactive Skills Category Filter
 */
const filterButtons = document.querySelectorAll('[data-skill-filter]');
const skillCards = document.querySelectorAll('#skills-grid .skill-card');

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const selected = btn.getAttribute('data-skill-filter');

    filterButtons.forEach((other) => {
      other.setAttribute('aria-pressed', String(other === btn));
    });

    skillCards.forEach((card) => {
      const category = card.getAttribute('data-category');
      card.hidden = selected !== 'all' && category !== selected;
    });
  });
});

/**
 * Copy Email to Clipboard with Accessible Status Announcement
 */
const copyEmailBtn = document.getElementById('copy-email-btn');
const copyStatus = document.getElementById('copy-status');

copyEmailBtn?.addEventListener('click', async () => {
  const email = copyEmailBtn.getAttribute('data-copy') ?? 'justiceduodu@yahoo.com';
  try {
    await navigator.clipboard.writeText(email);
    copyEmailBtn.textContent = 'Copied';
    if (copyStatus) copyStatus.textContent = `Copied ${email} to clipboard.`;
    window.setTimeout(() => {
      copyEmailBtn.textContent = 'Copy';
    }, 2200);
  } catch {
    if (copyStatus) copyStatus.textContent = `Email address: ${email}`;
  }
});

/**
 * Static Mailto Draft Composer
 */
const contactForm = document.getElementById('contact-form');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const data = new FormData(contactForm);
  const name = String(data.get('name') ?? '').trim();
  const subject = String(data.get('subject') ?? '').trim();
  const body = String(data.get('body') ?? '').trim();

  const mailtoSubject = encodeURIComponent(`[Portfolio] ${subject}`);
  const mailtoBody = encodeURIComponent(`Hi Justice,\n\n${body}\n\nBest regards,\n${name}`);
  window.location.href = `mailto:justiceduodu@yahoo.com?subject=${mailtoSubject}&body=${mailtoBody}`;
});

/**
 * Active Section Indicator in Primary Navigation
 */
const navLinks = Array.from(document.querySelectorAll('.nav-list a[href^="#"]'));
const trackedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href') ?? ''))
  .filter((section) => section instanceof HTMLElement);

if ('IntersectionObserver' in window && trackedSections.length > 0) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      const activeId = `#${visible.target.id}`;
      navLinks.forEach((link) => {
        if (link.getAttribute('href') === activeId) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    },
    {
      rootMargin: '-25% 0px -60% 0px',
      threshold: [0.1, 0.4, 0.7],
    }
  );

  trackedSections.forEach((section) => navObserver.observe(section));
}

/**
 * Keep Footer Year Current
 */
const yearEl = document.getElementById('current-year');
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}
