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

  // 현재시간과 마지막 크레딧 사용 시간과의 차이를 계산
  const pickTimeGap = curTime - lastPick
  const battleTimeGap = curTime - lastLeague
  const adventureTimeGap = curTime - lastAdventure
  console.log('pickTimeGap', pickTimeGap)

  // 현재시간과 마지막 크레딧 사용 시간과의 차이를 크레딧 리프레쉬 시간 단위로 나누어서 더해줄 크레딧을 계산
  const pickCreditToAdd = Math.floor(pickTimeGap / PICK_CREDIT_REFRESH)
  const battleCreditToAdd = Math.floor(battleTimeGap / BATTLE_CREDIT_REFRESH)
  const adventureCreditToAdd = Math.floor(adventureTimeGap / ADVENTURE_CREDIT_REFRESH)
  console.log('pickCreditToAdd', pickCreditToAdd)

  const isPickCreditMax = pickCredit + pickCreditToAdd >= MAX_PICK_CREDIT
  const isBattleCreditMax = battleCredit + battleCreditToAdd >= MAX_BATTLE_CREDIT
  const isAdventureCreditMax = adventureCredit + adventureCreditToAdd >= MAX_ADVENTURE_CREDIT
  console.log('isPickCreditMax', isPickCreditMax)

  // 위의 나머지가 다음 크레딧 증가를 실행시킬 시간
  const pickRest = pickTimeGap - (PICK_CREDIT_REFRESH * pickCreditToAdd)
  const battleRest = battleTimeGap - (BATTLE_CREDIT_REFRESH * battleCreditToAdd)
  const adventureRest = adventureTimeGap - (ADVENTURE_CREDIT_REFRESH * adventureCreditToAdd)
  console.log('pickRest', pickRest)

  // 위의 시간이 지난 후 업데이트를 해줘야 하기 때문에 마지막 크레딧 사용 시간을 현재시간 - 위의 사간 을 적용
  // 이미 크래딧과 더할 크레딧을 더한 값이 MAX값일 경우에는 현재시간을 적용
  const lastPickToUpdate = isPickCreditMax ? curTime : curTime - pickRest
  const lastLeagueToUpdate = isBattleCreditMax ? curTime : curTime - battleRest
  const lastAdventureToUpdate = isAdventureCreditMax ? curTime : curTime - adventureRest
  console.log('lastPickToUpdate', lastPickToUpdate)
  console.log('curTime', curTime)

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

export const updateUserInventory = (firebase, userId, item, type, cnt) => {
  const inventoryRef = firebase.ref(`/users/${userId}/inventory`)
  return inventoryRef.transaction(inventory => {
    const newInventory = inventory || []
    if (type === 'save') {
      for (let i = 0; i < cnt; i++) {
        newInventory.push(item)
      }
    } else if (type === 'use') {
      for (let i = 0; i < cnt; i++) {
        newInventory.splice(_.findIndex(newInventory, e => e.id === item.id), 1)
      }
    }
    return newInventory
  })
}

export const updateUserPokemoney = (firebase, userId, value) => {
  const pokemoneyRef = firebase.ref(`/users/${userId}/pokemoney`)
  return pokemoneyRef.transaction(pokemoney => {
    return pokemoney + value
  })
}

export const updateUserToLose = (firebase, userId, type, point) => {
  // type should be attackLose or defenseLose
  const userRef = firebase.ref(`/users/${userId}`)
  return userRef.once('value')
  .then(snapshot => {
    const user = snapshot.val()
    const updateObj = {
      [`/users/${userId}/battleLose`]: user.battleLose + 1,
      [`/users/${userId}/${type}`]: (user[type] || 0) + 1,
      [`/users/${userId}/leaguePoint`]: user.leaguePoint - point,
      [`/users/${userId}/colPoint_leaguePoint`]: convertNumberToStringForIndex([user.colPoint, user.leaguePoint - point]),
      [`/users/${userId}/leaguePoint_colPoint`]: convertNumberToStringForIndex([user.leaguePoint - point, user.colPoint])
    }
    if (type === 'attackLose') updateObj[`/users/${userId}/winInRow`] = 0
    return updater(firebase, updateObj)
  })
}

export const updateUserToWin = (firebase, userId, type, point, winInRow) => {
  // type should be attackWin or defenseWin
  const userRef = firebase.ref(`/users/${userId}`)
  return userRef.once('value')
    .then(snapshot => {
      const user = snapshot.val()
      const updateObj = {
        [`/users/${userId}/battleWin`]: user.battleWin + 1,
        [`/users/${userId}/${type}`]: (user[type] || 0) + 1,
        [`/users/${userId}/leaguePoint`]: user.leaguePoint + point,
        [`/users/${userId}/colPoint_leaguePoint`]: convertNumberToStringForIndex([user.colPoint, user.leaguePoint + point]),
        [`/users/${userId}/leaguePoint_colPoint`]: convertNumberToStringForIndex([user.leaguePoint + point, user.colPoint])
      }
      if (type === 'attackWin') {
        updateObj[`/users/${userId}/winInRow`] = winInRow + 1
        updateObj[`/users/${userId}/maxWinInRow`] = winInRow + 1 > (user.maxWinInRow || 0) ? winInRow + 1 : (user.maxWinInRow || 0)
        updateObj[`/users/${userId}/attackLose`] = user.attackLose - 1
        updateObj[`/users/${userId}/battleLose`] = user.battleLose - 1
      }
      return updater(firebase, updateObj)
    })
}

export const getUsersByLeagueForBattle = (firebase, league) => {
  const ref = firebase.ref('users')
  return ref.orderByChild('league').equalTo(league).once('value')
  .then(snapshot => Promise.resolve(snapshot.val()))
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
