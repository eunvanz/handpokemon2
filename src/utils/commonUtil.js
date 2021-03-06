import _ from 'lodash'
import numeral from 'numeral'
import { pathToJS } from 'react-redux-firebase'

import { LEAGUE } from 'constants/rules'

export const isScreenSize = {
  xs: () => window.innerWidth < 768,
  sm: () => window.innerWidth < 992 && window.innerWidth >= 768,
  md: () => window.innerWidth < 1200 && window.innerWidth >= 992,
  lg: () => window.innerWidth >= 1200,
  smallerThan: (size) => {
    if (size === 'sm') {
      return window.innerWidth < 992
    } else if (size === 'md') {
      return window.innerWidth < 1200
    } else {
      return window.innerWidth < size
    }
  },
  largerThan: (size) => {
    if (size === 'xs') {
      return window.innerWidth >= 768
    } else if (size === 'sm') {
      return window.innerWidth >= 992
    } else if (size === 'md') {
      return window.innerWidth >= 1200
    } else {
      return window.innerWidth > size
    }
  }
}

export const isIE = () => {
  const agent = navigator.userAgent.toLowerCase()
  return agent.indexOf('Trident') !== -1 || agent.indexOf('msie') !== -1
}

export const isMobile = {
  Android: () => {
    return navigator.userAgent.match(/Android/i)
  },
  BlackBerry: () => {
    return navigator.userAgent.match(/BlackBerry/i)
  },
  iOS: () => {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i)
  },
  Opera: () => {
    return navigator.userAgent.match(/Opera Mini/i)
  },
  Windows: () => {
    return navigator.userAgent.match(/IEMobile/i)
  },
  any: () => {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows())
  }
}

export const setCookie = (cName, cValue, cDay) => {
  const expire = new Date()
  expire.setDate(expire.getDate() + cDay)
  let cookies = cName + '=' + escape(cValue) + '; path=/ '
  if (typeof cDay !== 'undefined') cookies += ';expires=' + expire.toGMTString() + ';'
  document.cookie = cookies
}

export const getCookie = cName => {
  cName = cName + '='
  const cookieData = document.cookie
  let start = cookieData.indexOf(cName)
  let cValue = ''
  if (start !== -1) {
    start += cName.length
    let end = cookieData.indexOf(';', start)
    if (end === -1) end = cookieData.length
    cValue = cookieData.substring(start, end)
  }
  return unescape(cValue)
}

export const showAlert = option => {
  return window.swal(option)
}

export const convertEmptyStringToNullInObj = object => {
  for (const propName in object) {
    if (object[propName] === '') {
      object[propName] = null
    }
  }
  return object
}

export const convertMapToArr = map => {
  const arr = []
  _.forEach(map, (value, key) => {
    value.id = key
    arr.push(value)
  })
  return arr
}

export const convertTimeToMMSS = time => {
  const min = Math.floor(time / (1000 * 60))
  const sec = Math.floor((time - (min * 1000 * 60)) / 1000)
  return `${min}:${numeral(sec).format('00')}`
}

export const getAuthUserFromFirebase = state => {
  const auth = pathToJS(state.firebase, 'auth')
  return {
    user: auth ? Object.assign({}, pathToJS(state.firebase, 'profile', { id: auth.uid })) : null,
    auth
  }
}

export const updater = (firebase, updateObj) => {
  return firebase.ref().update(updateObj)
}

export const dataURItoBlob = dataURI => {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString
  if (dataURI.split(',')[0].indexOf('base64') >= 0) byteString = atob(dataURI.split(',')[1])
  else byteString = unescape(dataURI.split(',')[1])

  // separate out the mime component
  let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to a typed array
  let ia = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  return new Blob([ia], { type: mimeString })
}

export const getSeqPromise = proms => { // promise array를 순차적으로 실행하여 결과를 반환
  const results = []
  return proms.reduce((prev, prom) => prev.then(() => {
    return prom()
      .then(result => {
        results.push(result)
        return Promise.resolve()
      })
  }), Promise.resolve())
  .then(() => {
    return Promise.resolve(results)
  })
}

export const isStringLength = str => {
  let strLength = 0
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i)
    let ch = str.substr(i, 1).toUpperCase()
    code = parseInt(code)
    if ((ch < '0' || ch > '9') && (ch < 'A' || ch > 'Z') && ((code > 255) || (code < 0))) strLength = strLength + 2
    else strLength = strLength + 1
  }
  return strLength
}

export const convertNumberToStringForIndex = (numArr, digit = 10) => {
  let result = ''
  let format = ''
  for (let i = 0; i < digit; i++) format += '0'
  numArr.forEach((num, idx) => {
    if (idx !== 0) result += '_'
    result += numeral(num).format(format)
  })
  return result
}

export const countAttrsInCollections = (attr, collections) => {
  return collections.filter(collection => collection.mon[collection.monId].mainAttr === attr || collection.mon[collection.monId].subAttr === attr).length
}

export const deepCopyArray = array => {
  return JSON.parse(JSON.stringify(array))
}

export const getHonorBurf = user => {
  const result = [0, 0, 0, 0, 0, 0]
  if (!user.enabledHonors) return result
  user.enabledHonors.forEach(honor => {
    for (let i = 0; i < result.length; i++) {
      result[i] += honor.burf[i]
    }
  })
  return result
}

export const getHonorBurfTotal = honorBurf => {
  const honorTotal = honorBurf ? honorBurf.reduce((accm, burf) => accm + burf, 0) : 0
  return honorTotal
}

export const getMsg = (message, locale) => {
  return message[locale] || message.en
}

export const getImageNameFromUrl = url => {
  return url.substring(url.indexOf('%2F') + 3, url.indexOf('?alt'))
}

export const getThumbnailImageUrl = url => {
  const imageName = getImageNameFromUrl(url)
  return url.replace(imageName, `thumb_${imageName}`)
}

export const flattenFirebaseObject = obj => {
  const key = Object.keys(obj)[0]
  return Object.assign({}, obj[key], { id: key })
}

export const isOlderVersion = (src, tgt) => {
  const srcArr = src.split('.')
  const tgtArr = tgt.split('.')
  if (Number(srcArr[0]) < Number(tgtArr[0])) return true
  else if (Number(srcArr[1]) < Number(tgtArr[1])) return true
  else if (Number(srcArr[2]) < Number(tgtArr[2])) return true
  return false
}

export const getLeague = (userRank, allUserNum) => {
  const pct = Math.round(userRank * 100 / allUserNum)
  for (let i = LEAGUE.length - 1; i > -1; i--) {
    if (pct <= LEAGUE[i].cut) return i
  }
}
