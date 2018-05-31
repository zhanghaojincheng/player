
import axios from 'axios'
import {commonParams} from './config'

export function getLyric(mid) {
  let url = '/api/getLyric'
  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    nobase64: 1,
    musicid: mid,
    songtype: 0
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
