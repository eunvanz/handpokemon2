// import { SECRET_KEY } from 'constants/security'
//
// import crypto from 'crypto-js'
// import cookie from 'cookie'
import { PICK_CREDIT_REFRESH, BATTLE_CREDIT_REFRESH, ADVENTURE_CREDIT_REFRESH,
MAX_ADVENTURE_CREDIT, MAX_BATTLE_CREDIT, MAX_PICK_CREDIT } from 'constants/rules'

export const isDupEmail = (firebase, email) => {
  const ref = firebase.ref('/users')
  return ref.orderByChild('email').equalTo(email).once('value')
  .then(snapshot => Promise.resolve(snapshot.val()))
}

export const isDupNickname = (firebase, nickname) => {
  const ref = firebase.ref('users')
  return ref.orderByChild('nickname').equalTo(nickname).once('value')
  .then(snapshot => Promise.resolve(snapshot.val()))
}

export const signUp = (firebase, user) => {
  const { password, ...userToSave } = user
  // 랭킹기록 해야함
  return firebase.createUser({ email: user.email, password }, userToSave)
}

export const getUserIdByEmail = (firebase, email) => {
  const ref = firebase.ref('users')
  return ref.orderByChild('email').equalTo(email).once('value')
  .then(snapshot => {
    const userId = Object.keys(snapshot.val())[0]
    return Promise.resolve(userId)
  })
}

export const getUserByUserId = (firebase, userId) => {
  const ref = firebase.ref(`users/${userId}`)
  return ref.once('value').then(snapshot => {
    return Promise.resolve(snapshot.val())
  })
}

export const refreshUserCredits = (firebase, uid, user) => {
  const ref = firebase.ref(`users/${uid}`)
  const curTime = new Date().getTime()
  const { pickCredit, battleCredit, adventureCredit, lastPick, lastLeague, lastAdventure } = user

  const pickTimeGap = curTime - lastPick
  const battleTimeGap = curTime - lastLeague
  const adventureTimeGap = curTime - lastAdventure

  const pickCreditToAdd = Math.floor(pickTimeGap / PICK_CREDIT_REFRESH)
  const battleCreditToAdd = Math.floor(battleTimeGap / BATTLE_CREDIT_REFRESH)
  const adventureCreditToAdd = Math.floor(adventureTimeGap / ADVENTURE_CREDIT_REFRESH)

  const pickRest = pickTimeGap - (PICK_CREDIT_REFRESH * pickCreditToAdd)
  const battleRest = battleTimeGap - (BATTLE_CREDIT_REFRESH * battleCreditToAdd)
  const adventureRest = adventureTimeGap - (ADVENTURE_CREDIT_REFRESH * adventureCreditToAdd)

  const lastPickToUpdate = curTime - pickRest
  const lastLeagueToUpdate = curTime - battleRest
  const lastAdventureToUpdate = curTime - adventureRest

  const updateObj = {}
  updateObj.lastPick = lastPickToUpdate
  updateObj.pickCredit = pickCredit + pickCreditToAdd > MAX_PICK_CREDIT ? MAX_PICK_CREDIT : pickCredit + pickCreditToAdd
  updateObj.lastLeague = lastLeagueToUpdate
  updateObj.battleCredit =
    battleCredit + battleCreditToAdd > MAX_BATTLE_CREDIT ? MAX_BATTLE_CREDIT : battleCredit + battleCreditToAdd
  updateObj.lastAdventure = lastAdventureToUpdate
  updateObj.adventureCredit =
    adventureCredit + adventureCreditToAdd > MAX_ADVENTURE_CREDIT
    ? MAX_ADVENTURE_CREDIT : adventureCredit + adventureCreditToAdd
  console.log('pickRest', pickRest)
  console.log('updateObj', updateObj)
  return ref.update(updateObj).then(() => Promise.resolve(updateObj))
}

