import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

import en from './en';
import vi from './vi';

i18n.use(initReactI18next).init({
  debug: true,
  fallbackLng: 'vi',
  resources: { en, vi }
});

export default i18n;
