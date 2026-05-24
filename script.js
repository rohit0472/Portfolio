/* ─── Terminal Logic ─────────────────────────────── */
const terminal    = document.getElementById('terminal')
const portfolio   = document.getElementById('main-portfolio')
const typed       = document.getElementById('typed')
const termBody    = document.getElementById('termBody')
const promptLine  = document.getElementById('promptLine')
const mobileInput = document.getElementById('mobileInput')

let buffer = ''
let busy   = false

mobileInput.focus()
terminal.addEventListener('click', () => mobileInput.focus())

mobileInput.addEventListener('input', e => {
  buffer = e.target.value
  typed.textContent = buffer
})

mobileInput.addEventListener('keydown', e => {
  if (busy) return
  if (e.key === 'Enter') {
    handle(buffer.trim().toLowerCase())
    mobileInput.value = ''
    buffer = ''
    typed.textContent = ''
  }
})

function handle(cmd) {
  if (cmd === 'sudo') {
    busy = true
    runSequence()
  } else {
    addLine(`command not found: ${cmd}`, 'var(--text3)')
  }
}

function addLine(text, color) {
  const line = document.createElement('div')
  line.className = 'line'
  line.style.color = color || 'var(--text2)'
  line.textContent = text
  termBody.insertBefore(line, promptLine)
  termBody.scrollTop = termBody.scrollHeight
}

function runSequence() {
  const steps = [
    { text: '[ AUTH ] Verifying credentials...',          color: 'var(--text2)' },
    { text: '[ OK ]   Identity confirmed.',               color: '#4ADE80'      },
    { text: '[ OK ]   Decrypting workspace...',           color: '#4ADE80'      },
    { text: '[ OK ]   Environment initialized.',          color: '#4ADE80'      },
    { text: '',                                           color: ''             },
    { text: 'Access granted.',                             color: 'var(--blue)'  },
    { text: "Welcome to Rohit's workspace.",               color: 'var(--blue)'  },
  ]

  let i = 0
  const interval = setInterval(() => {
    const s = steps[i]
    if (s.text) addLine(s.text, s.color)
    i++
    if (i === steps.length) {
      clearInterval(interval)
      setTimeout(() => {
        // Cinematic exit
        terminal.classList.add('exit')
        setTimeout(() => {
          terminal.style.display = 'none'
          portfolio.classList.add('visible')
          initPortfolio()
        }, 900)
      }, 500)
    }
  }, 420)
}

/* ─── Portfolio Init ────────────────────────────── */
function initPortfolio() {
  initSmoothScroll()
  initScrollHeader()
  initReveal()
  initActiveNav()
  initCursorGlow()
  initHeroCardTilt()
  initMobileNav()
}

/* Mobile hamburger nav */
function initMobileNav() {
  const toggle   = document.getElementById('navToggle')
  const drawer   = document.getElementById('navDrawer')
  const backdrop = document.getElementById('navBackdrop')
  if (!toggle) return

  function openNav() {
    toggle.classList.add('open')
    backdrop.classList.add('open')
    drawer.style.display = 'flex'
    // Let browser register display:flex before animating
    requestAnimationFrame(() => drawer.classList.add('open'))
  }
  function closeNav() {
    toggle.classList.remove('open')
    backdrop.classList.remove('open')
    drawer.classList.remove('open')
    // Hide after transition ends
    drawer.addEventListener('transitionend', () => {
      if (!drawer.classList.contains('open')) drawer.style.display = 'none'
    }, { once: true })
  }

  toggle.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeNav() : openNav()
  })

  // Close on backdrop click
  backdrop.addEventListener('click', closeNav)

  // Close on any drawer link click (smooth scroll handles the rest)
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeNav)
  })
}

/* Smooth scroll — intercepts ALL anchor clicks with href="#..." */
function initSmoothScroll() {
  const container = document.getElementById('main-portfolio')

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1)
      if (!id) return
      const target = document.getElementById(id)
      if (!target) return
      e.preventDefault()

      const headerH = document.getElementById('header')?.offsetHeight || 68
      // offsetTop relative to the scrolling container
      const targetTop = target.offsetTop - headerH - 24

      container.scrollTo({ top: targetTop, behavior: 'smooth' })
    })
  })
}

/* Header glass on scroll — listen on the portfolio container */
function initScrollHeader() {
  const header    = document.getElementById('header')
  const container = document.getElementById('main-portfolio')

  container.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', container.scrollTop > 30)
  }, { passive: true })
}

/* Scroll-reveal — use portfolio container as root */
function initReveal() {
  const container = document.getElementById('main-portfolio')
  const els = document.querySelectorAll('.reveal')

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, idx) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('in'), idx * 60)
        io.unobserve(e.target)
      }
    })
  }, { root: container, threshold: 0.12 })

  els.forEach(el => io.observe(el))
}

/* Cursor glow that follows mouse across entire portfolio */
function initCursorGlow() {
  const glow = document.createElement('div')
  glow.id = 'cursor-glow'
  glow.style.cssText = `
    position:fixed;
    width:500px;height:500px;
    border-radius:50%;
    pointer-events:none;
    z-index:0;
    background:radial-gradient(circle, rgba(79,140,255,.07) 0%, transparent 70%);
    transform:translate(-50%,-50%);
    transition:opacity .4s ease;
    opacity:0;
    will-change:left,top;
    max-width:100vw;
  `
  document.getElementById('main-portfolio').appendChild(glow)

  let raf
  document.getElementById('main-portfolio').addEventListener('mousemove', e => {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      glow.style.left = e.clientX + 'px'
      glow.style.top  = e.clientY + 'px'
      glow.style.opacity = '1'
    })
  }, { passive: true })

  document.getElementById('main-portfolio').addEventListener('mouseleave', () => {
    glow.style.opacity = '0'
  })
}

/* Hero card — 3D tilt + edge glow on mouse move */
function initHeroCardTilt() {
  const card = document.querySelector('.hero-card')
  if (!card) return

  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect()
    const cx     = rect.left + rect.width  / 2
    const cy     = rect.top  + rect.height / 2
    const dx     = (e.clientX - cx) / (rect.width  / 2)   // -1 to 1
    const dy     = (e.clientY - cy) / (rect.height / 2)   // -1 to 1
    const rotX   = -dy * 8   // degrees
    const rotY   =  dx * 8

    card.style.transform       = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`
    card.style.boxShadow       = `
      ${-dx * 20}px ${-dy * 20}px 60px rgba(79,140,255,.18),
      0 30px 60px rgba(0,0,0,.5),
      0 0 0 1px rgba(79,140,255,.2)
    `
    card.style.borderColor     = `rgba(79,140,255,${0.15 + Math.abs(dx) * 0.25 + Math.abs(dy) * 0.25})`
    card.style.transition      = 'transform .08s ease, box-shadow .08s ease, border-color .08s ease'
  })

  card.addEventListener('mouseleave', () => {
    card.style.transform   = ''
    card.style.boxShadow   = ''
    card.style.borderColor = ''
    card.style.transition  = 'transform .5s ease, box-shadow .5s ease, border-color .5s ease'
  })
}

/* Active nav highlight — use portfolio container as root */
function initActiveNav() {
  const container = document.getElementById('main-portfolio')
  const sections  = document.querySelectorAll('section[id]')
  const navLinks  = document.querySelectorAll('nav a, .nav-drawer a')

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.getAttribute('id')
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`)
        })
      }
    })
  }, { root: container, rootMargin: '-40% 0px -55% 0px' })

  sections.forEach(s => io.observe(s))
}