export const decreaseCredit = (firebase, uid, number, type) => {
  let creditRefPath
  let lastRefPath
  let refreshInterval
  if (type === 'pick') {
    creditRefPath = 'pickCredit'
    lastRefPath = 'lastPick'
    refreshInterval = PICK_CREDIT_REFRESH
  } else if (type === 'battle') {
    creditRefPath = 'battleCredit'
    lastRefPath = 'lastLeague'
    refreshInterval = BATTLE_CREDIT_REFRESH
  } else if (type === 'adventure') {
    creditRefPath = 'adventureCredit'
    lastRefPath = 'lastAdventure'
    refreshInterval = ADVENTURE_CREDIT_REFRESH
  }
  const creditRef = firebase.ref(`users/${uid}/${creditRefPath}`)
  const lastRef = firebase.ref(`users/${uid}/${lastRefPath}`)
  return lastRef.once('value') // 마지막 업데이트 시간과의 gap이 Refresh 시간보다 클경우 last업데이트 시간을 현재시간으로 설정
  .then(snapshot => {
    const lastUpdate = snapshot.val()
    const currentTime = new Date().getTime()
    const gap = currentTime - lastUpdate
    const shouldUpdate = refreshInterval - gap < 0
    if (shouldUpdate) return lastRef.set(currentTime)
    return Promise.resolve()
  })
  .then(() => {
    return creditRef.transaction(credit => {
      return credit - number < 0 ? 0 : credit - number
    })
  })
}

export const increaseCredit = (firebase, uid, number, type) => {
  let creditRefPath
  let lastRefPath
  let max
  if (type === 'pick') {
    creditRefPath = 'pickCredit'
    lastRefPath = 'lastPick'
    max = MAX_PICK_CREDIT
  } else if (type === 'battle') {
    creditRefPath = 'battleCredit'
    lastRefPath = 'lastLeague'
    max = MAX_BATTLE_CREDIT
  } else if (type === 'adventure') {
    creditRefPath = 'adventureCredit'
    lastRefPath = 'lastAdventure'
    max = MAX_ADVENTURE_CREDIT
  }
  const creditRef = firebase.ref(`users/${uid}/${creditRefPath}`)
  const lastRef = firebase.ref(`users/${uid}/${lastRefPath}`)
  return lastRef.set(new Date().getTime())
  .then(() => {
    return creditRef.transaction(credit => {
      let newCredit = credit + number
      if (newCredit > max) newCredit = max
      return newCredit
    })
  })
}

export const signIn = (firebase, data) => {
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     // 이메일과 비밀번호로 authUser를 얻어온다.
  //     const validUserArr = allUsers.filter(user => data.email === user.email && data.password === user.password)
  //     if (validUserArr.length === 0) return reject('등록되지 않은 이메일이거나 비밀번호가 틀렸습니다.')
  //     const authUser = auth.filter(authInfo => validUserArr[0].id)[0]
  //
  //     // 아이디를 기억해야할 경우 authUser를 쿠키에 저장한다. (기본은 24시간 로그인)
  //     const maxAge = data.remember ? 60 * 60 * 24 * 180 : 60 * 60 * 24
  //     const authUserString = JSON.stringify(authUser)
  //     const encAuthUserString = crypto.AES.encrypt(authUserString, SECRET_KEY).toString()
  //     document.cookie = `authUser=${encAuthUserString}; max-age=${maxAge}; path=/;`
  //
  //     // authUser의 id로 로그인 유저 정보를 얻어온다.
  //     const signInUser = getUserById(authUser.id)
  //     return resolve(signInUser)
  //   }, 1000)
  // })
  return firebase.login(data)
}

// export const getSessionUser = () => {
//   const cookies = cookie.parse(document.cookie)
//   let authUser = null
//   if (cookies.authUser && cookies.authUser.length > 0) { // 세션이 존재할경우
//     const decAuthUser = crypto.AES.decrypt(cookies.authUser, SECRET_KEY).toString(crypto.enc.Utf8)
//     authUser = JSON.parse(decAuthUser)
//   }
//   return authUser
// }

export const logout = (firebase) => {
  return firebase.logout()
}

// export const expireSessionUser = () => {
//   const expireDate = new Date()
//   expireDate.setDate(expireDate.getDate() - 1)
//   document.cookie = `authUser=; expires=${expireDate.toGMTString()}; path=/;`
// }
