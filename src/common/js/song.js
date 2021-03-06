import { getLyric } from 'api/song'

export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    } else {
      return new Promise((resolve, reject) => {
        getLyric(this.id)
          .then(res => {
            if (typeof res === 'string') {
              let reg = /^\w+\(({[^()]+})\)$/
              let matches = res.match(reg)
              if (matches) {
                res = changeLyricFormat(JSON.parse(matches[1]).lyric)
              }
              this.lyric = res
              resolve(this.lyric)
            }
          })
          .catch(() => {
            resolve('no lyric')
          })
      })
    }
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=5210737808&vkey=515733104053792DA2D5120E144538139FC0538341F70D57A69A4260E6051E516F77F0CB0DC49209B8FA7C226E1118BAAE40364306FDC6BB&uin=0&fromtag=38`

  })
}
function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(s => {
    ret.push(s.name)
  })
  return ret.join('/')
}

export function changeLyricFormat(str) {
  let dom = document.createElement('div')
  dom.innerHTML = str
  return dom.innerHTML
}
