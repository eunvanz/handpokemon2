import { IMG_BASE_URL } from 'constants/urls'

export const allUsers = [
  {
    id: 1,
    email: 'eunvanz@gmail.com',
    password: 'dldndgml1',
    nickname: '웅이',
    introduce: '자기소개',
    regDate: {
      hour: 22,
      minute: 22,
      second: 22,
      nano: 22,
      dayOfYear: 194,
      dayOfWeek: 'TUESDAY',
      month: 'JULY',
      dayOfMonth: 12,
      year: 2016,
      monthValue: 7,
      chronology: {
        id: 'ISO',
        calendarType: 'iso8601'
      }
    },
    profile: `${IMG_BASE_URL}/QjPwE0l.jpg`,
    colPoint: 0,
    colRank: 1,
    leaguePoint: 1000,
    leagueRank: 1,
    trainerGrade: {
      id: 1,
      condition: 0,
      title: '아기트레이너',
      hp: 1,
      power: 1,
      armor: 1,
      sPower: 1,
      sArmor: 1,
      dex: 1
    },
    trainerAttr: {
      id: 1,
      attr: '불꽃',
      condition: 10,
      title: '불꽃수집가',
      hp: 0,
      power: 2,
      armor: 2,
      sPower: 2,
      sArmor: 0,
      dex: 0
    },
    pickCredit: 12,
    battleCredit: 12,
    adventureCredit: 10,
    lastPick: 1501075966809,
    lastBattle: 1501075966809,
    lastAdventure: '20/7/2017'
  }
]

export const auth = [{
  id: 1,
  authorities: ['USER'],
  token: '830003E376CCBD8872FD6A9C62F24935'
}]

export const user = {
  id: 1,
  email: 'eunvanz@gmail.com',
  password: 'dldndgml1',
  nickname: '웅이',
  introduce: '자기소개',
  regDate: {
    hour: 22,
    minute: 22,
    second: 22,
    nano: 22,
    dayOfYear: 194,
    dayOfWeek: 'TUESDAY',
    month: 'JULY',
    dayOfMonth: 12,
    year: 2016,
    monthValue: 7,
    chronology: {
      id: 'ISO',
      calendarType: 'iso8601'
    }
  },
  profile: `${IMG_BASE_URL}/QjPwE0l.jpg`,
  colPoint: 0,
  colRank: 1,
  leaguePoint: 1000,
  leagueRank: 1,
  trainerGrade: {
    id: 1,
    condition: 0,
    title: '아기트레이너',
    hp: 1,
    power: 1,
    armor: 1,
    sPower: 1,
    sArmor: 1,
    dex: 1
  },
  trainerAttr: {
    id: 1,
    attr: '불꽃',
    condition: 10,
    title: '불꽃수집가',
    hp: 0,
    power: 2,
    armor: 2,
    sPower: 2,
    sArmor: 0,
    dex: 0
  },
  pickCredit: 12,
  battleCredit: 12,
  adventureCredit: 10,
  lastPick: 1501075966809,
  lastBattle: 1501075966809,
  lastAdventure: '20/7/2017'
}
