import { types } from 'mobx-state-tree';
import Cookies from 'universal-cookie';

import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';

// Translated data
import localeData from '../../../i18n/build/data.json';

const DEFAULT_LANGUAGE = 'en';
const COOKIE_NAME = 'language';

const LocaleStore = types
  .model('LocaleStore', {
    language: types.optional(types.string, DEFAULT_LANGUAGE),
  })
  .volatile(() => ({
    cookies: new Cookies(),
  }))
  .views(self => ({
    get languageWithoutRegionCode() {
      return self.language.toLowerCase().split(/[_-]+/)[0];
    },
    get messages() {
      // Try full locale, try locale without region code, fallback to default language
      return (
        localeData[self.languageWithoutRegionCode]
        || localeData[self.language]
        || localeData.DEFAULT_LANGUAGE
      );
    },
  }))
  .actions((self) => {
    const changeLanguage = (language = '', windowReload = false) => {
      if (self.language === language) return;
      self.language = language;

      // Save to cookie
      self.cookies.set(COOKIE_NAME, language, {
        path: '/',
        maxAge: 24 * 3600 * 30,
      });

      if (windowReload) {
        window.location.reload();
      }
    };

    const afterCreate = () => {
      addLocaleData([...en]);

      // Language from cookie
      const cookieLanguage = self.cookies.get(COOKIE_NAME);

      // Language from user's browser settings
      const browserLanguage = (navigator.languages && navigator.languages[0].split('-')[0])
        || navigator.language
        || navigator.userLanguage;

      self.language = cookieLanguage || browserLanguage;
    };

    return {
      afterCreate,
      changeLanguage,
    };
  });

export default LocaleStore;
