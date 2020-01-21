const path = require('path')
const resolve = dir => path.join(__dirname, '', dir)

module.exports = {
  mode: 'universal',
  // env: {
  //   PORT: '9001'
  // },
  server: {
    // nuxt.js server options ( can be overrided by environment variables )
    port: 9001,
    // host: "0.0.0.0",
  },
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /**
   * Global middleware
   */
  router: {
    middleware: ['auth'],
    extendRoutes(routes) {
      for (const route of routes) {
        route.props = /:/.test(route.path)
        route.meta = {
          title: route.path.replace('/', ''),
          icon: route.path.replace('/', '')
        }
        if (route.children) {
          for (const item of route.children) {
            item.meta = {
              title: item.name,
              icon: item.name
            }
            item.props = /:/.test(item.path)
          }
        }
      }
      routes.push({
        name: 'error-fallback',
        path: '*',
        component: resolve('pages/error/404.vue')
      })
    }
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#409eff' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/css/global.scss',
    '~/vendor/styles/index.scss',
    'element-ui/lib/theme-chalk/index.css',
    'normalize.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/global-components',
    '~/plugins/prototype',
    '~/plugins/axios',
    '~/plugins/utils'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/style-resources'
  ],

  styleResources: {
    scss: ['~/assets/css/variables.scss', '~/assets/css/mixins.scss']
  },
  /*
  ** Axios module configuration
  */
  // axios: {
  // See https://github.com/nuxt-community/axios-module#options
  // },

  /*
  ** Build configuration
  */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, { isDev, isClient }) {
      // Run ESLint on save
      if (isDev && isClient) {
        config.module.rules.push({
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules|vendor)/,
          enforce: 'pre'
        })
      }
    },
    extractCSS: true,
    plugins: (() => {
      return []
    })(),
    babel: {}
  }
}
