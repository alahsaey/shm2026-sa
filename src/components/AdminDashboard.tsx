import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Skeleton, DashboardOverviewSkeleton, ListSkeleton } from './ui/Skeleton';
import { 
  Database, 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft, 
  Upload, 
  Settings, 
  CheckCircle2, 
  User,
  Type,
  X,
  ChevronLeft,
  PlusCircle,
  FileDown,
  LayoutGrid,
  XCircle,
  ChevronDown,
  ChevronUp,
  Globe,
  Sparkles,
  Loader2,
  HelpCircle,
  Eye,
  EyeOff,
  GripVertical,
  Trophy,
  Users,
  Info,
  AlertCircle,
  Heart,
  Lock,
  Star,
  Book,
  Music,
  Music2,
  Film,
  Mic,
  Image as ImageIcon,
  ExternalLink,
  RefreshCw,
  RotateCcw,
  Search,
  Brain,
  Cpu,
  History,
  Palette,
  Lightbulb,
  Camera,
  Video,
  Map,
  Navigation,
  Flag,
  Languages,
  School,
  GraduationCap,
  Briefcase,
  Layers,
  Award,
  Volume1,
  Download,
  Clock,
  Cloud,
  Code,
  Coffee,
  Compass,
  CreditCard,
  Gift,
  Home,
  Key,
  LifeBuoy,
  Link,
  Mail,
  Moon,
  Phone,
  PieChart,
  Play,
  Power,
  Printer,
  Rocket,
  Shield,
  ShoppingBag,
  Smartphone,
  Sun,
  Tag,
  Terminal,
  Thermometer,
  ThumbsUp,
  Wrench,
  Trash,
  Umbrella,
  Wind,
  Zap,
  QrCode,
  Check,
  BookOpen,
  Volume2,
  VolumeX,
  Link2,
  Hourglass,
  ShieldCheck,
  CloudUpload,
  ArrowRight,
  ArrowUpRight,
  Link as LinkIcon,
  UserCircle,
  Activity,
  List,
} from 'lucide-react';
import { dataService, DBCategory, DBQuestion, DBGroup } from '../lib/dataService';
import { auth } from '../lib/firebase';
import { serverTimestamp } from 'firebase/firestore';
import { INITIAL_CATEGORIES } from '../constants';
import { aiService } from '../services/aiService';

const normalizeText = (text: string): string => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[-_()'"]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const getBrandInfo = (qText: string, aText: string) => {
  const normQ = normalizeText(qText);
  const normA = normalizeText(aText);
  
  const BRANDS = [
    { keys: ["bluetooth", "بلوتوث"], en: "bluetooth", domain: "bluetooth.com" },
    { keys: ["nfc", "اتصال قريب"], en: "nfc", domain: "nfc-forum.org" },
    { keys: ["chatgpt", "شات جي بي تي", "openai", "اوبن"], en: "chatgpt", domain: "openai.com" },
    { keys: ["أرامكو", "ارامكو", "aramco"], en: "aramco", domain: "aramco.com" },
    { keys: ["الهلال", "hilal"], en: "al-hilal", domain: "alhilal.com" },
    { keys: ["النصر", "nassr"], en: "al-nassr", domain: "alnassr.sa" },
    { keys: ["الاتحاد", "ittihad"], en: "al-ittihad", domain: "ittihadclub.sa" },
    { keys: ["الأهلي", "الاهلي", "ahly", "ahli"], en: "al-ahly", domain: "alahlyegypt.com" },
    { keys: ["ريال مدريد", "real madrid"], en: "real-madrid", domain: "realmadrid.com" },
    { keys: ["برشلونة", "barcelona"], en: "barcelona", domain: "fcbarcelona.com" },
    { keys: ["آبل", "ابل", "apple", "ايفون", "iphone"], en: "apple", domain: "apple.com" },
    { keys: ["جوجل", "google"], en: "google", domain: "google.com" },
    { keys: ["كروم", "chrome"], en: "chrome", domain: "google.com/chrome" },
    { keys: ["مايكروسوفت", "microsoft"], en: "microsoft", domain: "microsoft.com" },
    { keys: ["ويندوز", "windows"], en: "windows", domain: "microsoft.com" },
    { keys: ["نايكي", "نايك", "nike"], en: "nike", domain: "nike.com" },
    { keys: ["مرسيدس", "mercedes"], en: "mercedes-benz", domain: "mercedes-benz.com" },
    { keys: ["تويتر", "twitter", "تطبيق x", "x platform"], en: "twitter", domain: "x.com" },
    { keys: ["ماكدونالدز", "mcdonald"], en: "mcdonalds", domain: "mcdonalds.com" },
    { keys: ["سامسونج", "samsung"], en: "samsung", domain: "samsung.com" },
    { keys: ["أديداس", "اديداس", "adidas"], en: "adidas", domain: "adidas.com" },
    { keys: ["بوما", "puma"], en: "puma", domain: "puma.com" },
    { keys: ["تسلا", "تيسلا", "tesla"], en: "tesla", domain: "tesla.com" },
    { keys: ["واي فاي", "wifi", "وايفاي"], en: "wifi", domain: "wi-fi.org" },
    { keys: ["إنتل", "انتل", "intel"], en: "intel", domain: "intel.com" },
    { keys: ["انفيديا", "nvidia"], en: "nvidia", domain: "nvidia.com" },
    { keys: ["بلايستيشن", "playstation"], en: "playstation", domain: "playstation.com" },
    { keys: ["اكس بوكس", "xbox"], en: "xbox", domain: "xbox.com" },
    { keys: ["واتساب", "whatsapp"], en: "whatsapp", domain: "whatsapp.com" },
    { keys: ["انستغرام", "انستقرام", "instagram"], en: "instagram", domain: "instagram.com" },
    { keys: ["فيسبوك", "facebook"], en: "facebook", domain: "facebook.com" },
    { keys: ["يوتيوب", "youtube"], en: "youtube", domain: "youtube.com" },
    { keys: ["سناب شات", "سناب", "snapchat"], en: "snapchat", domain: "snapchat.com" },
    { keys: ["تيك توك", "tiktok"], en: "tiktok", domain: "tiktok.com" },
    { keys: ["سبوتيفاي", "spotify"], en: "spotify", domain: "spotify.com" },
    { keys: ["بيبسي", "pepsi"], en: "pepsi", domain: "pepsi.com" },
    { keys: ["كوكاكولا", "cocacola", "كوكا كولا"], en: "coca-cola", domain: "coca-cola.com" },
    { keys: ["برجر كنج", "برجر كينج", "burger king"], en: "burger-king", domain: "bk.com" },
    { keys: ["ستاربكس", "starbucks"], en: "starbucks", domain: "starbucks.com" }
  ];

  for (const brand of BRANDS) {
    for (const key of brand.keys) {
      if (normQ.includes(normalizeText(key)) || normA.includes(normalizeText(key))) {
        return brand;
      }
    }
  }

  const cleanAns = normA.replace(/[^\w]/g, "");
  if (cleanAns.length > 2 && !normA.includes(" ") && isNaN(Number(cleanAns))) {
    return { en: cleanAns, domain: `${cleanAns}.com` };
  }

  return null;
};

const handleImageError = (
  e: any, 
  qText: string = "", 
  aText: string = ""
) => {
  const target = e.currentTarget;
  const currentTry = parseInt(target.getAttribute('data-try-count') || '0', 10);
  
  console.warn(`Admin Image failed to load: ${target.src} (attempt: ${currentTry})`);
  
  if (currentTry >= 3) {
    target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop';
    return;
  }
  
  target.setAttribute('data-try-count', (currentTry + 1).toString());
  
  const brand = getBrandInfo(qText, aText);
  
  if (currentTry === 0) {
    if (brand && brand.domain) {
      target.src = `https://logo.clearbit.com/${brand.domain}`;
      return;
    }
  } 
  
  if (currentTry === 1) {
    if (brand && brand.en) {
      target.src = `https://img.icons8.com/color/256/${brand.en}.png`;
      return;
    }
  }
  
  const lowerQ = qText.toLowerCase();
  let query = 'abstract';
  if (lowerQ.includes('شعار') || lowerQ.includes('logo') || lowerQ.includes('ماركة')) {
    query = 'logo';
  } else if (lowerQ.includes('تقني') || lowerQ.includes('برمج') || lowerQ.includes('حاسوب') || lowerQ.includes('كمبيوتر')) {
    query = 'technology';
  } else if (lowerQ.includes('كورة') || lowerQ.includes('رياضة') || lowerQ.includes('مباراة') || lowerQ.includes('لاعب')) {
    query = 'sports';
  } else if (lowerQ.includes('تاريخ') || lowerQ.includes('قديم') || lowerQ.includes('ملك') || lowerQ.includes('سعودية')) {
    query = 'history';
  } else if (lowerQ.includes('مصحف') || lowerQ.includes('قرآن') || lowerQ.includes('ديني') || lowerQ.includes('رسول')) {
    query = 'islamic';
  }
  
  target.src = `https://images.unsplash.com/featured/800x600/?${encodeURIComponent(query)}&sig=${Math.floor(Math.random() * 1000)}`;
};

const getProxiedImageUrl = (url: string, qText: string = "", aText: string = ""): string => {
  if (!url) return "";

  const textLower = qText.toLowerCase();
  const ansLower = aText.toLowerCase();

  const FAMOUS_KNOWN_LOGOS: { [key: string]: string } = {
    "bluetooth": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Bluetooth.svg/1024px-Bluetooth.svg.png",
    "بلوتوث": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Bluetooth.svg/1024px-Bluetooth.svg.png",
    "nfc": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/NFC_logo.svg/1024px-NFC_logo.svg.png",
    "اتصال قريب المدى": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/NFC_logo.svg/1024px-NFC_logo.svg.png",
    "chatgpt": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png",
    "شات جي بي تي": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png",
    "أرامكو": "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Saudi_Aramco_logo.svg/1200px-Saudi_Aramco_logo.svg.png",
    "aramco": "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Saudi_Aramco_logo.svg/1200px-Saudi_Aramco_logo.svg.png",
    "الهلال": "https://upload.wikimedia.org/wikipedia/ar/thumb/0/05/Logo_al-hilal.svg/1200px-Logo_al-hilal.svg.png",
    "al-hilal": "https://upload.wikimedia.org/wikipedia/ar/thumb/0/05/Logo_al-hilal.svg/1200px-Logo_al-hilal.svg.png",
    "النصر": "https://upload.wikimedia.org/wikipedia/ar/thumb/1/1e/Logo_Al-Nassr.svg/1024px-Logo_Al-Nassr.svg.png",
    "al-nassr": "https://upload.wikimedia.org/wikipedia/ar/thumb/1/1e/Logo_Al-Nassr.svg/1024px-Logo_Al-Nassr.svg.png",
    "الاتحاد": "https://upload.wikimedia.org/wikipedia/ar/thumb/e/e3/Al_Ittihad_Saudi_Club_logo.svg/1024px-Al_Ittihad_Saudi_Club_logo.svg.png",
    "al-ittihad": "https://upload.wikimedia.org/wikipedia/ar/thumb/e/e3/Al_Ittihad_Saudi_Club_logo.svg/1024px-Al_Ittihad_Saudi_Club_logo.svg.png",
    "الأهلي": "https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Al_Ahly_SC_logo.svg/1024px-Al_Ahly_SC_logo.svg.png",
    "al-ahly": "https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Al_Ahly_SC_logo.svg/1024px-Al_Ahly_SC_logo.svg.png",
    "ريال مدريد": "https://upload.wikimedia.org/wikipedia/ar/thumb/c/c7/Logo_Real_Madrid.svg/1200px-Logo_Real_Madrid.svg.png",
    "real madrid": "https://upload.wikimedia.org/wikipedia/ar/thumb/c/c7/Logo_Real_Madrid.svg/1200px-Logo_Real_Madrid.svg.png",
    "برشلونة": "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28logo%29.svg/1024px-FC_Barcelona_%28logo%29.svg.png",
    "barcelona": "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28logo%29.svg/1024px-FC_Barcelona_%28logo%29.svg.png",
    "آبل": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/800px-Apple_logo_black.svg.png",
    "apple": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/800px-Apple_logo_black.svg.png",
    "جوجل": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
    "google": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
    "chrome": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/1024px-Google_Chrome_icon_%28February_2022%29.svg.png",
    "كروم": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/1024px-Google_Chrome_icon_%28February_2022%29.svg.png",
    "مايكروسوفت": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/1024px-Microsoft_logo_%282012%29.svg.png",
    "microsoft": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/1024px-Microsoft_logo_%282012%29.svg.png",
    "ويندوز": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Windows_logo_-_2021.svg/1024px-Windows_logo_-_2021.svg.png",
    "windows": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Windows_logo_-_2021.svg/1024px-Windows_logo_-_2021.svg.png",
    "نايكي": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png",
    "nike": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png",
    "mercedes": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Benz_Logo_2010.svg/1024px-Mercedes-Benz_Logo_2010.svg.png",
    "مرسيدس": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Benz_Logo_2010.svg/1024px-Mercedes-Benz_Logo_2010.svg.png",
    "twitter": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023_original.svg/1024px-X_logo_2023_original.svg.png",
    "تويتر": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023_original.svg/1024px-X_logo_2023_original.svg.png",
    "mcdonald": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/1200px-McDonald%27s_Golden_Arches.svg.png",
    "ماكدونالدز": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/1200px-McDonald%27s_Golden_Arches.svg.png",
    "samsung": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/1000px-Samsung_Logo.svg.png",
    "سامسونج": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/1000px-Samsung_Logo.svg.png",
    "adidas": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1024px-Adidas_Logo.svg.png",
    "أديداس": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1024px-Adidas_Logo.svg.png",
    "puma": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Puma_Logo.svg/1024px-Puma_Logo.svg.png",
    "بوما": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Puma_Logo.svg/1024px-Puma_Logo.svg.png",
    "wifi": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/WiFi_Logo.svg/1024px-WiFi_Logo.svg.png",
    "واي فاي": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/WiFi_Logo.svg/1024px-WiFi_Logo.svg.png",
    "وايفاي": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/WiFi_Logo.svg/1024px-WiFi_Logo.svg.png",
    "intel": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Intel_logo_%282020%2C_dark_blue%29.svg/1024px-Intel_logo_%282020%2C_dark_blue%29.svg.png",
    "إنتل": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Intel_logo_%282020%2C_dark_blue%29.svg/1024px-Intel_logo_%282020%2C_dark_blue%29.svg.png",
    "amd": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/AMD_Logo.svg/1024px-AMD_Logo.svg.png",
    "nvidia": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Nvidia_logo_and_wordmark.svg/1024px-Nvidia_logo_and_wordmark.svg.png",
    "انفيديا": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Nvidia_logo_and_wordmark.svg/1024px-Nvidia_logo_and_wordmark.svg.png",
    "playstation": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Playstation_logo_colour.svg/1024px-Playstation_logo_colour.svg.png",
    "بلايستيشن": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Playstation_logo_colour.svg/1024px-Playstation_logo_colour.svg.png",
    "xbox": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Xbox_logo_2013.svg/1024px-Xbox_logo_2013.svg.png",
    "اكس بوكس": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Xbox_logo_2013.svg/1024px-Xbox_logo_2013.svg.png",
    "whatsapp": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1024px-WhatsApp.svg.png",
    "واتساب": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1024px-WhatsApp.svg.png",
    "instagram": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1024px-Instagram_logo_2016.svg.png",
    "انستغرام": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1024px-Instagram_logo_2016.svg.png",
    "facebook": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png",
    "فيسبوك": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png",
    "youtube": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/YouTube_Logo_2017.svg/1024px-YouTube_Logo_2017.svg.png",
    "يوتيوب": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/YouTube_Logo_2017.svg/1024px-YouTube_Logo_2017.svg.png",
    "snapchat": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Snapchat_logo.svg/1024px-Snapchat_logo.svg.png",
    "سناب شات": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Snapchat_logo.svg/1024px-Snapchat_logo.svg.png",
    "tiktok": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/TikTok_logo.svg/1024px-TikTok_logo.svg.png",
    "تيك توك": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/TikTok_logo.svg/1024px-TikTok_logo.svg.png",
    "spotify": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1024px-Spotify_logo_without_text.svg.png",
    "سبوتيفاي": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1024px-Spotify_logo_without_text.svg.png",
    "tesla": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/1200px-Tesla_Motors.svg.png",
    "تسلا": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/1200px-Tesla_Motors.svg.png",
    "تيسلا": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/1200px-Tesla_Motors.svg.png",
    "pepsi": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Pepsi_logo_2014.svg/1024px-Pepsi_logo_2014.svg.png",
    "بيبسي": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Pepsi_logo_2014.svg/1024px-Pepsi_logo_2014.svg.png",
    "cocacola": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Coca-Cola_bottle_cap_logo.svg/1024px-Coca-Cola_bottle_cap_logo.svg.png",
    "كوكاكولا": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Coca-Cola_bottle_cap_logo.svg/1024px-Coca-Cola_bottle_cap_logo.svg.png"
  };

  let finalUrl = url;
  for (const key of Object.keys(FAMOUS_KNOWN_LOGOS)) {
    if (textLower.includes(key) || ansLower.includes(key)) {
      finalUrl = FAMOUS_KNOWN_LOGOS[key];
      break;
    }
  }

  if (finalUrl.startsWith("data:") || finalUrl.startsWith("blob:")) return finalUrl;
  
  if (
    finalUrl.includes("wikimedia.org") || 
    finalUrl.includes("wikipedia.org") || 
    finalUrl.includes("icons8.com") ||
    (!finalUrl.includes("unsplash.com") && !finalUrl.includes("pollinations.ai"))
  ) {
    const cleanUrl = finalUrl.replace(/^https?:\/\//, "");
    return `https://wsrv.nl/?url=${encodeURIComponent(cleanUrl)}`;
  }
  return finalUrl;
};

interface AdminDashboardProps {
  onBack: () => void;
  answeredQuestionIds?: string[];
  onResetPlayedQuestions?: () => void;
  onResetGame?: () => void;
  playSound?: (type: 'correct' | 'wrong' | 'victory' | 'intro' | 'click') => void;
  appSettings?: any;
}

const AVAILABLE_ICONS = [
  'LayoutGrid', 'Trophy', 'Users', 'Globe', 'Sparkles', 'HelpCircle', 
  'Heart', 'Lock', 'Settings', 'Star', 'Book', 'Music', 'Film', 'Mic',
  'Brain', 'Cpu', 'History', 'Palette', 'Lightbulb', 'Camera', 'Video',
  'Map', 'Navigation', 'Flag', 'Languages', 'School', 'GraduationCap',
  'ImageIcon', 'Database', 'PlusCircle', 'XCircle',
  'Briefcase', 'Clock', 'Cloud', 'Code', 'Coffee', 'Compass', 'CreditCard', 
  'Eye', 'Gift', 'Home', 'Key', 'LifeBuoy', 'Link', 'Mail', 'Moon', 
  'Phone', 'PieChart', 'Play', 'Power', 'Printer', 'Rocket', 'Shield', 
  'ShoppingBag', 'Smartphone', 'Sun', 'Tag', 'Terminal', 'Thermometer', 
  'ThumbsUp', 'Wrench', 'Trash', 'Umbrella', 'Wind', 'Zap'
];

const ICONS_MAP: Record<string, any> = {
  LayoutGrid, Trophy, Users, Globe, Sparkles, HelpCircle, Heart, Lock, 
  Settings, Star, Book, Music, Film, Mic, Brain, Cpu, History, 
  Palette, Lightbulb, Camera, Video, Map, Navigation, Flag, Languages, 
  School, GraduationCap, ImageIcon, Database, PlusCircle, XCircle,
  Briefcase, Clock, Cloud, Code, Coffee, Compass, CreditCard, Eye, Gift, 
  Home, Key, LifeBuoy, Link, Mail, Moon, Phone, PieChart, Play, Power, 
  Printer, Rocket, Shield, ShoppingBag, Smartphone, Sun, Tag, Terminal, 
  Thermometer, ThumbsUp, Wrench, Trash, Umbrella, Wind, Zap
};

const IconRenderer = ({ name, className, color }: { name: string, className?: string, color?: string }) => {
  const IconComponent = ICONS_MAP[name] || LayoutGrid;
  
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 3 }}
      whileTap={{ scale: 0.95 }}
      className="inline-block"
    >
      <IconComponent className={className} color={color} />
    </motion.div>
  );
};

const ICON_METADATA: Record<string, { category: string, keywords: string[] }> = {
  LayoutGrid: { category: 'ui', keywords: ['شبكة', 'تخطيط', 'رئيسية', 'layout'] },
  Trophy: { category: 'tools', keywords: ['كأس', 'فوز', 'نجاح', 'مركز أول', 'win'] },
  Users: { category: 'ui', keywords: ['مستخدمين', 'ناس', 'فريق', 'people', 'team'] },
  Globe: { category: 'places', keywords: ['عالم', 'كرة أرضية', 'إنترنت', 'world', 'earth'] },
  Sparkles: { category: 'ui', keywords: ['ذكاء اصطناعي', 'توهج', 'جديد', 'magic', 'ai'] },
  HelpCircle: { category: 'edu', keywords: ['مساعدة', 'استفسار', 'سؤال', 'help', 'question'] },
  Heart: { category: 'ui', keywords: ['حب', 'مفضلة', 'إعجاب', 'love', 'favorite'] },
  Lock: { category: 'ui', keywords: ['قفل', 'أمان', 'خصوصية', 'security', 'lock'] },
  Settings: { category: 'tools', keywords: ['إعدادات', 'ترس', 'تحكم', 'settings', 'config'] },
  Star: { category: 'ui', keywords: ['نجمة', 'تميز', 'تقييم', 'star', 'rating'] },
  Book: { category: 'edu', keywords: ['كتاب', 'قراءة', 'تعلم', 'book', 'read'] },
  Music: { category: 'media', keywords: ['موسيقى', 'صوت', 'نغم', 'music', 'audio'] },
  Film: { category: 'media', keywords: ['فيلم', 'سينما', 'فيديو', 'movie', 'film'] },
  Mic: { category: 'media', keywords: ['مايك', 'تسجيل', 'صوت', 'mic', 'audio'] },
  Brain: { category: 'edu', keywords: ['عقل', 'ذكاء', 'تفكير', 'brain', 'mind'] },
  Cpu: { category: 'tech', keywords: ['معالج', 'تقنية', 'حاسوب', 'cpu', 'tech'] },
  History: { category: 'edu', keywords: ['تاريخ', 'وقت', 'ماضي', 'history', 'time'] },
  Palette: { category: 'edu', keywords: ['ألوان', 'رسم', 'تصميم', 'art', 'design'] },
  Lightbulb: { category: 'edu', keywords: ['فكرة', 'إضاءة', 'حل', 'idea', 'bulb'] },
  Camera: { category: 'media', keywords: ['كاميرا', 'تصوير', 'صور', 'camera', 'photo'] },
  Video: { category: 'media', keywords: ['فيديو', 'تسجيل', 'عرض', 'video', 'record'] },
  Map: { category: 'places', keywords: ['خريطة', 'موقع', 'مكان', 'map', 'location'] },
  Navigation: { category: 'places', keywords: ['توجيه', 'بوصلة', 'سفر', 'nav', 'gps'] },
  Flag: { category: 'places', keywords: ['علم', 'بلد', 'دولة', 'flag', 'country'] },
  Languages: { category: 'edu', keywords: ['لغات', 'ترجمة', 'عالمي', 'lang', 'translate'] },
  School: { category: 'edu', keywords: ['مدرسة', 'تعليم', 'جامعة', 'school', 'edu'] },
  GraduationCap: { category: 'edu', keywords: ['تخرج', 'جامعة', 'شهادة', 'grad', 'degree'] },
  ImageIcon: { category: 'media', keywords: ['صورة', 'معرض', 'خلفية', 'image', 'gallery'] },
  Database: { category: 'tech', keywords: ['بيانات', 'سحابة', 'تخزين', 'data', 'cloud'] },
  PlusCircle: { category: 'ui', keywords: ['إضافة', 'جديد', 'زائد', 'add', 'new'] },
  XCircle: { category: 'ui', keywords: ['إغلاق', 'خطأ', 'حذف', 'close', 'error'] },
  Briefcase: { category: 'tools', keywords: ['حقيبة', 'عمل', 'وظيفة', 'job', 'work'] },
  Clock: { category: 'tools', keywords: ['ساعة', 'وقت', 'تنبيه', 'clock', 'time'] },
  Cloud: { category: 'ui', keywords: ['سحابة', 'جو', 'إنترنت', 'cloud', 'weather'] },
  Code: { category: 'tech', keywords: ['برمجة', 'كود', 'تطوير', 'code', 'dev'] },
  Coffee: { category: 'tools', keywords: ['قهوة', 'راحة', 'مقهى', 'coffee', 'break'] },
  Compass: { category: 'places', keywords: ['بوصلة', 'اتجاه', 'استكشاف', 'compass', 'travel'] },
  CreditCard: { category: 'tools', keywords: ['بطاقة', 'دفع', 'مال', 'card', 'payment'] },
  Eye: { category: 'ui', keywords: ['عين', 'مشاهدة', 'رؤية', 'view', 'visibility'] },
  Gift: { category: 'tools', keywords: ['هدية', 'مكافأة', 'خصم', 'gift', 'reward'] },
  Home: { category: 'places', keywords: ['منزل', 'رئيسية', 'سكن', 'home', 'house'] },
  Key: { category: 'tools', keywords: ['مفتاح', 'دخول', 'سر', 'key', 'access'] },
  LifeBuoy: { category: 'tools', keywords: ['دعم', 'مساعدة', 'إنقاذ', 'support', 'help'] },
  Link: { category: 'tools', keywords: ['رابط', 'اتصال', 'موقع', 'link', 'url'] },
  Mail: { category: 'tools', keywords: ['بريد', 'رسالة', 'تواصل', 'email', 'message'] },
  Moon: { category: 'ui', keywords: ['قمر', 'ليل', 'وضع ليلي', 'moon', 'night'] },
  Phone: { category: 'tools', keywords: ['هاتف', 'اتصال', 'مكالمة', 'phone', 'call'] },
  PieChart: { category: 'tech', keywords: ['رسم بياني', 'إحصاء', 'بيانات', 'chart', 'stats'] },
  Play: { category: 'media', keywords: ['تشغيل', 'بدء', 'فيديو', 'play', 'start'] },
  Power: { category: 'tech', keywords: ['طاقة', 'إغلاق', 'تشغيل', 'power', 'on'] },
  Printer: { category: 'tech', keywords: ['طابعة', 'ورق', 'نسخ', 'print', 'paper'] },
  Rocket: { category: 'tools', keywords: ['صاروخ', 'انطلاق', 'سرعة', 'rocket', 'launch'] },
  Shield: { category: 'ui', keywords: ['درع', 'حماية', 'أمان', 'shield', 'protect'] },
  ShoppingBag: { category: 'tools', keywords: ['تسوق', 'متجر', 'بيع', 'shop', 'store'] },
  Smartphone: { category: 'tech', keywords: ['جوال', 'هاتف', 'تطبيق', 'mobile', 'phone'] },
  Sun: { category: 'ui', keywords: ['شمس', 'نهار', 'وضع نهاري', 'sun', 'day'] },
  Tag: { category: 'tools', keywords: ['وسم', 'تصنيف', 'سعر', 'tag', 'label'] },
  Terminal: { category: 'tech', keywords: ['أوامر', 'برمجة', 'نظام', 'shell', 'console'] },
  Thermometer: { category: 'ui', keywords: ['حرارة', 'جو', 'مناخ', 'temp', 'weather'] },
  ThumbsUp: { category: 'ui', keywords: ['إعجاب', 'نعم', 'موافق', 'like', 'agree'] },
  Wrench: { category: 'tools', keywords: ['مفتاح ربط', 'إصلاح', 'صيانة', 'tool', 'fix'] },
  Trash: { category: 'ui', keywords: ['حذف', 'مهملات', 'إزالة', 'delete', 'remove'] },
  Umbrella: { category: 'ui', keywords: ['مظلة', 'مطر', 'حماية', 'umbrella', 'rain'] },
  Wind: { category: 'ui', keywords: ['رياح', 'جو', 'هواء', 'wind', 'weather'] },
  Zap: { category: 'ui', keywords: ['برق', 'سرعة', 'كهرباء', 'flash', 'bolt'] }
};

