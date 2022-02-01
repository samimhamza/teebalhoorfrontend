import config from "./src/configs";

const { locale, availableLocales, fallbackLocale } = config.locales;
const { gaId } = config.analytics;

export default {
  srcDir: "src/",

  loading: "./components/LoadingComponent.vue",

  // ssr: false,
  // target: 'static',

  // server:{
  //   host: '0.0.0.0',
  // },
  head: {
    titleTemplate: "%s - nuxt",
    title: "nuxt",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;600;700&display=swap",
      },
      ...config.icons.map((href) => ({ rel: "stylesheet", href })),
    ],
    script: [
      {
        src: "/assets/lottie-player.js",
      },
    ],
  },

  css: ["~/assets/scss/theme.scss", "~/assets/main.scss"],

  plugins: [
    // plugins
    { src: "~/plugins/Vuelidate.js", mode: "all" },
    { src: "~/plugins/vue-toastr.js", mode: "client" },
    { src: "~/plugins/lodash.js", mode: "all" },
    { src: "~/plugins/animate.js", mode: "client" },
    { src: "~/plugins/apexcharts.js", mode: "client" },
    { src: "~/plugins/clipboard.js", mode: "client" },
    { src: "~/plugins/vue-shortkey.js", mode: "client" },
    { src: "~/plugins/draggable.js", mode: "client" },
    { src: "~/plugins/csvExport.js", mode: "client" },
    { src: "~/plugins/vuetify.js", mode: "client" },
    { src: "~/plugins/global.js", mode: "all" },
    { src: "~/plugins/editor.js", mode: "client" },

    // // // filters
    { src: "~/filters/capitalize.js" },
    { src: "~/filters/lowercase.js" },
    { src: "~/filters/uppercase.js" },
    { src: "~/filters/formatDate.js" },
  ],

  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    [
      "@nuxtjs/vuetify",
      {
        customVariables: ["~/assets/scss/vuetify/variables/_index.scss"],
        optionsPath: "~/configs/vuetify.js",
        treeShake: true,
        defaultAssets: {
          font: false,
        },
      },
    ],
    [
      "nuxt-i18n",
      {
        detectBrowserLanguage: {
          useCookie: true,
          cookieKey: "i18n_redirected",
        },
        locales: availableLocales,
        lazy: true,
        langDir: "translations/",
        defaultLocale: locale,
        vueI18n: {
          fallbackLocale,
        },
      },
    ],
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    "@nuxtjs/auth-next",
    "@nuxtjs/google-gtag",
    "@nuxtjs/axios",
    [
      "nuxt-sweetalert2",
      {
        confirmButtonColor: "#FF5252",
        cancelButtonColor: "#2c7be5",
      },
    ],
    [
      "vuejs-google-maps/nuxt",
      {
        apiKey: "AIzaSyDNtpPnk9q69exb8wEGA_XYIM5YJlJR9aI",
        libraries: ["places"],
      },
    ],
    "vue2-editor/nuxt",
  ],

  "google-gtag": {
    id: gaId,
    debug: true, // enable to track in dev mode
    disableAutoPageTrack: false, // disable if you don't want to track each page route with router.afterEach(...).
  },

  axios: {
    baseURL: "https://teebalhoor2.code9ine.com/api/v1",
    // baseURL: "http://localhost:8000/api/v1",
    //baseURL: "http://192.168.3.90:8000/api/v1",
    credentials: true,
    changeOrigin: true,
    common: {
      Accept: "application/json",
    },
  },

  auth: {
    redirect: {
      login: "/auth/signin",
      logout: "/auth/signin",
      callback: "/auth/signin",
      home: false,
    },
    strategies: {
      local: {
        token: {
          property: "token",
          global: true,
          required: true,
          type: "Bearer",
        },
        user: {
          property: "data",
          autoFetch: true,
        },
        endpoints: {
          login: { url: "/login", method: "post" },
          logout: { url: "/logout", method: "post" },
          user: { url: "/auth/user", method: "get" },
        },
      },
    },
  },

  router: {
    middleware: ["auth", "authScope"],
  },

  build: {},
};
