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

export const generations = ['1', '2', '3', '4', '5', '6']

export const districts = [
  {
    name: '황량한 대지',
    attrs: ['노말', '땅', '유령'],
    color: colors.brown
  },
  {
    name: '뜨끈한 불지옥',
    attrs: ['불꽃', '비행', '강철'],
    color: colors.red
  },
  {
    name: '신비로운 동굴',
    attrs: ['염력', '독', '용'],
    color: colors.indigo
  },
  {
    name: '어둠의 탑',
    attrs: ['전기', '벌레', '악'],
    color: colors.black
  },
  {
    name: '수련자의 숲',
    attrs: ['풀', '격투', '바위'],
    color: colors.green
  },
  {
    name: '요정의 바다',
    attrs: ['물', '얼음', '요정'],
    color: colors.lightBlue
  },
  {
    name: '중앙던전',
    attrs: ['노말', '땅', '유령', '불꽃', '비행', '강철', '염력', '독', '용', '전기', '벌레', '악', '풀', '격투', '바위', '물', '얼음', '요정'],
    color: '#e0e0e0'
  }
]
