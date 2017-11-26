export const badgeStyle = {
  fontStyle: 'normal',
  backgroundColor: 'red',
  padding: '1px 5px 3px',
  borderRadius: '2px',
  fontSize: '11px',
  lineHeight: '15px',
  margin: '1px',
  fontWeight: 'bold',
  display: 'inline'
}

export const levelBadgeStyle = Object.assign({}, badgeStyle, {
  backgroundColor: '#03A9F4',
  color: 'white'
})

export const rankBadgeStyle = rank => {
  let bgColor
  if (rank === 'SS') {
    bgColor = '#F44336'
  } else if (rank === 'S') {
    bgColor = '#9C27B0'
  } else if (rank === 'A') {
    bgColor = '#673AB7'
  } else if (rank === 'B') {
    bgColor = '#009688'
  } else if (rank === 'C') {
    bgColor = '#8BC34A'
  } else if (rank === 'D') {
    bgColor = '#795548'
  } else if (rank === 'E') {
    bgColor = '#607D8B'
  } else if (rank === 'F') {
    bgColor = '#000000'
  }
  return Object.assign({}, badgeStyle, {
    backgroundColor: bgColor,
    color: 'white',
    position: 'absolute',
    top: '0px'
  })
}

export const creditBadgeStyle = Object.assign({}, badgeStyle, {
  color: 'white',
  position: 'relative',
  left: '0px',
  float: 'right',
  width: 'auto',
  minWidth: '25px'
})

export const nullContainerHeight = window.innerHeight - 280

export const fontSizeByDamage = damage => {
  if (damage < 150) {
    return '16px'
  } else if (damage < 200) {
    return '18px'
  } else if (damage < 250) {
    return '20px'
  } else if (damage < 300) {
    return '22px'
  } else if (damage < 350) {
    return '24px'
  } else if (damage < 400) {
    return '26px'
  } else {
    return '28px'
  }
}
