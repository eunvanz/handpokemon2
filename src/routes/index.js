// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout'
import Home from './Home'
import SignUp from './SignUp'
import SignIn from './SignIn'
import PickMon from './PickMon'
import PickDistrict from './PickDistrict'
import MonManagement from './MonManagement'
import Collection from './Collection'
import Ranking from './Ranking'
import Honor from './Honor'

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => ({
  path        : '/',
  component   : CoreLayout,
  indexRoute  : Home,
  childRoutes : [
    SignUp(store),
    SignIn(store),
    PickMon(store),
    PickDistrict(store),
    MonManagement(store),
    Collection(store),
    Ranking(store),
    Honor(store)
  ]
})

export default createRoutes
