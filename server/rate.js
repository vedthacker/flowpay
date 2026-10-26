function getRate(pool) {
  let rate = 3 + pool / 100000
  if (rate > 8) {
    rate = 8
  }
  return rate.toFixed(2)
}

module.exports = getRate
