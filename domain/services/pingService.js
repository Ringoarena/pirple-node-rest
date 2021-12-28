var pingService = {
  ping: () => {
    const isHealthy = 1 + 1 === 2
    return {
      isHealthy,
      message: isHealthy ? 'healthy' : 'unhealthy'
    }
  }
}

module.exports = pingService