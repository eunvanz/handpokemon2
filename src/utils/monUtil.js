export const getMonImage = mon => {
  if (mon.mon) {
    return mon.mon.monImage.filter(monImage => mon.imageSeq === monImage.seq)[0]
  } else {
    return mon.monImage[0]
  }
}
