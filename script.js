/* ============================== */
/*  Portfolio Script              */
/* ============================== */

document.addEventListener('DOMContentLoaded', () => {
  // ===== Cache DOM Elements =====
  const preloader = document.querySelector('.preloader');
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  const backToTop = document.getElementById('backToTop');
  const cursor = document.querySelector('.cursor');
  const cursorFollower = document.querySelector('.cursor-follower');
  const navLinks = document.querySelectorAll('.nav__link');
  const contactForm = document.getElementById('contactForm');
  const githubStatsImg = document.getElementById('githubStats');
  const topLanguagesImg = document.getElementById('topLanguages');
  const projectsGrid = document.getElementById('projectsGrid');

  let isAnimating = true;

  // ===== Preloader =====
  const hidePreloader = () => {
    if (!preloader) return;
    preloader.style.opacity = '0';
    preloader.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
      if (preloader.parentNode) {
        preloader.parentNode.removeChild(preloader);
      }
      isAnimating = false;
    }, 500);
  };

  // Ensure preloader is hidden even if the image hasn't fired events
  setTimeout(hidePreloader, 1200);

  // ===== Navigation Toggle (Mobile) =====
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      navToggle.classList.toggle('active');
    });

    // Close nav when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  // ===== Active Navigation on Scroll =====
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -20% 0px',
    threshold: 0
  };

  const setActiveNav = entries => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector(`.nav__link[href="#${id}"]`);

      if (entry.isIntersecting && link) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  };

  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(setActiveNav, observerOptions);

    document.querySelectorAll('section[id]').forEach(section => {
      navObserver.observe(section);
    });
  }

  // ===== Scroll Reveal Animations =====
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('[data-animate]');

    const options = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const callback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.transitionDelay = el.style.transitionDelay || '0s';
          el.classList.add('animate');
          observer.unobserve(el);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    // Delay each subsequent element slightly for stagger effect
    elements.forEach((el, index) => {
      // Only set delay for elements without explicit delay classes
      el.style.transitionDelay = `${index * 0.05}s`;
      observer.observe(el);
    });

    // Override with explicit delays where needed
    document.querySelectorAll('[data-animate].animate-delay-1').forEach(el => {
      el.style.transitionDelay = '0.1s';
    });
    document.querySelectorAll('[data-animate].animate-delay-2').forEach(el => {
      el.style.transitionDelay = '0.2s';
    });
    document.querySelectorAll('[data-animate].animate-delay-3').forEach(el => {
      el.style.transitionDelay = '0.3s';
    });
  };

  animateOnScroll();

  // ===== Skill Bar Animation =====
  const skillBars = document.querySelectorAll('.skill__bar-group');

  if ('IntersectionObserver' in window) {
    const skillObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          const fill = entry.target.querySelector('.skill__bar-fill');
          if (fill) {
            const width = fill.style.width || getComputedStyle(fill).width;
            fill.style.width = '0';
            setTimeout(() => {
              fill.style.width = width;
            }, 100);
          }
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillObserver.observe(bar));
  }

  // ===== Back to Top Button =====
  const toggleBackToTop = () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleBackToTop);

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ===== Custom Cursor =====
  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  if (!isTouchDevice()) {
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    const animateCursor = () => {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;

      if (cursor) {
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      if (cursorFollower) {
        cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
      }

      requestAnimationFrame(animateCursor);
    };

    animateCursor();

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Cursor hover effects
    const hoverElements = document.querySelectorAll(
      '.btn, .nav__link, .project__card, .card, .chip, .back-to-top, .footer__social-link'
    );

    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (cursor && cursorFollower) {
          cursor.classList.add('hovered');
          cursorFollower.classList.add('hovered');
        }
      });

      el.addEventListener('mouseleave', () => {
        if (cursor && cursorFollower) {
          cursor.classList.remove('hovered');
          cursorFollower.classList.remove('hovered');
        }
      });
    });
  }

  // ===== GitHub Integration =====
  // Fetch GitHub stats images
  const loadGitHubStats = () => {
    const username = 'ariannicole';

    // GitHub Stats image
    if (githubStatsImg) {
      githubStatsImg.src = `https://github-readme-stats.vercel.app/api?username=${username}&theme=rose&include_shows=true&count_private=true`;
      githubStatsImg.alt = `${username}'s GitHub Stats`;
    }

    // Top Languages image
    if (topLanguagesImg) {
      topLanguagesImg.src = `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&theme=rose&layout=compact&langs_count=8`;
      topLanguagesImg.alt = `Top Languages by ${username}`;
    }
  };

  loadGitHubStats();

  // Fetch pinned GitHub projects
  const loadFeaturedProjects = async () => {
    const username = 'ariannicole';

    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?type=owner&sort=updated&per_page=6`);

      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }

      const repos = await response.json();

      // Filter out repos without descriptions and limit to featured
      const featured = repos
        .filter(repo => !repo.fork && repo.name !== `${username.toLowerCase()}` && repo.name !== `${username}.github.io`)
        .slice(0, 6);

      if (projectsGrid) {
        projectsGrid.innerHTML = featured.map(repo => `
          <div class="project__card" data-animate>
            <img class="project__img" src="${repo.owner.avatar_url}" alt="${repo.name}" loading="lazy" />
            <div class="project__content">
              <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project__title">
                ${repo.name}
              </a>
              <p class="project__description">${repo.description || 'No description provided.'}</p>
              <div class="project__meta">
                <span class="project__language">${repo.language || 'Unknown'}</span>
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project__link">
                  View on GitHub &rarr;
                </a>
              </div>
            </div>
          </div>
        `).join('') || '<p class="projects__loading">No featured projects found yet.</p>';

        // If no repos were returned, show a fallback message
        if (featured.length === 0 && projectsGrid.innerHTML === '') {
          projectsGrid.innerHTML = '<p class="projects__loading">Projects will appear here once I start sharing on GitHub.<br>Currently working on personal projects!</p>';
        }

        // Re-trigger animations on newly loaded elements
        setTimeout(animateOnScroll, 100);
      }
    } catch (error) {
      console.error('Error fetching GitHub projects:', error);
      if (projectsGrid) {
        projectsGrid.innerHTML = `
          <p class="projects__loading">
            Unable to load projects from GitHub.
            <br><br>
            <a href="https://github.com/ariannicole" target="_blank" rel="noopener noreferrer" class="btn btn--secondary">
              Browse my GitHub manually
            </a>
          </p>
        `;
      }
    }
  };

  loadFeaturedProjects();

  // ===== Contact Form =====
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');

      // Basic validation
      if (!name || !email || !message) {
        return;
      }

      // Construct the email subject and body
      const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

      // Redirect to the user's email client
      window.location.href = `mailto:arianicolet@gmail.com?subject=${subject}&body=${body}`;

      // Reset the form
      contactForm.reset();
    });
  }

  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===== Header Scroll Effect =====
  const header = document.querySelector('.header');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });
});
