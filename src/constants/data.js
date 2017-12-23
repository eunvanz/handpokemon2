import { colors } from './colors'

export const attrs = [
  '노말',
  '불꽃',
  '물',
  '전기',
  '풀',
  '얼음',
  '비행',
  '요정',
  '땅',
  '독',
  '격투',
  '염력',
  '벌레',
  '바위',
  '유령',
  '용',
  '악',
  '강철'
]

export const grades = [
  'b', 'r', 's', 'sr', 'e', 'l'
]

export const generations = ['1', '2', '3', '4', '5', '6', '7']

export const districts = [
  {
    name: '동쪽 섬',
    attrs: ['노말', '불꽃', '독', '벌레', '땅', '요정', '유령', '용', '얼음'],
    color: colors.indigo
  },
  {
    name: '서쪽 섬',
    attrs: ['바위', '비행', '강철', '악', '전기', '염력', '풀', '격투', '물'],
    color: colors.deepOrange
  },
  {
    name: '중앙던전',
    attrs: ['노말', '땅', '유령', '불꽃', '비행', '강철', '염력', '독', '용', '전기', '벌레', '악', '풀', '격투', '바위', '물', '얼음', '요정'],
    color: '#e0e0e0'
  }
]

// export const districts = [
//   {
//     name: '황량한 대지',
//     attrs: ['노말', '땅', '유령'],
//     color: colors.brown
//   },
//   {
//     name: '뜨끈한 불지옥',
//     attrs: ['불꽃', '비행', '강철'],
//     color: colors.red
//   },
//   {
//     name: '신비로운 동굴',
//     attrs: ['염력', '독', '용'],
//     color: colors.indigo
//   },
//   {
//     name: '어둠의 탑',
//     attrs: ['전기', '벌레', '악'],
//     color: colors.black
//   },
//   {
//     name: '수련자의 숲',
//     attrs: ['풀', '격투', '바위'],
//     color: colors.green
//   },
//   {
//     name: '요정의 바다',
//     attrs: ['물', '얼음', '요정'],
//     color: colors.lightBlue
//   },
//   {
//     name: '중앙던전',
//     attrs: ['노말', '땅', '유령', '불꽃', '비행', '강철', '염력', '독', '용', '전기', '벌레', '악', '풀', '격투', '바위', '물', '얼음', '요정'],
//     color: '#e0e0e0'
//   }
// ]

