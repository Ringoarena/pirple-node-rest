var parser = {
  jsonToObject: (json) => {
    try {
      return JSON.parse(json)
    } catch (error) {
      return {}
    }
  },
  getNumber: () => {
    return 1
  }
}

module.exports = parser