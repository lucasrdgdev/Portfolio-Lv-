/* =========================================================
   PORTFÓLIO — LUCAS VELOZO  v2.0
   JavaScript puro — sem dependências externas
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // DEFINIDO APENAS UMA VEZ PARA O ARQUIVO INTEIRO!
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let lenis;
  const readProgress = document.getElementById('readProgress');

  /* ══════════════════════════════════════════════════════
     0. LENIS — SCROLL SUAVE & BARRA DE PROGRESSO
  ══════════════════════════════════════════════════════ */
  if (typeof Lenis !== 'undefined') {
    
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Conecta a Barra de Progresso ao Lenis
    if (readProgress) {
      lenis.on('scroll', (e) => {
        const progressPercentage = e.progress * 100;
        readProgress.style.width = Math.min(progressPercentage, 100) + '%';
        readProgress.setAttribute('aria-valuenow', Math.round(progressPercentage));
      });
    }

    // Conecta as âncoras (menu) ao Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            e.preventDefault();
            lenis.scrollTo(targetElement); 
          }
        }
      });
    });

  } else {
    // Fallback de Acessibilidade
    if (REDUCED) {
      document.documentElement.style.scrollBehavior = 'auto';
    }
    // Fallback da Barra de Progresso
    if (readProgress) {
      window.addEventListener('scroll', () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
        readProgress.style.width = Math.min(progress, 100) + '%';
        readProgress.setAttribute('aria-valuenow', Math.round(progress));
      }, { passive: true });
    }
  }

  /* ══════════════════════════════════════════════════════
     1. PRELOADER — logs de boot falsos
  ══════════════════════════════════════════════════════ */
  const preloader    = document.getElementById('preloader');
  const preloaderLog = document.getElementById('preloaderLogs');

  const bootLines = [
    '> Inicializando sistema...                [OK]',
    '> Carregando módulos JavaScript...        [OK]',
    '> Conectando às APIs externas...          [OK]',
    '> Verificando ambiente AWS (Cloud)...     [OK]',
    '> Compilando componentes front-end...     [OK]',
    '> Aplicando identidade visual...          [OK]',
    '> Sistema pronto. Bem-vindo(a)!           ✓',
  ];

  if (preloader) {
    if (REDUCED) {
      preloader.remove();
    } else {
      let idx = 0;
      const logTimer = setInterval(() => {
        if (idx < bootLines.length) {
          const line = document.createElement('div');
          line.className = 'preloader__log-line';
          line.textContent = bootLines[idx++];
          preloaderLog.appendChild(line);
        } else {
          clearInterval(logTimer);
          setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => preloader.remove(), 650);
          }, 400);
        }
      }, 200);
    }
  }

  /* ══════════════════════════════════════════════════════
     2. CURSOR CUSTOMIZADO — bloco sólido piscante
  ══════════════════════════════════════════════════════ */
  const cursor = document.getElementById('customCursor');

  if (cursor && !REDUCED && supportsHover) {
    document.documentElement.classList.add('has-custom-cursor');

    let cursorX = 0, cursorY = 0;
    let rafCursor;

    const moveCursor = () => {
      cursor.style.left = cursorX + 'px';
      cursor.style.top  = cursorY + 'px';
    };

    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      cancelAnimationFrame(rafCursor);
      rafCursor = requestAnimationFrame(moveCursor);
    });

    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });

    document.querySelectorAll('a, button, input, .filter-btn, .skill-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-3px, -2px) scale(1.5)';
        cursor.style.opacity   = '0.7';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-3px, -2px) scale(1)';
        cursor.style.opacity   = '1';
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     4. BOTÃO VOLTAR AO TOPO
  ══════════════════════════════════════════════════════ */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      const half = document.documentElement.scrollHeight / 2;
      backToTop.classList.toggle('visible', window.scrollY > half);
    }, { passive: true });
    backToTop.addEventListener('click', () => typeof lenis !== 'undefined' ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ══════════════════════════════════════════════════════
     5. TEMA DARK / LIGHT
  ══════════════════════════════════════════════════════ */
  const themeToggle = document.getElementById('themeToggle');
  const html        = document.documentElement;

  html.setAttribute('data-theme', localStorage.getItem('lv-theme') || 'dark');
  syncThemeIcon();

  themeToggle?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('lv-theme', next);
    syncThemeIcon();
    if (!REDUCED) initMatrix();
  });

  function syncThemeIcon() {
    if (!themeToggle) return;
    const dark = html.getAttribute('data-theme') === 'dark';
    themeToggle.textContent    = dark ? '☀' : '☾';
    themeToggle.setAttribute('aria-label', dark ? 'Ativar modo claro' : 'Ativar modo escuro');
  }

  /* ══════════════════════════════════════════════════════
     6. MATRIX RAIN CANVAS
  ══════════════════════════════════════════════════════ */
  const matrixCanvas = document.getElementById('matrixCanvas');
  let matrixTimer;

  function initMatrix() {
    if (!matrixCanvas || REDUCED) return;
    const ctx = matrixCanvas.getContext('2d');

    const resize = () => {
      matrixCanvas.width  = matrixCanvas.offsetWidth;
      matrixCanvas.height = matrixCanvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const FONT_SIZE = 13;
    const CHARS     = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモ'.split('');
    let cols  = Math.floor(matrixCanvas.width / FONT_SIZE);
    let drops = new Array(cols).fill(1);

    window.addEventListener('resize', () => {
      cols  = Math.floor(matrixCanvas.width / FONT_SIZE);
      drops = new Array(cols).fill(1);
    }, { passive: true });

    clearInterval(matrixTimer);
    matrixTimer = setInterval(() => {
      const isDark = html.getAttribute('data-theme') !== 'light';
      ctx.fillStyle = isDark ? 'rgba(10,10,10,0.07)' : 'rgba(245,245,240,0.07)';
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

      ctx.fillStyle = '#ffd100';
      ctx.font      = `${FONT_SIZE}px JetBrains Mono, monospace`;

      drops.forEach((drop, i) => {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(char, i * FONT_SIZE, drop * FONT_SIZE);
        if (drop * FONT_SIZE > matrixCanvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    }, 55);
  }
  initMatrix();

  /* ══════════════════════════════════════════════════════
     7. PARTÍCULAS — CANVAS CONSTELLATION
  ══════════════════════════════════════════════════════ */
  const particlesCanvas = document.getElementById('particlesCanvas');

  if (particlesCanvas && !REDUCED) {
    const pCtx       = particlesCanvas.getContext('2d');
    const MAX_DIST   = 115;
    const N_PARTICLES = 55;
    const particles  = [];

    const resizeP = () => {
      particlesCanvas.width  = particlesCanvas.offsetWidth;
      particlesCanvas.height = particlesCanvas.offsetHeight;
    };
    resizeP();
    window.addEventListener('resize', resizeP, { passive: true });

    class Particle {
      constructor() { this.init(); }
      init() {
        this.x = Math.random() * particlesCanvas.width;
        this.y = Math.random() * particlesCanvas.height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.r  = Math.random() * 1.8 + 0.4;
        this.a  = Math.random() * 0.45 + 0.15;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > particlesCanvas.width)  this.vx *= -1;
        if (this.y < 0 || this.y > particlesCanvas.height)  this.vy *= -1;
      }
      draw() {
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        pCtx.fillStyle = `rgba(255,209,0,${this.a})`;
        pCtx.fill();
      }
    }

    for (let i = 0; i < N_PARTICLES; i++) particles.push(new Particle());

    const animateP = () => {
      pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
      particles.forEach((p, i) => {
        p.update();
        p.draw();
        for (let j = i + 1; j < particles.length; j++) {
          const q    = particles[j];
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < MAX_DIST) {
            pCtx.beginPath();
            pCtx.moveTo(p.x, p.y);
            pCtx.lineTo(q.x, q.y);
            pCtx.strokeStyle = `rgba(255,209,0,${0.18 * (1 - dist / MAX_DIST)})`;
            pCtx.lineWidth   = 0.5;
            pCtx.stroke();
          }
        }
      });
      requestAnimationFrame(animateP);
    };
    animateP();
  }

  /* ══════════════════════════════════════════════════════
     8. TYPING EFFECT — frases rotativas com apagamento
  ══════════════════════════════════════════════════════ */
  const typedEl = document.getElementById('typedText');

  const PHRASES = [
    'Olá, eu sou Lucas Velozo.',
    'Criando APIs escaláveis...',
    'Configurando AWS na nuvem...',
    'Automatizando com JavaScript...',
    'Residindo no Porto Digital...',
    'Construindo o futuro. 🚀',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;

  function typeLoop() {
    if (!typedEl) return;
    const phrase = PHRASES[phraseIdx];

    if (!deleting) {
      typedEl.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        setTimeout(() => { deleting = true; typeLoop(); }, 2200);
        return;
      }
    } else {
      typedEl.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % PHRASES.length;
      }
    }
    setTimeout(typeLoop, deleting ? 38 : 62);
  }

  if (typedEl) {
    if (REDUCED) {
      typedEl.textContent = PHRASES[0];
    } else {
      setTimeout(typeLoop, 2300);
    }
  }

  /* ══════════════════════════════════════════════════════
     9. GLITCH EFFECT — título principal
  ══════════════════════════════════════════════════════ */
  const glitchTitle = document.getElementById('glitchTitle');

  if (glitchTitle && !REDUCED) {
    setInterval(() => {
      glitchTitle.classList.add('glitch-active');
      glitchTitle.addEventListener('animationend', () => glitchTitle.classList.remove('glitch-active'), { once: true });
    }, 5500);
  }

  /* ══════════════════════════════════════════════════════
     10. TERMINAL INTERATIVO — comandos reais
  ══════════════════════════════════════════════════════ */
  const termInput  = document.getElementById('terminalInput');
  const termOutput = document.getElementById('terminalOutput');
  const termEl     = document.getElementById('terminal');

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  const CMDS = {
    help: () => `
<span class="tcmd-comment">// comandos disponíveis:</span>
  <span class="tcmd-keyword">about</span>      → Quem é Lucas Velozo
  <span class="tcmd-keyword">skills</span>     → Stack e tecnologias
  <span class="tcmd-keyword">projects</span>   → O que já foi commitado
  <span class="tcmd-keyword">contact</span>    → Como entrar em contato
  <span class="tcmd-keyword">devlink</span>    → Sobre a comunidade DEV LINK
  <span class="tcmd-keyword">github</span>     → Abrir perfil no GitHub
  <span class="tcmd-keyword">clear</span>      → Limpar o terminal
  <span class="tcmd-keyword">linkedin</span>   → Abrir perfil no LinkedIn
`,

    about: () => `
<span class="tcmd-comment">// lucas.velozo@portfolio:~</span>
<span class="tcmd-string">"Estagiário de Dev na Avantia — JavaScript, APIs REST, Sydle One."</span>
<span class="tcmd-string">"Cursando ADS na UNIT. Formação AWS re/Start."</span>
<span class="tcmd-string">"Residente Tecnológico no Porto Digital, Recife-PE."</span>
<span class="tcmd-string">"Fundador da comunidade DEV LINK."</span>`,

    skills: () => `
<span class="tcmd-comment">// stack principal</span>
<span class="tcmd-keyword">const</span> stack = [
  <span class="tcmd-string">"JavaScript"</span>, <span class="tcmd-string">"APIs REST"</span>, <span class="tcmd-string">"HTML5 / CSS3"</span>,
  <span class="tcmd-string">"AWS (Cloud)"</span>, <span class="tcmd-string">"Linux"</span>, <span class="tcmd-string">"Sydle One (BPM)"</span>,
  <span class="tcmd-string">"Banco de Dados"</span>, <span class="tcmd-string">"Git & GitHub"</span>
];`,

    projects: () => `
<span class="tcmd-comment">// projetos em destaque</span>
  <span class="tcmd-keyword">01.</span> Integração de API REST — <span class="tcmd-string">JS + Fetch API</span>
  <span class="tcmd-keyword">02.</span> Deploy em Nuvem       — <span class="tcmd-string">AWS + Linux</span>
  <span class="tcmd-keyword">03.</span> Landing Page DEV LINK  — <span class="tcmd-string">HTML5 + CSS3 + JS</span>`,

    contact: () => `
<span class="tcmd-comment">// contatos</span>
  <span class="tcmd-keyword">email</span>    → lucasrdgdev@gmail.com
  <span class="tcmd-keyword">linkedin</span> → linkedin.com/in/lkrdgdev
  <span class="tcmd-keyword">github</span>   → github.com/lucasrdgdev`,

    devlink: () => `
<span class="tcmd-comment">// 🔗 DEV LINK — Comunidade</span>
<span class="tcmd-string">"Conectando pessoas desenvolvedoras no Recife e no Brasil."</span>
<span class="tcmd-string">"Fortalecendo o ecossistema tech local."</span>
  <span class="tcmd-keyword">discord</span>  → Link em breve 🚀`,

    github: () => {
      window.open('https://github.com/lucasrdgdev', '_blank');
      return '<span class="tcmd-comment">// abrindo github.com/lucasrdgdev...</span>';
    },
    linkedin: () => {
      window.open('https://www.linkedin.com/in/lkrdgdev', '_blank');
      return '<span class="tcmd-comment">// abrindo linkedin.com/lkrdgdev...</span>';
    },
    clear: () => null,
  };

  function runCmd(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') { termOutput.innerHTML = ''; return; }

    const cmdLine = document.createElement('div');
    cmdLine.className = 'terminal__output-cmd';
    cmdLine.innerHTML = `<span class="terminal__prompt">lucas@dev</span><span class="terminal__symbol">:~$</span> `;
    const typedSpan = document.createElement('span');
    typedSpan.className = 'tcmd-text';
    typedSpan.textContent = raw;
    cmdLine.appendChild(typedSpan);
    termOutput.appendChild(cmdLine);

    const result  = CMDS[cmd] ? CMDS[cmd]() : `<span style="color:var(--color-text-faint)">comando '<span class="tcmd-keyword">${escapeHTML(cmd)}</span>' não encontrado. Digite <span class="tcmd-keyword">help</span>.</span>`;
    if (result === null) return;

    const out = document.createElement('div');
    out.className = 'terminal__output-result';
    out.innerHTML = result;
    termOutput.appendChild(out);
    termOutput.scrollTop = termOutput.scrollHeight;
  }

  termInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { runCmd(termInput.value); termInput.value = ''; }
  });

  termEl?.addEventListener('click', (e) => {
    const interactiveTarget = e.target instanceof Element
      ? e.target.closest('a, button, input, textarea, select, [role="button"]')
      : null;

    if (interactiveTarget) return;

    if (window.matchMedia('(pointer: coarse)').matches) return;

    termInput?.focus();
  });

  /* ══════════════════════════════════════════════════════
     11. TILT 3D — terminal acompanha o mouse
  ══════════════════════════════════════════════════════ */
  const heroSection = document.getElementById('hero');

  if (termEl && heroSection && !REDUCED && supportsHover) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect   = termEl.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const rotX   = ((e.clientY - cy) / rect.height) * -8;
      const rotY   = ((e.clientX - cx) / rect.width)  * 8;
      termEl.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }, { passive: true });

    heroSection.addEventListener('mouseleave', () => {
      termEl.style.transition = 'transform 0.6s ease';
      termEl.style.transform  = 'perspective(1200px) rotateX(0) rotateY(0)';
      setTimeout(() => { termEl.style.transition = ''; }, 620);
    });
  }

  /* ══════════════════════════════════════════════════════
     12. PARALLAX SUAVE — formas geométricas
  ══════════════════════════════════════════════════════ */
  if (!REDUCED) {
    const geoShapes = document.querySelectorAll('.geo-shape');
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      geoShapes.forEach((s, i) => {
        const speed = 0.08 + i * 0.04;
        s.style.transform = `translateY(${sy * speed}px) rotate(${sy * 0.02 + i * 40}deg)`;
      });
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════
     13. BOTÕES MAGNÉTICOS
  ══════════════════════════════════════════════════════ */
  if (!REDUCED && supportsHover) {
    document.querySelectorAll('#btnContato, #btnProjetos').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x    = e.clientX - rect.left - rect.width  / 2;
        const y    = e.clientY - rect.top  - rect.height / 2;
        btn.style.transform = `translateX(${x * 0.22}px) translateY(${y * 0.22}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform 0.55s ease';
        btn.style.transform  = '';
        setTimeout(() => { btn.style.transition = ''; }, 560);
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     14. SPOTLIGHT NOS CARDS DE PROJETOS
  ══════════════════════════════════════════════════════ */
  function addSpotlight(card) {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width)  * 100;
      const y    = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  }
  document.querySelectorAll('.project-card, .skill-card').forEach(addSpotlight);

  /* ══════════════════════════════════════════════════════
     15. CONTADORES ANIMADOS
  ══════════════════════════════════════════════════════ */
  function animateCounter(numEl, target) {
    const duration = 1800;
    const steps    = 60;
    const inc      = target / steps;
    let current    = 0;
    let frame      = 0;
    const tick     = setInterval(() => {
      current = Math.min(current + inc, target);
      numEl.textContent = Math.floor(current);
      if (++frame >= steps) { numEl.textContent = target; clearInterval(tick); }
    }, duration / steps);
  }

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    let counted = false;
    const counterObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !counted) {
        counted = true;
        document.querySelectorAll('.counter').forEach(c => {
          const target = parseInt(c.dataset.target, 10);
          const numEl  = c.querySelector('.counter__number');
          if (numEl && !REDUCED) animateCounter(numEl, target);
          else if (numEl) numEl.textContent = target;
        });
      }
    }, { threshold: 0.5 });
    counterObs.observe(statsSection);
  }

  /* ══════════════════════════════════════════════════════
     16. SCROLL REVEAL — direcional + legado
  ══════════════════════════════════════════════════════ */
  const revealAll = [
    ...document.querySelectorAll('[data-reveal]'),
    ...document.querySelectorAll('.section__intro, .about, .skills, .projects, .contact__links, .counters, .github-stats'),
  ];

  revealAll.forEach(el => {
    if (!el.hasAttribute('data-reveal')) el.classList.add('reveal');
  });

  if ('IntersectionObserver' in window && !REDUCED) {
    const revObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealAll.forEach(el => revObs.observe(el));
  } else {
    revealAll.forEach(el => { el.classList.add('is-visible'); });
  }

  /* ══════════════════════════════════════════════════════
     17. FILTROS DE PROJETOS
  ══════════════════════════════════════════════════════ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projCards  = document.querySelectorAll('.project-card[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projCards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        if (show) {
          card.style.display = '';
          requestAnimationFrame(() => { card.style.opacity = '1'; });
        } else {
          card.style.opacity = '0';
          setTimeout(() => { if (!show) card.style.display = 'none'; }, 300);
        }
        card.style.transition = 'opacity 0.3s ease';
      });
    });
  });

  /* ══════════════════════════════════════════════════════
     18. MODAL DE PROJETOS
  ══════════════════════════════════════════════════════ */
  const projectModal   = document.getElementById('projectModal');
  const modalTitle     = document.getElementById('modalTitle');
  const modalDesc      = document.getElementById('modalDesc');
  const modalTags      = document.getElementById('modalTags');
  const modalArch      = document.getElementById('modalArchitecture');
  const modalClose     = document.getElementById('modalClose');
  const modalOverlay   = projectModal?.querySelector('.modal__overlay');

  function openProjectModal(card) {
    if (!projectModal) return;
    modalTitle.textContent = card.querySelector('.project-card__title')?.textContent || '';
    modalDesc.textContent  = card.querySelector('.project-card__desc')?.textContent  || '';
    const tags = [...card.querySelectorAll('.project-card__tags li')].map(li => li.textContent);
    modalTags.innerHTML    = tags.map(t => `<span class="modal__tag">${t}</span>`).join('');
    modalArch.textContent  = card.dataset.architecture || 'Detalhes técnicos em breve.';
    projectModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeProjectModal() {
    projectModal?.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project-card__detail-btn').forEach(btn => {
    btn.addEventListener('click', () => openProjectModal(btn.closest('.project-card')));
  });
  modalClose?.addEventListener('click',   closeProjectModal);
  modalOverlay?.addEventListener('click', closeProjectModal);

  /* ══════════════════════════════════════════════════════
     19. RIPPLE NOS BOTÕES
  ══════════════════════════════════════════════════════ */
  document.querySelectorAll('.btn, .filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      ripple.className  = 'ripple';
      const rect  = btn.getBoundingClientRect();
      const size  = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        width:  ${size}px;
        height: ${size}px;
        left:   ${e.clientX - rect.left - size / 2}px;
        top:    ${e.clientY - rect.top  - size / 2}px;
      `;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  /* ══════════════════════════════════════════════════════
     20. CONFETTI — explosão ao clicar no botão principal
  ══════════════════════════════════════════════════════ */
  function spawnConfetti(cx, cy) {
    const COLORS = ['#ffd100', '#ffffff', '#cca300', '#f5f5f0', '#ffea70'];
    for (let i = 0; i < 28; i++) {
      const p     = document.createElement('div');
      p.className = 'confetti-particle';
      const angle = Math.random() * Math.PI * 2;
      const vel   = 65 + Math.random() * 110;
      const w     = 5 + Math.random() * 7;
      const h     = 5 + Math.random() * 7;
      p.style.cssText = `
        left:   ${cx}px;
        top:    ${cy}px;
        width:  ${w}px;
        height: ${h}px;
        background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
        --dx: ${Math.cos(angle) * vel}px;
        --dy: ${Math.sin(angle) * vel - 70}px;
      `;
      document.body.appendChild(p);
      p.addEventListener('animationend', () => p.remove());
    }
  }

  document.getElementById('btnContato')?.addEventListener('click', (e) => {
    if (!REDUCED) spawnConfetti(e.clientX, e.clientY);
  });

  /* ══════════════════════════════════════════════════════
     21. COPIAR E-MAIL — feedback visual
  ══════════════════════════════════════════════════════ */
  const copyEmail = document.getElementById('copyEmail');
  const copyToast = document.getElementById('copyToast');

  function showToast(message) {
    if (!copyToast) return;
    copyToast.textContent = message;
    copyToast.classList.add('visible');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => copyToast.classList.remove('visible'), 2600);
  }

  copyEmail?.addEventListener('click', () => {
    navigator.clipboard?.writeText('lucasrdgdev@gmail.com').then(() => {
      showToast('✓ E-mail copiado!');
    });
  });

  document.getElementById('devlinkContact')?.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('🔗 Link do Discord da DEV LINK em breve.');
  });

  /* ══════════════════════════════════════════════════════
     22. QR CODE MODAL
  ══════════════════════════════════════════════════════ */
  const qrModal    = document.getElementById('qrModal');
  const qrClose    = document.getElementById('qrModalClose');
  const qrOverlay  = qrModal?.querySelector('.modal__overlay');
  const qrCodeBtn  = document.getElementById('qrCodeBtn');

  qrCodeBtn?.addEventListener('click', () => {
    qrModal?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });

  function closeQrModal() {
    qrModal?.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  qrClose?.addEventListener('click',   closeQrModal);
  qrOverlay?.addEventListener('click', closeQrModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeProjectModal(); closeQrModal(); }
  });

  /* ══════════════════════════════════════════════════════
     23. INTEGRAÇÃO API GITHUB
  ══════════════════════════════════════════════════════ */
  const githubRepos = document.getElementById('githubRepos');

  if (githubRepos) {
    fetch('https://api.github.com/users/lucasrdgdev/repos?sort=updated&per_page=3&type=public')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(repos => {
        if (!Array.isArray(repos) || repos.length === 0) return;

        repos.forEach(repo => {
          const card = document.createElement('article');
          card.className = 'project-card';
          card.dataset.category = (repo.language || 'javascript').toLowerCase().includes('js') ? 'javascript' : 'html';
          card.dataset.architecture = `Repositório público no GitHub. Linguagem principal: ${repo.language || 'N/A'}. ${repo.description || ''}`;
          card.innerHTML = `
            <p class="project-card__index">github/${repo.name}</p>
            <h3 class="project-card__title">${repo.name}</h3>
            <p class="project-card__desc">${repo.description || 'Repositório público no GitHub.'}</p>
            <ul class="project-card__tags">
              ${repo.language ? `<li>${repo.language}</li>` : ''}
              <li>⭐ ${repo.stargazers_count}</li>
              <li>🍴 ${repo.forks_count}</li>
            </ul>
            <div class="project-card__footer">
              <button class="project-card__detail-btn">Detalhes →</button>
              <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-card__link">Ver repositório</a>
            </div>
          `;
          githubRepos.appendChild(card);

          addSpotlight(card);

          const btn = card.querySelector('.project-card__detail-btn');
          btn?.addEventListener('click', () => openProjectModal(card));
          btn?.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect  = btn.getBoundingClientRect();
            const size  = Math.max(rect.width, rect.height);
            ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`;
            btn.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
          });
        });
      })
      .catch(() => {});
  }

  /* ══════════════════════════════════════════════════════
     24. EASTER EGG — digitar "DEVLINK" em qualquer lugar
  ══════════════════════════════════════════════════════ */
  let eggBuffer = '';
  const EGG_CODE = 'devlink';
  let eggActive  = false;

  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea')) return;
    eggBuffer = (eggBuffer + e.key.toLowerCase()).slice(-EGG_CODE.length);
    if (eggBuffer === EGG_CODE) {
      eggActive = !eggActive;
      document.documentElement.classList.toggle('easter-egg', eggActive);

      const t = document.createElement('div');
      t.className = 'copy-toast';
      t.style.cssText = 'opacity:1;transform:translateX(-50%) translateY(0);background:#7c3aed;color:white;';
      t.textContent = eggActive ? '🔗 DEV LINK Mode Ativado!' : '🔗 DEV LINK Mode Desativado';
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 3000);
    }
  });

  /* ══════════════════════════════════════════════════════
     26. MENU MOBILE (hamburger + acessibilidade)
  ══════════════════════════════════════════════════════ */
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  navToggle?.addEventListener('click', () => {
    const open = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.classList.toggle('is-open', open);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) {
      navMenu?.classList.remove('is-open');
      navToggle?.setAttribute('aria-expanded', 'false');
      navToggle?.classList.remove('is-open');
    }
  });

  navMenu?.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle?.setAttribute('aria-expanded', 'false');
      navToggle?.classList.remove('is-open');
    });
  });

  /* ══════════════════════════════════════════════════════
     27. ANO ATUAL NO RODAPÉ
  ══════════════════════════════════════════════════════ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ══════════════════════════════════════════════════════
     28. TEXT HIGHLIGHT — palavras em negrito ao revelar
  ══════════════════════════════════════════════════════ */
  if (!REDUCED) {
    const aboutObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('strong').forEach((strong, i) => {
            strong.style.animationDelay = `${i * 80}ms`;
          });
          aboutObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.about__text').forEach(p => aboutObs.observe(p));
  }

}); // fim DOMContentLoaded