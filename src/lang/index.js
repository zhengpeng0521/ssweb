import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import elementEsLocale from 'element-ui/lib/locale/lang/es'// element-ui lang
import enLocale from './en'
import zhLocale from './zh'
import esLocale from './es'
import defaultLocale from './default'
import dsfLocale from './dsf'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  default: {
    ...zhLocale,
    ...elementZhLocale,
    ...defaultLocale
  },
  dsf: {
    ...zhLocale,
    ...elementZhLocale,
    ...dsfLocale
  },
  es: {
    ...esLocale,
    ...elementEsLocale
  }
}

const i18n = new VueI18n({
  // set locale
  // options: en | zh | es
  locale: Cookies.get('language') || 'default',
  // set locale messages
  messages
})

export default i18n
