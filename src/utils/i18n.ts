export type SupportedLanguage = 'en' | 'es' | 'de' | 'fr' | 'ja' | 'hi';

export interface LanguageInfo {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: 'US' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', flag: 'ES' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch', flag: 'DE' },
  { code: 'fr', label: 'French', nativeLabel: 'Français', flag: 'FR' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語', flag: 'JP' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: 'IN' }
];

export const UI_TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    liveAdvisory: 'LIVE ADVISORY',
    zeroTrust: 'ZERO-TRUST',
    saved: 'Saved',
    allArticles: 'All Research',
    cybersecurity: 'Cybersecurity',
    trendingAi: 'Autonomous Systems & Productivity',
    blueprint: 'Blueprint',
    tools: 'Tools & Apps',
    searchPlaceholder: 'Search 59+ deep research publications...',
    tagline: 'Autonomous Cybersecurity Research • Sovereign Local Compute • Defensive Architecture',
    readTime: 'min read',
    tableOfContents: 'Table of Contents',
    shareArticle: 'Share Article',
    downloadMarkdown: 'Download Markdown',
    saveArticle: 'Save to Bookmarks',
    footerCopyright: '© 2013–2026 YinYangYoHackers • Founded by Vishwas Aithal. Educational & Authorized Defensive Use Only.'
  },
  es: {
    liveAdvisory: 'AVISO EN VIVO',
    zeroTrust: 'CERO-CONFIANZA',
    saved: 'Guardados',
    allArticles: 'Todas las Investigaciones',
    cybersecurity: 'Ciberseguridad',
    trendingAi: 'IA y Productividad',
    blueprint: 'Planos y Arquitectura',
    tools: 'Herramientas y Apps',
    searchPlaceholder: 'Buscar en 59+ publicaciones de investigación...',
    tagline: 'Investigación Autónoma en Ciberseguridad • IA Soberana Local • Arquitectura Defensiva',
    readTime: 'min de lectura',
    tableOfContents: 'Tabla de Contenidos',
    shareArticle: 'Compartir Artículo',
    downloadMarkdown: 'Descargar Markdown',
    saveArticle: 'Guardar en Marcadores',
    footerCopyright: '© 2013–2026 YinYangYoHackers • Fundado por Vishwas Aithal. Solo para Uso Defensivo Autorizado.'
  },
  de: {
    liveAdvisory: 'LIVE-WARNUNG',
    zeroTrust: 'ZERO-TRUST',
    saved: 'Gespeichert',
    allArticles: 'Alle Forschungen',
    cybersecurity: 'Cybersicherheit',
    trendingAi: 'KI & Produktivität',
    blueprint: 'Blaupausen',
    tools: 'Werkzeuge & Apps',
    searchPlaceholder: 'Durchsuche 59+ Sicherheitsforschungen...',
    tagline: 'Autonome Cybersicherheitsforschung • Souveräne lokale KI • Defensive Architektur',
    readTime: 'Min. Lesezeit',
    tableOfContents: 'Inhaltsverzeichnis',
    shareArticle: 'Artikel teilen',
    downloadMarkdown: 'Markdown herunterladen',
    saveArticle: 'Lesezeichen setzen',
    footerCopyright: '© 2013–2026 YinYangYoHackers • Gegründet von Vishwas Aithal. Nur zur autorisierten defensiven Nutzung.'
  },
  fr: {
    liveAdvisory: 'ALERTE EN DIRECT',
    zeroTrust: 'ZERO-TRUST',
    saved: 'Enregistrés',
    allArticles: 'Toutes les Recherches',
    cybersecurity: 'Cybersécurité',
    trendingAi: 'IA & Productivité',
    blueprint: 'Plans d\'Architecture',
    tools: 'Outils & Applications',
    searchPlaceholder: 'Rechercher parmi 59+ publications de recherche...',
    tagline: 'Recherche Autonome en Cybersécurité • IA Souveraine Locale • Architecture Défensive',
    readTime: 'min de lecture',
    tableOfContents: 'Table des Matières',
    shareArticle: 'Partager l\'article',
    downloadMarkdown: 'Télécharger en Markdown',
    saveArticle: 'Ajouter aux favoris',
    footerCopyright: '© 2013–2026 YinYangYoHackers • Fondé par Vishwas Aithal. Usage défensif autorisé uniquement.'
  },
  ja: {
    liveAdvisory: 'ライブ警告',
    zeroTrust: 'ゼロトラスト',
    saved: '保存済み',
    allArticles: 'すべての研究論文',
    cybersecurity: 'サイバーセキュリティ',
    trendingAi: 'トレンドAI & 生産性',
    blueprint: 'ブループリント',
    tools: 'ツール & アプリ',
    searchPlaceholder: '59件以上のセキュリティ研究を検索...',
    tagline: '自律型サイバーセキュリティ研究 • 主権型ローカルAI • 防御的アーキテクチャ',
    readTime: '分で読了',
    tableOfContents: '目次',
    shareArticle: '記事を共有',
    downloadMarkdown: 'Markdownをダウンロード',
    saveArticle: 'ブックマークに保存',
    footerCopyright: '© 2013–2026 YinYangYoHackers • Vishwas Aithalにより設立。教育および認可された防御目的のみ。'
  },
  hi: {
    liveAdvisory: 'लाइव सुरक्षा चेतावनी',
    zeroTrust: 'जीरो-ट्रस्ट',
    saved: 'सहेजे गए',
    allArticles: 'सभी शोध लेख',
    cybersecurity: 'साइबर सुरक्षा',
    trendingAi: 'स्वायत्त प्रणालियाँ और उत्पादकता',
    blueprint: 'आर्किटेक्चर ब्लूप्रिंट',
    tools: 'टूल्स और ऐप्स',
    searchPlaceholder: '59+ गहन सुरक्षा शोध खोजें...',
    tagline: 'स्वायत्त साइबर सुरक्षा अनुसंधान • स्थानीय संप्रभु प्रणालियाँ • रक्षात्मक आर्किटेक्चर',
    readTime: 'मिनट पढ़ने का समय',
    tableOfContents: 'सामग्री सूची',
    shareArticle: 'लेख साझा करें',
    downloadMarkdown: 'मार्कडाउन डाउनलोड करें',
    saveArticle: 'बुकमार्क में सहेजें',
    footerCopyright: '© 2013–2026 YinYangYoHackers • Vishwas Aithal द्वारा स्थापित। केवल अधिकृत रक्षात्मक उपयोग हेतु।'
  }
};
