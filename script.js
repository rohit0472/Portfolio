const terminal = document.getElementById('terminal')
const portfolio = document.getElementById('main-portfolio')
const typed = document.getElementById('typed')
const body = document.querySelector('.terminal-body')
const promptLine = document.querySelector('.prompt')
const mobileInput = document.getElementById('mobileInput')

let buffer = ''
let busy = false

mobileInput.focus()

terminal.addEventListener('click', () => {
  mobileInput.focus()
})

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
    addLine(`command not found: ${cmd}`, 'var(--red)')
  }
}

function addLine(text, color) {
  const line = document.createElement('div')
  line.className = 'line'
  line.style.color = color
  line.textContent = text
  body.insertBefore(line, promptLine)
  body.scrollTop = body.scrollHeight
}

function runSequence() {
  const steps = [
    '[ OK ] Authenticating...',
    '[ OK ] Granting root access...',
    '[ OK ] Decrypting interface...',
    'Root access granted.'
  ]

  let i = 0
  const interval = setInterval(() => {
    addLine(steps[i], 'var(--green)')
    i++
    if (i === steps.length) {
      clearInterval(interval)
      setTimeout(() => {
        terminal.classList.add('hacked')
        setTimeout(() => {
          terminal.style.display = 'none'
          portfolio.classList.add('visible')
        }, 1200)
      }, 600)
    }
  }, 500)
}
