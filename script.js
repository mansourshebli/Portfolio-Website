const revealElements = [...document.querySelectorAll("[data-reveal]")];
const typingTarget = document.querySelector(".typing");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const scrollIndicatorBar = document.querySelector(".scroll-indicator__bar");
let scrollIndicatorFill = null;
const yearSpan = document.getElementById("year");
const floatingElements = [...document.querySelectorAll("[data-floating]")];
const githubGrid = document.querySelector(".github-grid");
const githubUsername = githubGrid ? githubGrid.dataset.username : null;
const prefersReducedMotion = window.matchMedia
  ? window.matchMedia("(prefers-reduced-motion: reduce)")
  : { matches: false };

// Intersection Observer to reveal elements on scroll
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

revealElements.forEach(el => observer.observe(el));

// Typing loop effect
if (typingTarget) {
  const phrases = [
    "AI competition champion",
    "student founder",
    "quantum curious maker",
    "community mentor"
  ];
  let index = 0;
  let charIndex = 0;
  let direction = 1;

  const type = () => {
    const current = phrases[index];
    charIndex += direction;

    typingTarget.textContent = current.slice(0, charIndex);

    if (charIndex === current.length) {
      direction = -1;
      setTimeout(type, 1500);
    } else if (charIndex === 0 && direction === -1) {
      direction = 1;
      index = (index + 1) % phrases.length;
      setTimeout(type, 300);
    } else {
      setTimeout(type, direction === 1 ? 70 : 40);
    }
  };

  type();
}

// Mobile navigation toggle
if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    siteNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-active");
  });

  siteNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.classList.remove("is-active");
    });
  });
}

// Tilt effect for interactive cards
const attachTilt = element => {
  if (!element || element.dataset.tiltBound === "true") return;

  const handlePointerMove = event => {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / rect.height) * 14;
    const rotateY = ((x - rect.width / 2) / rect.width) * -14;

    element.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(
      2
    )}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const resetTilt = () => {
    element.style.transform = "";
  };

  element.addEventListener("pointermove", handlePointerMove);
  element.addEventListener("pointerleave", resetTilt);
  element.addEventListener("pointerup", resetTilt);
  element.dataset.tiltBound = "true";
};

const initTilt = () => {
  if (prefersReducedMotion.matches) return;
  document.querySelectorAll("[data-tilt]").forEach(attachTilt);
};

const handleMotionPreferenceChange = () => {
  if (prefersReducedMotion.matches) {
    document
      .querySelectorAll("[data-tilt]")
      .forEach(el => (el.style.transform = ""));
    floatingElements.forEach(el => (el.style.transform = ""));
  } else {
    initTilt();
  }
};

if (typeof prefersReducedMotion.addEventListener === "function") {
  prefersReducedMotion.addEventListener("change", handleMotionPreferenceChange);
} else if (typeof prefersReducedMotion.addListener === "function") {
  prefersReducedMotion.addListener(handleMotionPreferenceChange);
}

initTilt();

// Scroll indicator and parallax badge motion
const ensureScrollIndicatorFill = () => {
  if (!scrollIndicatorBar) return;
  if (!scrollIndicatorFill) {
    scrollIndicatorFill = document.createElement("span");
    scrollIndicatorFill.className = "scroll-indicator__fill";
    scrollIndicatorBar.appendChild(scrollIndicatorFill);
  }
};

const updateScrollIndicator = () => {
  if (!scrollIndicatorBar) return;
  ensureScrollIndicatorFill();

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? scrollTop / docHeight : 0;
  const clamped = Math.min(Math.max(progress, 0), 1);

  scrollIndicatorFill.style.width = `${clamped * 100}%`;
};

let scrollThrottle;
window.addEventListener("scroll", () => {
  if (!scrollThrottle) {
    scrollThrottle = requestAnimationFrame(() => {
      updateScrollIndicator();
      applyFloatMotion();
      scrollThrottle = null;
    });
  }
});

// Floating badge motion
const applyFloatMotion = () => {
  if (prefersReducedMotion.matches) return;
  const scrollTop = window.scrollY;
  floatingElements.forEach(el => {
    const intensity = parseFloat(el.dataset.floatIntensity || "18");
    const offset = (Math.sin((scrollTop + el.offsetTop) / 200) * intensity) / 10;
    el.style.transform = `translate3d(0, ${offset}px, 0)`;
  });
};

