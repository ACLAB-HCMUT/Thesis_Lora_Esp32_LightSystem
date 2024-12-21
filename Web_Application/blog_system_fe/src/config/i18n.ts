import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import vi from "../locales/vi.json";
import i18n from "i18next";

export let defaultLanguage: string = localStorage.getItem("lang") || "vi";

if (defaultLanguage !== "vi" && defaultLanguage !== "en") {
  defaultLanguage = import.meta.env.VITE_DEFAULT_LOCALE as string;
}

const defaultNamespace = "default";

const resources = {
  en: {
    [defaultNamespace]: en,
  },
  vi: {
    [defaultNamespace]: vi,
  },
};

i18n.use(initReactI18next).init({
  defaultNS: defaultNamespace,
  ns: [defaultNamespace],
  resources,
  lng: defaultLanguage,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
