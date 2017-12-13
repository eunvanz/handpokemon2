import React, { Component } from 'react'
import { node, oneOfType, string, array, bool, object } from 'prop-types'
import unloaderImage from './assets/unloader.png'
import loaderImage from './assets/loader.png'
import shallowCompare from 'react-addons-shallow-compare'

import { setBoardUserProfile } from 'services/BoardService'

const cache = {}
class Img extends Component {
  static propTypes = {
    loader: node,
    unloader: node,
    src: oneOfType([string, array]),
    cache: bool,
    profile: string,
    firebase: object,
    user: object,
    isUserProfile: bool,
    profilePath: string
  }

  static defaultProps = {
    loader: <img src={loaderImage} style={{ width: '100%' }} />,
    unloader: <img src={unloaderImage} style={{ width: '100%' }} />,
    src: []
  }

  constructor (props) {
    super(props)

    this.sourceList = this.srcToArray(this.props.src)

    // console.log('this.sourceList', this.sourceList)
    // console.log('cache', cache)
    // console.log('cache.length', Object.keys(cache).length)

    if (this.props.cache) {
      // check cache to decide at which index to start
      for (let i = 0; i < this.sourceList.length; i++) {
        // if we've never seen this image before, the cache wont help.
        // no need to look further, just start loading
        /* istanbul ignore else */
        if (!(this.sourceList[i] in cache)) break
  
        // if we have loaded this image before, just load it again
        /* istanbul ignore else */
        if (cache[this.sourceList[i]] === true) {
          this.state = { currentIndex: i, isLoading: false, isLoaded: true }
          return true
        }
      }
    }

    this.state = this.sourceList.length
      // 'normal' opperation: start at 0 and try to load
      ? { currentIndex: 0, isLoading: true, isLoaded: false, updatedImage: null }
      // if we dont have any sources, jump directly to unloaded
      : { isLoading: false, isLoaded: false, updatedImage: null }
  }

  srcToArray = src => (Array.isArray(src) ? src : [src]).filter(x => x)

  onLoad = () => {
    cache[this.sourceList[this.state.currentIndex]] = true
    /* istanbul ignore else */
    if (this.i) this.setState({ isLoaded: true })
  }

  onError = () => {
    cache[this.sourceList[this.state.currentIndex]] = false
    // if the current image has already been destroyed, we are probably no longer mounted
    // no need to do anything then
    /* istanbul ignore else */
    if (!this.i) return false

    // before loading the next image, check to see if it was ever loaded in the past
    for (var nextIndex = this.state.currentIndex + 1; nextIndex < this.sourceList.length; nextIndex++) {
      // get next img
      let src = this.sourceList[nextIndex]

      // if we have never seen it, its the one we want to try next
      if (!(src in cache)) {
        this.setState({ currentIndex: nextIndex })
        break
      }

      // if we know it exists, use it!
      if (cache[src] === true) {
        this.setState({ currentIndex: nextIndex, isLoading: false, isLoaded: true })
        return true
      }

      // if we know it doesn't exist, skip it!
      /* istanbul ignore else */
      if (cache[src] === false) continue
    }

    // currentIndex is zero bases, length is 1 based.
    // if we have no more sources to try, return - we are done
    if (nextIndex === this.sourceList.length) return this.setState({ isLoading: false })

    // otherwise, try the next img
    this.loadImg()
  }

  loadImg = () => {
    this.i = new Image()
    this.i.src = this.sourceList[this.state.currentIndex]
    this.i.onload = this.onLoad
    this.i.onerror = this.onError
  }

  unloadImg = () => {
    delete this.i.onerror
    delete this.i.onload
    delete this.i.src
    delete this.i
  }

  componentDidMount () {
    // kick off process
    /* istanbul ignore else */
    if (this.state.isLoading) this.loadImg()
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentWillUnmount () {
    // ensure that we dont leave any lingering listeners
    /* istanbul ignore else */
    if (this.i) this.unloadImg()
  }

  componentWillReceiveProps (nextProps) {
    let src = this.srcToArray(nextProps.src)

    let srcAdded = src.filter(s => this.sourceList.indexOf(s) === -1)
    let srcRemoved = this.sourceList.filter(s => src.indexOf(s) === -1)

    // if src prop changed, restart the loading process
    if (srcAdded.length || srcRemoved.length) {
      this.sourceList = src

      // if we dont have any sources, jump directly to unloader
      if (!src.length) return this.setState({ isLoading: false, isLoaded: false })
      this.setState({ currentIndex: 0, isLoading: true, isLoaded: false }, this.loadImg)
    }
  }

  render () {
    // console.log('isLoading, isLoaded', this.state.isLoading + ', ' + this.state.isLoaded)
    // console.log(this.sourceList[this.state.currentIndex])
    const { src, loader, unloader, isUserProfile, profilePath, firebase, user, cache, ...rest } = this.props
    // if we have loaded, show img
    if (this.state.isLoaded) {
      // clear non img props
      return <img src={this.sourceList[this.state.currentIndex]} {...rest} />
    }

    // if we are still trying to load, show img and a loader if requested
    // if (!this.state.isLoaded && this.state.isLoading) return this.props.loader ? this.props.loader : null
    if (!this.state.isLoaded && this.state.isLoading) return <img src={loaderImage} {...rest} />

    // if we have given up on loading, show a place holder if requested, or nothing
    /* istanbul ignore else */
    // if (!this.state.isLoaded && !this.state.isLoading) return this.props.unloader ? this.props.unloader : null
    if (!this.state.isLoaded && !this.state.isLoading) {
      if (this.props.isUserProfile) {
        // 해당 게시물의 writer의 프로필사진 정보를 업데이트
        const { profilePath, firebase, user } = this.props
        setBoardUserProfile(firebase, profilePath, user.id).then(img => this.setState({ updatedImage: img }))
        return <img src={this.state.updatedImage || loaderImage} {...rest} />
      } else {
        return <img src={unloaderImage} {...rest} />
      }
    }
  }
}

export default Img

// import React from 'react'
// import PropTypes from 'prop-types'
// import ReactImage from 'react-image'

// import unloader from './assets/unloader.png'

// // import Loading from 'components/Loading'

// class Img extends React.Component {
//   render () {
//     const { src, ...rest } = this.props
//     const newSrc = [src, unloader]
//     return (
//       <ReactImage src={newSrc} {...rest} loader={<img src={unloader} style={{ width: '100%' }} />} />
//     )
//   }
// }

// Img.propTypes = {
//   src: PropTypes.string.isRequired
// }

// export default Img
