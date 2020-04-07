const { environment } = require('@rails/webpacker')

module.exports = environment

// TO DO: Figure out how to not need this line.
// Fixes action cable error: https://github.com/rails/rails/issues/35501
environment.loaders.delete('nodeModules')
