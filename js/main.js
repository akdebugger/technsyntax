/* ==========================================================================
   Tech'nSyntax — Main JavaScript
   Mobile Nav, Smooth Scroll, Reveal, Stats Counter, Filter, Email Obfuscation
   ========================================================================== */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", function () {
    initHeaderScroll();
    initMobileMenu();
    initActiveNav();
    initSmoothScroll();
    initScrollReveal();
    initScrollToTop();
    initFooterYear();
    initEmailObfuscation();
    initImagePlaceholders();
    initHeroStats();
    initHeroCodeTyping();
    initBlogFilter();
  });

  /* --------------------------------------------------------------------------
     1. Sticky Header Shadow (Throttled via requestAnimationFrame)
     -------------------------------------------------------------------------- */
  function initHeaderScroll() {
    const header = document.querySelector(".header");
    if (!header) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > 10) {
            header.classList.add("is-scrolled");
          } else {
            header.classList.remove("is-scrolled");
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* --------------------------------------------------------------------------
     2. Accessible Mobile Navigation with Focus Trap
     -------------------------------------------------------------------------- */
  function initMobileMenu() {
    const toggleBtn = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const overlay = document.querySelector(".nav-overlay");
    if (!toggleBtn || !navLinks) return;

    const focusableSelectors = 'a[href], button:not([disabled])';
    let previouslyFocused = null;

    function openMenu() {
      previouslyFocused = document.activeElement;
      navLinks.classList.add("is-open");
      toggleBtn.setAttribute("aria-expanded", "true");
      if (overlay) overlay.classList.add("is-open");
      document.body.style.overflow = "hidden";

      // Focus first link in drawer for keyboard users on desktop/tablet
      const firstLink = navLinks.querySelector("a[href]");
      if (firstLink && window.innerWidth >= 768) {
        firstLink.focus();
      }
    }

    function closeMenu(restoreFocus) {
      navLinks.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
      if (overlay) overlay.classList.remove("is-open");
      document.body.style.overflow = "";

      if (restoreFocus && previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
    }

    toggleBtn.addEventListener("click", function () {
      const isOpen = navLinks.classList.contains("is-open");
      isOpen ? closeMenu(true) : openMenu();
    });

    if (overlay) {
      overlay.addEventListener("click", function () {
        closeMenu(true);
      });
    }

    // Auto-close on link selection without stealing focus
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth < 960) {
          closeMenu(false);
        }
      });
    });

    // Close on Escape & Focus Trap
    document.addEventListener("keydown", function (e) {
      if (!navLinks.classList.contains("is-open")) return;

      if (e.key === "Escape") {
        closeMenu(true);
        return;
      }

      if (e.key === "Tab") {
        const focusables = Array.from(navLinks.querySelectorAll(focusableSelectors));
        focusables.unshift(toggleBtn);

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Close on resize beyond 960px
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 960 && navLinks.classList.contains("is-open")) {
        closeMenu(false);
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. Active Navigation Link
     -------------------------------------------------------------------------- */
  function initActiveNav() {
    let currentPath = window.location.pathname.split("/").pop();
    if (!currentPath || currentPath === "" || currentPath === "index.html") {
      currentPath = "index.html";
    }

    // Target primary nav items (exclude mobile CTAs and WhatsApp buttons)
    document.querySelectorAll(".nav-links > li:not(.nav-cta-mobile):not(.nav-whatsapp-mobile) > a").forEach(function (link) {
      const href = link.getAttribute("href");
      if (!href) return;
      const linkPath = href.split("#")[0].split("/").pop();

      let isActive = false;
      if (linkPath === currentPath || (currentPath === "index.html" && (linkPath === "" || linkPath === "index.html"))) {
        isActive = true;
      } else if (linkPath === "services.html" && currentPath.startsWith("service-")) {
        isActive = true;
      } else if (linkPath === "blog.html" && currentPath.startsWith("blog-")) {
        isActive = true;
      }

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. Smooth Scroll for Same-Page Anchors with Sticky Offset
     -------------------------------------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href*="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        const href = link.getAttribute("href");
        if (!href || href === "#" || href === "#main") return;

        const hashIndex = href.indexOf("#");
        if (hashIndex === -1) return;

        const targetId = href.substring(hashIndex);
        const pathPart = href.substring(0, hashIndex);

        // Check if anchor is on the current page
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        if (pathPart && pathPart !== currentPage && pathPart !== "") {
          return; // Let browser navigate to other page with hash
        }

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const headerOffset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

        if (prefersReducedMotion) {
          window.scrollTo(0, targetPosition);
        } else {
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
          });
        }

        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     5. Scroll Reveal Animations (IntersectionObserver + Safety Fallback)
     -------------------------------------------------------------------------- */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal");
    if (!revealElements.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealElements.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px"
      }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });

    // Safety fallback: force-reveal all after 1200ms
    window.addEventListener("load", function () {
      setTimeout(function () {
        revealElements.forEach(function (el) {
          el.classList.add("is-visible");
        });
        observer.disconnect();
      }, 1200);
    });
  }

  /* --------------------------------------------------------------------------
     6. Scroll-to-Top Button
     -------------------------------------------------------------------------- */
  function initScrollToTop() {
    const btn = document.querySelector(".scroll-top");
    if (!btn) return;

    let ticking = false;

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            if (window.scrollY > 400) {
              btn.classList.add("is-visible");
            } else {
              btn.classList.remove("is-visible");
            }
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );

    btn.addEventListener("click", function () {
      if (prefersReducedMotion) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    });
  }

  /* --------------------------------------------------------------------------
     7. Dynamic Footer Year
     -------------------------------------------------------------------------- */
  function initFooterYear() {
    const yearEls = document.querySelectorAll(".js-current-year");
    const currentYear = new Date().getFullYear();
    yearEls.forEach(function (el) {
      el.textContent = currentYear;
    });
  }

  /* --------------------------------------------------------------------------
     8. Obfuscate Email in Markup
     -------------------------------------------------------------------------- */
  function initEmailObfuscation() {
    const emailEls = document.querySelectorAll(".js-email");
    emailEls.forEach(function (el) {
      const user = el.getAttribute("data-user") || "info";
      const domain = el.getAttribute("data-domain") || "technsyntax.site";
      const email = user + "@" + domain;

      if (el.tagName.toLowerCase() === "a") {
        el.setAttribute("href", "mailto:" + email);
        if (!el.textContent.trim() || el.textContent.trim() === "[email protected]") {
          el.textContent = email;
        }
      } else {
        el.textContent = email;
      }
    });
  }

  /* --------------------------------------------------------------------------
     9. Image Placeholder Handling
     -------------------------------------------------------------------------- */
  function initImagePlaceholders() {
    const wrappers = document.querySelectorAll(".img-wrap");
    wrappers.forEach(function (wrap) {
      const img = wrap.querySelector("img");
      if (!img) return;

      function activatePlaceholder() {
        wrap.classList.add("img-placeholder");
        const altText = img.getAttribute("alt") || "Tech'nSyntax Media Placeholder";
        wrap.setAttribute("data-img-label", altText);
        img.style.display = "none";
      }

      // Check if file is 0-bytes or failed
      if (img.complete) {
        if (img.naturalWidth === 0) {
          activatePlaceholder();
        }
      } else {
        img.addEventListener("error", activatePlaceholder, { once: true });
        img.addEventListener(
          "load",
          function () {
            if (img.naturalWidth === 0) {
              activatePlaceholder();
            }
          },
          { once: true }
        );
      }
    });
  }

  /* --------------------------------------------------------------------------
     10. Hero Stats Counter Animation
     -------------------------------------------------------------------------- */
  function initHeroStats() {
    const statItems = document.querySelectorAll(".js-hero-stat");
    if (!statItems.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      statItems.forEach(function (el) {
        const target = el.getAttribute("data-target") || el.textContent;
        const suffix = el.getAttribute("data-suffix") || "";
        el.textContent = target + suffix;
      });
      return;
    }

    let hasAnimated = false;
    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            obs.disconnect();

            statItems.forEach(function (el) {
              const target = parseInt(el.getAttribute("data-target"), 10);
              const suffix = el.getAttribute("data-suffix") || "";
              if (isNaN(target)) return;

              const duration = 1500;
              const startTime = performance.now();

              function updateCount(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out expo
                const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const currentVal = Math.floor(easeProgress * target);

                el.textContent = currentVal + suffix;

                if (progress < 1) {
                  requestAnimationFrame(updateCount);
                } else {
                  el.textContent = target + suffix;
                }
              }

              requestAnimationFrame(updateCount);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    const statsContainer = document.querySelector(".hero-stats");
    if (statsContainer) {
      observer.observe(statsContainer);
    }
  }

  /* --------------------------------------------------------------------------
     11. Hero Code Editor Typing Animation
     -------------------------------------------------------------------------- */
  function initHeroCodeTyping() {
    const typingCode = document.querySelector(".js-code-typing");
    if (!typingCode) return;

    if (prefersReducedMotion) {
      // Keep static syntax colored code visible
      return;
    }

    // Gentle cursor pulse is styled via CSS
  }

  /* --------------------------------------------------------------------------
     12. Blog Category Filter
     -------------------------------------------------------------------------- */
  function initBlogFilter() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const blogCards = document.querySelectorAll(".blog-card");
    const liveCounter = document.querySelector(".js-blog-count");
    if (!filterBtns.length || !blogCards.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const category = btn.getAttribute("data-category");

        // Update active button state
        filterBtns.forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });

        let visibleCount = 0;

        blogCards.forEach(function (card) {
          const cardCat = card.getAttribute("data-category");
          if (category === "all" || cardCat === category) {
            card.classList.remove("is-hidden");
            visibleCount++;
          } else {
            card.classList.add("is-hidden");
          }
        });

        // Announce count to screen readers
        if (liveCounter) {
          const label = category === "all" ? "all categories" : category;
          liveCounter.textContent = `Showing ${visibleCount} article${visibleCount === 1 ? "" : "s"} in ${label}.`;
        }
      });
    });
  }

})();
