import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources for all supported languages
const resources = {
  en: {
    translation: {
      // Common
      welcome: "Welcome to KrishiAI",
      logout: "Logout",
      loading: "Loading...",
      error: "Error",
      submit: "Submit",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      search: "Search",
      filter: "Filter",
      
      // Auth
      login: "Login",
      register: "Register",
      username: "Username",
      password: "Password",
      fullName: "Full Name",
      phoneNumber: "Phone Number",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      
      // Location
      state: "State",
      district: "District",
      village: "Village",
      selectState: "Select State",
      selectDistrict: "Select District",
      
      // Farm Details
      farmSize: "Farm Size (acres)",
      soilType: "Soil Type",
      primaryCrop: "Primary Crop",
      
      // Navigation
      dashboard: "Dashboard",
      news: "News & Updates",
      diseaseDetection: "Disease Detection",
      cropRecommendation: "Crop Recommendation",
      aiAssistant: "AI Assistant",
      schemes: "Government Schemes",
      
      // Dashboard
      farmAnalytics: "Farm Analytics",
      cropHealth: "Crop Health",
      weatherForecast: "Weather Forecast",
      marketPrices: "Market Prices",
      recentActivity: "Recent Activity",
      
      // News
      latestNews: "Latest Agricultural News",
      viewFullArticle: "View Full Article",
      listenToArticle: "Listen to Article",
      newsCategories: "Categories",
      
      // Disease Detection
      uploadImage: "Upload Crop Image",
      detectDisease: "Detect Disease",
      diseaseDetected: "Disease Detected",
      treatment: "Treatment",
      confidence: "Confidence",
      dragDropImage: "Drag and drop an image here, or click to select",
      
      // Crop Recommendation
      getCropRecommendation: "Get Crop Recommendation",
      budget: "Budget (₹)",
      climate: "Climate",
      recommendedCrops: "Recommended Crops",
      
      // AI Chat
      askQuestion: "Ask a question...",
      voiceInput: "Voice Input",
      typingMessage: "AI is typing...",
      
      // Schemes
      governmentSchemes: "Government Schemes",
      eligibility: "Eligibility",
      benefits: "Benefits",
      howToApply: "How to Apply",
      
      // Languages
      selectLanguage: "Select Language",
      english: "English",
      hindi: "हिंदी",
      telugu: "తెలుగు",
      tamil: "தமிழ்",
      kannada: "ಕನ್ನಡ",
    }
  },
  hi: {
    translation: {
      // Common
      welcome: "KrishiAI में आपका स्वागत है",
      logout: "लॉग आउट",
      loading: "लोड हो रहा है...",
      error: "त्रुटि",
      submit: "जमा करें",
      cancel: "रद्द करें",
      save: "सहेजें",
      delete: "हटाएं",
      edit: "संपादित करें",
      search: "खोजें",
      filter: "फ़िल्टर",
      
      // Auth
      login: "लॉगिन",
      register: "रजिस्टर",
      username: "उपयोगकर्ता नाम",
      password: "पासवर्ड",
      fullName: "पूरा नाम",
      phoneNumber: "फोन नंबर",
      alreadyHaveAccount: "पहले से खाता है?",
      dontHaveAccount: "खाता नहीं है?",
      
      // Location
      state: "राज्य",
      district: "जिला",
      village: "गाँव",
      selectState: "राज्य चुनें",
      selectDistrict: "जिला चुनें",
      
      // Farm Details
      farmSize: "खेत का आकार (एकड़)",
      soilType: "मिट्टी का प्रकार",
      primaryCrop: "मुख्य फसल",
      
      // Navigation
      dashboard: "डैशबोर्ड",
      news: "समाचार और अपडेट",
      diseaseDetection: "रोग का पता लगाना",
      cropRecommendation: "फसल सिफारिश",
      aiAssistant: "AI सहायक",
      schemes: "सरकारी योजनाएं",
      
      // Dashboard
      farmAnalytics: "खेत विश्लेषण",
      cropHealth: "फसल स्वास्थ्य",
      weatherForecast: "मौसम पूर्वानुमान",
      marketPrices: "बाजार मूल्य",
      recentActivity: "हाल की गतिविधि",
      
      // News
      latestNews: "नवीनतम कृषि समाचार",
      viewFullArticle: "पूरा लेख देखें",
      listenToArticle: "लेख सुनें",
      newsCategories: "श्रेणियां",
      
      // Disease Detection
      uploadImage: "फसल की तस्वीर अपलोड करें",
      detectDisease: "रोग का पता लगाएं",
      diseaseDetected: "रोग का पता चला",
      treatment: "उपचार",
      confidence: "विश्वास",
      dragDropImage: "यहां एक छवि खींचें और छोड़ें, या चुनने के लिए क्लिक करें",
      
      // Crop Recommendation
      getCropRecommendation: "फसल सिफारिश प्राप्त करें",
      budget: "बजट (₹)",
      climate: "जलवायु",
      recommendedCrops: "अनुशंसित फसलें",
      
      // AI Chat
      askQuestion: "एक प्रश्न पूछें...",
      voiceInput: "ध्वनि इनपुट",
      typingMessage: "AI टाइप कर रहा है...",
      
      // Schemes
      governmentSchemes: "सरकारी योजनाएं",
      eligibility: "पात्रता",
      benefits: "लाभ",
      howToApply: "कैसे आवेदन करें",
      
      // Languages
      selectLanguage: "भाषा चुनें",
      english: "English",
      hindi: "हिंदी",
      telugu: "తెలుగు",
      tamil: "தமிழ்",
      kannada: "ಕನ್ನಡ",
    }
  },
  te: {
    translation: {
      welcome: "KrishiAI కి స్వాగతం",
      logout: "లాగౌట్",
      loading: "లోడ్ అవుతోంది...",
      error: "లోపం",
      submit: "సమర్పించండి",
      cancel: "రద్దు చేయండి",
      save: "సేవ్ చేయండి",
      login: "లాగిన్",
      register: "రిజిస్టర్",
      username: "వినియోగదారు పేరు",
      password: "పాస్‌వర్డ్",
      fullName: "పూర్తి పేరు",
      state: "రాష్ట్రం",
      district: "జిల్లా",
      village: "గ్రామం",
      dashboard: "డాష్‌బోర్డ్",
      news: "వార్తలు మరియు నవీకరణలు",
      diseaseDetection: "వ్యాధి గుర్తింపు",
      cropRecommendation: "పంట సిఫార్సు",
      aiAssistant: "AI సహాయకుడు",
      schemes: "ప్రభుత్వ పథకాలు",
      selectLanguage: "భాషను ఎంచుకోండి",
      english: "English",
      hindi: "हिंदी",
      telugu: "తెలుగు",
      tamil: "தமிழ்",
      kannada: "ಕನ್ನಡ",
    }
  },
  ta: {
    translation: {
      welcome: "KrishiAI க்கு வரவேற்கிறோம்",
      logout: "வெளியேறு",
      loading: "ஏற்றுகிறது...",
      error: "பிழை",
      submit: "சமர்ப்பிக்கவும்",
      cancel: "ரத்து செய்",
      save: "சேமி",
      login: "உள்நுழைய",
      register: "பதிவு",
      username: "பயனர் பெயர்",
      password: "கடவுச்சொல்",
      fullName: "முழு பெயர்",
      state: "மாநிலம்",
      district: "மாவட்டம்",
      village: "கிராமம்",
      dashboard: "டாஷ்போர்டு",
      news: "செய்திகள் மற்றும் புதுப்பிப்புகள்",
      diseaseDetection: "நோய் கண்டறிதல்",
      cropRecommendation: "பயிர் பரிந்துரை",
      aiAssistant: "AI உதவியாளர்",
      schemes: "அரசு திட்டங்கள்",
      selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
      english: "English",
      hindi: "हिंदी",
      telugu: "తెలుగు",
      tamil: "தமிழ்",
      kannada: "ಕನ್ನಡ",
    }
  },
  kn: {
    translation: {
      welcome: "KrishiAI ಗೆ ಸುಸ್ವಾಗತ",
      logout: "ಲಾಗ್ ಔಟ್",
      loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
      error: "ದೋಷ",
      submit: "ಸಲ್ಲಿಸಿ",
      cancel: "ರದ್ದುಮಾಡಿ",
      save: "ಉಳಿಸಿ",
      login: "ಲಾಗಿನ್",
      register: "ನೋಂದಣಿ",
      username: "ಬಳಕೆದಾರ ಹೆಸರು",
      password: "ಪಾಸ್ವರ್ಡ್",
      fullName: "ಪೂರ್ಣ ಹೆಸರು",
      state: "ರಾಜ್ಯ",
      district: "ಜಿಲ್ಲೆ",
      village: "ಗ್ರಾಮ",
      dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      news: "ಸುದ್ದಿ ಮತ್ತು ನವೀಕರಣಗಳು",
      diseaseDetection: "ರೋಗ ಪತ್ತೆ",
      cropRecommendation: "ಬೆಳೆ ಶಿಫಾರಸು",
      aiAssistant: "AI ಸಹಾಯಕ",
      schemes: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
      selectLanguage: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      english: "English",
      hindi: "हिंदी",
      telugu: "తెలుగు",
      tamil: "தமிழ்",
      kannada: "ಕನ್ನಡ",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