export const honors = [{
  'type': 1,
  'name': '아기트레이너',
  'condition': 100,
  'reward': 50,
  'burf': [1, 1, 1, 1, 1, 1]
}, {
  'type': 1,
  'name': '초급트레이너',
  'condition': 200,
  'reward': 100,
  'burf': [2, 2, 2, 2, 2, 2]
}, {
  'type': 1,
  'name': '중급트레이너',
  'condition': 500,
  'reward': 200,
  'burf': [3, 3, 3, 3, 3, 3]
}, {
  'type': 1,
  'name': '고급트레이너',
  'condition': 800,
  'reward': 350,
  'burf': [4, 4, 4, 4, 4, 4]
}, {
  'type': 1,
  'name': '특급트레이너',
  'condition': 1000,
  'reward': 500,
  'burf': [5, 5, 5, 5, 5, 5]
}, {
  'type': 1,
  'name': '초급레인저',
  'condition': 1200,
  'reward': 650,
  'burf': [6, 6, 6, 6, 6, 6]
}, {
  'type': 1,
  'name': '중급레인저',
  'condition': 1500,
  'reward': 800,
  'burf': [7, 7, 7, 7, 7, 7]
}, {
  'type': 1,
  'name': '고급레인저',
  'condition': 2000,
  'reward': 1000,
  'burf': [8, 8, 8, 8, 8, 8]
}, {
  'type': 1,
  'name': '특급레인저',
  'condition': 2500,
  'reward': 1250,
  'burf': [9, 9, 9, 9, 9, 9]
}, {
  'type': 1,
  'name': '초급짐리더',
  'condition': 3000,
  'reward': 1500,
  'burf': [10, 10, 10, 10, 10, 10]
}, {
  'type': 1,
  'name': '중급짐리더',
  'condition': 3500,
  'reward': 1750,
  'burf': [11, 11, 11, 11, 11, 11]
}, {
  'type': 1,
  'name': '고급짐리더',
  'condition': 4000,
  'reward': 2000,
  'burf': [12, 12, 12, 12, 12, 12]
}, {
  'type': 1,
  'name': '특급짐리더',
  'condition': 4500,
  'reward': 2250,
  'burf': [13, 13, 13, 13, 13, 13]
}, {
  'type': 1,
  'name': '초급챔피언',
  'condition': 5000,
  'reward': 2500,
  'burf': [14, 14, 14, 14, 14, 14]
}, {
  'type': 1,
  'name': '중급챔피언',
  'condition': 5500,
  'reward': 2750,
  'burf': [15, 15, 15, 15, 15, 15]
}, {
  'type': 1,
  'name': '고급챔피언',
  'condition': 6000,
  'reward': 3000,
  'burf': [16, 16, 16, 16, 16, 16]
}, {
  'type': 1,
  'name': '특급챔피언',
  'condition': 6500,
  'reward': 3250,
  'burf': [17, 17, 17, 17, 17, 17]
}, {
  'type': 1,
  'name': '초급마스터',
  'condition': 7000,
  'reward': 3500,
  'burf': [18, 18, 18, 18, 18, 18]
}, {
  'type': 1,
  'name': '중급마스터',
  'condition': 7500,
  'reward': 3750,
  'burf': [19, 19, 19, 19, 19, 19]
}, {
  'type': 1,
  'name': '고급마스터',
  'condition': 8000,
  'reward': 4000,
  'burf': [20, 20, 20, 20, 20, 20]
}, {
  'type': 1,
  'name': '특급마스터',
  'condition': 8500,
  'reward': 4250,
  'burf': [21, 21, 21, 21, 21, 21]
}, {
  'type': 2,
  'attr': '노말',
  'name': '노말수집가',
  'condition': 16,
  'reward': 200,
  'burf': [0, 1, 1, 0, 0, 3]
}, {
  'type': 2,
  'attr': '노말',
  'name': '노말애호가',
  'condition': 32,
  'reward': 500,
  'burf': [0, 2, 2, 0, 0, 6]
}, {
  'type': 2,
  'attr': '노말',
  'name': '노말매니아',
  'condition': 48,
  'reward': 1000,
  'burf': [0, 3, 3, 0, 0, 9]
}, {
  'type': 2,
  'attr': '노말',
  'name': '노말짐리더',
  'condition': 64,
  'reward': 2000,
  'burf': [0, 4, 4, 0, 0, 12]
}, {
  'type': 2,
  'attr': '노말',
  'name': '노말챔피언',
  'condition': 80,
  'reward': 3000,
  'burf': [0, 5, 5, 0, 0, 15]
}, {
  'type': 2,
  'attr': '노말',
  'name': '노말마스터',
  'condition': 100,
  'reward': 5000,
  'burf': [0, 8, 8, 0, 0, 24]
}, {
  'type': 2,
  'attr': '불꽃',
  'name': '불꽃수집가',
  'condition': 11,
  'reward': 200,
  'burf': [0, 2, 2, 1, 0, 0]
}, {
  'type': 2,
  'attr': '불꽃',
  'name': '불꽃애호가',
  'condition': 22,
  'reward': 500,
  'burf': [0, 4, 4, 2, 0, 0]
}, {
  'type': 2,
  'attr': '불꽃',
  'name': '불꽃매니아',
  'condition': 33,
  'reward': 1000,
  'burf': [0, 6, 6, 3, 0, 0]
}, {
  'type': 2,
  'attr': '불꽃',
  'name': '불꽃짐리더',
  'condition': 44,
  'reward': 2000,
  'burf': [0, 8, 8, 4, 0, 0]
}, {
  'type': 2,
  'attr': '불꽃',
  'name': '불꽃챔피언',
  'condition': 55,
  'reward': 3000,
  'burf': [0, 10, 10, 5, 0, 0]
}, {
  'type': 2,
  'attr': '불꽃',
  'name': '불꽃마스터',
  'condition': 65,
  'reward': 5000,
  'burf': [0, 16, 16, 8, 0, 0]
}, {
  'type': 2,
  'attr': '물',
  'name': '물수집가',
  'condition': 21,
  'reward': 200,
  'burf': [2, 0, 1, 0, 2, 0]
}, {
  'type': 2,
  'attr': '물',
  'name': '물애호가',
  'condition': 42,
  'reward': 500,
  'burf': [4, 0, 2, 0, 4, 0]
}, {
  'type': 2,
  'attr': '물',
  'name': '물매니아',
  'condition': 63,
  'reward': 1000,
  'burf': [6, 0, 3, 0, 6, 0]
}, {
  'type': 2,
  'attr': '물',
  'name': '물짐리더',
  'condition': 84,
  'reward': 2000,
  'burf': [8, 0, 4, 0, 8, 0]
}, {
  'type': 2,
  'attr': '물',
  'name': '물챔피언',
  'condition': 105,
  'reward': 3000,
  'burf': [10, 0, 5, 0, 10, 0]
}, {
  'type': 2,
  'attr': '물',
  'name': '물마스터',
  'condition': 123,
  'reward': 5000,
  'burf': [16, 0, 8, 0, 16, 0]
}, {
  'type': 2,
  'attr': '전기',
  'name': '전기수집가',
  'condition': 9,
  'reward': 200,
  'burf': [4, 0, 0, 0, 1, 0]
}, {
  'type': 2,
  'attr': '전기',
  'name': '전기애호가',
  'condition': 18,
  'reward': 500,
  'burf': [8, 0, 0, 0, 2, 0]
}, {
  'type': 2,
  'attr': '전기',
  'name': '전기매니아',
  'condition': 27,
  'reward': 1000,
  'burf': [12, 0, 0, 0, 3, 0]
}, {
  'type': 2,
  'attr': '전기',
  'name': '전기짐리더',
  'condition': 36,
  'reward': 2000,
  'burf': [16, 0, 0, 0, 4, 0]
}, {
  'type': 2,
  'attr': '전기',
  'name': '전기챔피언',
  'condition': 45,
  'reward': 3000,
  'burf': [20, 0, 0, 0, 5, 0]
}, {
  'type': 2,
  'attr': '전기',
  'name': '전기마스터',
  'condition': 49,
  'reward': 5000,
  'burf': [32, 0, 0, 0, 8, 0]
}, {
  'type': 2,
  'attr': '풀',
  'name': '풀수집가',
  'condition': 15,
  'reward': 200,
  'burf': [0, 3, 0, 2, 0, 0]
}, {
  'type': 2,
  'attr': '풀',
  'name': '풀애호가',
  'condition': 30,
  'reward': 500,
  'burf': [0, 6, 0, 4, 0, 0]
}, {
  'type': 2,
  'attr': '풀',
  'name': '풀매니아',
  'condition': 45,
  'reward': 1000,
  'burf': [0, 9, 0, 6, 0, 0]
}, {
  'type': 2,
  'attr': '풀',
  'name': '풀짐리더',
  'condition': 60,
  'reward': 2000,
  'burf': [0, 12, 0, 8, 0, 0]
}, {
  'type': 2,
  'attr': '풀',
  'name': '풀챔피언',
  'condition': 75,
  'reward': 3000,
  'burf': [0, 15, 0, 10, 0, 0]
}, {
  'type': 2,
  'attr': '풀',
  'name': '풀마스터',
  'condition': 89,
  'reward': 5000,
  'burf': [0, 24, 0, 16, 0, 0]
}, {
  'type': 2,
  'attr': '얼음',
  'name': '얼음수집가',
  'condition': 7,
  'reward': 200,
  'burf': [1, 1, 1, 0, 0, 2]
}, {
  'type': 2,
  'attr': '얼음',
  'name': '얼음애호가',
  'condition': 14,
  'reward': 500,
  'burf': [2, 2, 2, 0, 0, 4]
}, {
  'type': 2,
  'attr': '얼음',
  'name': '얼음매니아',
  'condition': 21,
  'reward': 1000,
  'burf': [3, 3, 3, 0, 0, 6]
}, {
  'type': 2,
  'attr': '얼음',
  'name': '얼음짐리더',
  'condition': 28,
  'reward': 2000,
  'burf': [4, 4, 4, 0, 0, 8]
}, {
  'type': 2,
  'attr': '얼음',
  'name': '얼음챔피언',
  'condition': 35,
  'reward': 3000,
  'burf': [5, 5, 5, 0, 0, 10]
}, {
  'type': 2,
  'attr': '얼음',
  'name': '얼음마스터',
  'condition': 39,
  'reward': 5000,
  'burf': [8, 8, 8, 0, 0, 16]
}, {
  'type': 2,
  'attr': '비행',
  'name': '비행수집가',
  'condition': 17,
  'reward': 200,
  'burf': [0, 0, 1, 3, 1, 0]
}, {
  'type': 2,
  'attr': '비행',
  'name': '비행애호가',
  'condition': 34,
  'reward': 500,
  'burf': [0, 0, 2, 6, 2, 0]
}, {
  'type': 2,
  'attr': '비행',
  'name': '비행매니아',
  'condition': 51,
  'reward': 1000,
  'burf': [0, 0, 3, 9, 3, 0]
}, {
  'type': 2,
  'attr': '비행',
  'name': '비행짐리더',
  'condition': 68,
  'reward': 2000,
  'burf': [0, 0, 4, 12, 4, 0]
}, {
  'type': 2,
  'attr': '비행',
  'name': '비행챔피언',
  'condition': 85,
  'reward': 3000,
  'burf': [0, 0, 5, 15, 5, 0]
}, {
  'type': 2,
  'attr': '비행',
  'name': '비행마스터',
  'condition': 98,
  'reward': 5000,
  'burf': [0, 0, 8, 24, 8, 0]
}, {
  'type': 2,
  'attr': '요정',
  'name': '요정수집가',
  'condition': 7,
  'reward': 200,
  'burf': [1, 3, 1, 0, 0, 0]
}, {
  'type': 2,
  'attr': '요정',
  'name': '요정애호가',
  'condition': 14,
  'reward': 500,
  'burf': [2, 6, 2, 0, 0, 0]
}, {
  'type': 2,
  'attr': '요정',
  'name': '요정매니아',
  'condition': 21,
  'reward': 1000,
  'burf': [3, 9, 3, 0, 0, 0]
}, {
  'type': 2,
  'attr': '요정',
  'name': '요정짐리더',
  'condition': 28,
  'reward': 2000,
  'burf': [4, 12, 4, 0, 0, 0]
}, {
  'type': 2,
  'attr': '요정',
  'name': '요정챔피언',
  'condition': 35,
  'reward': 3000,
  'burf': [5, 15, 5, 0, 0, 0]
}, {
  'type': 2,
  'attr': '요정',
  'name': '요정마스터',
  'condition': 41,
  'reward': 5000,
  'burf': [8, 24, 8, 0, 0, 0]
}, {
  'type': 2,
  'attr': '땅',
  'name': '땅수집가',
  'condition': 11,
  'reward': 200,
  'burf': [1, 2, 0, 1, 1, 0]
}, {
  'type': 2,
  'attr': '땅',
  'name': '땅애호가',
  'condition': 22,
  'reward': 500,
  'burf': [2, 4, 0, 2, 2, 0]
}, {
  'type': 2,
  'attr': '땅',
  'name': '땅매니아',
  'condition': 33,
  'reward': 1000,
  'burf': [3, 6, 0, 3, 3, 0]
}, {
  'type': 2,
  'attr': '땅',
  'name': '땅짐리더',
  'condition': 44,
  'reward': 2000,
  'burf': [4, 8, 0, 4, 4, 0]
}, {
  'type': 2,
  'attr': '땅',
  'name': '땅챔피언',
  'condition': 55,
  'reward': 3000,
  'burf': [5, 10, 0, 5, 5, 0]
}, {
  'type': 2,
  'attr': '땅',
  'name': '땅마스터',
  'condition': 67,
  'reward': 5000,
  'burf': [8, 16, 0, 8, 8, 0]
}, {
  'type': 2,
  'attr': '독',
  'name': '독수집가',
  'condition': 11,
  'reward': 200,
  'burf': [0, 0, 0, 1, 3, 1]
}, {
  'type': 2,
  'attr': '독',
  'name': '독애호가',
  'condition': 22,
  'reward': 500,
  'burf': [0, 0, 0, 2, 6, 2]
}, {
  'type': 2,
  'attr': '독',
  'name': '독매니아',
  'condition': 33,
  'reward': 1000,
  'burf': [0, 0, 0, 3, 9, 3]
}, {
  'type': 2,
  'attr': '독',
  'name': '독짐리더',
  'condition': 44,
  'reward': 2000,
  'burf': [0, 0, 0, 4, 12, 4]
}, {
  'type': 2,
  'attr': '독',
  'name': '독챔피언',
  'condition': 55,
  'reward': 3000,
  'burf': [0, 0, 0, 5, 15, 5]
}, {
  'type': 2,
  'attr': '독',
  'name': '독마스터',
  'condition': 62,
  'reward': 5000,
  'burf': [0, 0, 0, 8, 24, 8]
}, {
  'type': 2,
  'attr': '격투',
  'name': '격투수집가',
  'condition': 9,
  'reward': 200,
  'burf': [0, 0, 1, 2, 1, 1]
}, {
  'type': 2,
  'attr': '격투',
  'name': '격투애호가',
  'condition': 18,
  'reward': 500,
  'burf': [0, 0, 2, 4, 2, 2]
}, {
  'type': 2,
  'attr': '격투',
  'name': '격투매니아',
  'condition': 27,
  'reward': 1000,
  'burf': [0, 0, 3, 6, 3, 3]
}, {
  'type': 2,
  'attr': '격투',
  'name': '격투짐리더',
  'condition': 36,
  'reward': 2000,
  'burf': [0, 0, 4, 8, 4, 4]
}, {
  'type': 2,
  'attr': '격투',
  'name': '격투챔피언',
  'condition': 45,
  'reward': 3000,
  'burf': [0, 0, 5, 10, 5, 5]
}, {
  'type': 2,
  'attr': '격투',
  'name': '격투마스터',
  'condition': 52,
  'reward': 5000,
  'burf': [0, 0, 8, 16, 8, 8]
}, {
  'type': 2,
  'attr': '염력',
  'name': '염력수집가',
  'condition': 15,
  'reward': 200,
  'burf': [1, 2, 0, 0, 2, 0]
}, {
  'type': 2,
  'attr': '염력',
  'name': '염력애호가',
  'condition': 30,
  'reward': 500,
  'burf': [2, 4, 0, 0, 4, 0]
}, {
  'type': 2,
  'attr': '염력',
  'name': '염력매니아',
  'condition': 45,
  'reward': 1000,
  'burf': [3, 6, 0, 0, 6, 0]
}, {
  'type': 2,
  'attr': '염력',
  'name': '염력짐리더',
  'condition': 60,
  'reward': 2000,
  'burf': [4, 8, 0, 0, 8, 0]
}, {
  'type': 2,
  'attr': '염력',
  'name': '염력챔피언',
  'condition': 75,
  'reward': 3000,
  'burf': [5, 10, 0, 0, 10, 0]
}, {
  'type': 2,
  'attr': '염력',
  'name': '염력마스터',
  'condition': 89,
  'reward': 5000,
  'burf': [8, 16, 0, 0, 16, 0]
}, {
  'type': 2,
  'attr': '벌레',
  'name': '벌레수집가',
  'condition': 12,
  'reward': 200,
  'burf': [2, 0, 2, 0, 1, 0]
}, {
  'type': 2,
  'attr': '벌레',
  'name': '벌레애호가',
  'condition': 24,
  'reward': 500,
  'burf': [4, 0, 4, 0, 2, 0]
}, {
  'type': 2,
  'attr': '벌레',
  'name': '벌레매니아',
  'condition': 36,
  'reward': 1000,
  'burf': [6, 0, 6, 0, 3, 0]
}, {
  'type': 2,
  'attr': '벌레',
  'name': '벌레짐리더',
  'condition': 48,
  'reward': 2000,
  'burf': [8, 0, 8, 0, 4, 0]
}, {
  'type': 2,
  'attr': '벌레',
  'name': '벌레챔피언',
  'condition': 60,
  'reward': 3000,
  'burf': [10, 0, 10, 0, 5, 0]
}, {
  'type': 2,
  'attr': '벌레',
  'name': '벌레마스터',
  'condition': 72,
  'reward': 5000,
  'burf': [16, 0, 16, 0, 8, 0]
}, {
  'type': 2,
  'attr': '바위',
  'name': '바위수집가',
  'condition': 10,
  'reward': 200,
  'burf': [0, 0, 0, 2, 0, 3]
}, {
  'type': 2,
  'attr': '바위',
  'name': '바위애호가',
  'condition': 20,
  'reward': 500,
  'burf': [0, 0, 0, 4, 0, 6]
}, {
  'type': 2,
  'attr': '바위',
  'name': '바위매니아',
  'condition': 30,
  'reward': 1000,
  'burf': [0, 0, 0, 6, 0, 9]
}, {
  'type': 2,
  'attr': '바위',
  'name': '바위짐리더',
  'condition': 40,
  'reward': 3000,
  'burf': [0, 0, 0, 8, 0, 12]
}, {
  'type': 2,
  'attr': '바위',
  'name': '바위챔피언',
  'condition': 50,
  'reward': 2000,
  'burf': [0, 0, 0, 10, 0, 15]
}, {
  'type': 2,
  'attr': '바위',
  'name': '바위마스터',
  'condition': 58,
  'reward': 5000,
  'burf': [0, 0, 0, 16, 0, 24]
}, {
  'type': 2,
  'attr': '유령',
  'name': '유령수집가',
  'condition': 7,
  'reward': 200,
  'burf': [1, 0, 3, 1, 0, 0]
}, {
  'type': 2,
  'attr': '유령',
  'name': '유령애호가',
  'condition': 14,
  'reward': 500,
  'burf': [2, 0, 6, 4, 0, 0]
}, {
  'type': 2,
  'attr': '유령',
  'name': '유령매니아',
  'condition': 21,
  'reward': 1000,
  'burf': [3, 0, 9, 3, 0, 0]
}, {
  'type': 2,
  'attr': '유령',
  'name': '유령짐리더',
  'condition': 28,
  'reward': 3000,
  'burf': [4, 0, 12, 4, 0, 0]
}, {
  'type': 2,
  'attr': '유령',
  'name': '유령챔피언',
  'condition': 35,
  'reward': 2000,
  'burf': [5, 0, 15, 5, 0, 0]
}, {
  'type': 2,
  'attr': '유령',
  'name': '유령마스터',
  'condition': 39,
  'reward': 5000,
  'burf': [8, 0, 24, 8, 0, 0]
}, {
  'type': 2,
  'attr': '용',
  'name': '용수집가',
  'condition': 8,
  'reward': 200,
  'burf': [0, 0, 2, 2, 1, 0]
}, {
  'type': 2,
  'attr': '용',
  'name': '용애호가',
  'condition': 16,
  'reward': 500,
  'burf': [0, 0, 4, 4, 2, 0]
}, {
  'type': 2,
  'attr': '용',
  'name': '용매니아',
  'condition': 24,
  'reward': 1000,
  'burf': [0, 0, 6, 6, 3, 0]
}, {
  'type': 2,
  'attr': '용',
  'name': '용짐리더',
  'condition': 32,
  'reward': 2000,
  'burf': [0, 0, 8, 8, 4, 0]
}, {
  'type': 2,
  'attr': '용',
  'name': '용챔피언',
  'condition': 40,
  'reward': 3000,
  'burf': [0, 0, 10, 10, 5, 0]
}, {
  'type': 2,
  'attr': '용',
  'name': '용마스터',
  'condition': 47,
  'reward': 5000,
  'burf': [0, 0, 16, 16, 8, 0]
}, {
  'type': 2,
  'attr': '악',
  'name': '악수집가',
  'condition': 8,
  'reward': 200,
  'burf': [1, 1, 0, 0, 2, 1]
}, {
  'type': 2,
  'attr': '악',
  'name': '악애호가',
  'condition': 16,
  'reward': 500,
  'burf': [2, 2, 0, 0, 4, 2]
}, {
  'type': 2,
  'attr': '악',
  'name': '악매니아',
  'condition': 24,
  'reward': 1000,
  'burf': [3, 3, 0, 0, 6, 3]
}, {
  'type': 2,
  'attr': '악',
  'name': '악짐리더',
  'condition': 32,
  'reward': 2000,
  'burf': [4, 4, 0, 0, 8, 4]
}, {
  'type': 2,
  'attr': '악',
  'name': '악챔피언',
  'condition': 40,
  'reward': 3000,
  'burf': [5, 5, 0, 0, 10, 5]
}, {
  'type': 2,
  'attr': '악',
  'name': '악마스터',
  'condition': 49,
  'reward': 5000,
  'burf': [8, 8, 0, 0, 16, 8]
}, {
  'type': 2,
  'attr': '강철',
  'name': '강철수집가',
  'condition': 8,
  'reward': 200,
  'burf': [1, 0, 0, 0, 0, 4]
}, {
  'type': 2,
  'attr': '강철',
  'name': '강철애호가',
  'condition': 16,
  'reward': 500,
  'burf': [2, 0, 0, 0, 0, 8]
}, {
  'type': 2,
  'attr': '강철',
  'name': '강철매니아',
  'condition': 24,
  'reward': 1000,
  'burf': [3, 0, 0, 0, 0, 12]
}, {
  'type': 2,
  'attr': '강철',
  'name': '강철짐리더',
  'condition': 32,
  'reward': 2000,
  'burf': [4, 0, 0, 0, 0, 16]
}, {
  'type': 2,
  'attr': '강철',
  'name': '강철챔피언',
  'condition': 40,
  'reward': 3000,
  'burf': [5, 0, 0, 0, 0, 20]
}, {
  'type': 2,
  'attr': '강철',
  'name': '강철마스터',
  'condition': 49,
  'reward': 5000,
  'burf': [8, 0, 0, 0, 0, 32]
}]

