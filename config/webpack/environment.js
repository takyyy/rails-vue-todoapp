const { environment } = require('@rails/webpacker')
const vue =  require('./loaders/vue')

// environment.loaders.get('vue').options.extractCSS = false
environment.loaders.append('vue', vue)
module.exports = environment