const IconPicker = ({ selected, onSelect, isOpen, onClose, color, playSound }: { selected: string, onSelect: (icon: string) => void, isOpen: boolean, onClose: () => void, color?: string, playSound?: (type: any) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [customUrl, setCustomUrl] = useState(selected?.startsWith('http') ? selected : '');
  const ref = useRef<HTMLDivElement>(null);

  const ICON_CATEGORIES = [
    { id: 'all', label: 'الكل' },
    { id: 'ui', label: 'واجهة' },
    { id: 'edu', label: 'تعليم' },
    { id: 'media', label: 'وسائط' },
    { id: 'tech', label: 'تقنية' },
    { id: 'places', label: 'أماكن' },
    { id: 'tools', label: 'أدوات' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;

  const filteredIcons = AVAILABLE_ICONS.filter(icon => {
    const meta = ICON_METADATA[icon];
    const matchesSearch = icon.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         meta?.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || meta?.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div 
      ref={ref}
      className="absolute top-full left-0 mt-4 bg-white border border-slate-100 rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.15)] z-[1000] p-6 w-[360px] animate-in fade-in zoom-in duration-300 origin-top-left"
    >
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input 
            type="text"
            placeholder="ابحث بالفئة أو الكلمة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-[var(--app-primary)]/5 focus:border-[var(--app-primary)]/30 transition-all font-black text-slate-700"
            autoFocus
          />
        </div>
        
        <div className="flex gap-1 overflow-x-auto pb-1 custom-scrollbar">
          {ICON_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-black whitespace-nowrap transition-all ${
                activeCategory === cat.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'text-slate-400 hover:text-indigo-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 max-h-[320px] overflow-y-auto pr-1 pb-1 custom-scrollbar">
        {filteredIcons.map(icon => (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            key={icon}
            title={icon.replace(/([A-Z])/g, ' $1').trim()}
            aria-label={icon.replace(/([A-Z])/g, ' $1').trim()}
            onClick={() => { playSound?.('click'); onSelect(icon); onClose(); }}
            className={`
              flex flex-col items-center justify-center aspect-square rounded-2xl transition-all border-2 
              ${selected === icon 
                ? 'border-[var(--app-primary)] bg-[var(--app-primary-light)]/50 text-[var(--app-primary)] shadow-[var(--app-glow)] shadow-lg' 
                : 'border-white hover:border-slate-100 bg-white hover:bg-slate-50 text-slate-400'}
            `}
          >
            <IconRenderer 
              name={icon} 
              className="w-6 h-6" 
              color={selected === icon ? 'var(--app-primary)' : '#94a3b8'}
            />
          </motion.button>
        ))}

        {filteredIcons.length === 0 && (
          <div className="col-span-4 py-16 text-center">
            <div className="bg-slate-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-200" />
            </div>
            <p className="text-slate-400 text-sm font-black">لا توجد نتائج</p>
          </div>
        )}
      </div>
      
      <div className="mt-6 pt-6 border-t border-slate-50 space-y-4">
        <label htmlFor="custom-icon-url" className="text-[10px] font-black text-slate-400 px-1 uppercase tracking-[0.2em] block">رابط صورة مخصص</label>
        
        <div className="flex gap-2">
          <input 
            id="custom-icon-url"
            type="text" 
            placeholder="أدخل رابط المباشر للصورة..." 
            value={customUrl}
            className="flex-grow text-xs px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500/20 transition-all font-bold text-slate-600"
            onChange={(e) => setCustomUrl(e.target.value)}
          />
          {customUrl && customUrl.startsWith('http') && (
            <button 
              onClick={() => { playSound?.('click'); onSelect(customUrl); onClose(); }}
              className="px-6 py-3 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-black transition-all shadow-lg"
            >
              اعتماد
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ModernDropdown = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "اختر القائمة..."
}: { 
  value: string, 
  onChange: (val: string) => void, 
  options: { value: string, label: string }[],
  placeholder?: string
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption = options.find(o => o.value === value);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-14 px-6 rounded-2xl border transition-all flex items-center justify-between outline-none ${
          isOpen ? 'bg-white border-indigo-400 ring-4 ring-indigo-50 shadow-sm' : 'bg-slate-50 border-slate-100 hover:border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${isOpen ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-100 text-slate-400'}`}>
            <LayoutGrid className="w-3.5 h-3.5" />
          </div>
          <span className={`text-sm font-black transition-colors ${isOpen ? 'text-indigo-600' : 'text-slate-700'}`}>
            {currentOption ? currentOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-100 rounded-[28px] shadow-2xl z-[500] overflow-hidden origin-top"
          >
            <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/50">
               <div className="text-[10px] text-center font-black text-slate-400 uppercase tracking-[0.25em] flex items-center justify-center gap-2">
                 <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
                 إختر القائمة المستهدفة
               </div>
            </div>
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar p-2 scroll-smooth">
              {options.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-bold">لا توجد خيارات متاحة</div>
              ) : options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full text-right px-6 py-4 rounded-[20px] transition-all duration-300 flex items-center justify-between group mb-1
                    ${value === opt.value 
                      ? 'bg-orange-500 text-white shadow-xl shadow-orange-100 translate-x-1' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-orange-600'}
                  `}
                >
                  <span className="text-sm font-black tracking-tight">{opt.label}</span>
                  {value === opt.value ? (
                    <CheckCircle2 className="w-4 h-4 text-white animate-in zoom-in duration-300" />
                  ) : (
                    <ChevronLeft className="w-3.5 h-3.5 text-slate-300 group-hover:text-orange-400 transition-colors h-mirror" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="p-3 border-t border-slate-50 bg-slate-50/30">
               <div className="text-[9px] text-center font-black text-slate-300 uppercase tracking-[0.3em] py-0.5">نهاية القائمة المعروضة</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AdminDashboard({ onBack, answeredQuestionIds = [], onResetPlayedQuestions, onResetGame, playSound, appSettings }: AdminDashboardProps) {
  const [categories, setCategories] = useState<DBCategory[]>([]);
  const [groups, setGroups] = useState<DBGroup[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<DBQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [appSettingsState, setAppSettingsState] = useState<any>({ logoUrl: '' });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [newCat, setNewCat] = useState({ 
    name: '', 
    group: 'عام', 
    imageUrl: '', 
    iconUrl: 'LayoutGrid', 
    sourceText: '', 
    letterMode: false, 
    imagesEnabled: false,
    qrEnabled: false,
    videoEnabled: false,
    mapMode: false,
    imageMode: false,
    timerDuration: 60,
    letter: 'أ',
    description: ''
  });
  const [showGroupManager, setShowGroupManager] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [draggedGroups, setDraggedGroups] = useState<DBGroup[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [importUrl, setImportUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [creationMode, setCreationMode] = useState<'manual' | 'url' | 'ai'>('manual');
  const [editSourceUrl, setEditSourceUrl] = useState('');
  const [editSourceText, setEditSourceText] = useState('');
  const [editCatName, setEditCatName] = useState('');
  const [editCatDescription, setEditCatDescription] = useState(''); // New state for category description
  const [editCatGroup, setEditCatGroup] = useState('');
  const [editCatIcon, setEditCatIcon] = useState('LayoutGrid');
  const [editCatImage, setEditCatImage] = useState('');
  const [editCatBorderColor, setEditCatBorderColor] = useState('');
  const [editCatShadow, setEditCatShadow] = useState('');
  const [editCatLetterMode, setEditCatLetterMode] = useState(false);
  const [editCatImagesEnabled, setEditCatImagesEnabled] = useState(false);
  const [editCatQrEnabled, setEditCatQrEnabled] = useState(false);
  const [editCatVideoEnabled, setEditCatVideoEnabled] = useState(false);
  const [editCatMapMode, setEditCatMapMode] = useState(false);
  const [editCatImageMode, setEditCatImageMode] = useState(false);
  const [editCatTimerDuration, setEditCatTimerDuration] = useState(60);
  const [editCatLetter, setEditCatLetter] = useState('أ');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showEditIconPicker, setShowEditIconPicker] = useState(false);
  const [showSyncConfirm, setShowSyncConfirm] = useState(false);
  const [catToDelete, setCatToDelete] = useState<string | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<{ id: string, name: string } | null>(null);
  const [qToDelete, setQToDelete] = useState<string | null>(null);
  const [expandedCatId, setExpandedCatId] = useState<string | null>(null); // New state for expanded card
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[] | null>(null);
  const [pointFilter, setPointFilter] = useState<number | 'all'>('all');
  const [qSearch, setQSearch] = useState('');
  const [answerSearch, setAnswerSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [letterFilter, setLetterFilter] = useState<string>('الكل');
  const [hasImageFilter, setHasImageFilter] = useState<'all' | 'with' | 'without'>('all');
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [questionAddTab, setQuestionAddTab] = useState<'single' | 'bulk'>('single');
  const [bulkText, setBulkText] = useState('');
  const [isParsingBulk, setIsParsingBulk] = useState(false);
  const [parsedBulkQuestions, setParsedBulkQuestions] = useState<any[]>([]);
  
  const [newQ, setNewQ] = useState({ 
    text: '', 
    answer: '', 
    options: [] as string[],
    points: 20, 
    source: ' مسابقات أبوالفواطم', 
    sourceUrl: '', 
    imageUrl: '', 
    videoUrl: '', 
    qrEnabled: false, 
    letterMode: false, 
    imagesEnabled: false,
    videoEnabled: false,
    mapMode: false,
    letter: 'أ' 
  });
  const [selectedQIds, setSelectedQIds] = useState<string[]>([]);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [sidebarTab, setSidebarTab] = useState<'overview' | 'categories' | 'media' | 'settings' | 'data'>('overview');
  const [categorySubTab, setCategorySubTab] = useState<'list' | 'add'>('list');
  const [mediaSubTab, setMediaSubTab] = useState<'questions' | 'system' | 'upload'>('questions');
  const [lastUploadedUrl, setLastUploadedUrl] = useState<string | null>(null);
  const [playingTestAudio, setPlayingTestAudio] = useState<{id: string, audio: HTMLAudioElement} | null>(null);

  const TABS = [
    { id: 'overview', label: 'لوحة القيادة', icon: Globe },
    { id: 'categories', label: 'الأقسام والأسئلة', icon: LayoutGrid },
    { id: 'media', label: 'الأصوات والوسائط', icon: Music },
    { id: 'settings', label: 'إعدادات الهوية', icon: Settings },
    { id: 'data', label: 'قاعدة البيانات', icon: Database },
  ] as const;
  const [groupToRename, setGroupToRename] = useState<string | null>(null);
  const [newGroupNameValue, setNewGroupNameValue] = useState('');
  
  // Collapse/Expand state for overcrowding prevention
  const [showQuestionAddSection, setShowQuestionAddSection] = useState(false);
  const [showFiltersSection, setShowFiltersSection] = useState(true);

  const ARABIC_LETTERS = [
    "الكل", "أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي"
  ];

  // Question Editing States
  const [editingQId, setEditingQId] = useState<string | null>(null);
  const [editQText, setEditQText] = useState('');
  const [editQAnswer, setEditQAnswer] = useState('');
  const [editQPoints, setEditQPoints] = useState(20);
  const [editQImageUrl, setEditQImageUrl] = useState('');
  const [editQVideoUrl, setEditQVideoUrl] = useState('');
  const [editQSource, setEditQSource] = useState('');
  const [editQSourceUrl, setEditQSourceUrl] = useState('');
  const [editQQrEnabled, setEditQQrEnabled] = useState(false);
  const [editQLetterMode, setEditQLetterMode] = useState(false);
  const [editQImagesEnabled, setEditQImagesEnabled] = useState(false);
  const [editQLetter, setEditQLetter] = useState('أ');
  const [editQOptions, setEditQOptions] = useState<string[]>([]);
  const [isGeneratingOptions, setIsGeneratingOptions] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [showSyncLog, setShowSyncLog] = useState(false);
  const [syncLog, setSyncLog] = useState<any[]>([]);
  const [autoGenSmart, setAutoGenSmart] = useState(false);

  const [editQVideoEnabled, setEditQVideoEnabled] = useState(false);
  const [editQMapMode, setEditQMapMode] = useState(false);
  const [previewQ, setPreviewQ] = useState<any>(null);

  useEffect(() => {
    setDraggedGroups(groups);
  }, [groups]);

  const handleUpdateGroupsOrder = (newOrder: DBGroup[]) => {
    // Correctly update local state first for smooth UI
    const updatedWithOrder = newOrder.map((g, idx) => ({ ...g, order: idx }));
    setDraggedGroups(updatedWithOrder);
    setGroups(updatedWithOrder);
    
    // Debounced persistence to database
    handlePersistOrder(updatedWithOrder);
  };

  const handleRenameGroup = async (oldName: string, newName: string, groupId: string) => {
    playSound?.('click');
    if (!newName.trim() || oldName === newName) return;
    try {
      setLoading(true);
      await dataService.updateGroup(groupId, { name: newName });
      
      // Update all categories associated with this group
      const catsToUpdate = categories.filter(c => c.group === oldName);
      await Promise.all(catsToUpdate.map(c => 
        dataService.updateCategory(c.id, { group: newName })
      ));
      
      setCategories(prev => prev.map(c => c.group === oldName ? { ...c, group: newName } : c));
      setMessage({ text: 'تم إعادة تسمية المجموعة وتحديث الأقسام التابعة لها', type: 'success' });
      setGroupToRename(null);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGroupManually = async () => {
    playSound?.('click');
    if (!newGroupName.trim()) return;
    try {
      setLoading(true);
      await dataService.addGroup({
        name: newGroupName,
        order: groups.length
      });
      setNewGroupName('');
      setMessage({ text: 'تم إضافة المجموعة بنجاح', type: 'success' });
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const QuestionPreviewModal = ({ question, onClose }: { question: any, onClose: () => void }) => {
    if (!question) return null;

    const getYouTubeId = (url: string) => {
      if (!url) return null;
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/|live\/)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2] && match[2].length >= 10) ? match[2] : null;
    };

    const isDirectVideoLink = (url: string) => {
      if (!url) return false;
      const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
      return videoExtensions.some(ext => url.toLowerCase().includes(ext)) || url.toLowerCase().includes('firebasestorage.googleapis.com');
    };

    return (
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" 
        />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-modal-title"
            className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-[0_50px_200px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
          >
            {/* Preview Content Header */}
            <div className="bg-slate-50 px-8 py-6 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[var(--app-primary-light)] text-[var(--app-primary)] rounded-2xl flex items-center justify-center shadow-lg shadow-[var(--app-glow)]">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 id="preview-modal-title" className="font-black text-xl text-slate-800">معاينة السؤال</h2>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">عرض مباشر لما سيظهر للمتسابقين</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                aria-label="إغلاق المعاينة"
                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all border border-slate-100 hover:scale-110 active:scale-95"
              >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-12 bg-slate-100/30 custom-scrollbar">
            <div className="flex flex-col items-center gap-10 w-full">
              
              {/* Question Text Card */}
              <div className="w-full bg-white p-10 rounded-[32px] shadow-xl border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-[var(--app-primary)]" />
                <h3 className="text-3xl md:text-4xl font-black text-slate-800 leading-[1.4] tracking-tight text-center">
                  {question.text || 'نص السؤال سيظهر هنا...'}
                </h3>
                
                {question.points && (
                   <div className="mt-8 flex justify-center">
                     <span className="bg-indigo-600 text-white px-6 py-2 rounded-full font-black text-sm shadow-lg shadow-indigo-100">
                        {question.points} نقطة
                     </span>
                   </div>
                )}
              </div>

              {/* Media Section */}
              {((question.imagesEnabled && question.imageUrl) || (question.videoEnabled && question.videoUrl)) && (
                <div className="w-full max-w-2xl rounded-[32px] overflow-hidden border-[8px] border-white shadow-2xl bg-black relative group aspect-video">
                  {question.videoEnabled && question.videoUrl ? (
                    <>
                      {getYouTubeId(question.videoUrl) ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeId(question.videoUrl)}?autoplay=0&rel=0`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                      ) : isDirectVideoLink(question.videoUrl) ? (
                        <video src={question.videoUrl} controls className="w-full h-full object-contain" />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-white h-full p-8 text-center bg-slate-900">
                           <Video className="w-12 h-12 mb-4 text-rose-500" />
                           <p className="font-black text-lg">رابط الفيديو غير مدعوم للمعالجة</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <img 
                      src={getProxiedImageUrl(question.imageUrl, question.text, question.answer)} 
                      alt="Question" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageError(e, question.text, question.answer)}
                    />
                  )}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white text-[10px] font-black flex items-center gap-2">
                    <Film className="w-3.5 h-3.5" />
                    محتوى مرئي
                  </div>
                </div>
              )}

              {/* Answer Preview */}
              <div className="w-full mt-4">
                 <div className="text-center mb-4">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">الإجابة النموذجية</span>
                 </div>
                 <div className="bg-white/50 backdrop-blur-sm p-8 rounded-[32px] border-2 border-dashed border-slate-200 text-center">
                    <h4 className="text-2xl font-black text-indigo-600">
                      {question.answer || 'الإجابة ستظهر هنا...'}
                    </h4>
                 </div>
              </div>

            </div>
          </div>

          <div className="p-8 bg-white border-t border-slate-50 flex justify-center">
            <button 
              onClick={onClose}
              className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-black transition-all active:scale-95"
            >
              إغلاق المعاينة
            </button>
          </div>
        </motion.div>
      </div>
    );
  };
  // App Settings States
  const [competitionName, setCompetitionName] = useState('');
  const [competitionSlogan, setCompetitionSlogan] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [correctSoundUrl, setCorrectSoundUrl] = useState('');
  const [wrongSoundUrl, setWrongSoundUrl] = useState('');
  const [correctImageUrl, setCorrectImageUrl] = useState('');
  const [wrongImageUrl, setWrongImageUrl] = useState('');
  const [beepSoundUrl, setBeepSoundUrl] = useState('');
  const [victorySoundUrl, setVictorySoundUrl] = useState('');
  const [correctSoundVolume, setCorrectSoundVolume] = useState(0.5);
  const [wrongSoundVolume, setWrongSoundVolume] = useState(0.5);
  const [beepVolume, setBeepVolume] = useState(0.5);
  const [victorySoundVolume, setVictorySoundVolume] = useState(0.5);
  const [timerDuration, setTimerDuration] = useState(60);
  const [enableSounds, setEnableSounds] = useState(true);
  const [introSoundUrl, setIntroSoundUrl] = useState('');
  const [clickSoundUrl, setClickSoundUrl] = useState('');
  const [introSoundVolume, setIntroSoundVolume] = useState(0.5);
  const [clickSoundVolume, setClickSoundVolume] = useState(0.1);
  const [adminImageUrl, setAdminImageUrl] = useState('');
  const [themeId, setThemeId] = useState('indigo');
  const [enableCrowdNoise, setEnableCrowdNoise] = useState(false);
  const [crowdNoiseVolume, setCrowdNoiseVolume] = useState(0.3);
  const [crowdNoiseUrl, setCrowdNoiseUrl] = useState('');
  const [totalQuestionsCount, setTotalQuestionsCount] = useState<number | '...'>('...');
  const [recountTrigger, setRecountTrigger] = useState(0);
  const [importing, setImporting] = useState(false);
  const [newEditGroupName, setNewEditGroupName] = useState('');

  useEffect(() => {
    if (categories.length > 0) {
      const fetchTotalCount = async () => {
        try {
          // Efficiently count questions across categories
          const counts = await Promise.all(
            categories.map(async (cat) => {
              const qs = await dataService.getQuestions(cat.id);
              return qs.length;
            })
          );
          const total = counts.reduce((a, b) => a + b, 0);
          setTotalQuestionsCount(total);
        } catch (e) {
          console.error("Error fetching total questions:", e);
        }
      };
      fetchTotalCount();
    } else if (categories.length === 0 && !loading) {
      setTotalQuestionsCount(0);
    }
  }, [categories, recountTrigger]);

  useEffect(() => {
    const init = async () => {
      await loadCategories();
      await loadGroups();
      if (!appSettings) {
        await loadSettings();
      }
    };
    init();
  }, []);

  // Reactive settings sync
  useEffect(() => {
    if (!appSettings) return;
    
    try {
      if (appSettings.competitionName !== undefined) setCompetitionName(appSettings.competitionName);
      if (appSettings.competitionSlogan !== undefined) setCompetitionSlogan(appSettings.competitionSlogan);
      if (appSettings.logoUrl !== undefined) setLogoUrl(appSettings.logoUrl);
      if (appSettings.adminImageUrl !== undefined) setAdminImageUrl(appSettings.adminImageUrl);
      if (appSettings.themeId !== undefined) setThemeId(appSettings.themeId);
      if (appSettings.correctSoundUrl !== undefined) setCorrectSoundUrl(appSettings.correctSoundUrl);
      if (appSettings.wrongSoundUrl !== undefined) setWrongSoundUrl(appSettings.wrongSoundUrl);
      if (appSettings.correctImageUrl !== undefined) setCorrectImageUrl(appSettings.correctImageUrl);
      if (appSettings.wrongImageUrl !== undefined) setWrongImageUrl(appSettings.wrongImageUrl);
      if (appSettings.beepSoundUrl !== undefined) setBeepSoundUrl(appSettings.beepSoundUrl);
      if (appSettings.victorySoundUrl !== undefined) setVictorySoundUrl(appSettings.victorySoundUrl);
      if (appSettings.correctSoundVolume !== undefined) setCorrectSoundVolume(appSettings.correctSoundVolume);
      if (appSettings.wrongSoundVolume !== undefined) setWrongSoundVolume(appSettings.wrongSoundVolume);
      if (appSettings.beepVolume !== undefined) setBeepVolume(appSettings.beepVolume);
      if (appSettings.victorySoundVolume !== undefined) setVictorySoundVolume(appSettings.victorySoundVolume);
      if (appSettings.timerDuration !== undefined) setTimerDuration(appSettings.timerDuration);
      if (appSettings.enableSounds !== undefined) setEnableSounds(appSettings.enableSounds);
      if (appSettings.introSoundUrl !== undefined) setIntroSoundUrl(appSettings.introSoundUrl);
      if (appSettings.clickSoundUrl !== undefined) setClickSoundUrl(appSettings.clickSoundUrl);
      if (appSettings.introSoundVolume !== undefined) setIntroSoundVolume(appSettings.introSoundVolume);
      if (appSettings.clickSoundVolume !== undefined) setClickSoundVolume(appSettings.clickSoundVolume);
      if (appSettings.enableCrowdNoise !== undefined) setEnableCrowdNoise(appSettings.enableCrowdNoise);
      if (appSettings.crowdNoiseVolume !== undefined) setCrowdNoiseVolume(appSettings.crowdNoiseVolume);
      if (appSettings.crowdNoiseUrl !== undefined) setCrowdNoiseUrl(appSettings.crowdNoiseUrl);
    } catch (e) {
      console.warn("Error syncing app settings in admin mode:", e);
    }
  }, [appSettings]);

  const loadSettings = async () => {
    try {
      const settings = await dataService.getSettings();
      if (settings) {
        if (settings.competitionName) setCompetitionName(settings.competitionName);
        if (settings.competitionSlogan) setCompetitionSlogan(settings.competitionSlogan);
        if (settings.logoUrl) setLogoUrl(settings.logoUrl);
        if (settings.adminImageUrl) setAdminImageUrl(settings.adminImageUrl);
        if (settings.themeId) setThemeId(settings.themeId);
        if (settings.correctSoundUrl) setCorrectSoundUrl(settings.correctSoundUrl);
        if (settings.wrongSoundUrl) setWrongSoundUrl(settings.wrongSoundUrl);
        if (settings.correctImageUrl) setCorrectImageUrl(settings.correctImageUrl);
        if (settings.wrongImageUrl) setWrongImageUrl(settings.wrongImageUrl);
        if (settings.beepSoundUrl) setBeepSoundUrl(settings.beepSoundUrl);
        if (settings.victorySoundUrl) setVictorySoundUrl(settings.victorySoundUrl);
        if (settings.correctSoundVolume !== undefined) setCorrectSoundVolume(settings.correctSoundVolume);
        if (settings.wrongSoundVolume !== undefined) setWrongSoundVolume(settings.wrongSoundVolume);
        if (settings.beepVolume !== undefined) setBeepVolume(settings.beepVolume);
        if (settings.victorySoundVolume !== undefined) setVictorySoundVolume(settings.victorySoundVolume);
        if (settings.timerDuration !== undefined) setTimerDuration(settings.timerDuration);
        if (settings.enableSounds !== undefined) setEnableSounds(settings.enableSounds);
        if (settings.introSoundUrl) setIntroSoundUrl(settings.introSoundUrl);
        if (settings.clickSoundUrl) setClickSoundUrl(settings.clickSoundUrl);
        if (settings.introSoundVolume !== undefined) setIntroSoundVolume(settings.introSoundVolume);
        if (settings.clickSoundVolume !== undefined) setClickSoundVolume(settings.clickSoundVolume);
        if (settings.enableCrowdNoise !== undefined) setEnableCrowdNoise(settings.enableCrowdNoise);
        if (settings.crowdNoiseVolume !== undefined) setCrowdNoiseVolume(settings.crowdNoiseVolume);
        if (settings.crowdNoiseUrl !== undefined) setCrowdNoiseUrl(settings.crowdNoiseUrl);
      }
    } catch (e) {
      handleError(e);
    }
  };

  const handleUpdateAppSettings = async () => {
    playSound?.('click');
    try {
      // Calculate total size of potential large strings to avoid Firestore 1MB limit
      const largeStrings = [
        logoUrl, adminImageUrl, correctSoundUrl, wrongSoundUrl, correctImageUrl, 
        wrongImageUrl, beepSoundUrl, victorySoundUrl, introSoundUrl, clickSoundUrl, crowdNoiseUrl
      ];
      const totalSize = largeStrings.reduce((acc, str) => acc + (str?.length || 0), 0);
      
      if (totalSize > 800000) { // ~800KB threshold to be safe (1MB limit)
        setMessage({ 
          text: 'إجمالي حجم الملفات المرفوعة كبير جداً (يقترب من 1 ميجابايت). يرجى تقليل أحجام الملفات أو استخدام روابط خارجية لضمان حفظ الإعدادات.', 
          type: 'error' 
        });
        return;
      }

      setLoading(true);
      await dataService.updateSettings({
        competitionName,
        competitionSlogan,
        logoUrl,
        adminImageUrl,
        themeId,
        correctSoundUrl,
        wrongSoundUrl,
        correctImageUrl,
        wrongImageUrl,
        beepSoundUrl,
        victorySoundUrl,
        introSoundUrl,
        clickSoundUrl,
        correctSoundVolume,
        wrongSoundVolume,
        beepVolume,
        victorySoundVolume,
        introSoundVolume,
        clickSoundVolume,
        timerDuration,
        enableSounds,
        enableCrowdNoise,
        crowdNoiseVolume,
        crowdNoiseUrl
      });
      setMessage({ text: 'تم تحديث إعدادات التطبيق بنجاح', type: 'success' });
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    playSound?.('click');
    try {
      setLoading(true);
      setMessage({ text: 'جاري تجميع البيانات للتصدير...', type: 'success' });
      
      const allCategories = await dataService.getCategories();
      const allGroups = await dataService.getGroups();
      const settings = await dataService.getSettings();
      
      const exportedData = {
        appSettings: settings,
        groups: allGroups,
        categories: [] as any[],
        exportedAt: new Date().toISOString(),
        appName: 'مسابقة أبوالفواطم'
      };

      for (const cat of allCategories) {
        const qSnap = await dataService.getQuestions(cat.id);
        exportedData.categories.push({
          ...cat,
          questions: qSnap
        });
      }

      const blob = new Blob([JSON.stringify(exportedData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bufawatim_data_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setMessage({ text: 'تم تصدير البيانات بنجاح!', type: 'success' });
    } catch (e) {
      console.error(e);
      setMessage({ text: 'فشل في تصدير البيانات', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleImportData = async (e: ChangeEvent<HTMLInputElement>) => {
    playSound?.('click');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm('🚨 استيراد البيانات سيقوم بإضافة البيانات الجديدة بجانب الحالية. هل أنت متأكد؟')) return;

    try {
      setImporting(true);
      setLoading(true);
      setMessage({ text: 'جاري الاستيراد، يرجى الانتظار...', type: 'success' });
      
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.categories) throw new Error('الملف غير متوافق');

      // Update settings if present
      if (data.appSettings) {
        await dataService.updateSettings(data.appSettings);
        setAppSettingsState(data.appSettings);
      }

      // Restore groups
      const existingGroups = await dataService.getGroups();
      const groupNameMap = new Set(existingGroups.map(g => g.name));
      
      if (data.groups) {
        for (const g of data.groups) {
          if (!groupNameMap.has(g.name)) {
            await dataService.addGroup({ name: g.name, order: g.order });
          }
        }
      }

      // Restore categories and questions
      for (const catData of data.categories) {
        const { questions: catQs, id: oldId, ...catMeta } = catData;
        const newCat = await dataService.addCategory(catMeta);
        
        if (catQs && catQs.length > 0) {
          for (const q of catQs) {
            const { id: oldQid, categoryId, ...qMeta } = q;
            await dataService.addQuestion(newCat.id, qMeta);
          }
        }
      }

      await loadCategories();
      await loadGroups();
      setMessage({ text: 'تم استيراد كافة البيانات والأسئلة بنجاح!', type: 'success' });
    } catch (e) {
      console.error(e);
      setMessage({ text: 'حدث خطأ أثناء الاستيراد', type: 'error' });
    } finally {
      setImporting(false);
      setLoading(false);
      if (e.target) e.target.value = '';
    }
  };

  const loadGroups = async () => {
    try {
      const data = await dataService.getGroups();
      
      // If categories have groups not in the groups collection, sync them
      const categoryGroups = Array.from(new Set(categories.map(c => c.group || 'عام'))) as string[];
      const existingGroupNames = new Set(data.map(g => g.name));
      
      const missingGroups = categoryGroups.filter(g => !existingGroupNames.has(g));
      if (missingGroups.length > 0) {
        for (const name of missingGroups) {
          await dataService.addGroup({ name, order: data.length + missingGroups.indexOf(name) });
        }
        const updatedGroups = await dataService.getGroups();
        setGroups(updatedGroups);
      } else {
        setGroups(data);
      }
    } catch (e) {
      console.error("Failed to load groups", e);
    }
  };

  useEffect(() => {
    if (selectedCatId) {
      loadQuestions(selectedCatId);
      const currentCat = categories.find(c => c.id === selectedCatId);
      setEditSourceUrl(currentCat?.sourceUrl || '');
      setEditSourceText(currentCat?.sourceText || '');
      setEditCatName(currentCat?.name || '');
      setEditCatDescription(currentCat?.description || '');
      setEditCatGroup(currentCat?.group || 'عام');
      setEditCatIcon(currentCat?.iconUrl || 'LayoutGrid');
      setEditCatImage(currentCat?.imageUrl || '');
      setEditCatBorderColor(currentCat?.borderColor || '');
      setEditCatShadow(currentCat?.customShadow || '');
      setEditCatLetterMode(currentCat?.letterMode || false);
      setEditCatImagesEnabled(currentCat?.imagesEnabled || false);
      setEditCatQrEnabled(currentCat?.qrEnabled || false);
      setEditCatVideoEnabled(currentCat?.videoEnabled || false);
      setEditCatMapMode(currentCat?.mapMode || false);
      setEditCatImageMode(currentCat?.imageMode || false);
      setEditCatTimerDuration(currentCat?.timerDuration || 60);
      setEditCatLetter(currentCat?.letter || 'أ');
      setNewQ(prev => ({
        ...prev,
        letterMode: currentCat?.letterMode || false,
        imagesEnabled: currentCat?.imagesEnabled || false,
        qrEnabled: currentCat?.qrEnabled || false,
        videoEnabled: currentCat?.videoEnabled || false,
        mapMode: currentCat?.mapMode || false
      }));
    }
  }, [selectedCatId, categories]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleError = (e: any) => {
    console.error(e);
    let errorText = 'حدث خطأ غير متوقع';
    const currentUserEmail = auth.currentUser?.email || 'غير مسجل';
    
    const msg = e.message || '';
    if (msg.includes('getaddrinfo') || msg.includes('ENOTFOUND') || msg.includes('EAI_AGAIN')) {
      errorText = 'فشل في الوصول إلى العنوان (خطأ في DNS). تأكد من صحة الرابط أو جرب لاحقاً، قد يكون الموقع متوقفاً أو يحظر منطقتنا.';
    } else if (msg.includes('timeout') || msg.includes('deadline')) {
      errorText = 'انتهت مهلة الطلب (Timeout). الموقع بطيء جداً أو تم حظر الاتصال. حاول مرة أخرى أو استخدم موقعاً آخر.';
    } else if (msg.includes('403')) {
      errorText = 'تم حظر الوصول إلى هذا الموقع (Forbidden 403). الموقع يحظر الطلبات المؤتمتة. جرب نسخ المحتوى يدوياً.';
    } else {
      try {
        const data = JSON.parse(e.message);
        if (data.error) {
          errorText = `خطأ في الصلاحيات: ${data.operationType} على ${data.path || 'غير معروف'}. البريد الحالي: ${currentUserEmail}. تأكد من أنك مسجل كمدير.`;
        }
      } catch {
        errorText = e.message || errorText;
      }
    }
    setMessage({ text: errorText, type: 'error' });
  };

  const handleAudioUpload = (e: ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) { 
        setMessage({ 
          text: 'حجم الملف كبير جداً للرفع المباشر (الحد الأقصى 500 ك.ب). يرجى ضغط الملف أو استخدام روابط الرفع الخارجية الموضحة في الأسفل.', 
          type: 'error' 
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          setter(result);
          setMessage({ text: 'تم تحميل الملف الصوتي بنجاح', type: 'success' });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) { 
        setMessage({ 
          text: 'حجم الصورة كبير للرفع المباشر (الحد الأقصى 500 ك.ب). يرجى استخدام صورة أصغر أو الرفع عبر PostImages ونسخ "الرابط المباشر".', 
          type: 'error' 
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          setter(result);
          setMessage({ text: 'تم تحميل الصورة بنجاح', type: 'success' });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await dataService.getCategories();
      
      // Only perform the update if specifically needed and not handled before
      // This saves unnecessary write/read operations that consume quota
      const sportsCat = data.find(c => c.name === 'رياضة وشعارات' && !c.videoEnabled);
      if (sportsCat) {
        try {
          await dataService.updateCategory(sportsCat.id, { videoEnabled: true });
          sportsCat.videoEnabled = true;
        } catch (updateErr) {
          console.warn("Minor quota notice: Could not update sports category flags, but app will continue.");
        }
      }

      setCategories(data);
    } catch (e: any) {
      if (e.message?.includes('Quota') || e.message?.includes('quota')) {
        setMessage({ text: 'تنبيه: تم تجاوز حصة قراءة البيانات اليومية المجانية في Firebase. قد لا تظهر بعض البيانات حتى يتم إعادة ضبط الحصة غداً.', type: 'error' });
      } else {
        handleError(e);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestion = (q: DBQuestion) => {
    playSound?.('click');
    setEditingQId(q.id);
    setEditQText(q.text);
    setEditQAnswer(q.answer);
    setEditQPoints(q.points);
    setEditQImageUrl(q.imageUrl || '');
    setEditQVideoUrl(q.videoUrl || '');
    setEditQSource(q.source || '');
    setEditQSourceUrl(q.sourceUrl || '');
    setEditQQrEnabled(q.qrEnabled || false);
    setEditQLetterMode(q.letterMode || false);
    setEditQImagesEnabled(q.imagesEnabled || false);
    setEditQVideoEnabled(q.videoEnabled || false);
    setEditQMapMode(q.mapMode || false);
    setEditQLetter(q.letter || 'أ');
    setEditQOptions(q.options || []);
  };

  const handleGenerateOptionsForEdit = async () => {
    if (!editQText || !editQAnswer) {
      setMessage({ text: 'يرجى إدخال السؤال والإجابة أولاً لتوليد الخيارات', type: 'error' });
      return;
    }
    try {
      setIsGeneratingOptions(true);
      const generated = await aiService.generateOptions(editQText, editQAnswer);
      setEditQOptions(generated);
      setMessage({ text: 'تم توليد الخيارات الذكية بنجاح', type: 'success' });
    } catch (e) {
      handleError(e);
    } finally {
      setIsGeneratingOptions(false);
    }
  };

  const handleGenerateOptionsForNew = async () => {
    if (!newQ.text || !newQ.answer) {
      setMessage({ text: 'يرجى إدخال السؤال والإجابة أولاً لتوليد الخيارات', type: 'error' });
      return;
    }
    try {
      setIsGeneratingOptions(true);
      const generated = await aiService.generateOptions(newQ.text, newQ.answer);
      setNewQ(prev => ({ ...prev, options: generated }));
      setMessage({ text: 'تم توليد الخيارات الذكية بنجاح', type: 'success' });
    } catch (e) {
      handleError(e);
    } finally {
      setIsGeneratingOptions(false);
    }
  };

  const handleUpdateQuestion = async (qId: string) => {
    if (!selectedCatId) return;
    try {
      setLoading(true);
      await dataService.updateQuestion(selectedCatId, qId, {
        text: editQText,
        answer: editQAnswer,
        points: editQPoints,
        imageUrl: editQImageUrl,
        videoUrl: editQVideoUrl,
        imagesEnabled: editQImagesEnabled,
        qrEnabled: editQQrEnabled,
        letterMode: editQLetterMode,
        videoEnabled: editQVideoEnabled,
        mapMode: editQMapMode,
        letter: editQLetter,
        options: editQOptions,
        source: editQSource,
        sourceUrl: editQSourceUrl
      });
      setQuestions(prev => prev.map(q => q.id === qId ? {
        ...q,
        text: editQText,
        answer: editQAnswer,
        points: editQPoints,
        imageUrl: editQImageUrl,
        videoUrl: editQVideoUrl,
        imagesEnabled: editQImagesEnabled,
        qrEnabled: editQQrEnabled,
        letterMode: editQLetterMode,
        videoEnabled: editQVideoEnabled,
        mapMode: editQMapMode,
        letter: editQLetter,
        options: editQOptions,
        source: editQSource,
        sourceUrl: editQSourceUrl
      } : q));
      setEditingQId(null);
      setMessage({ text: 'تم تحديث السؤال بنجاح', type: 'success' });
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };
  const loadQuestions = async (catId: string) => {
    try {
      setIsLoadingQuestions(true);
      const data = await dataService.getQuestions(catId);
      setQuestions(data);
      setSelectedQIds([]); // Reset selection on change
      setQSearch('');
      setAnswerSearch('');
      setSourceFilter('all');
      setHasImageFilter('all');
      setPointFilter('all');
    } catch (e) {
      handleError(e);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleAddCategory = async () => {
    playSound?.('click');
    if (!newCat.name.trim()) {
      setMessage({ text: 'يرجى إدخال اسم القسم', type: 'error' });
      return;
    }
    try {
      setLoading(true);

      // Verify or create group if it doesn't exist
      let groupName = (newCat.group || 'عام').trim() || 'عام';
      
      // If we are on the Maps tab and group is default 'عام', force it to 'القوائم الأخرى'
      if (sidebarTab === 'maps' && (groupName === 'عام' || !groupName)) {
        groupName = 'القوائم الأخرى';
      }
      
      // Safety check for the __NEW__ placeholder
      if (groupName === '__NEW__') groupName = 'عام';

      // Let's check from the server directly to be 100% sure we don't duplicate
      const freshGroups = await dataService.getGroups();
      const existingGroup = freshGroups.find(g => g.name === groupName);
      if (!existingGroup) {
        await dataService.addGroup({ name: groupName, order: freshGroups.length });
        await loadGroups();
        setMessage({ text: `تم إنشاء القائمة الجديدة: ${groupName}`, type: 'success' });
      }

      // Determine a relevant illustative icon based on the category name
      let suggestedIcon = 'https://img.icons8.com/plasticine/256/moleskine.png'; // default
      const name = newCat.name.toLowerCase();
      
      // Traditional & Religious
      if (name.includes('خرائط') || name.includes('خريطة') || name.includes('جغرافيا')) suggestedIcon = 'https://img.icons8.com/plasticine/256/globe-earth.png';
      else if (name.includes('قرآن') || name.includes('آيات') || name.includes('آية')) suggestedIcon = 'https://img.icons8.com/plasticine/256/quran.png';
      else if (name.includes('نبي') || name.includes('محمد')) suggestedIcon = 'https://img.icons8.com/plasticine/256/mosque.png';
      else if (name.includes('علي') || name.includes('أمير')) suggestedIcon = 'https://img.icons8.com/plasticine/256/sword.png';
      else if (name.includes('زهراء') || name.includes('فاطمة')) suggestedIcon = 'https://img.icons8.com/plasticine/256/lotus.png';
      else if (name.includes('حسن')) suggestedIcon = 'https://img.icons8.com/plasticine/256/emerald.png';
      else if (name.includes('حسين')) suggestedIcon = 'https://img.icons8.com/plasticine/256/blood-drop.png';
      else if (name.includes('سجاد')) suggestedIcon = 'https://img.icons8.com/plasticine/256/prayer-beads.png';
      else if (name.includes('باقر')) suggestedIcon = 'https://img.icons8.com/plasticine/256/reading.png';
      else if (name.includes('صادق')) suggestedIcon = 'https://img.icons8.com/plasticine/256/university.png';
      else if (name.includes('كاظم')) suggestedIcon = 'https://img.icons8.com/plasticine/256/jailbreak.png';
      else if (name.includes('رضا')) suggestedIcon = 'https://img.icons8.com/plasticine/256/deer.png';
      else if (name.includes('جواد')) suggestedIcon = 'https://img.icons8.com/plasticine/256/young-man.png';
      else if (name.includes('هادي')) suggestedIcon = 'https://img.icons8.com/plasticine/256/sun.png';
      else if (name.includes('عسكري')) suggestedIcon = 'https://img.icons8.com/plasticine/256/fortress.png';
      else if (name.includes('مهدي') || name.includes('القائم')) suggestedIcon = 'https://img.icons8.com/plasticine/256/mosque.png';
      
      // General
      else if (name.includes('عالم') || name.includes('جغرافيا')) suggestedIcon = 'https://img.icons8.com/plasticine/256/globe-earth.png';
      else if (name.includes('رياضة') || name.includes('كرة')) suggestedIcon = 'https://img.icons8.com/plasticine/256/football.png';
      else if (name.includes('تاريخ') || name.includes('غزوات')) suggestedIcon = 'https://img.icons8.com/plasticine/256/shield.png';
      else if (name.includes('علم') || name.includes('أعلام')) suggestedIcon = 'https://img.icons8.com/plasticine/256/flag.png';
      else if (name.includes('قانون') || name.includes('فقه')) suggestedIcon = 'https://img.icons8.com/plasticine/256/scales.png';
      else if (name.includes('فن') || name.includes('تمثيل')) suggestedIcon = 'https://img.icons8.com/plasticine/256/theater-mask.png';
      else if (name.includes('برنامج') || name.includes('تلفزيون')) suggestedIcon = 'https://img.icons8.com/plasticine/256/tv-show.png';
      else if (name.includes('صحة') || name.includes('طب')) suggestedIcon = 'https://img.icons8.com/plasticine/256/stethoscope.png';
      else if (name.includes('لغز') || name.includes('فوازير')) suggestedIcon = 'https://img.icons8.com/plasticine/256/confused.png';
      else if (name.includes('بيت') || name.includes('أهل')) suggestedIcon = 'https://img.icons8.com/plasticine/256/mosque.png';

      const catRef = await dataService.addCategory({
        name: newCat.name.trim(),
        group: groupName,
        imageUrl: newCat.imageUrl || suggestedIcon,
        sourceUrl: importUrl || "",
        sourceText: newCat.sourceText || "",
        letterMode: newCat.letterMode,
        imagesEnabled: newCat.imagesEnabled,
        qrEnabled: newCat.qrEnabled,
        videoEnabled: newCat.videoEnabled,
        mapMode: newCat.mapMode,
        imageMode: newCat.imageMode,
        timerDuration: newCat.timerDuration,
        iconUrl: newCat.iconUrl,
        letter: newCat.letter,
        description: newCat.description,
        isActive: true
      });
      const catId = catRef.id;

      // Manual mode category creation summary
      setMessage({ text: 'تم إنشاء القسم بنجاح!', type: 'success' });

      if (creationMode === 'url' && importUrl) {
        setIsExtracting(true);
        setExtractionProgress(10);
        setMessage({ text: 'جاري البدء في عملية الاستخراج من الرابط...', type: 'success' });
        
        try {
          setExtractionProgress(30);
          const content = await aiService.fetchUrlContent(importUrl);
          setExtractionProgress(60);
          setMessage({ text: 'جاري تحليل المحتوى واستخراج الأسئلة المتنوعة...', type: 'success' });
          const extractedQuestions = await aiService.extractQuestionsFromUrlContent(content, importUrl);
          
          setExtractionProgress(80);
          for (const q of extractedQuestions) {
            await dataService.addQuestion(catId, q);
          }
          
          setExtractionProgress(100);
          await dataService.updateCategory(catId, { lastSyncedAt: serverTimestamp() });
          setMessage({ text: `تمت إضافة القسم واستخراج ${extractedQuestions.length} أسئلة بنجاح`, type: 'success' });
        } catch (error: any) {
          console.error("AI Extraction Error:", error);
          const errorMessage = error.message || 'فشل استخراج الأسئلة من الرابط.';
          setMessage({ text: errorMessage, type: 'error' });
        } finally {
          setIsExtracting(false);
          setExtractionProgress(0);
        }
      } else if (creationMode === 'ai') {
        setIsGenerating(true);
        setMessage({ text: 'جاري توليد أسئلة ذكية متوافقة مع القسم المضاف...', type: 'success' });
        try {
          const generatedQuestions = await aiService.generateQuestionsFromTopic(newCat.name, 20, [], newCat.sourceText);
          for (const q of generatedQuestions) {
            await dataService.addQuestion(catId, q);
          }
          setMessage({ text: `تمت إضافة القسم وتوليد ${generatedQuestions.length} أسئلة ذكية بنجاح`, type: 'success' });
        } catch (error: any) {
          console.error("AI Generation Error:", error);
          setMessage({ text: 'تمت إضافة القسم، ولكن فشل توليد الأسئلة بالذكاء الاصطناعي.', type: 'error' });
        } finally {
          setIsGenerating(false);
        }
      } else {
        setMessage({ text: 'تمت إضافة القسم بنجاح', type: 'success' });
      }

      setNewCat(prev => ({ ...prev, name: '', imageUrl: '' })); // Retain group for easier bulk entry
      setImportUrl('');
      await loadCategories();
      await loadGroups();
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategoryMeta = async () => {
    if (!selectedCatId) return;
    if (!editCatName.trim()) {
      setMessage({ text: 'يرجى إدخال اسم القسم', type: 'error' });
      return;
    }
    try {
      setLoading(true);

      // Verify or create group if it doesn't exist
      let groupName = (editCatGroup || 'عام').trim() || 'عام';
      if (groupName === '__NEW__') groupName = 'عام';

      const freshGroups = await dataService.getGroups();
      const existingGroup = freshGroups.find(g => g.name === groupName);
      if (!existingGroup) {
        await dataService.addGroup({ name: groupName, order: freshGroups.length });
        await loadGroups();
        setMessage({ text: `تم إنشاء القائمة الجديدة: ${groupName}`, type: 'success' });
      }

      await dataService.updateCategory(selectedCatId, { 
        name: editCatName, 
        group: groupName,
        iconUrl: editCatIcon,
        imageUrl: editCatImage,
        borderColor: editCatBorderColor,
        customShadow: editCatShadow,
        letterMode: editCatLetterMode,
        imagesEnabled: editCatImagesEnabled,
        qrEnabled: editCatQrEnabled,
        videoEnabled: editCatVideoEnabled,
        mapMode: editCatMapMode,
        imageMode: editCatImageMode,
        timerDuration: editCatTimerDuration,
        sourceText: editSourceText,
        letter: editCatLetter
      });
      await loadCategories();
      setMessage({ text: 'تم تحديث بيانات القسم بنجاح', type: 'success' });
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = (groupId: string, groupName: string) => {
    playSound?.('click');
    if (groupName === 'عام') {
      alert('لا يمكن حذف القوائم الأساسية (عام)');
      return;
    }
    setGroupToDelete({ id: groupId, name: groupName });
  };

  const confirmDeleteGroup = async () => {
    if (!groupToDelete) return;
    const { id: groupId, name: groupName } = groupToDelete;
    
    try {
      setLoading(true);
      // 1. Update categories in this group to "عام"
      const affectedCats = categories.filter(c => (c.group || 'عام') === groupName);
      for (const cat of affectedCats) {
        await dataService.updateCategory(cat.id, { group: 'عام' });
      }

      // 2. Delete the group document
      await dataService.deleteGroup(groupId);
      
      await loadGroups();
      await loadCategories();
      setGroupToDelete(null);
      setMessage({ text: `تم حذف القائمة "${groupName}" بنجاح`, type: 'success' });
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const groupPersistTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const catPersistTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePersistOrder = (newOrder: DBGroup[]) => {
    if (groupPersistTimeoutRef.current) clearTimeout(groupPersistTimeoutRef.current);
    
    groupPersistTimeoutRef.current = setTimeout(async () => {
      try {
        // Update all groups in the new order
        // This ensures the database accurately reflects the current UI state
        // and handles cases where only some items changed position
        const updates = newOrder.map((g, index) => 
          dataService.updateGroup(g.id, { order: index })
        );
        await Promise.all(updates);
        console.log("Groups order persisted successfully");
      } catch (e) {
        console.error("Failed to update group order", e);
      }
    }, 2000); // 2 second debounce to prevent hitting Firebase quotas during drag
  };

  const handleReorderGroups = (newFilteredOrder: DBGroup[]) => {
    // Merge the reordered subset back into the master groups list while preserving items not currently visible
    const newFullOrder = [...groups];
    
    // 1. Identify the items that were part of the reorderable subset
    const filteredIds = new Set(newFilteredOrder.map(g => g.id));
    
    // 2. Find the original positions of those items in the master list
    const originalVisibleIndices = groups
      .map((g, idx) => filteredIds.has(g.id) ? idx : -1)
      .filter(idx => idx !== -1);
      
    // 3. Place the items from the newFilteredOrder back into those exact slots
    newFilteredOrder.forEach((item, i) => {
      newFullOrder[originalVisibleIndices[i]] = item;
    });

    // 4. Update order properties locally to match new indices
    const updatedFullOrder = newFullOrder.map((g, idx) => ({ ...g, order: idx }));

    setGroups(updatedFullOrder);
    setDraggedGroups(updatedFullOrder); // Keep modal in sync
    handlePersistOrder(updatedFullOrder);
  };

  const handleUpdateSource = async () => {
    if (!selectedCatId) return;
    const currentCat = categories.find(c => c.id === selectedCatId);
    
    // If URL changed and we have questions, ask user what to do
    if (currentCat?.sourceUrl !== editSourceUrl && questions.length > 0) {
      setShowSyncConfirm(true);
      return;
    }
    
    await performUpdateSource(false);
  };

  const performUpdateSource = async (deleteExisting: boolean) => {
    if (!selectedCatId) return;
    try {
      setLoading(true);
      await dataService.updateCategory(selectedCatId, { 
        sourceUrl: editSourceUrl,
        sourceText: editSourceText,
        lastSyncedAt: null
      });
      
      if (deleteExisting) {
        // Bulk delete questions for this category
        for (const q of questions) {
          await dataService.deleteQuestion(selectedCatId, q.id);
        }
        loadQuestions(selectedCatId);
      }
      
      loadCategories();
      setShowSyncConfirm(false);
      setMessage({ text: 'تم تحديث رابط المصدر للقسم بنجاح', type: 'success' });
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAIGenerateMore = async () => {
    if (!selectedCatId || !editCatName) return;
    try {
      setIsGenerating(true);
      setMessage({ text: 'جاري توليد المزيد من الأسئلة الذكية لهذا القسم...', type: 'success' });
      
      const existingTexts = questions.map(q => q.text);
      const generated = await aiService.generateQuestionsFromTopic(
        editCatName, 
        9, 
        existingTexts, 
        editSourceText,
        newQ.letterMode ? newQ.letter : undefined
      );
      let added = 0;
      for (const q of generated) {
        const isDup = questions.some(ex => ex.text === q.text);
        if (!isDup) {
          let questionLetter = newQ.letter;
          let questionAnswer = q.answer;

          // If in "All Letters" mode, try to extract the letter from the answer if AI followed the format (ب)
          if (newQ.letterMode && newQ.letter === 'الكل') {
            const match = q.answer.match(/^\((.*?)\)\s*(.*)/);
            if (match) {
              questionLetter = match[1];
              questionAnswer = match[2];
            } else {
              // Fallback: use first char of answer if no format found
              questionLetter = q.answer.trim().charAt(0);
            }
          }

          await dataService.addQuestion(selectedCatId, {
            ...q,
            answer: questionAnswer,
            letterMode: newQ.letterMode,
            letter: newQ.letterMode ? questionLetter : undefined
          });
          added++;
        }
      }
      
      loadQuestions(selectedCatId);
      setMessage({ text: `تمت إضافة ${added} سؤالاً ذكياً جديداً لهذا القسم.`, type: 'success' });
    } catch (e) {
      handleError(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualSync = async () => {
    if (!selectedCatId || !editSourceUrl) return;
    try {
      setIsExtracting(true);
      setExtractionProgress(20);
      setMessage({ text: 'جاري الاتصال بالمصدر وجلب المحتوى...', type: 'success' });

      const existingTexts = questions.map(q => q.text.trim());
      const content = await aiService.fetchUrlContent(editSourceUrl);
      setExtractionProgress(50);
      setMessage({ text: 'جاري تحليل البيانات واستخراج أسئلة جديدة...', type: 'success' });
      const extractedQuestions = await aiService.extractQuestionsFromUrlContent(content, editSourceUrl, existingTexts);
      
      setExtractionProgress(80);
      let addedCount = 0;
      for (const q of extractedQuestions) {
        // Simple duplicate check (text based) 
        const isDup = questions.some(ex => ex.text.trim() === q.text.trim());
        if (!isDup) {
          await dataService.addQuestion(selectedCatId, q);
          addedCount++;
        }
      }
      
      setExtractionProgress(100);
      loadQuestions(selectedCatId);
      setMessage({ text: `تمت عملية المزامنة بنجاح. تمت إضافة ${addedCount} سؤالاً جديداً (تم تجاهل المكرر).`, type: 'success' });
    } catch (e) {
      handleError(e);
    } finally {
      setIsExtracting(false);
      setExtractionProgress(0);
    }
  };

  const handleAddQuestion = async () => {
    playSound?.('click');
    if (!selectedCatId) return;
    if (!newQ.text.trim()) {
      setMessage({ text: 'يرجى إدخال نص السؤال', type: 'error' });
      return;
    }
    if (!newQ.answer.trim()) {
      setMessage({ text: 'يرجى إدخال الإجابة', type: 'error' });
      return;
    }
    if (isNaN(newQ.points) || newQ.points <= 0) {
      setMessage({ text: 'يرجى إدخال نقاط صحيحة', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      await dataService.addQuestion(selectedCatId, {
        ...newQ,
        imagesEnabled: newQ.imagesEnabled,
        letterMode: newQ.letterMode,
        qrEnabled: newQ.qrEnabled,
        videoEnabled: newQ.videoEnabled,
        mapMode: newQ.mapMode
      });
      setNewQ({ 
        text: '', 
        answer: '', 
        options: [],
        points: 20, 
        source: ' مسابقات أبوالفواطم', 
        sourceUrl: '',
        imageUrl: '', 
        videoUrl: '', 
        qrEnabled: false,
        letterMode: newQ.letterMode, 
        imagesEnabled: newQ.imagesEnabled,
        videoEnabled: newQ.videoEnabled,
        mapMode: newQ.mapMode,
        letter: newQ.letter 
      });
      loadQuestions(selectedCatId);
      setRecountTrigger(prev => prev + 1);
      setMessage({ text: 'تمت إضافة السؤال بنجاح', type: 'success' });
    } catch (e) {
      handleError(e);
    }
  };

  const handleBulkParse = async () => {
    if (!bulkText.trim()) return;
    try {
      setIsParsingBulk(true);
      setMessage({ text: 'جاري تحليل النص المجمع باستخدام الذكاء الاصطناعي...', type: 'success' });
      const results = await aiService.parseBulkQuestions(bulkText);
      setParsedBulkQuestions(results);
      setMessage({ text: `تم بنجاح تحليل ${results.length} سؤالاً. يرجى مراجعتها ثم الحفظ.`, type: 'success' });
    } catch (e) {
      handleError(e);
    } finally {
      setIsParsingBulk(false);
    }
  };

  const handleBulkSave = async () => {
    if (!selectedCatId || parsedBulkQuestions.length === 0) return;
    try {
      setLoading(true);
      setMessage({ text: `جاري حفظ ${parsedBulkQuestions.length} سؤالاً...`, type: 'success' });
      let savedCount = 0;
      for (const q of parsedBulkQuestions) {
        await dataService.addQuestion(selectedCatId, {
          ...q,
          videoEnabled: !!q.videoUrl,
          imagesEnabled: !!q.imageUrl,
          source: q.source || 'إضافة مجمعة بالذكاء',
          createdAt: serverTimestamp()
        });
        savedCount++;
      }
      setParsedBulkQuestions([]);
      setBulkText('');
      setQuestionAddTab('single');
      loadQuestions(selectedCatId);
      setRecountTrigger(prev => prev + 1);
      setMessage({ text: `تم حفظ ${savedCount} سؤالاً بنجاح في هذا القسم.`, type: 'success' });
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = (id: string) => {
    playSound?.('click');
    setCatToDelete(id);
  };

  const confirmDeleteCategory = async () => {
    if (!catToDelete) return;
    try {
      setLoading(true);
      // Delete questions first (optional but better)
      const qs = await dataService.getQuestions(catToDelete);
      for (const q of qs) {
        await dataService.deleteQuestion(catToDelete, q.id);
      }
      
      await dataService.deleteCategory(catToDelete);
      loadCategories();
      if (selectedCatId === catToDelete) {
        setSelectedCatId(null);
      }
      setCatToDelete(null);
      setMessage({ text: 'تم حذف القسم بنجاح', type: 'success' });
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCategoryActive = async (id: string, currentStatus: boolean) => {
    playSound?.('click');
    try {
      setLoading(true);
      await dataService.updateCategory(id, { isActive: !currentStatus });
      // Update local state for immediate feedback
      setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, isActive: !currentStatus } : cat));
      setMessage({ 
        text: !currentStatus ? 'تم تفعيل القسم بنجاح وستظهر للمشاركين' : 'تم إخفاء القسم بنجاح من شريط المسابقة', 
        type: 'success' 
      });
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = (qId: string) => {
    playSound?.('click');
    setQToDelete(qId);
  };

  const confirmDeleteQuestion = async () => {
    if (!qToDelete || !selectedCatId) return;
    
    const previousQuestions = [...questions];
    const qId = qToDelete;

    // Optimistic update
    setQuestions(questions.filter(q => q.id !== qId));
    setQToDelete(null);
    
    try {
      await dataService.deleteQuestion(selectedCatId, qId);
      setRecountTrigger(prev => prev + 1);
      setMessage({ text: 'تم حذف السؤال بنجاح', type: 'success' });
    } catch (e) {
      // Rollback on error
      setQuestions(previousQuestions);
      handleError(e);
    }
  };

  const handleAIGenerateQuestions = async () => {
    if (!selectedCatId) return;
    const cat = categories.find(c => c.id === selectedCatId);
    if (!cat) return;

    try {
      setIsGeneratingQuestions(true);
      setMessage({ text: 'جاري توليد 10 أسئلة ذكية بناءً على القسم...', type: 'success' });
      
      const existingTexts = questions.map(q => q.text.trim());
      const generated = await aiService.generateQuestionsFromTopic(
        cat.name, 
        10, 
        existingTexts, 
        cat.sourceText || editSourceText || '',
        cat.letterMode ? cat.letter : undefined
      );
      
      let addedCount = 0;
      for (const q of generated) {
        const isDup = questions.some(ex => ex.text.trim() === q.text.trim());
        if (!isDup) {
          let questionLetter = cat.letter;
          let questionAnswer = q.answer;

          if (cat.letterMode && cat.letter === 'الكل') {
            const match = q.answer.match(/^\((.*?)\)\s*(.*)/);
            if (match) {
              questionLetter = match[1];
              questionAnswer = match[2];
            } else {
              questionLetter = q.answer.trim().charAt(0);
            }
          }

          await dataService.addQuestion(selectedCatId, {
            ...q,
            answer: questionAnswer,
            letterMode: cat.letterMode,
            letter: cat.letterMode ? questionLetter : undefined
          });
          addedCount++;
        }
      }
      
      loadQuestions(selectedCatId);
      setRecountTrigger(prev => prev + 1);
      setMessage({ text: `تم توليد وإضافة ${addedCount} سؤالاً بنجاح!`, type: 'success' });
    } catch (e) {
      console.error("AI Generation failed:", e);
      setMessage({ text: 'فشل في توليد الأسئلة عبر الذكاء الاصطناعي', type: 'error' });
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleBulkDelete = () => {
    playSound?.('click');
    if (selectedQIds.length === 0) return;
    setBulkDeleteIds([...selectedQIds]);
  };

  const confirmBulkDelete = async () => {
    if (!bulkDeleteIds || !selectedCatId) return;
    const idsToDelete = [...bulkDeleteIds];
    const previousQuestions = [...questions];

    setQuestions(prev => prev.filter(q => !idsToDelete.includes(q.id)));
    setSelectedQIds([]);
    setBulkDeleteIds(null);

    try {
      await Promise.all(idsToDelete.map(id => dataService.deleteQuestion(selectedCatId, id)));
      setRecountTrigger(prev => prev + 1);
      setMessage({ text: 'تم حذف الأسئلة المحددة بنجاح', type: 'success' });
    } catch (e) {
      setQuestions(previousQuestions);
      handleError(e);
    }
  };

  const handleDeletePlayed = () => {
    const playedIds = questions.filter(q => answeredQuestionIds.includes(q.id)).map(q => q.id);
    if (playedIds.length > 0) {
      setBulkDeleteIds(playedIds);
    }
  };

  const toggleQSelection = (id: string) => {
    setSelectedQIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedQIds.length === questions.length) {
      setSelectedQIds([]);
    } else {
      setSelectedQIds(questions.map(q => q.id));
    }
  };

  const handleSyncCategory = async (cat: DBCategory) => {
    if (!cat.sourceUrl) return;
    try {
      setIsExtracting(true);
      setSyncStatus('running');
      setShowSyncLog(true);
      setSyncLog([{ name: cat.name, status: 'pending', message: 'جاري البدء...' }]);
      setExtractionProgress(10);
      
      const existingQs = await dataService.getQuestions(cat.id);
      const existingTexts = existingQs.map(q => q.text.trim());
      
      setExtractionProgress(30);
      setSyncLog(prev => prev.map(l => l.name === cat.name ? { ...l, message: 'تحليل محتوى الرابط...' } : l));
      const content = await aiService.fetchUrlContent(cat.sourceUrl);
      
      setExtractionProgress(60);
      setSyncLog(prev => prev.map(l => l.name === cat.name ? { ...l, message: 'استخراج الأسئلة بالذكاء الاصطناعي...' } : l));
      const newQuestions = await aiService.extractQuestionsFromUrlContent(content, cat.sourceUrl, existingTexts);
      
      if (newQuestions.length === 0) {
        await dataService.updateCategory(cat.id, { lastSyncedAt: serverTimestamp() });
        setSyncLog(prev => prev.map(l => l.name === cat.name ? { ...l, status: 'success', message: 'اكتمل. لم يتم العثور على أي معلومات جديدة.' } : l));
        setMessage({ text: 'تم فحص الرابط ولكن لم يتم العثور على أي معلومات جديدة لم تكن موجودة مسبقاً.', type: 'info' });
      } else {
        setExtractionProgress(80);
        setSyncLog(prev => prev.map(l => l.name === cat.name ? { ...l, message: `جاري حفظ ${newQuestions.length} سؤال...` } : l));
        let addedCount = 0;
        for (const q of newQuestions) {
          const isDup = existingTexts.some(txt => txt === q.text.trim());
          if (!isDup) {
            let questionLetter = cat.letter;
            let questionAnswer = q.answer;

            if (cat.letterMode && cat.letter === 'الكل') {
              const match = q.answer.match(/^\((.*?)\)\s*(.*)/);
              if (match) {
                questionLetter = match[1];
                questionAnswer = match[2];
              } else {
                questionLetter = q.answer.trim().charAt(0);
              }
            }

            await dataService.addQuestion(cat.id, {
              ...q,
              answer: questionAnswer,
              letterMode: cat.letterMode,
              letter: cat.letterMode ? questionLetter : undefined
            });
            addedCount++;
          }
        }
        await dataService.updateCategory(cat.id, { lastSyncedAt: serverTimestamp() });
        setSyncLog(prev => prev.map(l => l.name === cat.name ? { ...l, status: 'success', message: `اكتمل بنجاح. تمت إضافة ${addedCount} سؤال جديد.` } : l));
        setRecountTrigger(prev => prev + 1);
        setMessage({ text: `تمت مزامنة ${addedCount} سؤال جديد بنجاح للقسم: ${cat.name}`, type: 'success' });
        
        if (selectedCatId === cat.id) {
          const freshQuestions = await dataService.getQuestions(cat.id);
          setQuestions(freshQuestions);
        }
        const freshCats = await dataService.getCategories();
        setCategories(freshCats);
      }
      setExtractionProgress(100);
      setSyncStatus('completed');
    } catch (e: any) {
      console.error("Manual Sync Error:", e);
      setSyncStatus('error');
      setSyncLog(prev => prev.map(l => l.name === cat.name ? { ...l, status: 'error', message: `خطأ: ${e.message || 'حدث خطأ غير متوقع'}` } : l));
      handleError(e);
    } finally {
      setIsExtracting(false);
      setExtractionProgress(0);
    }
  };

  const handleSmartSyncAll = async () => {
    playSound?.('click');
    const unsyncedCats = categories.filter(c => c.sourceUrl && !c.lastSyncedAt);
    if (unsyncedCats.length === 0) {
      alert("جميع الأقسام التي تحتوي على روابط مصادر تمت مزامنتها بالفعل.");
      return;
    }

    if (!confirm(`سيتم البدء في المزامنة الذكية لـ (${unsyncedCats.length}) أقسام. قد تستغرق هذه العملية دقائق. هل تود الاستمرار؟`)) {
      return;
    }

    try {
      setIsExtracting(true);
      setSyncStatus('running');
      setShowSyncLog(true);
      setSyncLog(unsyncedCats.map(c => ({ name: c.name, status: 'pending', message: 'في الانتظار...' })));
      
      for (let i = 0; i < unsyncedCats.length; i++) {
        const cat = unsyncedCats[i];
        
        // Add a substantial delay between categories to strictly respect Gemini free tier quotas
        if (i > 0) {
          await new Promise(r => setTimeout(r, 12000));
        }

        setExtractionProgress(Math.floor(((i) / unsyncedCats.length) * 100));
        setSyncLog(prev => prev.map(l => l.name === cat.name ? { ...l, message: 'بدء المعالجة...' } : l));
        
        try {
          const existingQs = await dataService.getQuestions(cat.id);
          const existingTexts = existingQs.map(q => q.text.trim());
          
          setSyncLog(prev => prev.map(l => l.name === cat.name ? { ...l, message: 'تحليل الرابط...' } : l));
          const content = await aiService.fetchUrlContent(cat.sourceUrl!);
          
          setSyncLog(prev => prev.map(l => l.name === cat.name ? { ...l, message: 'استخراج الأسئلة...' } : l));
          const newQuestions = await aiService.extractQuestionsFromUrlContent(content, cat.sourceUrl!, existingTexts);
          
          if (newQuestions.length > 0) {
            let addedCount = 0;
            setSyncLog(prev => prev.map(l => l.name === cat.name ? { ...l, message: `حفظ الأسئلة المستخرجة...` } : l));
            for (const q of newQuestions) {
              const isDup = existingTexts.some(txt => txt === q.text.trim());
              if (!isDup) {
                let questionLetter = cat.letter;
                let questionAnswer = q.answer;

                if (cat.letterMode && cat.letter === 'الكل') {
                  const match = q.answer.match(/^\((.*?)\)\s*(.*)/);
                  if (match) {
                    questionLetter = match[1];
                    questionAnswer = match[2];
                  } else {
                    questionLetter = q.answer.trim().charAt(0);
                  }
                }

                await dataService.addQuestion(cat.id, {
                  ...q,
                  answer: questionAnswer,
                  letterMode: cat.letterMode,
                  letter: cat.letterMode ? questionLetter : undefined
                });
                addedCount++;
              }
            }
            setSyncLog(prev => prev.map(l => l.name === cat.name ? { ...l, status: 'success', message: `اكتمل. ${addedCount} سؤال جديد.` } : l));
          } else {
            setSyncLog(prev => prev.map(l => l.name === cat.name ? { ...l, status: 'success', message: `اكتمل. لم يتم العثور على أسئلة جديدة.` } : l));
          }
          
          await dataService.updateCategory(cat.id, { lastSyncedAt: serverTimestamp() });
        } catch (catErr: any) {
          console.error(`Error syncing ${cat.name}:`, catErr);
          setSyncLog(prev => prev.map(l => l.name === cat.name ? { ...l, status: 'error', message: `فشل: ${catErr.message || 'خطأ'}` } : l));
        }
      }
      
      const freshCats = await dataService.getCategories();
      setCategories(freshCats);
      setRecountTrigger(prev => prev + 1);
      setExtractionProgress(100);
      setSyncStatus('completed');
      setMessage({ text: "اكتملت المزامنة الذكية لجميع الأقسام بنجاح.", type: 'success' });
    } catch (e: any) {
      console.error("Smart Sync All Error:", e);
      setSyncStatus('error');
      handleError(e);
    } finally {
      setIsExtracting(false);
      setExtractionProgress(0);
    }
  };

  const handleSeed = async (force: boolean = false, targetCatId?: string | null) => {
    const msg = targetCatId 
      ? 'سيتم إعادة جلب الأسئلة الافتراضية لهذا القسم فقط. هل تود الاستمرار؟' 
      : 'سيتم جلب الأسئلة الافتراضية إلى قاعدة البيانات. هل تود الاستمرار؟';
    
    if (force || confirm(msg)) {
      try {
        setLoading(true);
        if (targetCatId) {
          const cat = categories.find(c => c.id === targetCatId);
          if (cat) {
            const seedCat = INITIAL_CATEGORIES.find(ic => ic.name === cat.name);
            if (seedCat) {
              await dataService.seedInitialData([seedCat]);
            } else {
              setMessage({ text: 'لا توجد بيانات افتراضية لهذا القسم', type: 'error' });
              return;
            }
          }
        } else {
          await dataService.seedInitialData(INITIAL_CATEGORIES);
        }
        await loadCategories();
        setRecountTrigger(prev => prev + 1);
        if (targetCatId) loadQuestions(targetCatId);
        setRecountTrigger(prev => prev + 1);
        setMessage({ text: 'تمت مزامنة البيانات الافتراضية بنجاح', type: 'success' });
      } catch (e) {
        handleError(e);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateCategoryDetails = async () => {
    playSound?.('click');
    if (!selectedCatId) return false;
    try {
      setLoading(true);
      
      let finalGroup = editCatGroup;
      if (editCatGroup === '__NEW__' && newEditGroupName.trim()) {
        await dataService.addGroup({ 
          name: newEditGroupName.trim(), 
          order: groups.length 
        });
        finalGroup = newEditGroupName.trim();
        await loadGroups();
        setNewEditGroupName('');
        setEditCatGroup(finalGroup);
      }

      await dataService.updateCategory(selectedCatId, {
        name: editCatName,
        group: finalGroup,
        iconUrl: editCatIcon,
        imageUrl: editCatImage,
        borderColor: editCatBorderColor,
        customShadow: editCatShadow,
        letterMode: editCatLetterMode,
        imagesEnabled: editCatImagesEnabled,
        qrEnabled: editCatQrEnabled,
        videoEnabled: editCatVideoEnabled,
        mapMode: editCatMapMode,
        imageMode: editCatImageMode,
        timerDuration: editCatTimerDuration,
        letter: editCatLetter,
        sourceUrl: editSourceUrl,
        sourceText: editSourceText,
        description: editCatDescription
      });
      setMessage({ text: 'تم تحديث بيانات القسم بنجاح', type: 'success' });
      await loadCategories();
      return true;
    } catch (e) {
      handleError(e);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => {
    if (loading) return <DashboardOverviewSkeleton />;
    
    return (
      <div className="space-y-6">
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'إجمالي الأقسام', value: categories.length, icon: LayoutGrid, color: 'indigo' },
          { label: 'إجمالي الأسئلة', value: totalQuestionsCount, icon: HelpCircle, color: 'amber' }, 
          { label: 'الأسئلة الملعوبة', value: answeredQuestionIds.length, icon: History, color: 'emerald' },
          { label: 'عدد القوائم', value: groups.length, icon: Layers, color: 'rose' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm group hover:shadow-xl hover:border-indigo-100 transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-slate-400 text-[9px] font-semibold uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h4>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Played Questions Summary Card */}
      {answeredQuestionIds.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-indigo-600 rounded-[32px] p-6 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <History className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">حالة الأسئلة في المسابقة</h3>
                <p className="text-indigo-100 font-medium max-w-md text-sm">
                   تم لعب <span className="bg-white text-indigo-600 px-2 py-0.5 rounded-lg font-bold">{answeredQuestionIds.length}</span> سؤال حتى الآن.
                </p>
              </div>
            </div>
            <button 
              onClick={onResetPlayedQuestions}
              className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold text-[10px] hover:bg-slate-50 transition-all shadow-xl flex items-center gap-3 whitespace-nowrap"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة تصفير السجل
            </button>
          </div>
        </motion.div>
      )}

      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -z-0 translate-x-20 -translate-y-20 group-hover:scale-110 transition-transform duration-700" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">إجراءات سريعة</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-widest">إدارة الحالة العامة للمسابقة</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <p className="text-[10px] text-slate-400 font-bold italic bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
              تم إيقاف المزامنة التلقائية بناءً على طلبك. يمكنك إضافة الأقسام يدوياً من علامة تبويب الأقسام.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
    );
  };

  const renderMedia = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Media Management Actions */}
      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="flex-grow bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-10 rounded-full" />
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[24px] flex items-center justify-center relative z-10">
                <Sparkles className="w-8 h-8" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">المزامنة الذكية للوسائط</h3>
              <p className="text-sm text-slate-400 font-bold mt-1">تحديث الصور والملفات الصوتية للأقسام والأسئلة آلياً</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <p className="text-xs font-bold text-slate-400 italic">
               المزامنة معطلة. يرجى تعديل الوسائط يدوياً لكل سؤال.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-slate-100 pb-10">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse" />
            <div className="relative p-6 bg-indigo-600 rounded-[32px] text-white shadow-2xl shadow-indigo-200">
              {mediaSubTab === 'questions' && <Volume2 className="w-10 h-10" />}
              {mediaSubTab === 'system' && <Zap className="w-10 h-10" />}
              {mediaSubTab === 'upload' && <CloudUpload className="w-10 h-10" />}
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {mediaSubTab === 'questions' && "أصوات الأسئلة والتفاعل"}
              {mediaSubTab === 'system' && "أصوات ومؤثرات النظام"}
              {mediaSubTab === 'upload' && "تحميل ورفع الوسائط"}
            </h2>
            <p className="text-slate-500 font-bold mt-1 text-lg">
              {mediaSubTab === 'questions' && "تخصيص أصوات الإجابة الصحيحة والخاطئة"}
              {mediaSubTab === 'system' && "إدارة أصوات البداية، العد التنازلي، والانتصار"}
              {mediaSubTab === 'upload' && "أدوات مساعدة لرفع ملفاتك والحصول على روابط مباشرة"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {playingTestAudio && (
            <motion.button 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playingTestAudio.audio.pause();
                setPlayingTestAudio(null);
              }}
              className="px-6 py-3 bg-rose-500 text-white font-bold rounded-2xl shadow-xl shadow-rose-100 flex items-center gap-3 animate-pulse text-xs"
            >
              <VolumeX className="w-5 h-5" />
              <span>إيقاف المعاينة</span>
            </motion.button>
          )}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUpdateAppSettings}
            className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 flex items-center gap-3 text-base"
          >
            <Save className="w-5 h-5" />
            <span>حفظ الإعدادات</span>
          </motion.button>
        </div>
      </div>

      {mediaSubTab === 'questions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Correct Answer Card */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8 flex flex-col">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-100">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-800">صوت الاجابة الصحيحة</h4>
                <p className="text-xs text-slate-400 font-bold">يظهر عند النقر على إجابة صحيحة</p>
              </div>
            </div>

            <div className="space-y-6 flex-grow">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">رابط ملف الصوت (MP3)</label>
                <div className="flex gap-3">
                  <div className="relative flex-grow">
                    <input 
                      type="text" value={correctSoundUrl} onChange={(e) => setCorrectSoundUrl(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all text-xs font-mono font-bold pr-14"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Music className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                  <label className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm cursor-pointer active:scale-95 shrink-0" title="رفع ملف صوتي">
                    <Upload className="w-6 h-6" />
                    <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleAudioUpload(e, setCorrectSoundUrl)} />
                  </label>
                  <button 
                    onClick={() => {
                      if (playingTestAudio && playingTestAudio.id === 'correct') {
                        playingTestAudio.audio.pause();
                        setPlayingTestAudio(null);
                        return;
                      }
                      const url = correctSoundUrl || 'https://cdn.pixabay.com/audio/2021/08/04/audio_06d8a552c6.mp3';
                      const audio = new Audio(url);
                      audio.volume = correctSoundVolume;
                      audio.onended = () => setPlayingTestAudio(null);
                      audio.play().catch(e => console.warn("Audio test failed", e));
                      setPlayingTestAudio({ id: 'correct', audio });
                    }}
                    className={`w-14 h-14 ${playingTestAudio?.id === 'correct' ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white'} rounded-2xl flex items-center justify-center transition-all shadow-sm shrink-0`}
                  >
                    {playingTestAudio?.id === 'correct' ? <XCircle className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-black text-slate-400">
                  <span>حجم الصوت</span>
                  <span>{Math.round(correctSoundVolume * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" value={correctSoundVolume}
                  onChange={(e) => setCorrectSoundVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">صورة/GIF التفاعل المبهج</label>
                <div className="relative group flex gap-2">
                  <div className="relative flex-grow">
                    <input 
                      type="text" value={correctImageUrl} onChange={(e) => setCorrectImageUrl(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all text-xs font-mono font-bold pr-14"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <ImageIcon className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                  <label className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm cursor-pointer active:scale-95" title="رفع صورة">
                    <Upload className="w-6 h-6" />
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setCorrectImageUrl)} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Wrong Answer Card */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8 flex flex-col">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-100">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-800">صوت الاجابة الخاطئة</h4>
                <p className="text-xs text-slate-400 font-bold">يظهر عند النقر على إجابة خاطئة</p>
              </div>
            </div>

            <div className="space-y-6 flex-grow">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">رابط ملف الصوت (MP3)</label>
                <div className="flex gap-3">
                  <div className="relative flex-grow">
                    <input 
                      type="text" value={wrongSoundUrl} onChange={(e) => setWrongSoundUrl(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-rose-500 transition-all text-xs font-mono font-bold pr-14"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Music className="w-5 h-5 text-rose-400" />
                    </div>
                  </div>
                  <label className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm cursor-pointer active:scale-95 shrink-0" title="رفع ملف صوتي">
                    <Upload className="w-6 h-6" />
                    <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleAudioUpload(e, setWrongSoundUrl)} />
                  </label>
                  <button 
                    onClick={() => {
                      if (playingTestAudio && playingTestAudio.id === 'wrong') {
                        playingTestAudio.audio.pause();
                        setPlayingTestAudio(null);
                        return;
                      }
                      const url = wrongSoundUrl || 'https://cdn.pixabay.com/audio/2022/03/24/audio_346b0266ed.mp3';
                      const audio = new Audio(url);
                      audio.volume = wrongSoundVolume;
                      audio.onended = () => setPlayingTestAudio(null);
                      audio.play().catch(e => console.warn("Audio test failed", e));
                      setPlayingTestAudio({ id: 'wrong', audio });
                    }}
                    className={`w-14 h-14 ${playingTestAudio?.id === 'wrong' ? 'bg-rose-500 text-white animate-pulse' : 'bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white'} rounded-2xl flex items-center justify-center transition-all shadow-sm shrink-0`}
                  >
                    {playingTestAudio?.id === 'wrong' ? <XCircle className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-black text-slate-400">
                  <span>حجم الصوت</span>
                  <span>{Math.round(wrongSoundVolume * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" value={wrongSoundVolume}
                  onChange={(e) => setWrongSoundVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">صورة/GIF التفاعل الخاطئ</label>
                <div className="relative group flex gap-2">
                  <div className="relative flex-grow">
                    <input 
                      type="text" value={wrongImageUrl} onChange={(e) => setWrongImageUrl(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-rose-500 transition-all text-xs font-mono font-bold pr-14"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <ImageIcon className="w-5 h-5 text-rose-400" />
                    </div>
                  </div>
                  <label className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm cursor-pointer active:scale-95" title="رفع صورة">
                    <Upload className="w-6 h-6" />
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setWrongImageUrl)} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {mediaSubTab === 'system' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Intro Sound Card */}
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8 flex flex-col">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                  <Music2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-800">صوت بداية انطلاق المسابقة</h4>
                  <p className="text-xs text-slate-400 font-bold">هوية المسابقة الرئيسية</p>
                </div>
              </div>

              <div className="space-y-6 flex-grow">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">رابط ملف الصوت (MP3)</label>
                  <div className="flex gap-3">
                    <div className="relative flex-grow">
                      <input 
                        type="text" value={introSoundUrl} onChange={(e) => setIntroSoundUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all text-xs font-mono font-bold pr-14"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Music2 className="w-5 h-5 text-indigo-400" />
                      </div>
                    </div>
                    <label className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all shadow-sm cursor-pointer active:scale-95 shrink-0" title="رفع ملف صوتي">
                      <Upload className="w-6 h-6" />
                      <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleAudioUpload(e, setIntroSoundUrl)} />
                    </label>
                    <button 
                      onClick={() => {
                        if (playingTestAudio && playingTestAudio.id === 'intro') {
                          playingTestAudio.audio.pause();
                          setPlayingTestAudio(null);
                          return;
                        }
                        const url = introSoundUrl || 'https://cdn.pixabay.com/audio/2024/02/07/audio_447470f5e1.mp3';
                        const audio = new Audio(url);
                        audio.volume = introSoundVolume;
                        audio.onended = () => setPlayingTestAudio(null);
                        audio.play().catch(e => console.warn("Audio test failed", e));
                        setPlayingTestAudio({ id: 'intro', audio });
                      }}
                      className={`w-14 h-14 ${playingTestAudio?.id === 'intro' ? 'bg-rose-500 text-white animate-pulse' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-500 hover:text-white'} rounded-2xl flex items-center justify-center transition-all shadow-sm shrink-0`}
                    >
                      {playingTestAudio?.id === 'intro' ? <XCircle className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-[11px] font-black text-slate-400">
                    <span>حجم الصوت</span>
                    <span>{Math.round(introSoundVolume * 100)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.01" value={introSoundVolume}
                    onChange={(e) => setIntroSoundVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* General Settings */}
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-center">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${enableSounds ? 'bg-indigo-600 text-white scale-110 shadow-2xl shadow-indigo-200' : 'bg-slate-100 text-slate-400'}`}>
                  {enableSounds ? <Volume2 className="w-12 h-12" /> : <VolumeX className="w-12 h-12" />}
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900">تفعيل الأصوات العامة</h4>
                  <p className="text-slate-500 font-bold mt-1">التحكم في تشغيل أو إيقاف كافة نغمات المسابقة</p>
                </div>
                <button 
                  onClick={() => setEnableSounds(!enableSounds)}
                  className={`px-10 py-4 rounded-2xl font-black transition-all ${enableSounds ? 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-500 hover:text-white' : 'bg-emerald-600 text-white shadow-xl shadow-emerald-100'}`}
                >
                  {enableSounds ? 'إيقاف الأصوات' : 'تفعيل الأصوات الآن'}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="text-sm uppercase tracking-[0.25em] font-black text-slate-400">مؤثرات النظام المتنوعة</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'نغمة العد التنازلي', url: beepSoundUrl, setUrl: setBeepSoundUrl, vol: beepVolume, setVol: setBeepVolume, icon: Clock, color: 'amber', id: 'beep' },
                { label: 'نغمة الفوز النهائى', url: victorySoundUrl, setUrl: setVictorySoundUrl, vol: victorySoundVolume, setVol: setVictorySoundVolume, icon: Trophy, color: 'indigo', id: 'victory' },
                { label: 'صوت النقر واللمس', url: clickSoundUrl, setUrl: setClickSoundUrl, vol: clickSoundVolume, setVol: setClickSoundVolume, icon: Volume1, color: 'slate', id: 'click' }
              ].map((sound, i) => (
                <div key={i} className="p-6 bg-white rounded-[32px] border border-slate-100 space-y-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 bg-${sound.color}-50 text-${sound.color}-600 rounded-xl`}>
                        <sound.icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-black text-slate-700">{sound.label}</span>
                    </div>
                    <button 
                      onClick={() => {
                        if (playingTestAudio && playingTestAudio.id === sound.id) {
                          playingTestAudio.audio.pause();
                          setPlayingTestAudio(null);
                          return;
                        }
                        const fallbackUrl = 
                          sound.label.includes('العد') ? 'https://cdn.pixabay.com/audio/2021/08/04/audio_06d8a552c6.mp3' :
                          sound.label.includes('الفوز') ? 'https://cdn.pixabay.com/audio/2021/08/04/audio_10499e4f51.mp3' :
                          'https://cdn.pixabay.com/audio/2021/08/04/audio_c361406d8a.mp3';
                        const url = sound.url || fallbackUrl;
                        const audio = new Audio(url);
                        audio.volume = sound.vol;
                        audio.onended = () => setPlayingTestAudio(null);
                        audio.play().catch(e => console.warn("Audio test failed", e));
                        setPlayingTestAudio({ id: sound.id, audio });
                      }}
                      className={`w-10 h-10 ${playingTestAudio?.id === sound.id ? 'bg-rose-500 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-200'} rounded-xl flex items-center justify-center transition-all`}
                    >
                      {playingTestAudio?.id === sound.id ? <XCircle className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input 
                        type="text" value={sound.url} onChange={(e) => sound.setUrl(e.target.value)}
                        placeholder="رابط mp3..."
                        className="flex-grow px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-[10px] font-mono font-bold focus:border-indigo-300"
                      />
                      <label className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-all shadow-sm cursor-pointer active:scale-95 shrink-0" title="رفع ملف صوتي">
                        <Upload className="w-5 h-5" />
                        <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleAudioUpload(e, sound.setUrl)} />
                      </label>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-bold text-slate-400">
                         <span>حجم الصوت</span>
                         <span>{Math.round(sound.vol * 100)}%</span>
                       </div>
                       <input 
                        type="range" min="0" max="1" step="0.01" value={sound.vol}
                        onChange={(e) => sound.setVol(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Background Crowd Noise Section */}
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-50 pb-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-100">
                    <Users className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-800">صوت المشجعين تلقائياً (Background Crowd Noise)</h4>
                    <p className="text-xs text-slate-400 font-bold">صوت حماسي للمشجعين يعمل في الخلفية أثناء قراءة السؤال</p>
                  </div>
                </div>
                <button 
                  onClick={() => setEnableCrowdNoise(!enableCrowdNoise)}
                  className={`px-8 py-3.5 rounded-2xl font-black text-xs transition-all ${enableCrowdNoise ? 'bg-orange-500 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {enableCrowdNoise ? 'مُفعّل تلقائياً ●' : 'غير مُفعّل'}
                </button>
              </div>

              {enableCrowdNoise && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2"
                >
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">رابط مباشر لصوت المشجعين (MP3)</label>
                    <div className="flex gap-3">
                      <div className="relative flex-grow">
                        <input 
                          type="text" 
                          value={crowdNoiseUrl} 
                          onChange={(e) => setCrowdNoiseUrl(e.target.value)}
                          placeholder="اتركه فارغاً للاستعانة بالصوت الافتراضي الحماسي"
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-orange-500 transition-all text-xs font-mono font-bold pr-12 text-slate-600"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <Music className="w-5 h-5 text-orange-400" />
                        </div>
                      </div>
                      <label className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all shadow-sm cursor-pointer active:scale-95 shrink-0" title="رفع ملف صوتي">
                        <Upload className="w-6 h-6" />
                        <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleAudioUpload(e, setCrowdNoiseUrl)} />
                      </label>
                      <button 
                        onClick={() => {
                          if (playingTestAudio && playingTestAudio.id === 'crowd_preview') {
                            playingTestAudio.audio.pause();
                            setPlayingTestAudio(null);
                            return;
                          }
                          const defaultUrl = 'https://www.soundjay.com/human/sounds/crowd-cheering-2.mp3';
                          const url = crowdNoiseUrl || defaultUrl;
                          const audio = new Audio(url);
                          audio.volume = crowdNoiseVolume;
                          audio.onended = () => setPlayingTestAudio(null);
                          audio.play().catch(e => console.warn("Audio test failed", e));
                          setPlayingTestAudio({ id: 'crowd_preview', audio });
                        }}
                        className={`w-14 h-14 ${playingTestAudio?.id === 'crowd_preview' ? 'bg-rose-500 text-white font-black' : 'bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white'} rounded-2xl flex items-center justify-center transition-all shadow-sm shrink-0`}
                      >
                        {playingTestAudio?.id === 'crowd_preview' ? <XCircle className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 flex flex-col justify-end">
                    <div className="flex justify-between text-[11px] font-black text-slate-400 mb-1">
                      <span>مستوى حجم صوت الخلفية للمشجعين</span>
                      <span>{Math.round(crowdNoiseVolume * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                      <Volume1 className="w-5 h-5 text-slate-400" />
                      <input 
                        type="range" min="0" max="1" step="0.01" value={crowdNoiseVolume}
                        onChange={(e) => setCrowdNoiseVolume(parseFloat(e.target.value))}
                        className="flex-grow h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-orange-500"
                      />
                      <Volume2 className="w-5 h-5 text-orange-500" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      )}

      {mediaSubTab === 'upload' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Direct Upload Feature (Simulated Connection) */}
            <div className="lg:col-span-2 bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl shadow-slate-100 space-y-10">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
                  <CloudUpload className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">منصة الرفع المتكاملة</h3>
                  <p className="text-slate-400 font-bold mt-1">ارفع ملفاتك مباشرة واستخدمها في المسابقة</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                   <div className="p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center gap-4 group hover:border-indigo-400 hover:bg-white transition-all cursor-pointer relative overflow-hidden">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                        <Mic className="w-8 h-8" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-black text-slate-900">رفع أصوات (MP3/WAV)</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">الحد الأقصى 500 ك.ب</p>
                      </div>
                      <input type="file" accept="audio/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                        handleAudioUpload(e, (url) => {
                          setLastUploadedUrl(url);
                        });
                      }} />
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center gap-4 group hover:border-emerald-400 hover:bg-white transition-all cursor-pointer relative overflow-hidden">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-black text-slate-900">رفع صور (PNG/JPG/GIF)</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">الحد الأقصى 500 ك.ب</p>
                      </div>
                      <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                        handleImageUpload(e, (url) => {
                          setLastUploadedUrl(url);
                        });
                      }} />
                   </div>
                </div>
              </div>

              {lastUploadedUrl && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-indigo-50 border border-indigo-100 p-8 rounded-[32px] space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                        تم
                      </div>
                      <span className="text-sm font-black text-indigo-900">تم توليد رابط الملف بنجاح!</span>
                    </div>
                    <button 
                      onClick={() => {
                        if (typeof navigator !== 'undefined' && navigator.clipboard) {
                          navigator.clipboard.writeText(lastUploadedUrl);
                          setMessage({ text: 'تم نسخ الرابط للحافظة', type: 'success' });
                        }
                      }}
                      className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                    >
                      نسخ الرابط
                    </button>
                  </div>
                  <div className="p-5 bg-white border border-indigo-100 rounded-2xl break-all">
                    <p className="text-[10px] font-mono text-slate-500 leading-relaxed font-bold">{lastUploadedUrl.substring(0, 200)}...</p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-bold bg-white/50 p-3 rounded-xl italic">
                    <AlertCircle className="w-3 h-3" />
                    <span>ملاحظة: الروابط المباشرة (Base64) قد تجعل قاعدة البيانات كبيرة. يفضل استخدام المواقع الخارجية للملفات المتكررة.</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Hosting Accounts Info */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                  <UserCircle className="w-24 h-24" />
                </div>
                <div className="relative z-10 space-y-8">
                  <div>
                    <h4 className="text-xl font-black mb-2 flex items-center gap-3 text-amber-400">
                      <Star className="w-6 h-6 fill-current" /> ربط حساباتي
                    </h4>
                    <p className="text-slate-400 text-xs font-bold leading-relaxed">اربط حسابك في مواقع الرفع المفضلة لرفع ملفاتك مباشرة والحصول على روابط دائمة.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 group/item hover:bg-white/10 transition-all">
                       <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                         <img src="https://imgbb.com/favicon.ico" className="w-6 h-6" />
                       </div>
                       <div className="flex-grow">
                         <span className="block text-sm font-bold">ImgBB Account</span>
                         <span className="text-[10px] text-emerald-400 font-bold">متصل ومفعل</span>
                       </div>
                       <ExternalLink className="w-5 h-5 text-slate-500 group-hover/item:text-white transition-colors cursor-pointer" />
                    </div>
                    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 group/item hover:bg-white/10 transition-all">
                       <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                         <img src="https://postimages.org/favicon.ico" className="w-6 h-6" />
                       </div>
                       <div className="flex-grow">
                         <span className="block text-sm font-bold">PostImages Account</span>
                         <span className="text-[10px] text-amber-400 font-bold">بانتظار الربط</span>
                       </div>
                       <Plus className="w-5 h-5 text-slate-500 group-hover/item:text-white transition-colors cursor-pointer" />
                    </div>
                  </div>

                  <button className="w-full py-4 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-2xl font-black text-xs transition-all border border-white/10">
                    تعديل الإعدادات المتقدمة
                  </button>
                </div>
              </div>
              
              <div className="bg-indigo-600 p-8 rounded-[40px] text-white space-y-4 shadow-xl shadow-indigo-100">
                 <h5 className="text-xs font-black uppercase tracking-widest text-indigo-200">مواقع الرفع المقترحة</h5>
                 <div className="flex flex-wrap gap-2">
                    {['PostImages', 'ImgBB', 'Top4top', 'Catbox'].map(site => (
                      <a key={site} href={`https://${site.toLowerCase()}.com`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold transition-all">
                        {site}
                      </a>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCategories = () => {
    if (loading) {
      return (
        <div className="space-y-12 animate-in fade-in duration-500">
           <div className="flex justify-between items-center mb-8">
              <Skeleton width={200} height={32} />
              <div className="flex gap-4">
                 <Skeleton width={120} height={48} className="rounded-2xl" />
                 <Skeleton width={120} height={48} className="rounded-2xl" />
              </div>
           </div>
           {[...Array(3)].map((_, i) => (
             <div key={i} className="space-y-6">
                <Skeleton width={150} height={24} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                   {[...Array(4)].map((_, j) => (
                     <div key={j} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                        <div className="flex justify-between">
                           <Skeleton variant="circular" width={48} height={48} />
                           <Skeleton width={80} height={32} className="rounded-xl" />
                        </div>
                        <Skeleton width="100%" height={24} />
                        <div className="space-y-2">
                           <Skeleton width="100%" height={8} className="rounded-full" />
                           <div className="flex justify-between">
                              <Skeleton width={40} height={16} />
                              <Skeleton width={40} height={16} />
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           ))}
        </div>
      );
    }

    if (selectedCatId) {
      return (
        <div className="bg-white/80 backdrop-blur-xl p-0 rounded-[40px] border border-slate-200 shadow-2xl shadow-slate-200/50 min-h-[600px] overflow-hidden">
          {/* Header Bar */}
          <div className="px-8 py-4 border-b border-slate-50 flex items-center justify-between">
            <button 
              onClick={() => { playSound?.('click'); setSelectedCatId(null); }}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-black text-sm transition-all group"
            >
              <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              العودة للأقسام
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">وضع التعديل المباشر</span>
            </div>
          </div>

          {/* Category Header Profile */}
          <div className="bg-gradient-to-br from-slate-50 to-white border-b border-slate-100 p-8 md:p-10">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Icon Section */}
              <div className="relative group">
                <motion.button 
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEditIconPicker(!showEditIconPicker)}
                  className="w-32 h-32 bg-white border-2 border-dashed border-slate-200 rounded-[40px] flex items-center justify-center text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.05)] group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {editCatIcon?.startsWith('http') ? (
                    <img src={editCatIcon} className="w-16 h-16 object-contain transition-transform group-hover:scale-110 z-10" />
                  ) : (
                    <IconRenderer name={editCatIcon || 'LayoutGrid'} className="w-16 h-16 transition-transform group-hover:scale-110 z-10" />
                  )}
                  <div className="absolute bottom-3 right-3 bg-indigo-600 p-2 rounded-2xl shadow-xl border border-white z-20 flex gap-1">
                    <Plus className="w-4 h-4 text-white" />
                    <label className="cursor-pointer">
                      <Upload className="w-4 h-4 text-white hidden group-hover:block" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageUpload(e, setEditCatIcon)}
                      />
                    </label>
                  </div>
                </motion.button>
                <IconPicker 
                  selected={editCatIcon || 'LayoutGrid'} 
                  onSelect={setEditCatIcon} 
                  isOpen={showEditIconPicker} 
                  onClose={() => setShowEditIconPicker(false)} 
                  color="#4f46e5"
                  playSound={playSound}
                />
              </div>

              {/* Main Info Section */}
              <div className="flex-grow text-center lg:text-right space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                    <label className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">اسم القسم الرئيسي</label>
                    <div className="h-px bg-indigo-100 flex-grow max-w-[100px]" />
                  </div>
                  <input 
                    type="text"
                    value={editCatName}
                    onChange={(e) => setEditCatName(e.target.value)}
                    className="text-4xl lg:text-5xl font-black text-slate-800 bg-transparent border-none focus:outline-none focus:ring-0 w-full p-0 placeholder:text-slate-200"
                    placeholder="أدخل عنوان القسم هنا..."
                  />
                  <textarea 
                    value={editCatDescription}
                    onChange={(e) => setEditCatDescription(e.target.value)}
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-slate-500 font-bold text-lg p-0 placeholder:text-slate-200 resize-none min-h-[60px]"
                    placeholder="أدخل وصف القسم هنا... (سيظهر في تمديد البطاقة)"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm transition-all focus-within:border-indigo-300">
                    <ImageIcon className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">صورة الغلاف:</span>
                    <input 
                      type="text"
                      placeholder="رابط الصورة..."
                      value={editCatImage}
                      onChange={(e) => setEditCatImage(e.target.value)}
                      className="text-xs font-bold text-slate-600 bg-transparent outline-none min-w-[150px]"
                    />
                    <label className="cursor-pointer p-1 text-indigo-500 hover:bg-indigo-50 rounded-lg">
                      <Upload className="w-3 h-3" />
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setEditCatImage)} />
                    </label>
                  </div>

                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm grow lg:grow-0">
                    <ModernDropdown 
                      value={editCatGroup}
                      onChange={setEditCatGroup}
                      options={[
                        { value: 'عام', label: 'عام' },
                        ...groups.filter(g => g.name !== 'عام').map(g => ({ value: g.name, label: g.name })),
                        { value: '__NEW__', label: '+ قائمة جديدة...' }
                      ]}
                    />
                  </div>

                  {editCatGroup === '__NEW__' && (
                    <input 
                      type="text"
                      placeholder="اسم القائمة الجديدة..."
                      value={newEditGroupName}
                      onChange={(e) => setNewEditGroupName(e.target.value)}
                      className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
                      autoFocus
                    />
                  )}


                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap lg:flex-col gap-3 shrink-0">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUpdateCategoryDetails}
                  disabled={loading}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  حفظ البيانات
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    const success = await handleUpdateCategoryDetails();
                    if (success) setSelectedCatId(null);
                  }}
                  disabled={loading}
                  className="px-8 py-3 bg-slate-800 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-3 shadow-lg transition-all hover:bg-black"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  حفظ والعودة للأقسام
                </motion.button>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setCatToDelete(selectedCatId)}
                    className="flex-grow py-4 px-6 bg-rose-50 text-rose-600 rounded-2xl text-xs font-black hover:bg-rose-100 border border-rose-100 flex items-center justify-center gap-2 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    حذف القسم
                  </button>
                  <button 
                    onClick={async () => {
                      try {
                        setLoading(true);
                        await handleSeed(true, selectedCatId);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all"
                    title="إعادة تهيئة أسئلة هذا القسم"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            {/* Settings & Config Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Settings Column */}
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-3 px-2">
                    <div className="w-6 h-px bg-slate-200" />
                    إعدادات العرض والأنماط
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'letters', label: 'نمط الحروف', icon: Languages, active: editCatLetterMode, set: setEditCatLetterMode, color: 'indigo' },
                      { id: 'images', label: 'نمط الصور', icon: ImageIcon, active: editCatImagesEnabled, set: setEditCatImagesEnabled, color: 'emerald' },
                      { id: 'qr', label: 'نمط الباركود', icon: QrCode, active: editCatQrEnabled, set: setEditCatQrEnabled, color: 'amber' },
                      { id: 'video', label: 'نمط الفيديو', icon: Video, active: editCatVideoEnabled, set: setEditCatVideoEnabled, color: 'rose' },
                      { id: 'maps', label: 'نمط الخرائط', icon: Map, active: editCatMapMode, set: setEditCatMapMode, color: 'sky' },
                      { id: 'image-mode', label: 'نمط البطاقة الصورة', icon: ImageIcon, active: editCatImageMode, set: setEditCatImageMode, color: 'orange' }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => { playSound?.('click'); mode.set(!mode.active); }}
                        className={`
                          group relative p-4 rounded-[28px] border-2 transition-all text-right
                          ${mode.active 
                            ? `bg-white border-${mode.color}-500 shadow-xl shadow-${mode.color}-500/10` 
                            : 'bg-white border-slate-100 hover:border-slate-200'}
                        `}
                      >
                        <div className={`
                          w-10 h-10 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110
                          ${mode.active ? `bg-${mode.color}-500 text-white` : 'bg-slate-50 text-slate-400'}
                        `}>
                          <mode.icon className="w-5 h-5" />
                        </div>
                        <div className={`text-[11px] font-black uppercase tracking-tight ${mode.active ? 'text-slate-900' : 'text-slate-400'}`}>
                          {mode.label}
                        </div>
                        <div className="mt-1 flex items-center gap-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${mode.active ? `bg-${mode.color}-500 animate-pulse` : 'bg-slate-200'}`} />
                          <span className={`text-[9px] font-bold ${mode.active ? `text-${mode.color}-600` : 'text-slate-300'}`}>
                            {mode.active ? 'مفعل الآن' : 'غير مفعل'}
                          </span>
                        </div>
                        {mode.active && (
                          <div className={`absolute top-3 left-3 w-5 h-5 bg-${mode.color}-50 text-${mode.color}-600 rounded-lg flex items-center justify-center`}>
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    ))}

                    {/* Category Wide Time Setting */}
                    <div className="col-span-full mt-4">
                      <div className="flex items-center justify-between p-4 bg-white rounded-[32px] border-2 border-amber-100 shadow-xl shadow-amber-500/5 group hover:border-amber-400 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-200 transition-transform group-hover:rotate-12">
                            <Clock className="w-7 h-7" />
                          </div>
                          <div className="text-right">
                            <span className="block text-sm font-black text-slate-800">مدة الوقت لهذا القسم (ثانية)</span>
                            <span className="text-[11px] text-slate-400 font-bold block">تحديد وقت مخصص لكل سؤال في هذا القسم فقط</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <input 
                            type="number"
                            value={editCatTimerDuration}
                            onChange={(e) => setEditCatTimerDuration(parseInt(e.target.value) || 60)}
                            className="w-24 h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xl font-black text-center text-slate-900 outline-none focus:border-amber-500 focus:bg-white transition-all shadow-inner"
                          />
                          <div className="flex flex-col gap-1">
                             <button onClick={() => setEditCatTimerDuration(prev => prev + 5)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"><Plus className="w-3 h-3"/></button>
                             <button onClick={() => setEditCatTimerDuration(prev => Math.max(5, prev - 5))} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"><Trash2 className="w-3 h-3 hover:text-rose-500"/></button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {editCatLetterMode && (
                      <div className="col-span-full mt-4 p-6 bg-indigo-50 rounded-[32px] border-2 border-indigo-100 space-y-4 animate-in slide-in-from-top-4">
                        <label className="text-[10px] font-black text-indigo-600 block uppercase tracking-widest text-center">تحديد الحرف المطلوب لهذا القسم</label>
                        <div className="flex flex-wrap justify-center gap-2">
                          {ARABIC_LETTERS.map(l => (
                            <button 
                              key={l}
                              onClick={() => setEditCatLetter(l)}
                              className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${editCatLetter === l ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-indigo-400 hover:bg-indigo-50 border border-white'}`}
                            >
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Intelligence & Source Bar */}
              <div className="lg:col-span-5 space-y-6">
                 <div className="p-8 bg-slate-900 rounded-[40px] text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-all" />
                    
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                          <Brain className="w-4 h-4 text-amber-400" />
                          ذكاء المحتوى (Content AI)
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mr-1">المصادر النصية لعمليات التوليد</label>
                           <textarea 
                              placeholder="انسخ نصوصك هنا... سيقوم النظام بتحليلها وتوليد أسئلة منها بلمسة واحدة." 
                              value={editSourceText}
                              onChange={(e) => setEditSourceText(e.target.value)}
                              className="w-full bg-slate-800/50 border border-slate-700 rounded-3xl p-5 text-sm font-medium outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 min-h-[150px] resize-none scrollbar-hide text-indigo-50"
                           />
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mr-1">رابط المصدر للدراسة</label>
                           <div className="relative">
                             <Globe className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                             <input 
                               type="url" 
                               placeholder="https://..." 
                               value={editSourceUrl}
                               onChange={(e) => setEditSourceUrl(e.target.value)}
                               className="w-full pr-11 pl-4 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-indigo-500/50 outline-none"
                             />
                           </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleManualSync}
                          disabled={isExtracting || !editSourceUrl}
                          className="flex flex-col items-center justify-center gap-2 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-[24px] border border-slate-700 transition-all group disabled:opacity-50"
                        >
                          {isExtracting ? <Loader2 className="w-5 h-5 animate-spin text-indigo-400" /> : <RefreshCw className="w-5 h-5 text-indigo-400 transition-transform group-hover:rotate-180 duration-500" />}
                          <span className="text-[10px] font-black uppercase">مزامنة الرابط</span>
                        </motion.button>

                        <motion.button 
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleAIGenerateMore}
                          disabled={isGenerating || (!editCatName && !editSourceText)}
                          className="flex flex-col items-center justify-center gap-2 py-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-[24px] shadow-xl shadow-amber-900/20 transition-all relative overflow-hidden disabled:opacity-50"
                        >
                          <Sparkles className="w-5 h-5" />
                          <span className="text-[10px] font-black uppercase">توليد المزيد</span>
                          {isGenerating && (
                            <motion.div 
                              initial={{ x: '-100%' }}
                              animate={{ x: '100%' }}
                              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                              className="absolute inset-0 bg-white/20 translate-y-10"
                            />
                          )}
                        </motion.button>
                      </div>
                    </div>
                 </div>

                 {/* Quick Preview Card */}
                 <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-[40px] flex items-center gap-6">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-indigo-200/50 flex flex-col items-center justify-center shrink-0">
                       <span className="text-2xl font-black text-indigo-600 leading-none">{questions.length}</span>
                       <span className="text-[8px] font-black text-indigo-400 uppercase tracking-tighter">سؤال</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 mb-1 leading-tight">جاهز للاستخدام</h4>
                      <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                        تم تكوين كافة الإعدادات والأنماط بشكل صحيح. يمكنك البدء في إضافة محتوى جديد أو تعديل الحالي.
                      </p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Questions Management UI */}
            <div className="px-8 md:p-10 border-t border-slate-100 bg-slate-50/20">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                 <div className="space-y-1">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                      إدارة الأسئلة والمحتوى
                       <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                         <HelpCircle className="w-5 h-5" />
                       </div>
                    </h2>
                    <p className="text-xs font-bold text-slate-400">يمكنك هنا إضافة الأسئلة يدوياً أو مجمعاً، وتصفح المحتوى الحالي.</p>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setShowQuestionAddSection(!showQuestionAddSection)}
                      className={`px-6 py-3 rounded-2xl border-2 transition-all flex items-center gap-2 text-xs font-black shadow-sm ${showQuestionAddSection ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'}`}
                    >
                      {showQuestionAddSection ? <Trash2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      {showQuestionAddSection ? 'إلغاء الإضافة' : 'إضافة سؤال جديد'}
                    </button>
                    
                    {showQuestionAddSection && (
                      <div className="flex items-center bg-slate-50 p-1 rounded-2xl border border-slate-100">
                         <button 
                           onClick={() => setQuestionAddTab('single')}
                           className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all ${questionAddTab === 'single' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400'}`}
                         >
                           مفرّد
                         </button>
                         <button 
                           onClick={() => setQuestionAddTab('bulk')}
                           className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all ${questionAddTab === 'bulk' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400'}`}
                         >
                           مجمع ذكي
                         </button>
                      </div>
                    )}
                 </div>
              </div>
              
              <AnimatePresence>
                {showQuestionAddSection && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-8 overflow-hidden"
                  >
                {questionAddTab === 'single' ? (
                  <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="space-y-10">
                      {/* Form Body */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2 space-y-3">
                          <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                              <HelpCircle className="w-3 h-3" />
                              نص السؤال
                            </label>
                            <div className="flex items-center gap-4">
                              {newQ.text.length > 0 && <span className="text-[10px] font-bold text-slate-400">{newQ.text.length} حرف</span>}
                              <button 
                                onClick={() => {
                                    setPreviewQ({
                                      ...newQ,
                                      id: 'temp-preview',
                                      categoryId: selectedCatId || '',
                                      isAnswered: false
                                    } as any);
                                }}
                                className="flex items-center gap-2 text-emerald-500 hover:text-emerald-700 transition-all font-black text-[9px] uppercase tracking-widest"
                                title="معاينة مباشرة"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                معاينة
                              </button>
                            </div>
                          </div>
                          <div className="relative group">
                            <textarea 
                              placeholder="أدخل نص السؤال هنا..." 
                              value={newQ.text}
                              onChange={(e) => setNewQ({ ...newQ, text: e.target.value })}
                              className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-sm font-bold min-h-[140px] resize-none leading-relaxed shadow-inner"
                            />
                            <button 
                              onClick={async () => {
                                if (!newQ.text) return;
                                try {
                                  setLoading(true);
                                  const improved = await aiService.rephraseText(newQ.text, 'question');
                                  setNewQ({ ...newQ, text: improved });
                                } finally {
                                  setLoading(false);
                                }
                              }}
                              disabled={loading}
                              className="absolute left-4 bottom-4 p-3 bg-white text-indigo-500 rounded-2xl shadow-xl border border-slate-100 hover:bg-slate-50 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                              title="تحسين السؤال بالذكاء"
                            >
                              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3" />
                            الإجابة النموذجية
                          </label>
                          <div className="relative group/answer">
                            <input 
                              type="text" 
                              placeholder="أدخل الإجابة..." 
                              value={newQ.answer}
                              onChange={(e) => setNewQ({ ...newQ, answer: e.target.value })}
                              className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-sm font-bold shadow-inner"
                            />
                            <button 
                              onClick={async () => {
                                if (!newQ.answer) return;
                                try {
                                  setLoading(true);
                                  const improved = await aiService.rephraseText(newQ.answer, 'answer');
                                  setNewQ({ ...newQ, answer: improved });
                                } finally {
                                  setLoading(false);
                                }
                              }}
                              disabled={loading}
                              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 text-indigo-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm border border-slate-100 opacity-0 group-hover/answer:opacity-100"
                              title="تحسين الإجابة بالذكاء"
                            >
                              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                            <Zap className="w-3 h-3" />
                            النقاط
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {[20, 40, 60, 100].map(val => (
                              <button 
                                key={val}
                                onClick={() => setNewQ({ ...newQ, points: val })}
                                className={`py-5 rounded-2xl text-sm font-black transition-all border-2 ${newQ.points === val ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200'}`}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-8 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-200 space-y-8">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-200 pb-4">إعدادات إضافية مرئية</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {(editCatImagesEnabled || newCat.imagesEnabled) && (
                            <div className="space-y-2 animate-in zoom-in-50 duration-300">
                               <label className="text-[9px] font-black text-slate-400 uppercase">رابط صورة (اختياري)</label>
                               <div className="flex gap-2">
                                 <input 
                                   type="text" 
                                   placeholder="https://..." 
                                   value={newQ.imageUrl}
                                   onChange={(e) => setNewQ({ ...newQ, imageUrl: e.target.value })}
                                   className="flex-grow px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                                 />
                                 <label className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm cursor-pointer shrink-0">
                                   <ImageIcon className="w-4 h-4" />
                                   <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (url) => setNewQ({ ...newQ, imageUrl: url }))} />
                                 </label>
                               </div>
                               {newQ.imageUrl && (
                                 <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 group">
                                   <img src={getProxiedImageUrl(newQ.imageUrl, newQ.text, newQ.answer)} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" onError={(e) => handleImageError(e, newQ.text, newQ.answer)} />
                                   <button 
                                     onClick={() => setNewQ({ ...newQ, imageUrl: '' })}
                                     className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                   >
                                     <X className="w-4 h-4" />
                                   </button>
                                 </div>
                               )}
                            </div>
                          )}
                          {(editCatVideoEnabled || newCat.videoEnabled) && (
                            <div className="space-y-2 animate-in zoom-in-50 duration-300">
                               <label className="text-[9px] font-black text-slate-400 uppercase">رابط فيديو (اختياري)</label>
                               <div className="flex gap-2">
                                 <input 
                                   type="text" 
                                   placeholder="https://..." 
                                   value={newQ.videoUrl}
                                   onChange={(e) => setNewQ({ ...newQ, videoUrl: e.target.value })}
                                   className="flex-grow px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                                 />
                               </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-8">
                         <button 
                           onClick={() => setPreviewQ(newQ as any)}
                           className="py-6 bg-slate-50 border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-100 text-slate-700 rounded-[24px] font-black text-lg transition-all flex items-center justify-center gap-3"
                         >
                           <Eye className="w-6 h-6" /> معاينة
                         </button>
                         <motion.button 
                           whileHover={{ scale: 1.02 }}
                           whileTap={{ scale: 0.98 }}
                           onClick={handleAddQuestion}
                           className="py-6 bg-indigo-500 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-indigo-500/20 hover:bg-indigo-400 transition-all flex items-center justify-center gap-4 group/btn"
                         >
                           إضافة السؤال للقسم
                           <PlusCircle className="w-6 h-6 group-hover/btn:rotate-90 transition-transform" />
                         </motion.button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="bg-indigo-50/50 border-2 border-indigo-100 rounded-2xl p-6">
                      <textarea 
                        className="w-full h-48 p-5 bg-white border border-indigo-100 rounded-2xl outline-none focus:border-indigo-400 transition-all text-sm font-bold placeholder:text-slate-300"
                        placeholder="الصق الأسئلة هنا (مثال: السؤال الإجابة)..."
                        value={bulkText}
                        onChange={(e) => setBulkText(e.target.value)}
                      />
                      <div className="flex justify-end mt-4">
                        <button 
                          onClick={handleBulkParse}
                          disabled={isParsingBulk || !bulkText.trim()}
                          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black flex items-center gap-2 shadow-lg disabled:opacity-50"
                        >
                          {isParsingBulk ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                          تحليل ذكي
                        </button>
                      </div>
                    </div>

                    {parsedBulkQuestions.length > 0 && (
                      <div className="space-y-4">
                         <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">معاينة ({parsedBulkQuestions.length})</h4>
                            <button onClick={() => setParsedBulkQuestions([])} className="text-[10px] text-rose-500 font-bold">إلغاء</button>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                            {parsedBulkQuestions.map((q, idx) => (
                              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 relative group">
                                 <div className="text-[10px] font-black text-indigo-600 mb-1">{q.points} نقطة</div>
                                 <div className="text-xs font-bold text-slate-700 leading-relaxed mb-1">{q.text}</div>
                                 <div className="text-[10px] font-bold text-emerald-600">{q.answer}</div>
                                 <button 
                                   onClick={() => setParsedBulkQuestions(prev => prev.filter((_, i) => i !== idx))}
                                   className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity text-rose-400 hover:text-rose-600"
                                 >
                                   <X className="w-3.5 h-3.5" />
                                 </button>
                              </div>
                            ))}
                         </div>
                         <button 
                           onClick={handleBulkSave} 
                           className="w-full py-4 bg-emerald-500 text-white rounded-xl font-black shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                         >
                            <Save className="w-5 h-5" />
                            حفظ الأسئلة المستخرجة
                         </button>
                      </div>
                    )}
                  </div>
                )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* List Header */}
            <div className="space-y-4 mb-8 mt-4">
              <div className="flex items-center justify-between px-6">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                  <Search className="w-4 h-4" />
                  قائمة الأسئلة والبحث
                </h3>
                <div className="flex items-center gap-3">
                  {selectedQIds.length > 0 && (
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => setBulkDeleteIds(selectedQIds)}
                      className="px-4 py-1.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-full text-[10px] font-black hover:bg-rose-100 transition-all flex items-center gap-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      حذف المختار ({selectedQIds.length})
                    </motion.button>
                  )}
                  {questions.length > 0 && (
                    <button 
                      onClick={handleSelectAll}
                      className="px-4 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-[10px] font-black hover:bg-indigo-100 transition-all"
                    >
                      {selectedQIds.length === questions.length ? 'إلغاء الكل' : 'تحديد الكل'}
                    </button>
                  )}
                  <button 
                    onClick={() => setShowFiltersSection(!showFiltersSection)}
                    className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-500 hover:bg-slate-50 transition-all flex items-center gap-2"
                  >
                    {showFiltersSection ? 'إخفاء الفلاتر' : 'تخصيص البحث والفلاتر'}
                    <Settings className={`w-3 h-3 ${showFiltersSection ? 'rotate-90' : ''} transition-transform`} />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {showFiltersSection && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-6"
                  >
                    <div className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Search Input */}
                        <div className="lg:col-span-2 relative group">
                          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                          <input 
                            type="text" 
                            placeholder="ابحث بالنص أو المصدر..."
                            value={qSearch}
                            onChange={(e) => setQSearch(e.target.value)}
                            className="w-full pr-11 pl-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 focus:bg-white transition-all text-right shadow-inner"
                            dir="rtl"
                          />
                        </div>

                        {/* Answer Filter */}
                        <div className="relative group">
                          <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                          <input 
                            type="text" 
                            placeholder="تصفية بالإجابة..."
                            value={answerSearch}
                            onChange={(e) => setAnswerSearch(e.target.value)}
                            className="w-full pr-11 pl-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 focus:bg-white transition-all text-right shadow-inner"
                            dir="rtl"
                          />
                        </div>

                        {/* Source Filter */}
                        <div className="relative">
                          <BookOpen className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <select 
                            value={sourceFilter}
                            onChange={(e) => setSourceFilter(e.target.value)}
                            className="w-full pr-11 pl-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-600 appearance-none cursor-pointer text-center focus:ring-4 focus:ring-slate-100"
                          >
                            <option value="all">كل المصادر</option>
                            {Array.from(new Set(questions.map(q => q.source?.trim() || 'بدون مصدر')))
                              .filter(Boolean)
                              .map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                          </select>
                        </div>

                        {/* Media Filter */}
                        <div className="relative">
                          <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <select 
                            value={hasImageFilter}
                            onChange={(e) => setHasImageFilter(e.target.value as any)}
                            className="w-full pr-11 pl-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-600 appearance-none cursor-pointer text-center focus:ring-4 focus:ring-slate-100"
                          >
                            <option value="all">كل الوسائط</option>
                            <option value="with">بها صور</option>
                            <option value="without">بدون صور</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-50">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">تصفية حسب النقاط:</span>
                        <div className="flex items-center gap-2">
                          {['all', 20, 40, 60, 100].map(pts => (
                            <button 
                              key={pts}
                              onClick={() => setPointFilter(pts as any)}
                              className={`px-5 py-2 text-[10px] font-black rounded-xl transition-all border-2 ${pointFilter === pts ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
                            >
                              {pts === 'all' ? 'الكل' : `${pts} نقطة`}
                            </button>
                          ))}
                        </div>

                        <div className="flex-grow" />

                        <div className="flex items-center gap-3">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">عرض:</span>
                           <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                             {questions.filter(q => {
                               const matchesPoints = pointFilter === 'all' || q.points === pointFilter;
                               const matchesSearch = q.text.toLowerCase().includes(qSearch.toLowerCase()) || 
                                                    (q.source || '').toLowerCase().includes(qSearch.toLowerCase());
                               const matchesAnswer = q.answer.toLowerCase().includes(answerSearch.toLowerCase());
                               const matchesSource = sourceFilter === 'all' || (q.source?.trim() || 'بدون مصدر') === sourceFilter;
                               return matchesPoints && matchesSearch && matchesSource && matchesAnswer;
                             }).length} من أصل {questions.length}
                           </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Questions List */}
            <div className="space-y-6 max-h-[85vh] overflow-y-auto pl-3 custom-scrollbar pr-1 pb-32">
                {isLoadingQuestions ? (
                  <ListSkeleton count={5} />
                ) : questions.filter(q => {
                    const matchesPoints = pointFilter === 'all' || q.points === pointFilter;
                    const matchesSearch = q.text.toLowerCase().includes(qSearch.toLowerCase()) || 
                                         (q.source || '').toLowerCase().includes(qSearch.toLowerCase());
                    const matchesAnswer = q.answer.toLowerCase().includes(answerSearch.toLowerCase());
                    const matchesSource = sourceFilter === 'all' || (q.source?.trim() || 'بدون مصدر') === sourceFilter;
                    const matchesLetter = letterFilter === 'الكل' || q.letter === letterFilter;
                    const matchesImage = hasImageFilter === 'all' || 
                                        (hasImageFilter === 'with' && q.imageUrl) || 
                                        (hasImageFilter === 'without' && !q.imageUrl);
                    
                    return matchesPoints && matchesSearch && matchesSource && matchesLetter && matchesImage && matchesAnswer;
                  })
                  .map((q) => (
                  <div 
                    key={q.id} 
                    className={`
                      relative flex flex-col p-8 bg-white border-2 rounded-[40px] transition-all group overflow-hidden
                      ${selectedQIds.includes(q.id) 
                        ? 'border-indigo-500 shadow-2xl shadow-indigo-500/10' 
                        : 'border-slate-50 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50'}
                      ${answeredQuestionIds.includes(q.id) ? 'opacity-80' : ''}
                    `}
                  >
                    {answeredQuestionIds.includes(q.id) && (
                      <div className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-2xl text-[10px] font-black shadow-xl shadow-emerald-200 animate-in fade-in zoom-in">
                        <CheckCircle2 className="w-4 h-4" />
                        تم لعب هذا السؤال
                      </div>
                    )}

                    <div className="flex items-start gap-8">
                      <div className="flex flex-col items-center gap-4 shrink-0 pt-2">
                        <button 
                          onClick={() => toggleQSelection(q.id)}
                          className={`
                            w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all
                            ${selectedQIds.includes(q.id) 
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' 
                              : 'bg-slate-50 border-slate-100 text-transparent hover:border-slate-300'}
                          `}
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        
                        <div className={`w-0.5 h-16 rounded-full ${selectedQIds.includes(q.id) ? 'bg-indigo-100' : 'bg-slate-50'}`} />
                        
                        <div className={`
                          w-14 h-14 rounded-3xl flex flex-col items-center justify-center border-2 shadow-sm
                          ${q.points >= 100 ? 'bg-slate-900 border-slate-900 text-amber-400' : q.points >= 60 ? 'bg-rose-50 border-rose-100 text-rose-600' : q.points >= 40 ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}
                        `}>
                          <span className="text-xl font-black leading-none">{q.points}</span>
                          <span className="text-[8px] font-black uppercase tracking-tighter mt-1">pts</span>
                        </div>
                      </div>

                      <div className="flex-grow min-w-0">
                        {editingQId === q.id ? (
                          <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 bg-slate-50/50 p-6 rounded-[32px] border border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                                  <Settings className="w-4 h-4" />
                                </div>
                                <h4 className="text-sm font-black text-slate-800">تعديل سريع للسؤال</h4>
                              </div>
                              <button 
                                onClick={() => setPreviewQ({
                                  ...q,
                                  text: editQText,
                                  answer: editQAnswer,
                                  points: editQPoints,
                                  letter: editQLetter,
                                  letterMode: editQLetterMode,
                                  imagesEnabled: editQImagesEnabled,
                                  videoEnabled: editQVideoEnabled,
                                  qrEnabled: editQQrEnabled,
                                  mapMode: editQMapMode,
                                  imageUrl: editQImageUrl,
                                  videoUrl: editQVideoUrl
                                } as any)}
                                className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                            </div>

                            <textarea 
                              value={editQText}
                              onChange={(e) => setEditQText(e.target.value)}
                              className="w-full px-6 py-5 text-sm font-bold border-2 border-slate-100 rounded-[28px] focus:border-indigo-500 outline-none bg-white transition-all shadow-inner min-h-[120px] resize-none"
                              placeholder="أدخل السؤال هنا..."
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <input 
                                type="text" 
                                value={editQAnswer}
                                onChange={(e) => setEditQAnswer(e.target.value)}
                                className="w-full px-6 py-4 text-xs font-black border-2 border-slate-100 rounded-2xl focus:border-emerald-500 shadow-inner outline-none bg-white"
                                placeholder="الإجابة..."
                              />
                              <div className="grid grid-cols-2 gap-4">
                                <select 
                                  value={editQPoints}
                                  onChange={(e) => setEditQPoints(parseInt(e.target.value))}
                                  className="w-full px-4 py-4 text-xs font-black bg-white border border-slate-200 rounded-2xl outline-none"
                                >
                                  {[20, 40, 60, 100].map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                                <select 
                                  value={editQLetter}
                                  onChange={(e) => setEditQLetter(e.target.value)}
                                  className="w-full px-4 py-4 text-xs font-black bg-white border border-slate-200 rounded-2xl outline-none"
                                >
                                  {ARABIC_LETTERS.slice(1).map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                               <div className="space-y-1">
                                 <label className="text-[10px] font-black text-slate-400 px-2 uppercase">رابط الصورة</label>
                                 <div className="flex gap-2">
                                   <input 
                                     type="text" 
                                     value={editQImageUrl}
                                     onChange={(e) => setEditQImageUrl(e.target.value)}
                                     className="flex-grow px-4 py-3 text-[10px] font-mono border border-slate-100 rounded-xl outline-none bg-white focus:border-indigo-300"
                                     placeholder="URL الصورة..."
                                   />
                                   <button 
                                     onClick={() => setEditQImagesEnabled(!editQImagesEnabled)}
                                     className={`px-3 rounded-xl transition-all ${editQImagesEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}
                                   >
                                     <ImageIcon className="w-4 h-4" />
                                   </button>
                                 </div>
                               </div>
                               <div className="space-y-1">
                                 <label className="text-[10px] font-black text-slate-400 px-2 uppercase">رابط الفيديو</label>
                                 <div className="flex gap-2">
                                   <input 
                                     type="text" 
                                     value={editQVideoUrl}
                                     onChange={(e) => setEditQVideoUrl(e.target.value)}
                                     className="flex-grow px-4 py-3 text-[10px] font-mono border border-slate-100 rounded-xl outline-none bg-white focus:border-rose-300"
                                     placeholder="URL الفيديو..."
                                   />
                                   <button 
                                     onClick={() => setEditQVideoEnabled(!editQVideoEnabled)}
                                     className={`px-3 rounded-xl transition-all ${editQVideoEnabled ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-400'}`}
                                   >
                                     <Video className="w-4 h-4" />
                                   </button>
                                 </div>
                               </div>
                              <div className="space-y-1">
                                 <label className="text-[10px] font-black text-slate-400 px-2 uppercase">رابط المصدر</label>
                                 <input 
                                   type="text" 
                                   value={editQSourceUrl}
                                   onChange={(e) => setEditQSourceUrl(e.target.value)}
                                   className="w-full px-4 py-3 text-[10px] font-mono border border-slate-100 rounded-xl outline-none bg-white focus:border-indigo-300"
                                   placeholder="URL المصدر..."
                                 />
                               </div>
                            </div>

                            {/* Multiple Choice Section for Edit */}
                            <div className="space-y-3 pt-6 border-t border-slate-200">
                              <div className="flex items-center justify-between">
                                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                   <List className="w-3 h-3" />
                                   تحكم الخيارات الذكية (AI)
                                 </h4>
                                 <motion.button 
                                   whileHover={{ scale: 1.02 }}
                                   whileTap={{ scale: 0.98 }}
                                   onClick={handleGenerateOptionsForEdit}
                                   disabled={isGeneratingOptions || !editQText || !editQAnswer}
                                   className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-[9px] font-black hover:bg-amber-100 disabled:opacity-50 flex items-center gap-2 border border-amber-100"
                                 >
                                   {isGeneratingOptions ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                   توليد خيارات جديدة
                                 </motion.button>
                              </div>
                              
                              {editQOptions && editQOptions.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {editQOptions.map((opt, idx) => (
                                    <div key={idx} className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${opt === editQAnswer ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-100 text-slate-400'}`}>
                                      <span className="text-[9px] font-black">{String.fromCharCode(65 + idx)}</span>
                                      <span className="text-[10px] font-bold">{opt}</span>
                                    </div>
                                  ))}
                                  <button 
                                    onClick={() => setEditQOptions([])}
                                    className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-all"
                                    title="حذف الخيارات"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <p className="text-[9px] font-bold text-slate-300 italic px-2">لا توجد خيارات متعددة مخزنة لهذا السؤال حالياً. يمكنك توليدها لتجربة لعب أسهل.</p>
                              )}
                            </div>

                            <div className="flex gap-4 pt-4">
                               <button 
                                 onClick={() => setPreviewQ({
                                   text: editQText,
                                   answer: editQAnswer,
                                   points: editQPoints,
                                   imageUrl: editQImageUrl,
                                   videoUrl: editQVideoUrl,
                                   videoEnabled: editQVideoEnabled,
                                   imagesEnabled: editQImagesEnabled
                                 })}
                                 className="px-6 py-5 bg-emerald-50 text-emerald-600 rounded-2xl font-bold text-sm hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
                               >
                                 <Eye className="w-5 h-5" /> معاينة
                               </button>
                               <button onClick={() => handleUpdateQuestion(q.id)} className="flex-grow py-5 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 flex items-center justify-center gap-3">
                                 <Save className="w-5 h-5" /> حفظ التعديلات
                               </button>
                               <button onClick={() => setEditingQId(null)} className="px-8 py-5 bg-white text-slate-400 rounded-2xl font-bold text-sm hover:bg-slate-100 border border-slate-200">
                                 إلغاء
                               </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-1 space-y-5">
                            <div className="flex items-start justify-between gap-6">
                              <div className="space-y-4 min-w-0 flex-grow">
                                 <div className="flex items-center gap-3">
                                    {q.letterMode && (
                                      <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-200">
                                        {q.letter || '؟'}
                                      </span>
                                    )}
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                                       <div className="flex items-center gap-2">
                                          {q.imageUrl && <ImageIcon className={`w-4 h-4 ${answeredQuestionIds.includes(q.id) ? 'text-slate-300' : 'text-emerald-500'}`} />}
                                          {q.videoUrl && <Video className={`w-4 h-4 ${answeredQuestionIds.includes(q.id) ? 'text-slate-300' : 'text-rose-500'}`} />}
                                          {q.qrEnabled && <QrCode className={`w-4 h-4 ${answeredQuestionIds.includes(q.id) ? 'text-slate-300' : 'text-amber-500'}`} />}
                                       </div>
                                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">MODES</span>
                                    </div>
                                 </div>
                                 
                                 <h3 className={`text-xl font-bold leading-tight transition-all uppercase ${answeredQuestionIds.includes(q.id) ? 'text-slate-400 line-through opacity-60' : 'text-slate-900 group-hover:text-indigo-600'}`}>{q.text}</h3>
                                 
                                 <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex items-center gap-3 bg-emerald-50 px-5 py-2.5 rounded-2xl border-2 border-emerald-100/50 shadow-sm">
                                       <div className="p-1 bg-emerald-500 text-white rounded-lg">
                                         <CheckCircle2 className="w-3 h-3" />
                                       </div>
                                       <span className="text-sm font-bold text-emerald-800">{q.answer}</span>
                                    </div>
                                    {q.source && (
                                      <div className="flex items-center gap-2 text-slate-400 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100/50">
                                         <BookOpen className="w-4 h-4" />
                                         <span className="text-xs font-semibold">{q.source}</span>
                                      </div>
                                    )}
                                 </div>
                              </div>

                              <div className="flex items-start gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                                 <button onClick={() => setPreviewQ(q)} className="p-3 text-emerald-500 hover:bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm"><Eye className="w-4 h-4" /></button>
                                 <button onClick={() => handleEditQuestion(q)} className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl border border-slate-100 shadow-sm"><Settings className="w-4 h-4" /></button>
                                 <button onClick={() => setQToDelete(q.id)} className="p-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl border border-slate-100 shadow-sm"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {categorySubTab === 'add' ? (
          <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50/50 rounded-bl-full -z-0 translate-x-10 -translate-y-10 group-hover:scale-110 transition-all duration-700" />
            
            <div className="relative z-10 flex flex-col gap-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">إضافة قسم جديد</h3>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5 uppercase tracking-widest">تحكم في هوية ونمط القسم بذكاء</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                <div className="lg:col-span-1 space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1 text-center lg:text-right">أيقونة</label>
                   <div className="flex justify-center">
                     <button onClick={() => setShowIconPicker(!showIconPicker)} className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-indigo-600 hover:border-indigo-400 hover:bg-white transition-all shadow-sm">
                       <IconRenderer name={newCat.iconUrl || 'LayoutGrid'} className="w-7 h-7" />
                     </button>
                     <IconPicker selected={newCat.iconUrl || 'LayoutGrid'} onSelect={(icon) => setNewCat({ ...newCat, iconUrl: icon })} isOpen={showIconPicker} onClose={() => setShowIconPicker(false)} color="#4f46e5" playSound={playSound} />
                   </div>
                </div>

                <div className="lg:col-span-3 space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">اسم القسم</label>
                   <input type="text" value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} placeholder="مثلاً: السيرة النبوية..." className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-indigo-400 transition-all font-black text-sm text-slate-700" />
                </div>

                <div className="lg:col-span-3 space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">رابط صورة الغلاف</label>
                   <div className="relative group">
                     <input type="text" value={newCat.imageUrl} onChange={(e) => setNewCat({ ...newCat, imageUrl: e.target.value })} placeholder="رابط خارجي للصورة..." className="w-full h-14 pr-6 pl-12 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-indigo-400 transition-all font-bold text-xs text-slate-700" />
                     <label className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer text-indigo-400 hover:text-indigo-600 transition-colors">
                       <Upload className="w-4 h-4" />
                       <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (url) => setNewCat({ ...newCat, imageUrl: url }))} />
                     </label>
                   </div>
                </div>

                <div className="lg:col-span-2 space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">القائمة</label>
                   <ModernDropdown 
                      value={newCat.group}
                      onChange={(val) => setNewCat({ ...newCat, group: val })}
                      options={[
                        { value: 'عام', label: 'عام' },
                        ...groups.filter(g => g.name !== 'عام').map(g => ({ value: g.name, label: g.name })),
                        { value: '__NEW__', label: '+ قائمة جديدة...' }
                      ]}
                    />
                </div>

                <div className="lg:col-span-4 space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">آلية المحتوى</label>
                   <div className="flex p-1.5 bg-slate-50 rounded-2xl border border-slate-100 h-14">
                      <button onClick={() => setCreationMode('manual')} className={`flex-grow rounded-xl text-[10px] font-black transition-all ${creationMode === 'manual' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}>يدوي</button>
                      <button onClick={() => setCreationMode('url')} className={`flex-grow rounded-xl text-[10px] font-black transition-all ${creationMode === 'url' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>رابط ذكي</button>
                      <button onClick={() => setCreationMode('ai')} className={`flex-grow rounded-xl text-[10px] font-black transition-all ${creationMode === 'ai' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-400'}`}>ذكاء آلي</button>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <div className="md:col-span-4">
                    <textarea 
                      value={newCat.description} 
                      onChange={(e) => setNewCat({ ...newCat, description: e.target.value })} 
                      placeholder="وصف القسم... (سيظهر كمعلومات إضافية عند الضغط على البطاقة)" 
                      className="w-full h-14 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-indigo-400 transition-all font-bold text-xs resize-none" 
                    />
                 </div>

                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="p-3 bg-white rounded-xl text-indigo-500 shadow-sm"><Clock className="w-5 h-5" /></div>
                    <div className="flex-grow">
                       <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">وقت السؤال</span>
                       <input type="number" value={newCat.timerDuration} onChange={(e) => setNewCat({ ...newCat, timerDuration: parseInt(e.target.value) || 60 })} className="w-full bg-transparent outline-none font-black text-slate-700 text-sm" />
                    </div>
                 </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="p-3 bg-white rounded-xl text-orange-500 shadow-sm"><ImageIcon className="w-5 h-5" /></div>
                    <div className="flex-grow flex items-center justify-between">
                       <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">خلفية البطاقة</span>
                       <button onClick={() => setNewCat({ ...newCat, imageMode: !newCat.imageMode })} className={`w-10 h-6 rounded-full p-1 transition-all flex items-center ${newCat.imageMode ? 'bg-orange-500' : 'bg-slate-200'}`}><div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all ${newCat.imageMode ? 'translate-x-4' : ''}`} /></button>
                    </div>
                 </div>

                 <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${newCat.description?.length > 30 ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                    <div className={`p-3 bg-white rounded-xl shadow-sm ${newCat.description?.length > 30 ? 'text-amber-500' : 'text-slate-400'}`}><Sparkles className="w-5 h-5" /></div>
                    <div className="flex-grow flex items-center justify-between gap-4">
                       <div>
                         <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">توليد 20 سؤال ذكي</span>
                         <span className="text-[8px] font-bold text-slate-400">{newCat.description?.length > 30 ? 'الوصف كافٍ للتوليد' : 'أدخل وصفاً (>30 حرف)'}</span>
                       </div>
                       <button 
                         disabled={!(newCat.description?.length > 30)}
                         onClick={() => setAutoGenSmart(!autoGenSmart)} 
                         className={`w-10 h-6 rounded-full p-1 transition-all flex items-center ${autoGenSmart && (newCat.description?.length > 30) ? 'bg-indigo-600' : 'bg-slate-200'}`}
                       >
                         <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all ${autoGenSmart && (newCat.description?.length > 30) ? 'translate-x-4' : ''}`} />
                       </button>
                    </div>
                 </div>

                 <div className="md:col-span-2">
                    <AnimatePresence mode="wait">
                      {creationMode === 'url' && (
                        <motion.input key="url" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} type="url" value={importUrl} onChange={(e) => setImportUrl(e.target.value)} placeholder="رابط مصدر الأسئلة..." className="w-full h-14 px-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl outline-none focus:bg-white transition-all font-bold text-xs" />
                      )}
                      {creationMode === 'ai' && (
                        <motion.textarea key="ai" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} value={newCat.sourceText} onChange={(e) => setNewCat({ ...newCat, sourceText: e.target.value })} placeholder="وصف الأسئلة المطلوبة..." className="w-full h-14 px-6 py-4 bg-amber-50/50 border border-amber-100 rounded-2xl outline-none focus:bg-white transition-all font-bold text-[11px] resize-none" />
                      )}
                    </AnimatePresence>
                 </div>
              </div>

              <div className="flex justify-end pt-4">
                 <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={async () => { await handleAddCategory(); setCategorySubTab('list'); }} disabled={loading || isExtracting} className="px-12 h-16 bg-slate-900 text-white font-black rounded-2xl flex items-center gap-4 shadow-xl shadow-slate-200 disabled:opacity-50">
                   {isExtracting ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
                   <span>اعتـماد القسم الجديد</span>
                 </motion.button>
              </div>
            </div>
          </section>
        ) : (
          <section className="space-y-8">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm"><Search className="w-5 h-5 text-slate-400" /></div>
                 <input type="text" value={sidebarSearch} onChange={(e) => setSidebarSearch(e.target.value)} placeholder="بحث..." className="bg-transparent outline-none font-black text-slate-900 text-sm min-w-[300px]" />
               </div>
               <motion.button onClick={handleSmartSyncAll} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black flex items-center gap-2 transition-all hover:bg-indigo-700 shadow-lg shadow-indigo-100"><Sparkles className="w-3.5 h-3.5" />مزامنة ذكية</motion.button>
            </div>

            <Reorder.Group axis="y" values={groups.filter(g => g.name.includes(sidebarSearch) || categories.some(c => (c.group || 'عام') === g.name && c.name.includes(sidebarSearch)))} onReorder={handleReorderGroups} className="space-y-12">
              {groups.filter(g => g.name.includes(sidebarSearch) || categories.some(c => (c.group || 'عام') === g.name && c.name.includes(sidebarSearch))).map((group) => (
                <Reorder.Item 
                  key={group.id} 
                  value={group} 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileDrag={{ scale: 1.01, zIndex: 50, transition: { duration: 0.1 } }}
                >
                  <div className="flex items-center justify-between group/group-header">
                    <div className="flex items-center gap-4"><div className="w-1.5 h-6 bg-indigo-500 rounded-full" /><h3 className="text-xl font-black text-slate-900">{group.name}</h3></div>
                    <div className="flex items-center gap-2 opacity-0 group-hover/group-header:opacity-100 transition-opacity">
                       <button onClick={() => { setGroupToRename(group.name); setNewGroupNameValue(group.name); }} className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><Settings className="w-4 h-4" /></button>
                       {group.name !== 'عام' && <button onClick={() => handleDeleteGroup(group.id, group.name)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>}
                       <div className="w-8 h-8 flex items-center justify-center text-slate-300 cursor-grab active:cursor-grabbing"><GripVertical className="w-4 h-4" /></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {categories.filter(c => (c.group || 'عام') === group.name).filter(c => c.name.includes(sidebarSearch)).sort((a,b)=>(a.order??0)-(b.order??0)).map((cat) => {
                      const isExpanded = expandedCatId === cat.id;
                      const questionCount = cat.questions?.length || 0;
                      const totalPoints = cat.questions?.reduce((acc, q) => acc + (q.points || 0), 0) || 0;
                      const answeredCount = cat.questions?.filter(q => answeredQuestionIds.includes(q.id)).length || 0;
                      const progress = questionCount > 0 ? (answeredCount / questionCount) * 100 : 0;

                      return (
                        <motion.div 
                          key={cat.id} 
                          layout 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          onClick={() => setExpandedCatId(isExpanded ? null : cat.id)} 
                          className={`relative bg-white border border-slate-100 p-6 rounded-[32px] cursor-pointer shadow-sm hover:shadow-xl transition-all ${isExpanded ? 'ring-4 ring-indigo-500/10 border-indigo-200' : ''}`}
                        >
                          {cat.imageMode && cat.imageUrl && <div className="absolute inset-0 opacity-10 rounded-[32px] overflow-hidden"><img src={cat.imageUrl} className="w-full h-full object-cover" alt="" /></div>}
                          <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between mb-6">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${cat.imageMode ? 'bg-orange-50 text-orange-600' : 'bg-slate-50'}`}>
                                {cat.iconUrl?.startsWith('http') ? <img src={cat.iconUrl} className="w-6 h-6 object-contain" /> : <IconRenderer name={cat.iconUrl || 'LayoutGrid'} className="w-6 h-6" />}
                              </div>
                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleToggleCategoryActive(cat.id, cat.isActive !== false); }} 
                                  className={`p-2 rounded-xl transition-all shadow-sm ${cat.isActive !== false ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' : 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white'}`}
                                  title={cat.isActive !== false ? "القسم نشط - اضغط للإخفاء" : "القسم متوقف - اضغط للتفعيل"}
                                >
                                  {cat.isActive !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                                {isExpanded && (
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setSelectedCatId(cat.id); }} 
                                    className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                    title="تعديل القسم"
                                  >
                                    <Settings className="w-4 h-4" />
                                  </button>
                                )}
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }} className="p-2 text-slate-200 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </div>
                            
                            <h4 className={`font-black text-slate-900 transition-all ${isExpanded ? 'text-xl mb-3' : 'text-md mb-1'}`}>{cat.name}</h4>
                            
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }} 
                                  animate={{ opacity: 1, height: 'auto' }} 
                                  exit={{ opacity: 0, height: 0 }}
                                  className="overflow-hidden"
                                >
                                  {cat.description && (
                                    <p className="text-xs text-slate-500 font-bold mb-4 leading-relaxed">
                                      {cat.description}
                                    </p>
                                  )}
                                  
                                  <div className="space-y-3 mb-4">
                                    <div className="flex justify-between items-end">
                                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">اكتمال الأسئلة</span>
                                      <span className="text-xs font-black text-indigo-600">{answeredCount}/{questionCount}</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="h-full bg-indigo-500"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                      <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">إجمالي النقاط</span>
                                      <span className="text-sm font-black text-slate-700">{totalPoints}</span>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                      <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">المدة</span>
                                      <span className="text-sm font-black text-slate-700">{cat.timerDuration || 60}ث</span>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <div className="flex flex-wrap gap-2 mt-auto">
                               {cat.imageMode && <span className="text-[8px] font-black px-2 py-0.5 bg-orange-100 text-orange-700 rounded-md">نمط البطاقة</span>}
                               {cat.timerDuration && <span className="text-[8px] font-black px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md">{cat.timerDuration}ث</span>}
                               {cat.imagesEnabled && <span className="text-[8px] font-black px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md">صور ذكية</span>}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </section>
        )}
      </div>
    );
  };

  const renderSettings = () => (
    <motion.div 
      key="app-settings-full-view"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="max-w-6xl mx-auto space-y-10 pb-20"
    >
      {/* branding Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white/40 backdrop-blur-3xl p-10 rounded-[40px] border border-white shadow-2xl shadow-slate-200/50">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] text-white rounded-[24px] flex items-center justify-center shadow-2xl shadow-[var(--app-glow)]">
            <Settings className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">إعدادات الهوية</h2>
            <p className="text-slate-400 text-sm font-bold mt-1">إدارة العلامة التجارية والمظهر العام للمسابقة</p>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUpdateAppSettings}
          disabled={loading}
          className="px-12 py-5 bg-slate-900 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-slate-200 flex items-center gap-4 transition-all hover:bg-black disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin text-[var(--app-primary)]" /> : <Save className="w-6 h-6 text-[var(--app-primary)]" />}
          <span>حفظ الهوية الجديدة</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Section: Textual Branding */}
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 space-y-10">
          <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
            <div className="w-10 h-10 bg-[var(--app-primary-light)] text-[var(--app-primary)] rounded-2xl flex items-center justify-center">
              <Type className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-slate-800">بيانات المسابقة</h3>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">اسم المسابقة</label>
              <input 
                type="text"
                value={competitionName}
                onChange={(e) => setCompetitionName(e.target.value)}
                className="w-full px-6 h-16 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-8 focus:ring-[var(--app-primary)]/5 focus:border-[var(--app-primary)] transition-all font-black text-slate-700 shadow-inner"
                placeholder="أدخل اسم المسابقة..."
              />
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">الشعار المكتوب (Slogan)</label>
              <input 
                type="text"
                value={competitionSlogan}
                onChange={(e) => setCompetitionSlogan(e.target.value)}
                className="w-full px-6 h-16 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-8 focus:ring-[var(--app-primary)]/5 focus:border-[var(--app-primary)] transition-all font-bold text-slate-600 shadow-inner italic"
                placeholder="أدخل شعار المسابقة..."
              />
            </div>
          </div>
        </div>

        {/* Section: Visual Style */}
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 space-y-10">
          <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
            <div className="w-10 h-10 bg-[var(--app-primary-light)] text-[var(--app-primary)] rounded-2xl flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-slate-800">سمة النظام (المظهر العام)</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { id: 'indigo', name: 'نيلي الاحترافي', color: '#4f46e5' },
              { id: 'amber', name: 'أمبر الذهبي', color: '#f59e0b' },
              { id: 'orange', name: 'برتقالي مشرق', color: '#ea580c' },
              { id: 'sunset', name: 'غروب دافئ', color: '#f97316' },
              { id: 'teal', name: 'فيروزي حديث', color: '#0b7c8c' },
              { id: 'emerald', name: 'أخضر الغابة', color: '#10b981' },
              { id: 'violet', name: 'بنفسج عميق', color: '#7c3aed' },
              { id: 'crimson', name: 'أحمر مـلكي', color: '#991b1b' },
            ].map((th) => (
              <motion.button
                key={th.id}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setThemeId(th.id);
                  // Apply immediately to the UI for preview
                  const themesList = [
                    { id: 'indigo', primary: '#4f46e5', hover: '#4338ca', light: '#f8faff', glow: 'rgba(79, 70, 229, 0.2)', rgb: '79, 70, 229' },
                    { id: 'amber', primary: '#f59e0b', hover: '#d97706', light: '#fffcf5', glow: 'rgba(245, 158, 11, 0.2)', rgb: '245, 158, 11' },
                    { id: 'orange', primary: '#ea580c', hover: '#c2410c', light: '#fff9f5', glow: 'rgba(234, 88, 12, 0.2)', rgb: '234, 88, 12' },
                    { id: 'sunset', primary: '#f97316', hover: '#ea580c', light: '#fffaf5', glow: 'rgba(249, 115, 22, 0.2)', rgb: '249, 115, 22' },
                    { id: 'teal', primary: '#0b7c8c', hover: '#086370', light: '#f0f9fa', glow: 'rgba(11, 124, 140, 0.2)', rgb: '11, 124, 140' },
                    { id: 'emerald', primary: '#10b981', hover: '#059669', light: '#f0fdf4', glow: 'rgba(16, 185, 129, 0.2)', rgb: '16, 185, 129' },
                    { id: 'violet', primary: '#7c3aed', hover: '#6d28d9', light: '#f9f8ff', glow: 'rgba(124, 58, 237, 0.2)', rgb: '124, 58, 237' },
                    { id: 'crimson', primary: '#991b1b', hover: '#7f1d1d', light: '#fff8f8', glow: 'rgba(153, 27, 27, 0.2)', rgb: '153, 27, 27' },
                  ];
                  const activeTheme = themesList.find(t => t.id === th.id);
                  if (activeTheme) {
                    document.documentElement.style.setProperty('--app-primary', activeTheme.primary);
                    document.documentElement.style.setProperty('--app-primary-hover', activeTheme.hover);
                    document.documentElement.style.setProperty('--app-primary-light', activeTheme.light);
                    document.documentElement.style.setProperty('--app-glow', activeTheme.glow);
                    document.documentElement.style.setProperty('--app-primary-rgb', activeTheme.rgb);
                    document.documentElement.style.setProperty('--theme-primary', activeTheme.primary);
                    document.documentElement.style.setProperty('--theme-primary-hover', activeTheme.hover);
                    document.documentElement.style.setProperty('--theme-primary-light', activeTheme.light);
                    document.documentElement.style.setProperty('--theme-glow', activeTheme.glow);
                    document.documentElement.style.setProperty('--theme-primary-rgb', activeTheme.rgb);
                  }
                }}
                className={`flex flex-col items-center gap-4 p-5 rounded-[32px] border-2 transition-all group ${
                  themeId === th.id 
                  ? 'bg-[var(--app-primary-light)] border-[var(--app-primary)] shadow-xl shadow-[var(--app-glow)]' 
                  : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="w-14 h-14 rounded-[20px] shadow-2xl border-4 border-white shrink-0 group-hover:rotate-12 transition-transform duration-500" style={{ backgroundColor: th.color }} />
                <span className={`text-[10px] font-black tracking-tight transition-colors ${themeId === th.id ? 'text-[var(--app-primary)]' : 'text-slate-400'}`}>
                  {th.name}
                  {themeId === th.id && <Check className="w-3 h-3 inline-block mr-1" />}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Section: Media Assets */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 space-y-12">
          <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
            <div className="w-10 h-10 bg-[var(--app-primary-light)] text-[var(--app-primary)] rounded-2xl flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-slate-800">الأصول الإعلامية والشعارات</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Logo Upload */}
            <div className="space-y-8">
              <div className="flex flex-col items-center justify-center gap-8 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-[var(--app-primary)] opacity-10 rounded-[40px] blur-[40px] scale-150 transition-opacity group-hover:opacity-20" />
                  <div className="w-56 h-56 bg-slate-50 rounded-[48px] border-2 border-dashed border-slate-200 p-10 flex items-center justify-center relative z-10 transition-all group-hover:bg-white group-hover:border-[var(--app-primary)] shadow-inner">
                    <img 
                      src={logoUrl || 'https://img.icons8.com/color/512/quiz.png'} 
                      className="w-full h-full object-contain filter drop-shadow-2xl transition-transform group-hover:scale-110" 
                      alt="Comp Logo" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <div className="w-full space-y-4 text-center">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block">شعار المسابقة الرئيسي</label>
                  <div className="relative flex gap-2">
                    <div className="relative flex-grow">
                      <Link2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        type="text"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        className="w-full pr-12 pl-6 h-14 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-[var(--app-primary)] transition-all text-[10px] font-mono font-bold text-slate-500 shadow-sm"
                        placeholder="رابط مباشر للصورة..."
                      />
                    </div>
                    <label className="w-14 h-14 bg-[var(--app-primary-light)] text-[var(--app-primary)] rounded-2xl flex items-center justify-center hover:bg-[var(--app-primary)] hover:text-white transition-all shadow-xl cursor-pointer active:scale-95 shrink-0" title="رفع من جهازك">
                      <Upload className="w-5 h-5" />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setLogoUrl)} />
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold italic opacity-60">يفضل صورة شفافة بأبعاد 512x512</p>
                </div>
              </div>
            </div>

            {/* Admin Profile Upload */}
            <div className="space-y-8">
              <div className="flex flex-col items-center justify-center gap-8 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-[var(--app-primary)] opacity-10 rounded-full blur-[40px] scale-150 transition-opacity group-hover:opacity-20" />
                  <div className="w-24 h-24 bg-white rounded-full border-2 border-dashed border-slate-200 p-2 flex items-center justify-center relative z-10 transition-all group-hover:bg-white group-hover:border-[var(--app-primary)] shadow-inner">
                    {adminImageUrl ? (
                      <img src={adminImageUrl} className="w-full h-full rounded-full object-cover shadow-2xl transition-transform group-hover:scale-105" alt="Admin" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center"><User className="w-16 h-16 text-slate-300" /></div>
                    )}
                  </div>
                </div>
                <div className="w-full space-y-4 text-center">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block">صورة مدير النظام (Admin)</label>
                  <div className="relative flex gap-2">
                    <div className="relative flex-grow">
                      <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        type="text"
                        value={adminImageUrl}
                        onChange={(e) => setAdminImageUrl(e.target.value)}
                        className="w-full pr-12 pl-6 h-14 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-[var(--app-primary)] transition-all text-[10px] font-mono font-bold text-slate-500 shadow-sm"
                        placeholder="رابط صورة المسؤول..."
                      />
                    </div>
                    <label className="w-14 h-14 bg-[var(--app-primary-light)] text-[var(--app-primary)] rounded-2xl flex items-center justify-center hover:bg-[var(--app-primary)] hover:text-white transition-all shadow-xl cursor-pointer active:scale-95 shrink-0" title="رفع من جهازك">
                      <Upload className="w-5 h-5" />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setAdminImageUrl)} />
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold italic opacity-60">سيتم استخدام الشعار كبديل إذا ترك فارغاً</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Default Timer */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-black p-12 rounded-[48px] text-white overflow-hidden relative group">
           <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--app-primary)] opacity-10 rounded-full blur-[120px] -z-0 translate-x-32 -translate-y-32" />
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] flex items-center justify-center shadow-2xl transform -rotate-6">
                  <Hourglass className="w-12 h-12 text-[var(--app-primary)] animate-pulse" />
                </div>
                <div>
                  <h3 className="text-3xl font-black tracking-tight">الوقت الافتراضي للإجابة</h3>
                  <p className="text-slate-400 text-sm font-bold mt-2">يتم تطبيقه على كافة الأقسام الجديدة التي سيتم إنشاؤها.</p>
                </div>
              </div>
              <div className="flex items-center bg-white/5 border border-white/10 p-4 rounded-[32px] gap-6 backdrop-blur-md">
                <input 
                  type="number"
                  value={timerDuration}
                  onChange={(e) => setTimerDuration(parseInt(e.target.value) || 30)}
                  className="w-32 h-20 bg-white/10 text-white border-2 border-white/10 rounded-2xl text-4xl font-black text-center focus:ring-8 focus:ring-[var(--app-primary)]/20 outline-none transition-all"
                />
                <span className="text-sm font-black text-[var(--app-primary)] uppercase tracking-widest px-4">ثانية</span>
              </div>
           </div>
        </div>
      </div>
      {/* Sticky Bottom Actions Bar (شريط القائمة السفلي) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-4xl px-4 pointer-events-none">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-slate-900/90 backdrop-blur-2xl p-4 rounded-[32px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] pointer-events-auto flex items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4 px-4">
             <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-orange-400 animate-spin-slow" />
             </div>
             <div className="hidden sm:block text-right">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">وضع الإعدادات النشط</p>
                <p className="text-xs font-black text-white mt-1">تأكد من حفظ التغييرات قبل الخروج</p>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <button
               onClick={() => { playSound?.('click'); onBack(); }}
               className="px-6 py-3 text-white/60 hover:text-white font-black text-xs transition-colors"
             >
               إلغاء التعديل
             </button>
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={handleUpdateAppSettings}
               disabled={loading}
               className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-orange-500/20 flex items-center gap-3 disabled:opacity-50"
             >
               {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
               <span>حفظ كافة الإعدادات</span>
             </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderData = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
           <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><Download className="w-6 h-6" /></div>
              <h3 className="text-xl font-black">تصدير البيانات</h3>
              <p className="text-xs text-slate-400 font-bold">حفظ نسخة احتياطية من كافة البيانات الحالية بصيغة JSON.</p>
           </div>
           <button onClick={handleExportData} className="mt-8 w-full py-4 bg-emerald-600 text-white font-black rounded-xl italic">تصدير وتحميل (.json)</button>
        </div>
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
           <div className="space-y-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center"><Upload className="w-6 h-6" /></div>
              <h3 className="text-xl font-black">استيراد البيانات</h3>
              <p className="text-xs text-slate-400 font-bold">رفع ملف JSON لاستعادة البيانات المحفوظة سابقاً.</p>
           </div>
           <div className="mt-8 relative"><input type="file" accept=".json" onChange={handleImportData} className="absolute inset-0 opacity-0 cursor-pointer" /><button className="w-full py-4 bg-amber-500 text-white font-black rounded-xl italic">اختيار ملف واستيراد</button></div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center shadow-sm">
            <RotateCcw className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">إجراءات إعادة الضبط</h3>
            <p className="text-xs font-bold text-slate-400 mt-1">تفريغ السجلات وإعادة تهيئة المسابقة</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
           <button onClick={onResetPlayedQuestions} className="py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-black transition-all flex items-center justify-center gap-3">
             <RotateCcw className="w-5 h-5 text-orange-500" />
             <span>تفريغ السجلات</span>
           </button>
           <button onClick={onResetGame} className="py-4 bg-orange-500 text-white font-black rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-lg shadow-orange-100">
             <Trash2 className="w-5 h-5" />
             <span>إعادة ضبط المسابقة</span>
           </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-display selection:bg-orange-500/30">
      <main className="relative z-10 w-full overflow-hidden">
          <div className="sticky top-0 z-[60] transition-all duration-300">
            <header className={`px-4 sm:px-8 py-3.5 flex flex-col lg:flex-row lg:items-center justify-between transition-all duration-300 gap-3 lg:gap-6 border-b ${scrolled ? 'bg-white/95 backdrop-blur-2xl border-white/50 shadow-xl' : 'bg-white border-slate-200/50'}`}>
              <div className="flex items-center justify-between w-full lg:w-auto">
                {/* Right Section: Title & App Info (العنوان وجهة اليمين) */}
                <div className="flex flex-col items-start gap-1 shrink-0">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none">
                    لوحة التحكم
                  </h2>
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                       {TABS.find(t => t.id === sidebarTab)?.label}
                     </p>
                  </div>
                </div>

                {/* Left Section Mobile ONLY: Logo & Actions (الشعار والعمليات جهة اليسار للموبايل) */}
                <div className="flex lg:hidden items-center gap-3 shrink-0">
                  <motion.button 
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { playSound?.('click'); onBack(); }}
                    aria-label="العودة للمسابقة"
                    className="w-9 h-9 bg-slate-900 hover:bg-black text-white rounded-xl flex items-center justify-center transition-all border border-slate-800 hover:border-orange-500/50 shadow-md active:scale-95"
                  >
                    <Trophy className="w-4 h-4 text-orange-400" />
                  </motion.button>
                </div>
              </div>
              
              {/* Center Section: Navigation Island (الأزرار في المنتصف تماماً) */}
              <div className="flex lg:flex-1 justify-start lg:justify-center overflow-x-auto w-full no-scrollbar pb-1 lg:pb-0 px-4 lg:px-0 -mx-4 lg:mx-0">
                <nav 
                  role="tablist" 
                  aria-label="أقسام لوحة التحكم" 
                  className={`flex items-center gap-1 p-1 rounded-full border transition-all duration-300 shadow-sm min-w-max ${scrolled ? 'bg-white border-slate-100' : 'bg-slate-100/80 border-slate-200/40'}`}
                >
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={sidebarTab === tab.id}
                      onClick={() => {
                        playSound?.('click');
                        setSidebarTab(tab.id);
                        if (tab.id === 'categories') setCategorySubTab('list');
                        if (tab.id === 'media') setMediaSubTab('questions');
                        setSelectedCatId(null);
                      }}
                      className={`flex items-center gap-1.5 sm:gap-2.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-300 group relative shrink-0 ${
                        sidebarTab === tab.id 
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 font-black' 
                        : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50/80 font-bold'
                      }`}
                    >
                      <tab.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${sidebarTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                      <span className="text-[11px] sm:text-xs md:text-[13px] tracking-tight whitespace-nowrap">{tab.label}</span>
                      
                      {sidebarTab === tab.id && (
                        <motion.div 
                          layoutId="nav-active-pill"
                          className="absolute inset-0 bg-white/10 rounded-full pointer-events-none"
                          transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                        />
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Left Section Desktop ONLY: Logo & Actions (الشعار والعمليات جهة اليسار) */}
              <div className="hidden lg:flex items-center gap-4 shrink-0">
                {sidebarTab === 'media' && syncStatus === 'running' && (
                  <button 
                    onClick={() => { playSound?.('click'); setShowSyncLog(true); }}
                    className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-2xl hover:bg-indigo-100 transition-all font-black text-[10px] shadow-sm animate-pulse"
                  >
                    <Activity className="w-4 h-4" />
                    <span>مراقبة</span>
                  </button>
                )}

                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white transition-all cursor-help group">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-800 leading-none group-hover:text-orange-600 transition-colors">مدير النظام</p>
                    <p className="text-[9px] text-slate-400 font-bold mt-1 line-clamp-1 max-w-[120px]">{auth.currentUser?.email}</p>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-full border-2 border-orange-100 shadow-sm overflow-hidden flex items-center justify-center p-0.5 group-hover:border-orange-500 transition-all">
                    {adminImageUrl || logoUrl ? (
                      <img 
                        src={adminImageUrl || logoUrl} 
                        alt="Logo" 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as any).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${auth.currentUser?.uid}`;
                        }}
                      />
                    ) : (
                      <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${auth.currentUser?.uid}`} alt="Avatar" />
                    )}
                  </div>
                </div>
                
                <div className="relative group">
                  <motion.button 
                    whileHover={{ scale: 1.08, rotate: 4 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => { playSound?.('click'); onBack(); }}
                    aria-label="العودة للمسابقة"
                    className="w-12 h-12 bg-slate-900 hover:bg-black text-white rounded-2xl flex items-center justify-center transition-all border border-slate-800 hover:border-orange-500/50 shadow-xl hover:shadow-orange-500/10 active:scale-95"
                  >
                    <Trophy className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
                  </motion.button>
                  <div className="absolute top-full left-0 mt-3 hidden group-hover:block bg-slate-900/95 backdrop-blur-md text-white text-[10px] sm:text-xs font-black px-4 py-2 rounded-xl border border-white/20 whitespace-nowrap shadow-2xl z-[80]">
                    العودة للمسابقة
                  </div>
                </div>
              </div>
            </header>


            {/* Sub-navigation directly below */}
            {(sidebarTab === 'categories' || sidebarTab === 'media') && (
              <motion.div 
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`flex justify-start md:justify-center overflow-x-auto no-scrollbar py-2.5 sm:py-3 border-b-2 transition-colors duration-300 px-4 -mx-4 md:px-0 md:mx-0 ${scrolled ? 'bg-white/95 backdrop-blur-xl border-orange-50 shadow-sm' : 'bg-slate-50 border-white'}`}
              >
                <div className="bg-white/80 backdrop-blur-md p-1 sm:p-1.5 rounded-xl sm:rounded-2xl flex items-center gap-1 sm:gap-1.5 border border-slate-100 shadow-md min-w-max">
                  {sidebarTab === 'categories' && (
                    <>
                      <button
                        onClick={() => { playSound?.('click'); setCategorySubTab('add'); setSelectedCatId(null); }}
                        className={`flex items-center gap-2 sm:gap-3 px-3.5 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all text-[11px] sm:text-xs font-black group ${
                          categorySubTab === 'add' ? 'bg-orange-500 text-white shadow-md shadow-orange-100' : 'text-slate-500 hover:text-orange-500 hover:bg-orange-50'
                        }`}
                      >
                        <PlusCircle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${categorySubTab === 'add' ? 'text-white' : 'text-orange-500'}`} />
                        <span>إضافة قسم جديد</span>
                      </button>
                      <button
                        onClick={() => { playSound?.('click'); setCategorySubTab('list'); setSelectedCatId(null); }}
                        className={`flex items-center gap-2 sm:gap-3 px-3.5 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all text-[11px] sm:text-xs font-black group ${
                          categorySubTab === 'list' && !selectedCatId ? 'bg-orange-500 text-white shadow-md shadow-orange-100' : 'text-slate-500 hover:text-orange-500 hover:bg-orange-50'
                        }`}
                      >
                        <LayoutGrid className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${categorySubTab === 'list' && !selectedCatId ? 'text-white' : 'text-orange-500'}`} />
                        <span>الأقسام المعروضة</span>
                      </button>
                    </>
                  )}
                  {sidebarTab === 'media' && (
                    <>
                      <button
                        onClick={() => { playSound?.('click'); setMediaSubTab('questions'); }}
                        className={`flex items-center gap-2 sm:gap-3 px-3.5 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all text-[11px] sm:text-xs font-black ${
                          mediaSubTab === 'questions' ? 'bg-orange-500 text-white shadow-md shadow-orange-100' : 'text-slate-500 hover:text-orange-500 hover:bg-orange-50'
                        }`}
                      >
                        <Volume2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${mediaSubTab === 'questions' ? 'text-white' : 'text-orange-500'}`} />
                        <span>أصوات الأسئلة</span>
                      </button>
                      <button
                        onClick={() => { playSound?.('click'); setMediaSubTab('system'); }}
                        className={`flex items-center gap-2 sm:gap-3 px-3.5 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all text-[11px] sm:text-xs font-black ${
                          mediaSubTab === 'system' ? 'bg-orange-500 text-white shadow-md shadow-orange-100' : 'text-slate-500 hover:text-orange-500 hover:bg-orange-50'
                        }`}
                      >
                        <Settings className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${mediaSubTab === 'system' ? 'text-white' : 'text-orange-500'}`} />
                        <span>أصوات النظام</span>
                      </button>
                      <button
                        onClick={() => { playSound?.('click'); setMediaSubTab('upload'); }}
                        className={`flex items-center gap-2 sm:gap-3 px-3.5 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all text-[11px] sm:text-xs font-black ${
                          mediaSubTab === 'upload' ? 'bg-orange-500 text-white shadow-md shadow-orange-100' : 'text-slate-500 hover:text-orange-500 hover:bg-orange-50'
                        }`}
                      >
                        <CloudUpload className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${mediaSubTab === 'upload' ? 'text-white' : 'text-orange-500'}`} />
                        <span>تحميل الأصوات</span>
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </div>

        {/* Dynamic Content Area */}
        <div className="p-6 max-w-[1400px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={sidebarTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              role="tabpanel"
              id={`tabpanel-${sidebarTab}`}
              aria-labelledby={`tab-${sidebarTab}`}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {sidebarTab === 'overview' && renderOverview()}
              {sidebarTab === 'categories' && renderCategories()}
              {sidebarTab === 'media' && renderMedia()}
              {sidebarTab === 'settings' && renderSettings()}
              {sidebarTab === 'data' && renderData()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Global Message Toast */}
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] min-w-[400px]"
          >
            <div className={`p-6 border-2 rounded-[32px] flex items-center justify-between shadow-2xl backdrop-blur-xl ${message.type === 'success' 
              ? 'bg-emerald-500 text-white border-emerald-400' 
              : 'bg-rose-600 text-white border-rose-500 font-bold'
            }`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  {message.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-sm font-black tracking-tight">{message.text}</p>
                  <p className="text-[10px] opacity-70 font-bold">إشعار من النظام</p>
                </div>
              </div>
              <button 
                onClick={() => setMessage(null)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Modals Section */}
        <AnimatePresence>
          {showGroupManager && (
            <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowGroupManager(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="group-manager-title"
                className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
              >
                 <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 id="group-manager-title" className="text-2xl font-black text-slate-800">إدارة مجموعات الأسئلة</h2>
                      <p className="text-xs text-slate-400 font-black mt-1">تعديل، ترتيب وحذف المجموعات</p>
                    </div>
                    <button onClick={() => setShowGroupManager(false)} aria-label="إغلاق مدير المجموعات" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:scale-110 active:scale-95 transition-all">
                      <X className="w-5 h-5" />
                    </button>
                 </div>

                 <div className="flex-grow p-8 overflow-y-auto">
                    <div className="mb-10 p-6 bg-indigo-50/50 rounded-[32px] border border-indigo-100/50">
                       <label className="text-[10px] font-black text-indigo-600 px-1 mb-2 block uppercase tracking-widest">إضافة مجموعة جديدة</label>
                       <div className="flex gap-3">
                          <input 
                            type="text" 
                            className="flex-grow px-5 py-4 bg-white border border-indigo-100 rounded-2xl text-sm outline-none font-black text-slate-700" 
                            placeholder="اسم المجموعة..."
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                          />
                          <button 
                            onClick={handleAddGroupManually}
                            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 active:scale-95 transition-all"
                          >
                            إضافة
                          </button>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center justify-between px-2 mb-4">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">المجموعات الحالية ({groups.length})</span>
                          <span className="text-[10px] font-black text-slate-300 italic">اسحب للترتيب</span>
                       </div>

                       <Reorder.Group 
                        axis="y" 
                        onReorder={handleUpdateGroupsOrder} 
                        values={draggedGroups}
                        className="space-y-3"
                       >
                         {draggedGroups.map((group) => (
                           <Reorder.Item 
                            key={group.id} 
                            value={group}
                            whileDrag={{ 
                              scale: 1.02, 
                              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                              zIndex: 50
                            }}
                            className={`
                              p-5 bg-white border border-slate-100 rounded-[24px] shadow-sm flex items-center group
                              ${groupToRename === group.id ? 'ring-2 ring-indigo-500' : ''}
                            `}
                           >
                             <GripVertical className="w-5 h-5 text-slate-300 cursor-grab active:cursor-grabbing mr-4 group-hover:text-slate-400 transition-colors" />
                             
                             <div className="flex-grow">
                                {groupToRename === group.id ? (
                                  <div className="flex gap-2">
                                    <input 
                                      type="text" 
                                      className="flex-grow px-3 py-2 bg-slate-50 rounded-xl text-sm font-black outline-none border border-indigo-200"
                                      value={newGroupNameValue}
                                      onChange={(e) => setNewGroupNameValue(e.target.value)}
                                      autoFocus
                                    />
                                    <button 
                                      onClick={() => handleRenameGroup(group.name, newGroupNameValue, group.id)}
                                      className="p-2 bg-emerald-500 text-white rounded-lg"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => setGroupToRename(null)}
                                      className="p-2 bg-slate-200 text-slate-500 rounded-lg"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <span className="font-black text-slate-700">{group.name}</span>
                                )}
                             </div>

                             <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => {
                                    setGroupToRename(group.id);
                                    setNewGroupNameValue(group.name);
                                  }}
                                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-all"
                                  title="إعادة تسمية"
                                >
                                  <Code className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteGroup(group.id, group.name)}
                                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all"
                                  title="حذف"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                             </div>
                           </Reorder.Item>
                         ))}
                       </Reorder.Group>
                    </div>
                 </div>

                 <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button 
                      onClick={() => setShowGroupManager(false)}
                      className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl active:scale-95 transition-all"
                    >
                      تم
                    </button>
                 </div>
              </motion.div>
            </div>
          )}

          {previewQ && (
            <QuestionPreviewModal 
              question={previewQ} 
              onClose={() => setPreviewQ(null)} 
            />
          )}

          {catToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
          >
             <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-cat-title"
                className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-slate-200"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-red-100 rounded-2xl text-red-600">
                    <Trash2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 id="delete-cat-title" className="text-xl font-black text-slate-800">حذف القسم نهائياً</h3>
                    <p className="text-slate-500 text-sm">سيتم حذف القسم وجميع الأسئلة المرتبطة به.</p>
                  </div>
                </div>

              <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                هل أنت متأكد من رغبتك في حذف قسم <span className="text-red-600 font-bold">"{categories.find(c => c.id === catToDelete)?.name}"</span>؟ هذه العملية لا يمكن التراجع عنها.
              </p>

              <div className="flex gap-4">
                <button 
                  onClick={confirmDeleteCategory}
                  className="flex-grow py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                >
                  نعم، احذف القسم
                </button>
                <button 
                  onClick={() => setCatToDelete(null)}
                  className="flex-grow py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Group Delete Confirmation Modal */}
      <AnimatePresence>
        {groupToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-group-title"
              className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-slate-200"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-rose-100 rounded-2xl text-rose-600">
                  <Trash2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 id="delete-group-title" className="text-xl font-black text-slate-800">حذف القائمة</h3>
                  <p className="text-slate-500 text-sm">سيتم حذف اسم القائمة من الشريط الجانبي.</p>
                </div>
              </div>

              <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                هل أنت متأكد من حذف القائمة <span className="text-rose-600 font-bold">"{groupToDelete.name}"</span>؟ 
                <br />
                <span className="text-xs text-slate-400 mt-2 block italic">* سيتم نقل كافة الأقسام التابعة لها إلى القائمة "عام".</span>
              </p>

              <div className="flex gap-4">
                <button 
                  onClick={confirmDeleteGroup}
                  className="flex-grow py-4 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-100"
                >
                  نعم، احذف القائمة
                </button>
                <button 
                  onClick={() => setGroupToDelete(null)}
                  className="flex-grow py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question Delete Confirmation Modal */}
      <AnimatePresence>
        {qToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-q-title"
              className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-slate-200"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-100 rounded-2xl text-red-600">
                  <Trash2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 id="delete-q-title" className="text-xl font-black text-slate-800">حذف السؤال</h3>
                  <p className="text-slate-500 text-sm">هذا الإجراء سيحذف السؤال المختار فقط.</p>
                </div>
              </div>

              <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                هل أنت متأكد من رغبتك في حذف هذا السؤال؟
              </p>

              <div className="flex gap-4">
                <button 
                  onClick={confirmDeleteQuestion}
                  className="flex-grow py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                >
                  نعم، احذف السؤال
                </button>
                <button 
                  onClick={() => setQToDelete(null)}
                  className="flex-grow py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Delete Confirmation Modal */}
      <AnimatePresence>
        {bulkDeleteIds && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="bulk-delete-title"
              className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-slate-200"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-100 rounded-2xl text-red-600">
                  <Trash2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 id="bulk-delete-title" className="text-xl font-black text-slate-800">حذف مجموعة أسئلة</h3>
                  <p className="text-slate-500 text-sm">سيتم حذف الأسئلة المحددة نهائياً.</p>
                </div>
              </div>

              <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                هل أنت متأكد من رغبتك في حذف <span className="text-red-600 font-bold">{bulkDeleteIds.length}</span> سؤال؟ لا يمكن التراجع عن هذا الإجراء.
              </p>

              <div className="flex gap-4">
                <button 
                  onClick={confirmBulkDelete}
                  className="flex-grow py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                >
                  نعم، احذف الأسئلة
                </button>
                <button 
                  onClick={() => setBulkDeleteIds(null)}
                  className="flex-grow py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Sync Logs Overlay */}
      <AnimatePresence>
        {showSyncLog && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-10 pointer-events-none">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 40 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 40 }}
               role="dialog"
               aria-modal="true"
               aria-labelledby="sync-log-title"
               className="w-full max-w-2xl bg-white rounded-[48px] shadow-[0_50px_100px_rgba(0,0,0,0.3)] border-4 border-indigo-50 overflow-hidden pointer-events-auto"
            >
               <div className="bg-indigo-600 p-8 text-white relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                  <div className="flex items-center justify-between relative z-10">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                          <RefreshCw className={`w-6 h-6 ${syncStatus === 'running' ? 'animate-spin' : ''}`} />
                        </div>
                        <div>
                           <h3 id="sync-log-title" className="text-xl font-black">مراقبة المزامنة الذكية</h3>
                           <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mt-0.5">تتبع عمليات استخراج البيانات بالذكاء الاصطناعي</p>
                        </div>
                     </div>
                     <button 
                       onClick={() => setShowSyncLog(false)} 
                       aria-label="إغلاق سجل المزامنة"
                       className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-md transition-all"
                     >
                        <X className="w-6 h-6" />
                     </button>
                  </div>
               </div>

               <div className="p-8 max-h-[500px] overflow-y-auto custom-scrollbar space-y-4 bg-slate-50">
                  {syncLog.length === 0 && (
                    <div className="py-20 text-center">
                       <div className="w-20 h-20 bg-white rounded-[32px] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-slate-200">
                          <Cloud className="w-10 h-10 text-slate-200" />
                       </div>
                       <p className="text-slate-400 font-black">لا توجد عمليات نشطة حالياً</p>
                    </div>
                  )}
                  {syncLog.map((log, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white p-5 rounded-[28px] border-2 border-transparent hover:border-indigo-100 shadow-sm group transition-all"
                    >
                      <div className="flex items-center gap-4">
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                           log.status === 'success' ? 'bg-emerald-50 text-emerald-600' :
                           log.status === 'error' ? 'bg-rose-50 text-rose-600' :
                           'bg-indigo-50 text-indigo-600'
                         }`}>
                            {log.status === 'success' ? <CheckCircle2 className="w-6 h-6" /> :
                             log.status === 'error' ? <AlertCircle className="w-6 h-6" /> :
                             <Loader2 className="w-6 h-6 animate-spin" />}
                         </div>
                         <div className="flex-grow min-w-0">
                            <div className="flex items-center justify-between mb-1">
                               <h4 className="text-sm font-black text-slate-800 truncate">{log.name}</h4>
                               <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${
                                 log.status === 'success' ? 'bg-emerald-100 text-emerald-700' :
                                 log.status === 'error' ? 'bg-rose-100 text-rose-700' :
                                 'bg-amber-100 text-amber-700'
                               }`}>
                                 {log.status === 'success' ? 'مكتمل' : log.status === 'error' ? 'فشل' : 'جاري التنفيذ'}
                               </span>
                            </div>
                            <p className="text-[11px] font-bold text-slate-500 leading-relaxed">{log.message}</p>
                         </div>
                      </div>
                      {log.status === 'pending' && (
                        <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: extractionProgress + '%' }}
                             className="h-full bg-indigo-500"
                           />
                        </div>
                      )}
                    </motion.div>
                  ))}
               </div>

               <div className="p-8 border-t border-slate-100 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className={`w-3 h-3 rounded-full ${syncStatus === 'running' ? 'bg-amber-500 animate-pulse' : syncStatus === 'completed' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        حالة النظام: {syncStatus === 'running' ? 'جاري المزامنة...' : syncStatus === 'completed' ? 'مكتمل' : 'جاهز'}
                     </span>
                  </div>
                  <div className="flex gap-3">
                    {syncStatus === 'running' && (
                      <button 
                        onClick={() => setShowSyncLog(true)}
                        className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black hover:bg-indigo-100 transition-all border border-indigo-100"
                      >
                         عرض سجل المزامنة (تحديث)
                      </button>
                    )}
                    <button 
                      onClick={() => setShowSyncLog(false)}
                      className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black hover:bg-black transition-all shadow-xl"
                    >
                       إغلاق النافذة
                    </button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
