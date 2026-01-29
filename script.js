const terminal = document.getElementById('terminal')
const portfolio = document.getElementById('main-portfolio')
const typed = document.getElementById('typed')
const body = document.querySelector('.terminal-body')
const promptLine = document.querySelector('.prompt')

let buffer = ''
let busy = false

document.addEventListener('keydown', e => {
  if (busy) return

  if (e.key === 'Backspace') buffer = buffer.slice(0, -1)
  else if (e.key === 'Enter') handle(buffer.trim().toLowerCase())
  else if (e.key.length === 1) buffer += e.key

  typed.textContent = buffer
})

function handle(cmd) {
  if (cmd === 'sudo') {
    busy = true
    runSequence()
  } else {
    addLine(`command not found: ${cmd}`, 'var(--red)')
  }
  buffer = ''
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
