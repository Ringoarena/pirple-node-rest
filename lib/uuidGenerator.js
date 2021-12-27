const generator = {
  generate: () => {
    return Math.random().toString(16).slice(2)
  }
}

module.exports = generator