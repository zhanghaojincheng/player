
export function addClass (el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}
export function attributeMethod (el, name, value) {
  name = 'data-' + name
  if (value) {
    return el.setAttribute(name, value)
  } else {
    return el.getAttribute(name)
  }
}

export function getCss(el, name) {
  console.log(window.getComputedStyle(el, null)[name])
  return window.getComputedStyle(el, null)[name]
}
