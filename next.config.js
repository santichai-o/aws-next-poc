const isProd = process.env.NODE_ENV === 'production'

module.exports = isProd
  ? require('./next.config.prod')
  : require('./next.config.dev')