export const items = [
  // {
  //   'type': 1, // 1: 포켓몬 보상, 2: 크레딧 충전
  //   'name': { ko: '베이직+레어 채집권' },
  //   'attrs': ['b', 'r'],
  //   'cost': 10
  // },
  // {
  //   'type': 1, // 1: 포켓몬 보상, 2: 크레딧 충전
  //   'name': { ko: '레어 100% 채집권' },
  //   'attrs': ['r'],
  //   'cost': 30
  // },
  // {
  //   'type': 1, // 1: 포켓몬 보상, 2: 크레딧 충전
  //   'name': { ko: '엘리트 100% 채집권' },
  //   'attrs': ['e'],
  //   'cost': 2000
  // },
  {
    'type': 1, // 1: 포켓몬 보상, 2: 크레딧 충전
    'name': { ko: '레전드 100% 채집권' },
    'grades': ['l'],
    'cost': 10000,
    'seq': 4,
    'description': { ko: '레전드등급의 포켓몬을 즉시 채집합니다.' },
    'img': 'https://firebasestorage.googleapis.com/v0/b/hand-pokemon-2.appspot.com/o/itemImages%2Fitem6.png?alt=media&token=0e2770f8-8ca1-4e60-8548-a4ed98a221f2'
  }
  // {
  //   'type': 2, // 1: 포켓몬 보상, 2: 크레딧 충전
  //   'name': { ko: '채집크레딧 충전권' },
  //   'creditType': 'pick',
  //   'cost': 50
  // },
  // {
  //   'type': 2, // 1: 포켓몬 보상, 2: 크레딧 충전
  //   'name': { ko: '시합크레딧 충전권' },
  //   'creditType': 'battle',
  //   'cost': 100
  // }
]
