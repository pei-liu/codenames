const { environment } = require('@rails/webpacker')

module.exports = environment

// Fixes action cable error: https://github.com/rails/rails/issues/35501
environment.loaders.delete('nodeModules')
