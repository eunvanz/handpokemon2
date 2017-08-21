import _ from 'lodash'
import numeral from 'numeral'
import { pathToJS, dataToJS } from 'react-redux-firebase'

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
  }
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
    user: auth ? dataToJS(state.firebase, `users/${pathToJS(state.firebase, 'auth').uid}`) : null,
    auth
  }
}
