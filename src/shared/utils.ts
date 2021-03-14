function filterByKeys(obj: any, keys: Array<any>): any {
  return Object.keys(obj)
    .filter((key) => keys.includes(key))
    .reduce((obj_, key) => {
      return {
        ...obj_,
        [key]: obj[key],
      }
    }, {})
}

async function sleep(t) {
  return await new Promise((r) => setTimeout(r, t))
}

function debounce(f, t = 0) {
  let timeout
  return function (...args) {
    const later = () => {
      timeout = null
      f(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, t)
  }
}

export { filterByKeys, sleep, debounce }
