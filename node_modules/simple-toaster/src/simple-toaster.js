let parentToasts = false
let maxToasts = 5
let activeToastsAmount = 0
let delayToShowNext = 0

function createParentToasts () {
  let container = document.createElement('div')
  container.id = 'simple-toaster'
  document.body.appendChild(container)
  return container
}

export default (type, message, timeout = 5000) => {
  let timer = false
  function remove (el) {
    clearTimeout(timer)
    el.classList.remove('active')
    activeToastsAmount--
    moveToasts()
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el)
    }, 1000)
  }
  function moveToasts(type) {
    let activeToasts = parentToasts.getElementsByClassName('active')
    for (let i = 0; i < activeToasts.length; i++) {
      let size = type === 'add' ? i + 1 : i
      activeToasts[i].style.transform = `translateY(calc(-${size}00% - ${size}0px))`
    }
  }
  function removeMaxToast () {
    let activeToasts = parentToasts.getElementsByClassName('active')
    if (activeToastsAmount > maxToasts) {
      remove(activeToasts[activeToastsAmount - 1])
      activeToastsAmount--
    }
  }
  function init () {
    let toast = document.createElement('div')
    toast.classList.add('toast', type)
    toast.innerHTML = message
    parentToasts = parentToasts || createParentToasts()
    parentToasts.insertBefore(toast, parentToasts.firstChild)
    moveToasts('add')
    setTimeout(() => {
      delayToShowNext += 400
      toast.classList.add('active')
      activeToastsAmount++
      removeMaxToast()
      if (timeout) {
        timer = setTimeout(() => {
          remove(toast)
        }, timeout)
      }
      setTimeout(() => {
        delayToShowNext -= 400
      }, 400)
    }, delayToShowNext)
    toast.onclick = ({target}) => {
      remove(target)
    }
  }
  init()
}
