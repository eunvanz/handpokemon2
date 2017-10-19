import _ from 'lodash'

import { PICK_CREDIT_REFRESH, BATTLE_CREDIT_REFRESH, ADVENTURE_CREDIT_REFRESH,
MAX_ADVENTURE_CREDIT, MAX_BATTLE_CREDIT, MAX_PICK_CREDIT } from 'constants/rules'

import { updater, convertNumberToStringForIndex } from 'utils/commonUtil'

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
  let isError = false
  return creditRef.transaction(credit => {
    if (credit - number < 0) {
      isError = true
      return 0
    }
    return credit - number
  })
  .then(() => {
    if (isError) return Promise.reject('크레딧이 부족합니다.')
    else return Promise.resolve()
  })
  .then(() => {
    return lastRef.once('value') // 마지막 업데이트 시간과의 gap이 Refresh 시간보다 클경우 last업데이트 시간을 현재시간으로 설정
  })
  .then(snapshot => {
    const lastUpdate = snapshot.val()
    const currentTime = new Date().getTime()
    const gap = currentTime - lastUpdate
    const shouldUpdate = refreshInterval - gap < 0
    if (shouldUpdate) return lastRef.set(currentTime)
    return Promise.resolve()
  })
  .catch(msg => {
    return Promise.reject(msg)
  })
}

export const increaseCredit = (firebase, uid, number, type) => {
  let creditRefPath
  let lastRefPath
  let max
  let refreshInterval
  if (type === 'pick') {
    creditRefPath = 'pickCredit'
    lastRefPath = 'lastPick'
    max = MAX_PICK_CREDIT
    refreshInterval = PICK_CREDIT_REFRESH - 5
  } else if (type === 'battle') {
    creditRefPath = 'battleCredit'
    lastRefPath = 'lastLeague'
    max = MAX_BATTLE_CREDIT
    refreshInterval = BATTLE_CREDIT_REFRESH - 5
  } else if (type === 'adventure') {
    creditRefPath = 'adventureCredit'
    lastRefPath = 'lastAdventure'
    max = MAX_ADVENTURE_CREDIT
    refreshInterval = ADVENTURE_CREDIT_REFRESH - 5 // 오차는 0.005초로 잡음
  }
  const creditRef = firebase.ref(`users/${uid}/${creditRefPath}`)
  const lastRef = firebase.ref(`users/${uid}/${lastRefPath}`)
  return lastRef.once('value')
  .then(snapshot => {
    const now = new Date().getTime()
    const lastUpdate = snapshot.val()
    const interval = now - lastUpdate
    if (interval < refreshInterval) {
      return Promise.reject(interval) // 브라우저 여러개로 동시 수정시 정합성 체크
    } else {
      return lastRef.set(now)
    }
  })
  .then(() => {
    return creditRef.once('value')
  })
  .then(snapshot => {
    const oldCredit = snapshot.val()
    let newCredit = oldCredit + number
    if (newCredit > max) newCredit = max
    return creditRef.set(newCredit) // transaction으로 하지 않는 이유는 브라우저 여러개가 동시에 수정시에 덮어쓰게 하려고
  })
}

export const getUserRanking = (firebase, type, page, prevPoint, prevKey) => {
  let limitToLast = page * 20
  const orderByChild = type === 'collection' ? 'colPoint_leaguePoint' : 'leaguePoint_colPoint'
  let ref = firebase.ref('users').orderByChild(orderByChild)
  if (prevPoint && prevKey) {
    ref = ref.endAt(prevPoint, prevKey)
    limitToLast++ // 이 전 페이지의 마지막 아이템까지 포함하므로 limit를 1 추가
  }
  return ref.limitToLast(limitToLast).once('value')
  .then(snapshot => {
    const result = []
    snapshot.forEach(child => {
      const user = child.val()
      user.id = child.key
      result.push(user)
    })
    return Promise.resolve(_.reverse(result.slice(prevKey ? 0 : undefined, prevKey ? -1 : undefined)))
  })
}

export const getUserRankingByUserId = (firebase, type, userId) => { // update겸용 : update하려면 어차피 ranking계산 로직이 필요하기 때문
  const orderByChild = type === 'collection' ? 'colPoint_leaguePoint' : 'leaguePoint_colPoint'
  let ref = firebase.ref('users').orderByChild(orderByChild)
  return ref.once('value')
  .then(snapshot => {
    let result = []
    let userRank = 0
    snapshot.forEach(child => {
      const user = child.val()
      user.id = child.key
      result.push(user)
    })
    const reversed = _.reverse(result)
    for (let i = 0; i < reversed.length; i++) {
      if (reversed[i].id === userId) userRank = i + 1
    }
    return updateUserRanking(firebase, type, userId, userRank).then(() => Promise.resolve(userRank))
  })
}

export const signIn = (firebase, data) => {
  return firebase.login(data)
}

export const logout = (firebase) => {
  return firebase.logout()
}

export const updateUserRanking = (firebase, type, userId, rank) => {
  const rankPath = type === 'collection' ? 'colRank' : 'leagueRank'
  return firebase.ref(`/users/${userId}/${rankPath}`).set(rank)
}

export const setUserPath = (firebase, userId, path, value) => {
  return firebase.ref(`/users/${userId}/${path}`).set(value)
}

// 일회용 함수: 콜렉션점수&시합점수 인덱스 필드 생성
export const updateUserIndexes = firebase => {
  const usersRef = firebase.ref('/users')
  usersRef.once('value', snapshot => {
    const users = snapshot.val()
    const keys = Object.keys(users)
    const updateObj = {}
    keys.forEach(key => {
      const colPoint = users[key].colPoint
      const leaguePoint = users[key].leaguePoint
      updateObj[`users/${key}/colPoint_leaguePoint`] = convertNumberToStringForIndex([colPoint, leaguePoint])
      updateObj[`users/${key}/leaguePoint_colPoint`] = convertNumberToStringForIndex([leaguePoint, colPoint])
    })
    return updater(firebase, updateObj)
  })
}
