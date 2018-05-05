
// import axios from 'axios'
import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'

export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uni: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

// 基于新版QQ音乐，这个请求并不是jsonp请求，会跨域
// export function getRecommend () {
//   const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
//   const data = Object.assign({}, commonParams, {
//     params: {
//       g_tk: '5381',
//       uin: '0',
//       format: 'json',
//       inCharset: 'utf-8',
//       outCharset: 'utf-8',
//       notice: '0',
//       platform: 'h5',
//       needNewCode: '1',
//       _: '1525500202002'
//     }
//   })
//   return axios.get(url, data)
// }
