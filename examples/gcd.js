function gcd(bob, job) {
  let greater = 0
  let lesser = 0

  if (bob === job) {
    return bob
  } else if (bob > job) {
    greater = bob
    lesser = job
  } else {
    greater = job
    lesser = bob
  }

  let gcd = 0

  while (lesser > 0) {
    gcd = lesser
    lesser = greater % gcd
    greater = gcd
  }

  return gcd
}
