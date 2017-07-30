import { auth, allUsers } from 'dummy/user'

import { SECRET_KEY } from 'constants/security'

import crypto from 'crypto-js'
import cookie from 'cookie'

export const checkDupEmail = email => {
  const falseRes = { result: false }
  const trueRes = { result: true }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'eunvanz@naver.com') {
        return resolve(falseRes)
      } else if (email === 'eunvanz@gmail.com') {
        return reject()
      } else {
        return resolve(trueRes)
      }
    }, 1000)
  })
}

export const checkDupNickname = nickname => {
  const falseRes = { result: false }
  const trueRes = { result: true }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (nickname === '유효') {
        return resolve(falseRes)
      } else if (nickname === '에러') {
        return reject()
      } else {
        return resolve(trueRes)
      }
    }, 1000)
  })
}

export const signUp = data => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve(data)
    }, 1000)
  })
}

export const getUserById = id => {
  return new Promise((resolve, reject) => {
    return resolve(allUsers.filter(user => user.id === id)[0])
  })
}

export const getSignInUser = data => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 이메일과 비밀번호로 authUser를 얻어온다.
      const validUserArr = allUsers.filter(user => data.email === user.email && data.password === user.password)
      if (validUserArr.length === 0) return reject('등록되지 않은 이메일이거나 비밀번호가 틀렸습니다.')
      const authUser = auth.filter(authInfo => validUserArr[0].id)[0]

      // 아이디를 기억해야할 경우 authUser를 쿠키에 저장한다. (기본은 24시간 로그인)
      const maxAge = data.remember ? 60 * 60 * 24 * 180 : 60 * 60 * 24
      const authUserString = JSON.stringify(authUser)
      const encAuthUserString = crypto.AES.encrypt(authUserString, SECRET_KEY).toString()
      document.cookie = `authUser=${encAuthUserString}; max-age=${maxAge}; path=/;`

      // authUser의 id로 로그인 유저 정보를 얻어온다.
      const signInUser = getUserById(authUser.id)
      return resolve(signInUser)
    }, 1000)
  })
}

export const getSessionUser = () => {
  const cookies = cookie.parse(document.cookie)
  let authUser = null
  if (cookies.authUser && cookies.authUser.length > 0) { // 세션이 존재할경우
    const decAuthUser = crypto.AES.decrypt(cookies.authUser, SECRET_KEY).toString(crypto.enc.Utf8)
    authUser = JSON.parse(decAuthUser)
  }
  return authUser
}

export const expireSessionUser = () => {
  const expireDate = new Date()
  expireDate.setDate(expireDate.getDate() - 1)
  document.cookie = `authUser=; expires=${expireDate.toGMTString()}; path=/;`
}
