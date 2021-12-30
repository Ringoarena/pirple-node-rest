var pingService = {
  ping: () => {
    const isHealthy = 1 + 1 === 2
    return {
      isHealthy
    }
  }
}

module.exports = pingService