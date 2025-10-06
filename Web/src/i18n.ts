import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from './Locales/en.json'
import tr from './Locales/tr.json'

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en,
            tr,
        },
        fallbackLng: "tr",
        supportedLngs: ["en", "tr"],
        debug: true,
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ["localStorage", "cookie", "navigator"],
            caches: ["localStorage", "cookie"],
        },
    });

export default i18n;