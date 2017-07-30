export const mon = {
  id: 0,
  no: 0,
  name: null,
  description: null,
  mainAttr: null,
  subAttr: null,
  hp: 0,
  power: 0,
  armor: 0,
  sPower: 0,
  sArmor: 0,
  dex: 0,
  total: 0,
  grade: null,
  skill: null,
  gen: 0,
  height: 0,
  weight: 0,
  next: 0,
  prev: 0,
  evoLv: 0,
  point: 0,
  monImage: [{ url: null, seq: 0, designer: { nickname: null } }],
  cost: 0
}

export const user = {
  id: 0,
  email: null,
  password: null,
  nickname: null,
  regDate: {
    hour: 0,
    minute: 0,
    second: 0,
    nano: 0,
    dayOfYear: 0,
    dayOfWeek: null,
    month: null,
    dayOfMonth: 0,
    year: 0,
    monthValue: 0,
    chronology: {
      id: 'ISO',
      calendarType: 'iso8601'
    }
  }
}

export const collection = {
  id: 0,
  monId: 0,
  mon,
  userId: 0,
  user,
  rank: null,
  level: 0,
  imageSeq: 1,
  lastBattle: 0, // timemillies 타입으로 들어옴
  hp: 0,
  addedHp: 0,
  power: 0,
  addedPower: 0,
  armor: 0,
  addedArmor: 0,
  sPower: 0,
  addedSPower: 0,
  sArmor: 0,
  addedSArmor: 0,
  dex: 0,
  addedDex: 0,
  total: 0,
  addedTotal: 0,
  height: 0,
  weight: 0
}
