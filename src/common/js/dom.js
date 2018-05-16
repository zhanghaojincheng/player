
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

let elementsStyle = document.createElement('div').style
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementsStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()
console.log(vendor)

export function prefixStyle(attr) {
  return `${vendor}${attr.charAt(0).toLocaleUpperCase()}${attr.substring(1)}`
}