applyFloatMotion();

// Impact tabs
const initTabs = () => {
  const groups = document.querySelectorAll("[data-tabs]");
  groups.forEach(group => {
    const buttons = [...group.querySelectorAll("[data-tab-target]")];
    const section = group.closest("section");
    if (!section) return;
    const panels = [...section.querySelectorAll("[data-tab-panel]")];

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        const target = button.dataset.tabTarget;
        buttons.forEach(btn => btn.classList.toggle("is-active", btn === button));
        panels.forEach(panel =>
          panel.classList.toggle("is-active", panel.dataset.tabPanel === target)
        );

        if (!prefersReducedMotion.matches) {
          panels
            .filter(panel => panel.classList.contains("is-active"))
            .forEach(panel => panel.querySelectorAll("[data-tilt]").forEach(attachTilt));
        }
      });
    });
  });
};

initTabs();

// Project switcher (browser-style cards)
const initProjectSwitchers = () => {
  const switchers = document.querySelectorAll("[data-project-switcher]");
  switchers.forEach(switcher => {
    const tabs = [...switcher.querySelectorAll("[data-project-target]")];
    const panels = [...switcher.querySelectorAll("[data-project-panel]")];

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.projectTarget;
        tabs.forEach(btn => btn.classList.toggle("is-active", btn === tab));
        panels.forEach(panel =>
          panel.classList.toggle("is-active", panel.dataset.projectPanel === target)
        );

        if (!prefersReducedMotion.matches) {
          panels
            .filter(panel => panel.classList.contains("is-active"))
            .forEach(panel => panel.querySelectorAll("[data-tilt]").forEach(attachTilt));
        }
      });
    });
  });
};

initProjectSwitchers();

// GitHub repository feed
const formatRelativeDate = isoString => {
  const updatedDate = new Date(isoString);
  const now = new Date();
  const diffMs = now - updatedDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "1 month ago";
  if (diffMonths < 12) return `${diffMonths} months ago`;
  const diffYears = Math.floor(diffMonths / 12);
  return diffYears === 1 ? "1 year ago" : `${diffYears} years ago`;
};

const formatNumber = num => {
  if (typeof num !== "number") return "0";
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return `${num}`;
};

const createRepoCard = repo => {
  const article = document.createElement("article");
  article.className = "repo-card";
  article.dataset.tilt = "";

  const language = repo.language || "Multi";
  const description =
    repo.description || "Exploring new ideas and patterns in public.";

  article.innerHTML = `
    <div class="repo-card__header">
      <span class="repo-card__icon">☆</span>
      <a class="repo-card__name" href="${repo.html_url}" target="_blank" rel="noopener">
        ${repo.name}
      </a>
    </div>
    <p class="repo-card__description">${description}</p>
    <div class="repo-card__meta">
      <span class="repo-card__badge">${language}</span>
      <span class="repo-card__stats">★ ${formatNumber(repo.stargazers_count)} • Updated ${formatRelativeDate(
    repo.pushed_at
  )}</span>
    </div>
  `;

  if (!prefersReducedMotion.matches) {
    attachTilt(article);
  }

  return article;
};

const renderGitHubRepos = repos => {
  if (!githubGrid) return;
  githubGrid.innerHTML = "";
  repos.forEach(repo => {
    githubGrid.appendChild(createRepoCard(repo));
  });
};

const loadGitHubRepos = async () => {
  if (!githubGrid || !githubUsername) return;

  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=8`
    );
    if (!response.ok) {
      throw new Error(`GitHub request failed with status ${response.status}`);
    }
    const data = await response.json();
    const filtered = data.filter(repo => !repo.fork).slice(0, 4);
    if (filtered.length) {
      renderGitHubRepos(filtered);
    } else {
      githubGrid.innerHTML =
        '<p class="repo-card__empty">Repositories are warming up — check back soon.</p>';
    }
  } catch (error) {
    githubGrid.innerHTML =
      '<p class="repo-card__empty">Unable to load GitHub right now. Visit my profile directly.</p>';
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

// Footer year
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

ensureScrollIndicatorFill();
updateScrollIndicator();
loadGitHubRepos();
