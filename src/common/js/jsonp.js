
import originJsonp from 'jsonp'

export default function jsonp (url, data, options) {
  return new Promise((resolve, reject) => {
    url += (url.indexOf('?') < 0 ? '?' : '') + params(data)
    console.log(url)
    originJsonp(url, options, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function params (data) {
  let url = ''
  for (var i in data) {
    url += `&${i}=${data[i]}`
  }
  return url ? url.substring(1) : ''
}
