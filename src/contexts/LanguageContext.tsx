import { createContext, useContext, useState, ReactNode } from "react";

type Language = "es" | "en" | "fr" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  es: {
    login: "Iniciar Sesión",
    email: "Correo electrónico",
    password: "Contraseña",
    dashboard: "Panel",
    history: "Historial",
    logout: "Cerrar Sesión",
    orders: "Comandas",
    placed: "Recibidas",
    ack: "Confirmadas",
    in_progress: "En Proceso",
    ready: "Listas",
    delivered: "Entregadas",
    table: "Mesa",
    notes: "Notas",
    items: "Artículos",
  },
  en: {
    login: "Login",
    email: "Email",
    password: "Password",
    dashboard: "Dashboard",
    history: "History",
    logout: "Logout",
    orders: "Orders",
    placed: "Placed",
    ack: "Acknowledged",
    in_progress: "In Progress",
    ready: "Ready",
    delivered: "Delivered",
    table: "Table",
    notes: "Notes",
    items: "Items",
  },
  fr: {
    login: "Connexion",
    email: "E-mail",
    password: "Mot de passe",
    dashboard: "Tableau de bord",
    history: "Historique",
    logout: "Déconnexion",
    orders: "Commandes",
    placed: "Reçues",
    ack: "Confirmées",
    in_progress: "En cours",
    ready: "Prêtes",
    delivered: "Livrées",
    table: "Table",
    notes: "Notes",
    items: "Articles",
  },
  ar: {
    login: "تسجيل الدخول",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    dashboard: "لوحة التحكم",
    history: "السجل",
    logout: "تسجيل الخروج",
    orders: "الطلبات",
    placed: "مستلمة",
    ack: "مؤكدة",
    in_progress: "قيد التنفيذ",
    ready: "جاهزة",
    delivered: "مسلمة",
    table: "طاولة",
    notes: "ملاحظات",
    items: "عناصر",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es");

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.es] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div dir={language === "ar" ? "rtl" : "ltr"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
