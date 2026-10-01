/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, useRef, useCallback, memo, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardSkeleton } from './components/ui/Skeleton';
import { 
  Trophy, 
  Users, 
  LayoutGrid, 
  CheckCircle2, 
  Target,
  AlertCircle,
  PlusCircle,
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  HelpCircle, 
  Heart, 
  Info,
  Lock,
  LogOut,
  Settings,
  Star,
  Book,
  Music,
  Film,
  Video,
  QrCode,
  Mic,
  Globe,
  ChevronLeft,
  ChevronRight,
  SkipForward,
  FastForward,
  Copy,
  History,
  Map,
  Search,
  Languages,
  Download,
  Image as ImageIcon,
  Sparkles,
  Sparkles as SparklesIcon,
  Loader2,
  BarChart3,
  ImagePlus,
  ListOrdered,
  CircleDashed,
  Check,
  RefreshCcw,
  ExternalLink,
  Clock,
  Share2,
  MonitorPlay,
  Maximize2,
  Minimize2,
  Brain, 
  Cpu, 
  Palette, 
  Lightbulb, 
  Camera, 
  Navigation, 
  Flag, 
  School, 
  GraduationCap, 
  Database, 
  Briefcase, 
  Cloud, 
  Code, 
  Coffee, 
  Compass, 
  CreditCard, 
  Eye, 
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
  Smile,
  MessageSquare,
  MessageCircle,
  Send,
  Volume2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth, signInWithGoogle } from './lib/firebase';
import { dataService, DBGroup } from './lib/dataService';
import { GameSession, Team, Category, Question, GameState } from './types.ts';
import AdminDashboard from './components/AdminDashboard';
import StatisticsDashboard from './components/StatisticsDashboard';
import RecentCompetitions from './components/RecentCompetitions';
import LiveTeamLeaderboard from './components/LiveTeamLeaderboard';
import { aiService, validateAndFixOptions } from './services/aiService';
import { imageService } from './services/imageService';
import confetti from 'canvas-confetti';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const IconRenderer = memo(({ name, className }: { name: string, className?: string }) => {
  const iconElement = useMemo(() => {
    switch (name) {
      case 'Trophy': return <Trophy className={className} />;
      case 'Users': return <Users className={className} />;
      case 'Globe': return <Globe className={className} />;
      case 'Sparkles': return <SparklesIcon className={className} />;
      case 'HelpCircle': return <HelpCircle className={className} />;
      case 'Heart': return <Heart className={className} />;
      case 'Lock': return <Lock className={className} />;
      case 'Settings': return <Settings className={className} />;
      case 'Star': return <Star className={className} />;
      case 'Book': return <Book className={className} />;
      case 'Music': return <Music className={className} />;
      case 'Film': return <Film className={className} />;
      case 'Mic': return <Mic className={className} />;
      case 'Timer': return <RefreshCcw className={className} />;
      case 'Brain': return <Brain className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'History': return <History className={className} />;
      case 'Palette': return <Palette className={className} />;
      case 'Lightbulb': return <Lightbulb className={className} />;
      case 'Camera': return <Camera className={className} />;
      case 'Video': return <Video className={className} />;
      case 'Map': return <Map className={className} />;
      case 'Navigation': return <Navigation className={className} />;
      case 'Flag': return <Flag className={className} />;
      case 'Languages': return <Languages className={className} />;
      case 'School': return <School className={className} />;
      case 'GraduationCap': return <GraduationCap className={className} />;
      case 'Database': return <Database className={className} />;
      case 'PlusCircle': return <PlusCircle className={className} />;
      case 'XCircle': return <XCircle className={className} />;
      case 'Briefcase': return <Briefcase className={className} />;
      case 'Clock': return <Clock className={className} />;
      case 'Cloud': return <Cloud className={className} />;
      case 'Code': return <Code className={className} />;
      case 'Coffee': return <Coffee className={className} />;
      case 'Compass': return <Compass className={className} />;
      case 'CreditCard': return <CreditCard className={className} />;
      case 'Eye': return <Eye className={className} />;
      case 'Gift': return <Gift className={className} />;
      case 'Home': return <Home className={className} />;
      case 'Key': return <Key className={className} />;
      case 'LifeBuoy': return <LifeBuoy className={className} />;
      case 'Link': return <Link className={className} />;
      case 'Mail': return <Mail className={className} />;
      case 'Moon': return <Moon className={className} />;
      case 'Phone': return <Phone className={className} />;
      case 'PieChart': return <PieChart className={className} />;
      case 'Play': return <Play className={className} />;
      case 'Power': return <Power className={className} />;
      case 'Printer': return <Printer className={className} />;
      case 'Rocket': return <Rocket className={className} />;
      case 'Shield': return <Shield className={className} />;
      case 'ShoppingBag': return <ShoppingBag className={className} />;
      case 'Smartphone': return <Smartphone className={className} />;
      case 'Sun': return <Sun className={className} />;
      case 'Tag': return <Tag className={className} />;
      case 'Terminal': return <Terminal className={className} />;
      case 'Thermometer': return <Thermometer className={className} />;
      case 'ThumbsUp': return <ThumbsUp className={className} />;
      case 'Wrench': return <Wrench className={className} />;
      case 'Trash': return <Trash className={className} />;
      case 'Umbrella': return <Umbrella className={className} />;
      case 'Wind': return <Wind className={className} />;
      case 'Zap': return <Zap className={className} />;
      default: return <LayoutGrid className={className} />;
    }
  }, [name, className]);

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 5 }}
      whileTap={{ scale: 0.92, rotate: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="inline-block"
    >
      {iconElement}
    </motion.div>
  );
});

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const getYouTubeId = (url: string) => {
  if (!url) return null;
  // Handle various YouTube URL formats including shorts, live, and standard
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/|live\/)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2]) {
    const id = match[2];
    return id.length >= 10 ? id : null;
  }
  return null;
};

const isDirectVideoLink = (url: string) => {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  return videoExtensions.some(ext => url.toLowerCase().includes(ext)) || url.toLowerCase().includes('firebasestorage.googleapis.com');
};

const THEMES = [
  { id: 'indigo', name: 'نيلي الاحترافي', primary: '#4f46e5', hover: '#4338ca', light: '#f8faff', glow: 'rgba(79, 70, 229, 0.2)', rgb: '79, 70, 229' },
  { id: 'amber', name: 'أمبر الذهبي', primary: '#f59e0b', hover: '#d97706', light: '#fffcf5', glow: 'rgba(245, 158, 11, 0.2)', rgb: '245, 158, 11' },
  { id: 'orange', name: 'برتقالي مشرق', primary: '#ea580c', hover: '#c2410c', light: '#fff9f5', glow: 'rgba(234, 88, 12, 0.2)', rgb: '234, 88, 12' },
  { id: 'sunset', name: 'غروب دافئ', primary: '#f97316', hover: '#ea580c', light: '#fffaf5', glow: 'rgba(249, 115, 22, 0.2)', rgb: '249, 115, 22' },
  { id: 'teal', name: 'فيروزي حديث', primary: '#0b7c8c', hover: '#086370', light: '#f0f9fa', glow: 'rgba(11, 124, 140, 0.2)', rgb: '11, 124, 140' },
  { id: 'emerald', name: 'أخضر الغابة', primary: '#10b981', hover: '#059669', light: '#f0fdf4', glow: 'rgba(16, 185, 129, 0.2)', rgb: '16, 185, 129' },
  { id: 'violet', name: 'بنفسج عميق', primary: '#7c3aed', hover: '#6d28d9', light: '#f9f8ff', glow: 'rgba(124, 58, 237, 0.2)', rgb: '124, 58, 237' },
  { id: 'crimson', name: 'أحمر مـلكي', primary: '#991b1b', hover: '#7f1d1d', light: '#fff8f8', glow: 'rgba(153, 27, 27, 0.2)', rgb: '153, 27, 27' },
];

export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('abf_theme') || 'indigo';
    } catch {
      return 'indigo';
    }
  });

  useEffect(() => {
    const activeTheme = THEMES.find(t => t.id === theme) || THEMES[0];
    document.documentElement.style.setProperty('--app-primary', activeTheme.primary);
    document.documentElement.style.setProperty('--app-primary-hover', activeTheme.hover);
    document.documentElement.style.setProperty('--app-primary-light', activeTheme.light);
    document.documentElement.style.setProperty('--app-glow', activeTheme.glow);
    document.documentElement.style.setProperty('--app-primary-rgb', activeTheme.rgb || '79, 70, 229');
    
    // Also set specific theme variables that components might use
    document.documentElement.style.setProperty('--theme-primary', activeTheme.primary);
    document.documentElement.style.setProperty('--theme-primary-hover', activeTheme.hover);
    document.documentElement.style.setProperty('--theme-primary-light', activeTheme.light);
    document.documentElement.style.setProperty('--theme-glow', activeTheme.glow);
    document.documentElement.style.setProperty('--theme-primary-rgb', activeTheme.rgb || '79, 70, 229');

    localStorage.setItem('abf_theme', theme);
  }, [theme]);

  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'game' | 'admin' | 'stats' | 'recent'>('game');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Contestant live reactions states
  const [flyingReactions, setFlyingReactions] = useState<{ id: string; emoji: string; x: number; size: number; rotation: number }[]>([]);
  const [rollingComments, setRollingComments] = useState<{ id: string; comment: string; senderName?: string }[]>([]);
  const [showReactionsSelector, setShowReactionsSelector] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [isContestantView, setIsContestantView] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === 'interact' || params.get('view') === 'interact';
  });

  const [persistentSessionId, setPersistentSessionId] = useState<string | null>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlSession = params.get('session') || params.get('sessionId');
      if (urlSession) return urlSession;
      return localStorage.getItem('abf_session_id');
    } catch {
      return null;
    }
  });
  
  const [session, setSession] = useState<GameSession>(() => {
    try {
      const saved = localStorage.getItem('abf_game_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Basic validation of saved state
        if (parsed && Array.isArray(parsed.teams) && typeof parsed.status === 'string') {
          // Ensure every team has required fields
          const sanitizedTeams = parsed.teams.map((t: any) => ({
            id: t.id || `team${Math.random()}`,
            name: t.name || '',
            score: typeof t.score === 'number' ? t.score : 0,
            selectedCategories: Array.isArray(t.selectedCategories) ? t.selectedCategories : [],
            color: t.color || '#4f46e5'
          }));

          // Always start at welcome screen or use validated status
          const validStatuses = ['welcome', 'setup', 'selection', 'question', 'result'];
          const initialStatus = validStatuses.includes(parsed.status) ? parsed.status : 'welcome';
          
          return { 
            ...parsed, 
            status: initialStatus as GameState, 
            teams: sanitizedTeams,
            categories: Array.isArray(parsed.categories) ? parsed.categories : [],
            occupiedSlots: Array.isArray(parsed.occupiedSlots) ? parsed.occupiedSlots : []
          };
        }
      }
    } catch (e) {
      console.warn("Failed to load session from localStorage", e);
    }
    return {
      teams: [
        { id: 'team1', name: '', score: 0, selectedCategories: [], color: '#4f46e5' },
        { id: 'team2', name: '', score: 0, selectedCategories: [], color: '#10b981' },
      ],
      categories: [],
      currentTurn: 'team1',
      selectedCategoryId: null,
      selectedQuestionId: null,
      status: 'welcome',
      occupiedSlots: [],
    };
  });

  const [startTime, setStartTime] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('abf_start_time');
      return saved ? parseInt(saved) : null;
    } catch {
      return null;
    }
  });

  const [setupStep, setSetupStep] = useState(() => {
    try {
      const saved = localStorage.getItem('abf_setup_step');
      return saved ? parseInt(saved) : 0;
    } catch {
      return 0;
    }
  });
  const [groups, setGroups] = useState<DBGroup[]>([]);
  
  const selectionGroups = useMemo(() => {
    const existingGroupNames = groups.map(g => g.name);
    const catGroupNames = Array.from(new Set((session?.categories || []).map(c => c.group || 'عام')));
    const allNames = Array.from(new Set([...existingGroupNames, ...catGroupNames]));
    return allNames.sort((a, b) => {
      if (a === 'عام') return 1;
      if (b === 'عام') return -1;
      return a.localeCompare(b);
    }).map(name => ({
      id: groups.find(g => g.name === name)?.id || name,
      name
    }));
  }, [groups, session.categories]);

  const introPlayed = useRef(false);
  const introAudioRef = useRef<HTMLAudioElement | null>(null);
  const feedbackAudioRef = useRef<HTMLAudioElement | null>(null);
  const crowdAudioRef = useRef<HTMLAudioElement | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState<'connecting' | 'connected' | 'error'>('connecting');

  // Safety timeout for loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 4500); 
    return () => clearTimeout(timer);
  }, [loading]);
  const [error, setError] = useState<string | null>(null);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(60);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [tempTime, setTempTime] = useState('60');
  const [timerActive, setTimerActive] = useState(false);
  const [isBonusTime, setIsBonusTime] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [animatingTeamId, setAnimatingTeamId] = useState<string | null>(null);
  const [isFetchingImage, setIsFetchingImage] = useState(false);
  const [isGeneratingOptions, setIsGeneratingOptions] = useState(false);
  const [activeOptions, setActiveOptions] = useState<string[]>([]);
  const [isGeneratingHint, setIsGeneratingHint] = useState(false);
  const [usedHintQuestionIds, setUsedHintQuestionIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('abf_used_hints');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('abf_used_hints', JSON.stringify(usedHintQuestionIds));
    } catch (e) {
      console.error("Failed to save hint state to localStorage", e);
    }
  }, [usedHintQuestionIds]);

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null); // PWA install prompt state
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [gameDuration, setGameDuration] = useState(0);
  const [copied, setCopied] = useState(false);

  // Warn before leaving during active game
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (session?.status !== 'setup' && session?.status !== 'result') {
        const msg = "هل أنت متأكد من مغادرة المسابقة؟ سيتم فقدان التقدم غير المحفوظ.";
        e.returnValue = msg;
        return msg;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [session.status]);

  // Save state to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('abf_game_session', JSON.stringify(session));
      localStorage.setItem('abf_setup_step', setupStep.toString());
      if (startTime) localStorage.setItem('abf_start_time', startTime.toString());
      if (persistentSessionId) localStorage.setItem('abf_session_id', persistentSessionId);
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
  }, [session, setupStep, startTime, persistentSessionId]);

  // Game continuous timer
  useEffect(() => {
    setShowAnswer(false);
    setShowQrCode(false);
  }, [session.selectedQuestionId]);

  useEffect(() => {
    let interval: any;
    if (['selection', 'question'].includes(session?.status || '')) {
      interval = setInterval(() => {
        setGameDuration(Math.floor((Date.now() - (startTime || Date.now())) / 1000));
      }, 1000);
    } else if (session?.status === 'setup') {
      setGameDuration(0); // Reset timer on setup
    }
    return () => clearInterval(interval);
  }, [session.status, startTime]);

  // Listen to fullscreen changes at the browser level to keep React state in sync
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Auto-exit fullscreen when leaving question view
  useEffect(() => {
    if (session?.status !== 'question' && isFullscreen) {
      if (document.fullscreenElement || (document as any).webkitFullscreenElement || (document as any).mozFullScreenElement) {
        try {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if ((document as any).webkitExitFullscreen) {
            (document as any).webkitExitFullscreen();
          } else if ((document as any).mozCancelFullScreen) {
            (document as any).mozCancelFullScreen();
          }
        } catch (e) {
          console.warn("Could not exit fullscreen on leaving view:", e);
        }
      }
      setIsFullscreen(false);
    }
  }, [session?.status, isFullscreen]);

  const handleToggleFullscreen = async () => {
    playSound('click');
    try {
      const docEl = document.documentElement;
      if (!document.fullscreenElement && 
          !(document as any).webkitFullscreenElement && 
          !(document as any).mozFullScreenElement && 
          !(document as any).msFullscreenElement) {
        // Request fullscreen
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if ((docEl as any).webkitRequestFullscreen) {
          await (docEl as any).webkitRequestFullscreen();
        } else if ((docEl as any).mozRequestFullScreen) {
          await (docEl as any).mozRequestFullScreen();
        } else if ((docEl as any).msRequestFullscreen) {
          await (docEl as any).msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn("Fullscreen toggle failed:", err);
      // Fallback
      setIsFullscreen(!isFullscreen);
    }
  };

  // Stop feedback sound when answer feedback is closed
  useEffect(() => {
    if (answerFeedback === null && feedbackAudioRef.current) {
      feedbackAudioRef.current.pause();
      feedbackAudioRef.current.currentTime = 0;
      feedbackAudioRef.current = null;
    }
  }, [answerFeedback]);

  const [playedQuestionIds, setPlayedQuestionIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('abf_played_questions');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regProgress, setRegProgress] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);

  // Auto-generation of 10 new questions per category when round ends (result screen)
  useEffect(() => {
    let active = true;
    if (session?.status === 'result') {
      const runRegen = async () => {
        setIsRegenerating(true);
        setRegProgress("جاري التحضير لتوليد الأسئلة...");
        setRegError("");
        setRegSuccess(false);

        try {
          // Get all active categories
          const dbCats = await dataService.getCategories();
          const activeCats = dbCats.filter(cat => cat.isActive !== false);
          
          if (activeCats.length === 0) {
            setRegProgress("لا توجد أقسام نشطة لتوليد الأسئلة لها.");
            setIsRegenerating(false);
            return;
          }

          for (let i = 0; i < activeCats.length; i++) {
            const cat = activeCats[i];
            if (!active) return;
            setRegProgress(`جاري توليد 10 أسئلة ذكية جديدة لقسم "${cat.name}" (${i + 1}/${activeCats.length})... ✨`);
            
            // Regenerate
            await aiService.regenerateCategoryQuestions(
              cat.id, 
              cat.name, 
              cat.description || cat.sourceUrl || '', 
              cat.letterMode ? cat.letter : undefined
            );
          }
          
          if (active) {
            setRegProgress("تم تحديث الفئات بـ 10 أسئلة جديدة فريدة تماماً! جاهز للجولة التالية! 🎉");
            setRegSuccess(true);
            setIsRegenerating(false);
          }
        } catch (err: any) {
          console.error("Failed to automatically regenerate categories:", err);
          if (active) {
            setRegError(err.message || String(err));
            setIsRegenerating(false);
          }
        }
      };

      runRegen();
    }
    return () => {
      active = false;
    };
  }, [session?.status]);

  const [appSettings, setAppSettings] = useState<any>({});

  // Sync theme with app settings if available
  useEffect(() => {
    if (appSettings?.themeId && THEMES.some(t => t.id === appSettings.themeId)) {
      setTheme(appSettings.themeId);
    }
  }, [appSettings?.themeId]);

  // Persistence for played questions
  useEffect(() => {
    try {
      localStorage.setItem('abf_played_questions', JSON.stringify(playedQuestionIds));
    } catch (e) {
      console.error("Failed to save played questions", e);
    }
  }, [playedQuestionIds]);

  // Real-time settings sync
  useEffect(() => {
    const unsub = dataService.subscribeSettings((settings) => {
      setDbConnected('connected');
      if (settings) {
        setAppSettings(settings);
      }
    }, (err: any) => {
      console.warn("Settings sync notice:", err);
      setDbConnected('error');
    });
    return () => unsub();
  }, []);

  const [periodicSaveTick, setPeriodicSaveTick] = useState(0);

  // Periodic timer for saving session
  useEffect(() => {
    if (session?.status === 'setup' || session?.status === 'result') return;
    
    const interval = setInterval(() => {
      setPeriodicSaveTick(prev => prev + 1);
    }, 60000); // Save every minute while active

    return () => clearInterval(interval);
  }, [session?.status]);

  // Persistence Effect: Continuous and periodic session saving
  useEffect(() => {
    const syncSession = async () => {
      // Only track if at least names are entered
      if ((session?.status || 'setup') === 'setup' && (session?.teams || []).every(t => (t.name || '').trim() === '')) return;
      
      const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
      const isCompleted = (session?.status || 'setup') === 'result';
      
      let winnerId: string | undefined = undefined;
      if (isCompleted) {
        const sorted = [...(session?.teams || [])].sort((a,b) => b.score - a.score);
        if (sorted.length > 0) {
          const topScore = sorted[0].score;
          const winners = session.teams.filter(t => t.score === topScore);
          const isDraw = winners.length > 1;
          winnerId = isDraw ? 'draw' : winners[0].id;
        }
      }

      try {
        const result = await dataService.saveGameSession({
          creatorId: user?.uid,
          createdAt: isCompleted ? new Date() : (startTime ? new Date(startTime) : new Date()),
          teams: (session?.teams || []).map(t => ({ 
            name: t.name || 'فريق مجهول', 
            score: t.score, 
            color: t.color,
            selectedCategories: t.selectedCategories || []
          })),
          winnerId: winnerId,
          categories: allActiveCategories.map(c => c.name),
          duration: duration,
          isCompleted: isCompleted,
          currentTurn: session?.currentTurn,
          selectedCategoryId: session?.selectedCategoryId,
          selectedQuestionId: session?.selectedQuestionId,
          status: session?.status,
          occupiedSlots: session?.occupiedSlots
        }, persistentSessionId || undefined);

        if (result && !persistentSessionId) {
          setPersistentSessionId((result as any).id);
        }
      } catch (err) {
        console.error("Session sync failed:", err);
      }
    };

    // Sync on major state changes or periodic tick
    if (session?.status !== 'setup' || (session?.teams || []).some(t => (t.name || '').trim() !== '')) {
      const timer = setTimeout(syncSession, 2000); // Debounce to prevent too many writes
      return () => clearTimeout(timer);
    }
  }, [
    session?.status, 
    session?.currentTurn, 
    session?.occupiedSlots?.length, 
    session?.teams, 
    periodicSaveTick, 
    persistentSessionId,
    startTime,
    user?.uid
  ]);

  // Real-time active session sync (multi-device support)
  useEffect(() => {
    if (!persistentSessionId) return;
    
    const unsub = dataService.subscribeSession(persistentSessionId, (dbSession) => {
      if (!dbSession) return;
      
      setSession(prev => {
        const hasChanges = 
          (dbSession.status && dbSession.status !== prev.status) ||
          (dbSession.currentTurn && dbSession.currentTurn !== prev.currentTurn) ||
          dbSession.selectedCategoryId !== prev.selectedCategoryId ||
          dbSession.selectedQuestionId !== prev.selectedQuestionId ||
          (dbSession.occupiedSlots && JSON.stringify(dbSession.occupiedSlots) !== JSON.stringify(prev.occupiedSlots)) ||
          JSON.stringify((dbSession.teams || []).map(t => t.score)) !== JSON.stringify((prev?.teams || []).map(t => t.score));

        if (!hasChanges) return prev;

        const updatedTeams = (prev?.teams || []).map((t, idx) => {
          const remoteTeam = (dbSession.teams || [])[idx];
          if (!remoteTeam) return t;
          return {
            ...t,
            name: remoteTeam.name === 'فريق مجهول' ? t.name : remoteTeam.name,
            score: remoteTeam.score,
            color: remoteTeam.color || t.color,
            selectedCategories: remoteTeam.selectedCategories || t.selectedCategories
          };
        });

        if ((dbSession.teams || []).length > (prev?.teams || []).length) {
          for (let i = (prev?.teams || []).length; i < (dbSession.teams || []).length; i++) {
            const rt = (dbSession.teams || [])[i];
            updatedTeams.push({
              id: `team${i+1}`,
              name: rt.name,
              score: rt.score,
              color: rt.color || '#4f46e5',
              selectedCategories: rt.selectedCategories || []
            });
          }
        }

        return {
          ...prev,
          status: (dbSession.status as any) || prev.status,
          currentTurn: dbSession.currentTurn || prev.currentTurn,
          selectedCategoryId: dbSession.selectedCategoryId === undefined ? prev.selectedCategoryId : dbSession.selectedCategoryId,
          selectedQuestionId: dbSession.selectedQuestionId === undefined ? prev.selectedQuestionId : dbSession.selectedQuestionId,
          occupiedSlots: dbSession.occupiedSlots || prev.occupiedSlots,
          teams: updatedTeams
        };
      });
    }, (err: any) => {
      console.warn("Session sync notice:", err);
    });

    return unsub;
  }, [persistentSessionId]);

  // Real-time reactions subscriber for the main game screen
  useEffect(() => {
    if (!persistentSessionId || isContestantView) return;

    const unsub = dataService.subscribeReactions(persistentSessionId, (reaction) => {
      // If reaction has an emoji, play floating animation!
      if (reaction.emoji) {
        const reactId = reaction.id || String(Math.random()) + Date.now();
        setFlyingReactions(prev => [
          ...prev,
          {
            id: reactId,
            emoji: reaction.emoji,
            x: 10 + Math.random() * 80, // random horizontal % from 10 to 90
            size: 32 + Math.random() * 32, // random font size from 32px to 64px
            rotation: -35 + Math.random() * 70 // random rotation -35deg to 35deg
          }
        ]);
        
        // Auto-remove flying reaction after 3.5 seconds to clean DOM
        setTimeout(() => {
          setFlyingReactions(prev => prev.filter(r => r.id !== reactId));
        }, 3500);
      }

      // If reaction has a comment, add it to our scrolling comment roster
      if (reaction.comment) {
        const commentId = reaction.id || String(Math.random()) + Date.now();
        setRollingComments(prev => [
          ...prev,
          {
            id: commentId,
            comment: reaction.comment,
            senderName: reaction.senderName || 'متسابق 💬'
          }
        ]);

        // Auto-remove rolling comment after 7.5 seconds to clean DOM
        setTimeout(() => {
          setRollingComments(prev => prev.filter(c => c.id !== commentId));
        }, 7500);
      }
    }, (err) => {
      console.warn("Reactions listener notice:", err);
    });

    return unsub;
  }, [persistentSessionId, isContestantView]);

  // Start timer effect
  useEffect(() => {
    if ((session?.status || 'welcome') === 'selection' && !startTime) {
      setStartTime(Date.now());
    }
  }, [session?.status, startTime]);

  // Background Crowd Noise Effect
  useEffect(() => {
    const isQuestionStatus = (session?.status === 'question');
    const isEnabled = appSettings?.enableCrowdNoise === true;

    if (isQuestionStatus && isEnabled) {
      const defaultUrl = 'https://www.soundjay.com/human/sounds/crowd-cheering-2.mp3';
      const url = appSettings?.crowdNoiseUrl || defaultUrl;
      const volume = appSettings?.crowdNoiseVolume ?? 0.3;

      if (url) {
        try {
          if (crowdAudioRef.current) {
            crowdAudioRef.current.pause();
            crowdAudioRef.current = null;
          }
          const audio = new Audio(url);
          audio.loop = true;
          audio.volume = volume;
          crowdAudioRef.current = audio;
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => console.warn("Crowd audio playback failed:", error));
          }
         } catch (e) {
          console.warn("Crowd audio play error:", e);
        }
      }
    } else {
      if (crowdAudioRef.current) {
        crowdAudioRef.current.pause();
        crowdAudioRef.current = null;
      }
    }

    return () => {
      if (crowdAudioRef.current) {
        crowdAudioRef.current.pause();
      }
    };
  }, [session?.status, appSettings?.enableCrowdNoise, appSettings?.crowdNoiseVolume, appSettings?.crowdNoiseUrl]);

  // Sound Effect Helper
  const playSound = useCallback((type: 'correct' | 'wrong' | 'victory' | 'intro' | 'click') => {
    if (appSettings?.enableSounds === false) return;

    const defaultAudios = {
      correct: 'https://cdn.pixabay.com/audio/2021/08/04/audio_06d8a552c6.mp3',
      wrong: 'https://cdn.pixabay.com/audio/2022/03/24/audio_346b0266ed.mp3',
      victory: 'https://cdn.pixabay.com/audio/2021/08/04/audio_10499e4f51.mp3',
      intro: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c35f6e525a.mp3',
      click: 'https://cdn.pixabay.com/audio/2022/03/15/audio_24a2a16d8a.mp3'
    };
    
    let rawUrl = '';
    let volume = 0.4;

    if (type === 'correct') {
      rawUrl = appSettings?.correctSoundUrl;
      volume = appSettings?.correctSoundVolume ?? 0.4;
    } else if (type === 'victory') {
      rawUrl = appSettings?.victorySoundUrl;
      volume = appSettings?.victorySoundVolume ?? 0.5;
    } else if (type === 'wrong') {
      rawUrl = appSettings?.wrongSoundUrl;
      volume = appSettings?.wrongSoundVolume ?? 0.4;
    } else if (type === 'intro') {
      rawUrl = appSettings?.introSoundUrl;
      volume = appSettings?.introSoundVolume ?? 0.5;
    } else if (type === 'click') {
      rawUrl = appSettings?.clickSoundUrl;
      volume = appSettings?.clickSoundVolume ?? 0.15;
    }

    const url = (rawUrl && typeof rawUrl === 'string' && rawUrl.trim() !== '') 
      ? rawUrl 
      : (defaultAudios as any)[type];

    if (!url || typeof url !== 'string' || url.trim() === '') return;

    try {
      const audio = new Audio(url);
      audio.volume = volume;
      
      if (type === 'intro') {
        introAudioRef.current = audio;
      }
      
      if (type === 'correct' || type === 'wrong') {
        if (feedbackAudioRef.current) {
          feedbackAudioRef.current.pause();
          feedbackAudioRef.current.currentTime = 0;
        }
        feedbackAudioRef.current = audio;
      }

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => console.warn("Audio playback failed:", error));
      }
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }, [appSettings]);

  // Beep Sound Helper
  const playBeep = useCallback(() => {
    if (appSettings?.enableSounds === false) return;
    
    const volume = appSettings?.beepVolume ?? 0.1;
    const customUrl = appSettings?.beepSoundUrl;

    if (customUrl && typeof customUrl === 'string' && customUrl.trim() !== '') {
      try {
        const audio = new Audio(customUrl);
        audio.volume = volume;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => console.warn("Beep playback error:", e));
        }
        return;
      } catch (e) {
        console.warn("Custom beep sound failed, falling back to oscillator", e);
      }
    }

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(Math.max(0.001, volume * 0.2), audioCtx.currentTime + 0.1);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.warn("Audio context not supported or blocked", e);
    }
  }, [appSettings]);

  const handleSmartFetchImage = async () => {
    if (!selectedQuestion) return;
    try {
      setIsFetchingImage(true);
      const url = await imageService.fetchSmartImage(selectedQuestion.text, selectedQuestion.answer);
      if (url) {
        // Update both local state and store the URL temporarily for this session or update globally
        const updatedCategories = (session?.categories || []).map(cat => {
          if (cat.id === session.selectedCategoryId) {
            return {
              ...cat,
              questions: (cat.questions || []).map(q => 
                q.id === session.selectedQuestionId ? { ...q, imageUrl: url } : q
              )
            };
          }
          return cat;
        });
        
        setSession({ ...session, categories: updatedCategories });

        // Persist to database so it's not fetched again
        if (session.selectedCategoryId && session.selectedQuestionId) {
          await dataService.updateQuestion(session.selectedCategoryId, session.selectedQuestionId, {
            imageUrl: url
          });
        }
      }
    } catch (e: any) {
      console.error("Failed to fetch smart image:", e);
      if (e?.message?.includes('429') || e?.message?.includes('RESOURCE_EXHAUSTED')) {
        console.warn("Gemini API Quota Exceeded (429). Image auto-fetch is paused temporarily.");
      }
    } finally {
      setIsFetchingImage(false);
    }
  };

  const GENERAL_TRIVIA_DISTRACTORS = [
    "الهلال", "النصر", "الاتحاد", "الأهلي", "ريال مدريد", "برشلونة", "بايرن ميونخ", "ليفربول", "مانشستر سيتي", 
    "مكة المكرمة", "الرياض", "جدة", "المدينة المنورة", "القاهرة", "دبي", "المنامة", "الكويت", "مسقط", "عمان", 
    "أبوظبي", "المملكة العربية السعودية", "جمهورية مصر العربية", "دولة الإمارات العربية المتحدة", "مملكة البحرين", 
    "عام 2022", "عام 2020", "عام 1999", "عام 1998", "عام 2018", "عام 2015", "عام 2010", "عام 2005", "عام 1990",
    "كريستيانو رونالدو", "ليونيل ميسي", "محمد صلاح", "كريم بنزيما", "نيمار دا سيلفا", "كيليان مبابي",
    "كأس العالم", "دوري أبطال أوروبا", "الدوري السعودي للمحترفين", "كأس السوبر", "كأس خادم الحرمين الشريفين",
    "تويتر (X)", "سناب شات", "إنستغرام", "جوجل", "آبل", "مايكروسوفت", "سامسونج"
  ];

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
      { keys: ["ستاربكس", "starbucks"], en: "starbucks", domain: "starbucks.com" },
      { keys: ["إتش بي", "اتش بي", "hp", "hewlett"], en: "hp", domain: "hp.com" },
      { keys: ["ديل", "dell"], en: "dell", domain: "dell.com" },
      { keys: ["لينوفو", "lenovo"], en: "lenovo", domain: "lenovo.com" },
      { keys: ["سوني", "sony"], en: "sony", domain: "sony.com" },
      { keys: ["الشباب", "شباك", "shabab"], en: "al-shabab", domain: "alshabab-club.sa" },
      { keys: ["بايرن", "bayern"], en: "bayern-munich", domain: "fcbayern.com" },
      { keys: ["ليفربول", "liverpool"], en: "liverpool", domain: "liverpoolfc.com" },
      { keys: ["مانشستر سيتي", "manchester city"], en: "manchester-city", domain: "mancity.com" },
      { keys: ["باريس", "paris"], en: "psg", domain: "psg.fr" },
      { keys: ["stc", "إس تي سي", "اس تي سي", "مجموعة إس تي سي"], en: "stc", domain: "stc.com.sa" }
    ];

    for (const brand of BRANDS) {
      for (const key of brand.keys) {
        if (normQ.includes(normalizeText(key)) || normA.includes(normalizeText(key))) {
          return brand;
        }
      }
    }

    // Smart parenthesis-based English word extraction (e.g. "إتش بي (HP)")
    const parenthesisMatch = aText.match(/\(([a-zA-Z0-9\s.-]+)\)/);
    if (parenthesisMatch) {
      const match = parenthesisMatch[1].trim().toLowerCase();
      if (match.length >= 2 && isNaN(Number(match))) {
        return { en: match, domain: `${match.replace(/\s+/g, "")}.com` };
      }
    }

    // Smart English word extraction
    const englishWordMatch = aText.match(/[a-zA-Z][a-zA-Z0-9.-]{1,}/g);
    if (englishWordMatch) {
      const match = englishWordMatch[0].trim().toLowerCase();
      if (match.length >= 2) {
        return { en: match, domain: `${match.replace(/\s+/g, "")}.com` };
      }
    }

    const cleanAns = normA.replace(/[^\w]/g, "");
    if (cleanAns.length >= 2 && !normA.includes(" ") && isNaN(Number(cleanAns))) {
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
    
    console.warn(`Image failed to load: ${target.src} (attempt: ${currentTry})`);
    
    if (currentTry >= 3) {
      target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop';
      return;
    }
    
    target.setAttribute('data-try-count', (currentTry + 1).toString());
    
    const brand = getBrandInfo(qText, aText);
    
    if (currentTry === 0) {
      if (brand && brand.domain) {
        target.src = `/api/proxy-image?url=${encodeURIComponent(`https://logo.clearbit.com/${brand.domain}`)}`;
        return;
      }
    } 
    
    if (currentTry === 1) {
      if (brand && brand.en) {
        target.src = `/api/proxy-image?url=${encodeURIComponent(`https://img.icons8.com/color/256/${brand.en}.png`)}`;
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
      "الشباب": "https://upload.wikimedia.org/wikipedia/ar/thumb/7/7f/Al_Shabab_FC_Saudi_Logo.svg/1024px-Al_Shabab_FC_Saudi_Logo.svg.png",
      "al-shabab": "https://upload.wikimedia.org/wikipedia/ar/thumb/7/7f/Al_Shabab_FC_Saudi_Logo.svg/1024px-Al_Shabab_FC_Saudi_Logo.svg.png",
      "ريال مدريد": "https://upload.wikimedia.org/wikipedia/ar/thumb/c/c7/Logo_Real_Madrid.svg/1200px-Logo_Real_Madrid.svg.png",
      "real madrid": "https://upload.wikimedia.org/wikipedia/ar/thumb/c/c7/Logo_Real_Madrid.svg/1200px-Logo_Real_Madrid.svg.png",
      "برشلونة": "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28logo%29.svg/1024px-FC_Barcelona_%28logo%29.svg.png",
      "barcelona": "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28logo%29.svg/1024px-FC_Barcelona_%28logo%29.svg.png",
      "bayern": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/1024px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png",
      "بايرن": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/1024px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png",
      "liverpool": "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/1024px-Liverpool_FC.svg.png",
      "ليفربول": "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/1024px-Liverpool_FC.svg.png",
      "manchester city": "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1024px-Manchester_City_FC_badge.svg.png",
      "مانشستر سيتي": "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1024px-Manchester_City_FC_badge.svg.png",
      "manchester united": "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1024px-Manchester_United_FC_crest.svg.png",
      "مانشستر يونايتد": "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1024px-Manchester_United_FC_crest.svg.png",
      "juventus": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Juventus_FC_2017_icon_%28black%29.svg/1024px-Juventus_FC_2017_icon_%28black%29.svg.png",
      "يوفنتوس": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Juventus_FC_2017_icon_%28black%29.svg/1024px-Juventus_FC_2017_icon_%28black%29.svg.png",
      "arsenal": "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1024px-Arsenal_FC.svg.png",
      "آرسنال": "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1024px-Arsenal_FC.svg.png",
      "ارسنال": "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1024px-Arsenal_FC.svg.png",
      "chelsea": "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/1024px-Chelsea_FC.svg.png",
      "تشيلسي": "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/1024px-Chelsea_FC.svg.png",
      "تشلسي": "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/1024px-Chelsea_FC.svg.png",
      "paris": "https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Paris_Saint-Germain_F.C..svg/1024px-Paris_Saint-Germain_F.C..svg.png",
      "باريس": "https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Paris_Saint-Germain_F.C..svg/1024px-Paris_Saint-Germain_F.C..svg.png",
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
      "hp": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/1024px-HP_logo_2012.svg.png",
      "إتش بي": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/1024px-HP_logo_2012.svg.png",
      "اتش بي": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/1024px-HP_logo_2012.svg.png",
      "dell": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dell_Logo.svg/1024px-Dell_Logo.svg.png",
      "ديل": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dell_Logo.svg/1024px-Dell_Logo.svg.png",
      "lenovo": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Lenovo_Global_Logo_2015.svg/1024px-Lenovo_Global_Logo_2015.svg.png",
      "لينوفو": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Lenovo_Global_Logo_2015.svg/1024px-Lenovo_Global_Logo_2015.svg.png",
      "sony": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sony_logo.svg/1024px-Sony_logo.svg.png",
      "سوني": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sony_logo.svg/1024px-Sony_logo.svg.png",
      "nintendo": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Nintendo.svg/1024px-Nintendo.svg.png",
      "نينتندو": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Nintendo.svg/1024px-Nintendo.svg.png",
      "intel": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Intel_logo_%282020%2C_dark_blue%29.svg/1024px-Intel_logo_%282020%2C_dark_blue%29.svg.png",
      "إنتل": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Intel_logo_%282020%2C_dark_blue%29.svg/1024px-Intel_logo_%282020%2C_dark_blue%29.svg.png",
      "نايكي": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png",
      "nike": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png",
      "adidas": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1024px-Adidas_Logo.svg.png",
      "أديداس": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1024px-Adidas_Logo.svg.png",
      "puma": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Puma_Logo.svg/1024px-Puma_Logo.svg.png",
      "بوما": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Puma_Logo.svg/1024px-Puma_Logo.svg.png",
      "mercedes": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Benz_Logo_2010.svg/1024px-Mercedes-Benz_Logo_2010.svg.png",
      "مرسيدس": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Benz_Logo_2010.svg/1024px-Mercedes-Benz_Logo_2010.svg.png",
      "bmw": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1024px-BMW.svg.png",
      "بي ام دبليو": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1024px-BMW.svg.png",
      "بي إم دبليو": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1024px-BMW.svg.png",
      "audi": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Audi_Logo_2016.svg/1024px-Audi_Logo_2016.svg.png",
      "أودي": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Audi_Logo_2016.svg/1024px-Audi_Logo_2016.svg.png",
      "اودي": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Audi_Logo_2016.svg/1024px-Audi_Logo_2016.svg.png",
      "toyota": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toyota_car_logo.svg/1024px-Toyota_car_logo.svg.png",
      "تويوتا": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toyota_car_logo.svg/1024px-Toyota_car_logo.svg.png",
      "honda": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/1024px-Honda.svg.png",
      "هوندا": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/1024px-Honda.svg.png",
      "hyundai": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Hyundai_Motor_Company_logo.svg/1024px-Hyundai_Motor_Company_logo.svg.png",
      "هيونداي": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Hyundai_Motor_Company_logo.svg/1024px-Hyundai_Motor_Company_logo.svg.png",
      "lamborghini": "https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Lamborghini_Logo.svg/1024px-Lamborghini_Logo.svg.png",
      "لامبورغيني": "https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Lamborghini_Logo.svg/1024px-Lamborghini_Logo.svg.png",
      "ferrari": "https://upload.wikimedia.org/wikipedia/en/thumb/d/d1/Ferrari-Logo.svg/1024px-Ferrari-Logo.svg.png",
      "فيراري": "https://upload.wikimedia.org/wikipedia/en/thumb/d/d1/Ferrari-Logo.svg/1024px-Ferrari-Logo.svg.png",
      "twitter": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023_original.svg/1024px-X_logo_2023_original.svg.png",
      "تويتر": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023_original.svg/1024px-X_logo_2023_original.svg.png",
      "mcdonald": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/1200px-McDonald%27s_Golden_Arches.svg.png",
      "ماكدونالدز": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/1200px-McDonald%27s_Golden_Arches.svg.png",
      "samsung": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/1000px-Samsung_Logo.svg.png",
      "سامسونج": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/1000px-Samsung_Logo.svg.png",
      "wifi": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/WiFi_Logo.svg/1024px-WiFi_Logo.svg.png",
      "واي فاي": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/WiFi_Logo.svg/1024px-WiFi_Logo.svg.png",
      "وايفاي": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/WiFi_Logo.svg/1024px-WiFi_Logo.svg.png",
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
      "كوكاكولا": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Coca-Cola_bottle_cap_logo.svg/1024px-Coca-Cola_bottle_cap_logo.svg.png",
      "starbucks": "https://upload.wikimedia.org/wikipedia/sco/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1024px-Starbucks_Corporation_Logo_2011.svg.png",
      "ستاربكس": "https://upload.wikimedia.org/wikipedia/sco/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1024px-Starbucks_Corporation_Logo_2011.svg.png",
      "burger king": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Burger_King_2021.svg/1024px-Burger_King_2021.svg.png",
      "برجر كنج": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Burger_King_2021.svg/1024px-Burger_King_2021.svg.png",
      "برجر كينج": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Burger_King_2021.svg/1024px-Burger_King_2021.svg.png",
      "kfc": "https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/1024px-KFC_logo.svg.png",
      "كنتاكي": "https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/1024px-KFC_logo.svg.png",
      "stc": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/STC-01.svg/1024px-STC-01.svg.png",
      "إس تي سي": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/STC-01.svg/1024px-STC-01.svg.png",
      "اس تي سي": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/STC-01.svg/1024px-STC-01.svg.png",
      "مجموعة إس تي سي": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/STC-01.svg/1024px-STC-01.svg.png"
    };

    let finalUrl = url;
    const normQ = normalizeText(qText);
    const normA = normalizeText(aText);
    const sortedKeys = Object.keys(FAMOUS_KNOWN_LOGOS).sort((a, b) => b.length - a.length);
    let matched = false;

    for (const key of sortedKeys) {
      const normKey = normalizeText(key);
      if (normKey && (normQ.includes(normKey) || normA.includes(normKey))) {
        finalUrl = FAMOUS_KNOWN_LOGOS[key];
        matched = true;
        break;
      }
    }

    // Dynamic brand logo fallback if not matched statically, but it's a logo/brand related question
    if (!matched) {
      const isLogoRelated = 
        normQ.includes("شعار") || 
        normQ.includes("logo") || 
        normQ.includes("لوجو") || 
        normQ.includes("ماركه") || 
        normQ.includes("ماركة") || 
        normA.includes("شعار") ||
        (url && (url.includes("pollinations.ai") || url.includes("unsplash.com") || url.includes("abstract")));

      if (isLogoRelated) {
        const brand = getBrandInfo(qText, aText);
        if (brand) {
          if (brand.domain) {
            finalUrl = `https://logo.clearbit.com/${brand.domain}`;
            matched = true;
          } else if (brand.en) {
            finalUrl = `https://img.icons8.com/color/256/${brand.en}.png`;
            matched = true;
          }
        }
      }
    }

    if (finalUrl.startsWith("data:") || finalUrl.startsWith("blob:")) return finalUrl;
    
    // Route all HTTP/HTTPS external resources through our premium, local `/api/proxy-image` to bypass any CORS/hotlink constraints (like Wikimedia and Clearbit)
    if (finalUrl.startsWith("http://") || finalUrl.startsWith("https://")) {
      return `/api/proxy-image?url=${encodeURIComponent(finalUrl)}`;
    }
    
    return finalUrl;
  };

  const generateSmartFallbackOptions = (answer: string, otherAnswers: string[] = []): string[] => {
    const cleanAnswer = answer.trim();
    const candidates = Array.from(new Set(
      otherAnswers
        .map(a => a.trim())
        .filter(a => a && a !== cleanAnswer && !a.includes("خيار"))
    ));
    
    // Handle digit/year based questions intelligently
    const hasDigits = /\d+/.test(cleanAnswer);
    let distractors: string[] = [];
    
    if (hasDigits) {
      const yearMatch = cleanAnswer.match(/\d+/);
      if (yearMatch) {
        const baseYear = parseInt(yearMatch[0], 10);
        const isWordYear = cleanAnswer.includes("عام") || cleanAnswer.includes("سنة");
        const offset1 = Math.random() > 0.5 ? 4 : -4;
        const offset2 = Math.random() > 0.5 ? 2 : -2;
        const y1 = baseYear + offset1;
        const y2 = baseYear + offset2;
        distractors.push(isWordYear ? `عام ${y1}` : `${y1}`);
        distractors.push(isWordYear ? `عام ${y2}` : `${y2}`);
      }
    }
    
    // Load other answers from same category
    if (distractors.length < 2) {
      const shuffledCandidates = [...candidates].sort(() => 0.5 - Math.random());
      for (const cand of shuffledCandidates) {
        if (distractors.length >= 2) break;
        distractors.push(cand);
      }
    }
    
    // Fill with general distractors
    if (distractors.length < 2) {
      const generalFiltered = GENERAL_TRIVIA_DISTRACTORS.filter(x => x !== cleanAnswer);
      const shuffledGeneral = [...generalFiltered].sort(() => 0.5 - Math.random());
      for (const item of shuffledGeneral) {
        if (distractors.length >= 2) break;
        distractors.push(item);
      }
    }
    
    const finalOptions = [cleanAnswer, ...distractors.slice(0, 2)];
    return finalOptions.sort(() => 0.5 - Math.random());
  };

  const handleShowThreeOptions = async () => {
    if (!selectedQuestion) return;
    
    const currentCategory = session?.categories?.find(c => c.id === session.selectedCategoryId);
    const otherAnswersInCat = currentCategory
      ? (currentCategory.questions || [])
          .map(q => q.answer)
          .filter(ans => ans && ans.trim() !== selectedQuestion.answer.trim())
      : [];

    const dbOptions = selectedQuestion.options || [];
    const hasDuplicates = new Set(dbOptions).size !== dbOptions.length;
    const hasAnswer = dbOptions.some(opt => opt.trim() === selectedQuestion.answer.trim());
    const hasPlaceholder = dbOptions.some(opt => opt.includes('خيار'));

    // If we already have options in the DB and they aren't placeholder dummy ones and contain the correct answer
    if (
      dbOptions.length === 3 && 
      !hasDuplicates && 
      hasAnswer && 
      !hasPlaceholder
    ) {
      setActiveOptions(dbOptions);
      return;
    }

    // Otherwise, let's generate/heal them!
    try {
      setIsGeneratingOptions(true);
      
      let options: string[] = [];

      if (dbOptions.length > 0 && (hasDuplicates || !hasAnswer || hasPlaceholder || dbOptions.length !== 3)) {
        // Real-time heal of existing DB options if they are corrupted, duplicate or incomplete
        console.log("Healing corrupted database options...");
        options = validateAndFixOptions(dbOptions, selectedQuestion.answer, otherAnswersInCat);
      } else {
        // Standard generation path
        try {
          options = await aiService.generateOptions(selectedQuestion.text, selectedQuestion.answer, otherAnswersInCat);
        } catch (e) {
          console.warn("AI generation failed, fallback to smart options:", e);
        }

        // Fallback if AI options failed or contains placeholder "خيار"
        if (!options || options.length < 3 || options.some(opt => opt.includes('خيار'))) {
          options = generateSmartFallbackOptions(selectedQuestion.answer, otherAnswersInCat);
        }
      }

      setActiveOptions(options);

      // Persist the repaired/generated options back to DB to permanently heal it
      if (session.selectedCategoryId && session.selectedQuestionId) {
        await dataService.updateQuestion(session.selectedCategoryId, session.selectedQuestionId, {
          options: options
        });
        
        // Also update local session to avoid re-generating
        const updatedCategories = (session?.categories || []).map(cat => {
          if (cat.id === session.selectedCategoryId) {
            return {
              ...cat,
              questions: (cat.questions || []).map(q => 
                q.id === session.selectedQuestionId ? { ...q, options: options } : q
              )
            };
          }
          return cat;
        });
        setSession({ ...session, categories: updatedCategories });
      }
    } catch (e) {
      console.error("Failed to showcase options:", e);
    } finally {
      setIsGeneratingOptions(false);
    }
  };

  const handleRequestSmartHint = async () => {
    if (!selectedQuestion) return;
    playSound('click');

    // If hint is already fetched/cached under the question, just activate it
    if (selectedQuestion.hint) {
      if (!usedHintQuestionIds.includes(selectedQuestion.id)) {
        setUsedHintQuestionIds(prev => [...prev, selectedQuestion.id]);
      }
      return;
    }

    try {
      setIsGeneratingHint(true);
      const hintText = await aiService.generateHint(selectedQuestion.text, selectedQuestion.answer);

      // Save hint locally into categories array inside session state
      const updatedCategories = (session?.categories || []).map(cat => {
        if (cat.id === session.selectedCategoryId) {
          return {
            ...cat,
            questions: (cat.questions || []).map(q => 
              q.id === session.selectedQuestionId ? { ...q, hint: hintText } : q
            )
          };
        }
        return cat;
      });

      setSession({ ...session, categories: updatedCategories });

      if (!usedHintQuestionIds.includes(selectedQuestion.id)) {
        setUsedHintQuestionIds(prev => [...prev, selectedQuestion.id]);
      }

      // Persist generated hint into standard firestore if active
      if (session.selectedCategoryId && session.selectedQuestionId) {
        await dataService.updateQuestion(session.selectedCategoryId, session.selectedQuestionId, {
          hint: hintText
        });
      }
    } catch (e) {
      console.error("Failed to request AI hint:", e);
    } finally {
      setIsGeneratingHint(false);
    }
  };

  // Auto-fetch visuals when question is selected if images are enabled for that category
  useEffect(() => {
    const activeCat = (session?.categories || []).find(c => c.id === session.selectedCategoryId);
    const q = activeCat?.questions?.find(q => q.id === session.selectedQuestionId);
    
    if (session.status === 'question' && session.selectedQuestionId && activeCat?.imagesEnabled && !q?.imageUrl && !isFetchingImage) {
      handleSmartFetchImage();
    }
  }, [session.status, session.selectedQuestionId, session.selectedCategoryId, isFetchingImage, session.categories]);

  useEffect(() => {
    let interval: any;
    if (timerActive && timeLeft >= 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const next = prev - 1;
          if (next <= 10 && next > 0) {
            playBeep();
          }
          if (next === 0) {
            playBeep(); // Final beep
            setTimerActive(false);
            playSound('wrong');
          }
          return Math.max(0, next);
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, playBeep, playSound]);

  // Auth observer
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAdmin(u?.email === 'alahsaey@gmail.com');
    });
  }, []);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    
    setIsLoggingIn(true);
    setLoginError(null);
    
    try {
      await signInWithGoogle();
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        console.log("Login popup closed or cancelled by user.");
        return;
      }
      console.error("Login failed:", err);
      if (err.code === 'auth/popup-blocked') {
        setLoginError("تم حظر النافذة المنبثقة. يرجى تفعيل النوافذ المنبثقة في متصفحك للمتابعة.");
      } else {
        setLoginError("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleShare = async () => {
    playSound('click');
    const shareData = {
      title: competitionName,
      text: competitionSlogan,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        // Show a simple notification state if needed, but for now just copy
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  // PWA Install Logic
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBtn(false);
    }
  };

  // Ensure "Sports" category exists for admin - optimized to run less frequently
  const hasCheckedSports = useRef(false);
  useEffect(() => {
    const ensureSports = async () => {
      if (!isAdmin || hasCheckedSports.current) return;
      try {
        hasCheckedSports.current = true;
        const dbCats = await dataService.getCategories();
        const sportsCatName = 'رياضة وشعارات';
        const sportsCat = dbCats.find(c => c.name === sportsCatName || c.name === 'Sports');
        
        if (!sportsCat) {
          await dataService.addCategory({
            name: sportsCatName,
            group: 'عام',
            imageUrl: 'https://img.icons8.com/plasticine/256/trophy.png',
            imagesEnabled: true,
            videoEnabled: true,
            isActive: true
          });
        }
      } catch (e: any) {
        if (!e.message?.includes('Quota')) {
          console.error("Auto-add/update Sports category skipped due to error", e);
        }
      }
    };
    ensureSports();
  }, [isAdmin]);

  // Load settings globally in real-time
  useEffect(() => {
    const unsub = dataService.subscribeSettings((settings) => {
      setDbConnected('connected');
      if (settings) {
        setAppSettings(settings);
        if (settings.competitionName) document.title = settings.competitionName;
      }
    }, (err: any) => {
      console.warn("Global settings sync notice:", err);
      setDbConnected('error');
    });
    return () => unsub();
  }, []);

  // Load groups in real-time
  useEffect(() => {
    const unsub = dataService.subscribeGroups((dbGroups) => {
      setGroups(dbGroups);
    }, (err: any) => {
      console.warn("Groups sync notice:", err);
    });
    return () => unsub();
  }, []);

  // Handle Intro Sound: Play only once on start screen, stop on exit
  const questionUnsubs = useRef<Record<string, () => void>>({});
  
  useEffect(() => {
    // Only play if on start screen (welcome status or setupStep 0) and in game view, and haven't played EVER in this state
    const isWelcome = session?.status === 'welcome' || setupStep === 0;
    if (isWelcome && view === 'game' && !introPlayed.current && appSettings) {
      playSound('intro');
      introPlayed.current = true;
    } 
    
    // Stop sound if moving away from start screen OR switching views (admin/stats)
    if (!isWelcome && setupStep > 0 && introAudioRef.current) {
      introAudioRef.current.pause();
      introAudioRef.current.currentTime = 0;
      introAudioRef.current = null;
    }
  }, [setupStep, view, appSettings, session?.status]);

  // Load categories and their questions in real-time
  useEffect(() => {
    let isMounted = true;
    
    const unsubCats = dataService.subscribeCategories((dbCats) => {
      setDbConnected('connected');
      if (!isMounted) return;
      
      // Filter out inactive categories
      const activeCats = dbCats.filter(cat => cat.isActive !== false);
      
      // Update categories metadata in session
      setSession(prev => {
        if (!prev) return prev;
        const updatedCategories = activeCats.map(cat => {
          const existingCat = (prev.categories || []).find(c => c.id === cat.id);
          return {
            ...cat,
            questions: existingCat ? (existingCat.questions || []) : []
          } as Category;
        });
        
        return { ...prev, categories: updatedCategories };
      });

      // Manage question subscriptions for each category
      activeCats.forEach(cat => {
        if (cat.id && !questionUnsubs.current[cat.id]) {
          questionUnsubs.current[cat.id] = dataService.subscribeQuestions(cat.id, (questions) => {
            if (!isMounted) return;
            
            setSession(prev => {
              if (!prev || !prev.categories) return prev;
              const updatedCategories = prev.categories.map(c => {
                if (c.id === cat.id) {
                  const mappedQuestions = (questions || []).map(q => {
                    const isPlayedBefore = (Array.isArray(playedQuestionIds) ? playedQuestionIds : []).includes(q.id);
                    // Check if it was answered in current session state
                    const existingQ = (c.questions || []).find(sq => sq.id === q.id);
                    const wasAnsweredInSession = existingQ ? existingQ.isAnswered : false;
                    
                    return { 
                      ...q, 
                      isAnswered: isPlayedBefore || wasAnsweredInSession || false 
                    } as Question;
                  });
                  return { ...c, questions: mappedQuestions };
                }
                return c;
              });
              return { ...prev, categories: updatedCategories };
            });

          }, (err: any) => {
            console.warn(`Questions sync notice for ${cat.id}:`, err);
          });
        }
      });

      // Cleanup subscriptions for deleted categories
      const catIds = new Set(dbCats.map(c => c.id));
      Object.keys(questionUnsubs.current).forEach(id => {
        if (!catIds.has(id)) {
          questionUnsubs.current[id]();
          delete questionUnsubs.current[id];
        }
      });

      setLoading(false);
    }, (err: any) => {
      console.error("Categories subscription failed:", err);
      setDbConnected('error');
      if (err.message?.includes('Quota')) {
        setError('تنبيه: تم تجاوز حصة قراءة البيانات اليومية المجانية في Firebase. قد لا تظهر بعض البيانات حتى يتم إعادة ضبط الحصة غداً.');
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      unsubCats();
      Object.keys(questionUnsubs.current).forEach(id => {
        const unsub = questionUnsubs.current[id];
        if (typeof unsub === 'function') unsub();
      });
      questionUnsubs.current = {};
    };
  }, [playedQuestionIds]);

  const teamNames = useMemo(() => (session?.teams || []).map(t => (t.name || '').trim()), [session?.teams]);
  const hasEmptyName = useMemo(() => teamNames.some(name => name === ''), [teamNames]);
  const hasDuplicateNames = useMemo(() => {
    const filledNames = teamNames.filter(name => name !== '');
    return new Set(filledNames.map(n => n.toLowerCase())).size !== filledNames.length;
  }, [teamNames]);
  const isNamesReady = !hasEmptyName && !hasDuplicateNames;

  const steps = useMemo(() => [
    { id: 1, name: 'أسماء الفرق', icon: Users },
    ...(session?.teams || []).map((team, idx) => ({
      id: idx + 2,
      name: `${team.name || 'فريق ' + (idx + 1)}`,
      icon: Target
    }))
  ], [session?.teams]);

  const logoSource = appSettings?.logoUrl || "https://img.icons8.com/color/512/quiz.png";
  const competitionName = appSettings?.competitionName || 'مسابقة أبو الفواطم';
  const competitionSlogan = appSettings?.competitionSlogan || 'تطبيق مسابقات تفاعلي';

  const handleResetSession = (e?: MouseEvent) => {
    e?.stopPropagation();
    if (!window.confirm('هل أنت متأكد من إعادة ضبط المسابقة بالكامل؟ سيتم حذف جميع البيانات الحالية.')) return;
    
    setSession(prev => ({
      ...prev,
      teams: [
        { id: 'team1', name: '', score: 0, selectedCategories: [], color: '#4f46e5' },
        { id: 'team2', name: '', score: 0, selectedCategories: [], color: '#10b981' },
      ],
      currentTurn: 'team1',
      selectedCategoryId: null,
      selectedQuestionId: null,
      status: 'welcome',
      occupiedSlots: [],
    }));
    setSetupStep(0);
    setStartTime(null);
    setUsedHintQuestionIds([]);
    localStorage.removeItem('abf_game_session');
    localStorage.removeItem('abf_setup_step');
    localStorage.removeItem('abf_start_time');
    localStorage.removeItem('abf_session_id');
    localStorage.removeItem('abf_used_hints');
    setPersistentSessionId(null);
    playSound('click');
  };

  const handleStartSetup = () => {
    setSession(prev => ({ ...prev, status: 'setup' }));
    setSetupStep(1);
    localStorage.setItem('abf_setup_step', '1');
  };

  // Sync favicon and PWA icons with logo if possible
  useEffect(() => {
    if (logoSource) {
      // 1. Update Favicon
      const iconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement || document.createElement('link');
      iconLink.type = 'image/x-icon';
      iconLink.rel = 'icon';
      iconLink.href = logoSource;
      if (!document.querySelector("link[rel~='icon']")) document.head.appendChild(iconLink);

      // 2. Update Apple Touch Icon
      const appleLink = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement || document.createElement('link');
      appleLink.rel = 'apple-touch-icon';
      appleLink.href = logoSource;
      if (!document.querySelector("link[rel='apple-touch-icon']")) document.head.appendChild(appleLink);
      
      // 3. Dynamic Manifest (for PWA installation icon)
      const manifest = {
        "name": appSettings?.competitionName || "مسابقة أبوالفواطم",
        "short_name": "أبوالفواطم",
        "description": appSettings?.competitionSlogan || "تطبيق مسابقات تفاعلي متعدد اللاعبين",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#4f46e5",
        "icons": [
          {
            "src": logoSource,
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": logoSource,
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
          }
        ]
      };
      
      const stringManifest = JSON.stringify(manifest);
      const blob = new Blob([stringManifest], {type: 'application/json'});
      const manifestURL = URL.createObjectURL(blob);
      
      const manifestTag = document.querySelector("link[rel='manifest']") as HTMLLinkElement;
      if (manifestTag) {
        manifestTag.href = manifestURL;
      }
    }
  }, [logoSource, appSettings?.competitionName, appSettings?.competitionSlogan]);

  const handleSetTeamName = (index: number, name: string) => {
    const newTeams = [...session.teams];
    newTeams[index].name = name;
    setSession({ ...session, teams: newTeams });
  };

  const handleSetTeamColor = (index: number, color: string) => {
    const newTeams = [...session.teams];
    newTeams[index].color = color;
    setSession({ ...session, teams: newTeams });
  };

  const handleAddTeam = () => {
    if (session.teams.length >= 5) return;
    const colors = teamColorOptions;
    const usedColors = (session?.teams || []).map(t => t.color);
    const nextColor = colors.find(c => !usedColors.includes(c)) || colors[0];
    
    setSession({
      ...session,
      teams: [
        ...session.teams,
        { id: `team${session.teams.length + 1}`, name: '', score: 0, selectedCategories: [], color: nextColor }
      ]
    });
  };

  const handleRemoveTeam = (index: number) => {
    if (session.teams.length <= 1) return;
    const newTeams = session.teams.filter((_, i) => i !== index);
    setSession({ ...session, teams: newTeams });
  };

  const teamColorOptions = [
    { name: 'Indigo', hex: '#4f46e5' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Rose', hex: '#f43f5e' },
    { name: 'Amber', hex: '#f59e0b' },
    { name: 'Sky', hex: '#0ea5e9' },
    { name: 'Violet', hex: '#8b5cf6' },
    { name: 'Fuchsia', hex: '#d946ef' },
    { name: 'Orange', hex: '#f97316' },
    { name: 'Lime', hex: '#84cc16' },
    { name: 'Cyan', hex: '#06b6d4' },
  ];

  const toggleCategorySelection = (categoryId: string) => {
    if (setupStep < 2) return; 
    const currentTeamIndex = setupStep - 2;
    if (currentTeamIndex >= session.teams.length) return;

    const team = session.teams[currentTeamIndex];
    
    let newSelected = [...team.selectedCategories];
    if (newSelected.includes(categoryId)) {
      newSelected = newSelected.filter(id => id !== categoryId);
    } else if (newSelected.length < 3) {
      newSelected.push(categoryId);
    }

    const newTeams = [...session.teams];
    newTeams[currentTeamIndex].selectedCategories = newSelected;
    setSession({ ...session, teams: newTeams });
  };

  const proceedSetup = () => {
    if (setupStep <= 1) {
      if (isNamesReady) {
        setSetupStep(2);
      }
    } else {
      const currentTeamIndex = setupStep - 2;
      if (currentTeamIndex >= 0 && currentTeamIndex < session.teams.length) {
        if (session.teams[currentTeamIndex].selectedCategories.length === 3) {
          if (setupStep < session.teams.length + 1) {
            setSetupStep(setupStep + 1);
          } else {
            setSession({ ...session, status: 'selection' });
          }
        }
      }
    }
  };

  const teamSelectedCategories = useMemo(() => 
    (session?.teams || []).map(t => t.selectedCategories || []).flat().join(','),
    [session?.teams]
  );

  const allActiveCategories = useMemo(() => {
    if (session.status === 'selection' || session.status === 'question') {
      const selectedIds = new Set(session.teams.flatMap(t => Array.isArray(t.selectedCategories) ? t.selectedCategories : []));
      if (selectedIds.size > 0) {
        return session.categories.filter(c => selectedIds.has(c.id));
      }
    }
    return session.categories;
  }, [session.categories, session.status, teamSelectedCategories]);

  const currentTeam = useMemo(() => {
    if (!session?.teams || session.teams.length === 0) return null;
    return session.teams.find(t => t.id === session.currentTurn) || session.teams[0];
  }, [session?.teams, session?.currentTurn]);

  const selectedCategory = useMemo(() => 
    session.categories.find(c => c.id === session.selectedCategoryId),
    [session.categories, session.selectedCategoryId]
  );

  const selectedQuestion = useMemo(() => {
    const q = selectedCategory?.questions.find(q => q.id === session.selectedQuestionId);
    if (!q) return null;
    
    // The section (category) level settings are now absolute master. If disabled on category, it's disabled for all questions in it.
    return {
      ...q,
      imagesEnabled: !!selectedCategory?.imagesEnabled,
      letterMode: !!selectedCategory?.letterMode,
      qrEnabled: !!selectedCategory?.qrEnabled,
      videoEnabled: !!selectedCategory?.videoEnabled,
      mapMode: !!selectedCategory?.mapMode,
      letter: (selectedCategory?.letter && selectedCategory.letter !== 'الكل') ? selectedCategory.letter : (q.letter || 'أ'),
      options: q.options || []
    } as Question;
  }, [selectedCategory, session.selectedQuestionId]);

  const handleSelectQuestion = (categoryId: string, questionId: string) => {
    const category = session.categories.find(c => c.id === categoryId);
    const question = category?.questions.find(q => q.id === questionId);
    
    if (question && !question.isAnswered) {
      // Mark as played immediately so it doesn't repeat if they back out
      setPlayedQuestionIds(prev => Array.from(new Set([...prev, questionId])));
      
      setShowAnswer(false);
      setActiveOptions([]);
      const duration = category?.timerDuration || appSettings?.timerDuration || 60;
      setTimeLeft(duration);
      setTimerActive(true);
      setIsBonusTime(false);
      setSession({
        ...session,
        selectedCategoryId: categoryId,
        selectedQuestionId: questionId,
        status: 'question'
      });
    }
  };

  const handlePassToOpponent = () => {
    const currentTeamIdx = (session?.teams || []).findIndex(t => t.id === session.currentTurn);
    const nextTeamIdx = (currentTeamIdx + 1) % (session?.teams?.length || 1);
    const nextTurn = (session?.teams || [])[nextTeamIdx]?.id || (session?.teams || [])[0]?.id;

    setSession({
      ...session,
      currentTurn: nextTurn as any
    });

    setTimeLeft(30);
    setTimerActive(true);
    setIsBonusTime(true);
    setShowAnswer(false);
  };

  const handleResetTimer = () => {
    const duration = selectedCategory?.timerDuration || appSettings?.timerDuration || 60;
    setTimeLeft(isBonusTime ? Math.ceil(duration / 2) : duration);
    setTimerActive(true);
  };

  const handleSkipQuestion = () => {
    const { selectedCategoryId, selectedQuestionId, currentTurn } = session;
    if (!selectedCategoryId || !selectedQuestionId) return;

    const newCategories = session.categories.map(cat => {
      if (cat.id === selectedCategoryId) {
        return {
          ...cat,
          questions: cat.questions.map(q => {
            if (q.id === selectedQuestionId) {
              return { ...q, isAnswered: true };
            }
            return q;
          })
        };
      }
      return cat;
    });

    const currentTeamIdx = session.teams.findIndex(t => t.id === currentTurn);
    const nextTeamIdx = (currentTeamIdx + 1) % session.teams.length;
    const nextTurn = session.teams[nextTeamIdx].id;

    const category = session.categories.find(cat => cat.id === selectedCategoryId);
    const question = category?.questions.find(q => q.id === selectedQuestionId);
    const questionPoints = question?.points || 0;
    const newOccupiedSlots = Array.from(new Set([...session.occupiedSlots, `${selectedCategoryId}-${questionPoints}`]));

    setPlayedQuestionIds(prev => Array.from(new Set([...prev, selectedQuestionId])));

    const selectedCatIds = new Set(session.teams.flatMap(t => t.selectedCategories));
    const hasMoreQuestions = newCategories.filter(c => selectedCatIds.has(c.id)).some(cat => {
      const pointValues = Array.from(new Set(cat.questions.map(q => q.points)));
      return pointValues.some(pts => {
        const isSlotOccupied = newOccupiedSlots.includes(`${cat.id}-${pts}`);
        const hasUnanswered = cat.questions.some(q => q.points === pts && !q.isAnswered);
        return !isSlotOccupied && hasUnanswered;
      });
    });

    // Persist to played questions list as well
    setPlayedQuestionIds(prev => Array.from(new Set([...prev, selectedQuestionId])));

    setSession({
      ...session,
      categories: newCategories,
      currentTurn: nextTurn as any,
      selectedCategoryId: null,
      selectedQuestionId: null,
      status: hasMoreQuestions ? 'selection' : 'result',
      occupiedSlots: newOccupiedSlots
    });

    setTimerActive(false);
    setIsBonusTime(false);
    setShowAnswer(false);
  };


  const handleAnswer = (winningTeamId: string | 'none', isDeduction: boolean = false) => {
    const { selectedCategoryId, selectedQuestionId, currentTurn } = session;
    if (!selectedCategoryId || !selectedQuestionId) return;

    if (winningTeamId !== 'none') {
      playSound('correct');
      setAnswerFeedback('correct');
      setAnimatingTeamId(winningTeamId);
      setTimeout(() => setAnimatingTeamId(null), 2500);
    } else {
      playSound('wrong');
      setAnswerFeedback('wrong');
      setAnimatingTeamId(currentTurn);
      setTimeout(() => setAnimatingTeamId(null), 2500);
    }

    setTimeout(() => setAnswerFeedback(null), 3500);

    setShowAnswer(false);
    setTimerActive(false);
    setActiveOptions([]);
    const newCategories = (session?.categories || []).map(cat => {
      if (cat.id === selectedCategoryId) {
        return {
          ...cat,
          questions: (cat.questions || []).map(q => {
            if (q.id === selectedQuestionId) {
              return { ...q, isAnswered: true };
            }
            return q;
          })
        };
      }
      return cat;
    });

    const category = (session?.categories || []).find(cat => cat.id === selectedCategoryId);
    const question = (category?.questions || []).find(q => q.id === selectedQuestionId);
    const questionPoints = question?.points || 0;

    // Always mark as played when answered, regardless of outcome
    setPlayedQuestionIds(prev => Array.from(new Set([...prev, selectedQuestionId])));

    const isHintUsed = usedHintQuestionIds.includes(selectedQuestionId);
    const earnedPoints = isHintUsed ? Math.round(questionPoints * 0.75) : questionPoints;

    const newTeams = (session?.teams || []).map(team => {
      if (isDeduction) {
        // If it's a deduction, subtract from opponents (based on button label)
        if (team.id !== currentTurn) {
          return { ...team, score: Math.max(0, team.score - (questionPoints || 0)) };
        }
      } else if (team.id === winningTeamId) {
        // If it's a correct answer, add to the winning team
        return { ...team, score: team.score + (earnedPoints || 0) };
      }
      return team;
    });

    const activeCatIds = new Set((session?.teams || []).flatMap(t => t.selectedCategories || []));
    const playedKey = `${selectedCategoryId}-${questionPoints}`;
    const newOccupiedSlots = Array.from(new Set([...(session?.occupiedSlots || []), playedKey]));

    const hasMoreQuestions = newCategories.filter(c => activeCatIds.has(c.id)).some(cat => {
      const pointValues = Array.from(new Set((cat.questions || []).map(q => q.points)));
      return pointValues.some(pts => {
        const isSlotOccupied = newOccupiedSlots.includes(`${cat.id}-${pts}`);
        const hasUnanswered = (cat.questions || []).some(q => q.points === pts && !q.isAnswered);
        return !isSlotOccupied && hasUnanswered;
      });
    });

    const currentTeamIdx = (session?.teams || []).findIndex(t => t.id === (currentTurn || ''));
    const nextTeamIdx = (currentTeamIdx + 1) % (session?.teams?.length || 1);
    const nextTurn = (session?.teams || [])[nextTeamIdx]?.id || (session?.teams || [])[0]?.id;

    setSession({
      ...session,
      teams: newTeams as Team[],
      categories: newCategories,
      currentTurn: nextTurn as any,
      selectedCategoryId: null,
      selectedQuestionId: null,
      status: hasMoreQuestions ? 'selection' : 'result',
      occupiedSlots: newOccupiedSlots
    });
  };

  const handleNextQuestion = () => {
    if (!selectedCategory || !selectedQuestion) return;
    const pool = selectedCategory.questions.filter(q => q.points === selectedQuestion.points && !q.isAnswered);
    if (pool.length <= 1) return;
    const currentIndex = pool.findIndex(q => q.id === selectedQuestion.id);
    const nextIndex = (currentIndex + 1) % pool.length;
    setSession({ ...session, selectedQuestionId: pool[nextIndex].id });
  };

  const handlePrevQuestion = () => {
    if (!selectedCategory || !selectedQuestion) return;
    const pool = selectedCategory.questions.filter(q => q.points === selectedQuestion.points && !q.isAnswered);
    if (pool.length <= 1) return;
    const currentIndex = pool.findIndex(q => q.id === selectedQuestion.id);
    const prevIndex = (currentIndex - 1 + pool.length) % pool.length;
    setSession({ ...session, selectedQuestionId: pool[prevIndex].id });
  };

  const handleSwapQuestion = () => {
    if (!selectedCategory || !selectedQuestion) return;
    const pool = selectedCategory.questions.filter(q => q.points === selectedQuestion.points && !q.isAnswered && q.id !== selectedQuestion.id);
    
    if (pool.length === 0) {
      alert("لا توجد أسئلة أخرى متاحة في هذا القسم حالياً.");
      return;
    }

    const randomQuestion = pool[Math.floor(Math.random() * pool.length)];
    setSession({
      ...session,
      selectedQuestionId: randomQuestion.id
    });
  };

  // Logic for game end
  useEffect(() => {
    if (session.status === 'result') {
      
      // Trigger Confetti
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      playSound('victory');

      return () => clearInterval(interval);
    }
  }, [session.status]);

  const resetGame = () => {
    try {
      localStorage.removeItem('abf_game_session');
      localStorage.removeItem('abf_setup_step');
      localStorage.removeItem('abf_start_time');
      localStorage.removeItem('abf_session_id');
      localStorage.removeItem('abf_used_hints');
      // We DO NOT remove abf_played_questions here because caller wants to avoid repetition in SAME browser
    } catch (e) {}

    setSession(prev => ({
      ...prev,
      teams: prev.teams.map(t => ({ ...t, name: '', score: 0, selectedCategories: [] })),
      categories: prev.categories.map(cat => ({
        ...cat,
        questions: shuffleArray(cat.questions.map(q => {
          const isPlayed = playedQuestionIds.includes(q.id);
          return { ...q, isAnswered: isPlayed };
        }))
      })),
      currentTurn: 'team1',
      selectedCategoryId: null,
      selectedQuestionId: null,
      status: 'welcome',
      occupiedSlots: [],
    }));
    setSetupStep(0);
    setGameDuration(0);
    setStartTime(null);
    setUsedHintQuestionIds([]);
    setPersistentSessionId(null);
    introPlayed.current = false; // Allow sound to play again on return to welcome
  };

  const ContestantView = () => {
    const [senderName, setSenderName] = useState(() => {
      try {
        return localStorage.getItem('abf_contestant_name') || '';
      } catch {
        return '';
      }
    });
    
    const [selectedTeam, setSelectedTeam] = useState(() => {
      try {
        return localStorage.getItem('abf_contestant_team') || 'viewer';
      } catch {
        return 'viewer';
      }
    });

    const [customComment, setCustomComment] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [sentStatus, setSentStatus] = useState<string | null>(null);

    // Persist local custom configurations
    useEffect(() => {
      try {
        localStorage.setItem('abf_contestant_name', senderName);
        localStorage.setItem('abf_contestant_team', selectedTeam);
      } catch (e) {
        console.warn(e);
      }
    }, [senderName, selectedTeam]);

    const emojisList = ['🎉', '🔥', '👏', '😂', '🤯', '😎', '💖', '😢', '😍', '👍', '🏆', '⭐'];

    const quickComments = [
      "مبدعين جداً! 🌟",
      "سؤال فيه ذكاء وتحدي! 🔥",
      "عاشت الأيادي 👏",
      "الوقت يداهمنا! ⏰",
      "سهل جداً 😎",
      "صعب جداً، ساعدونا! 🤯",
      "إثارة رهيبة وحماس! ⚡",
      "الروح الرياضية أولاً 🤝",
      "عشرة على عشرة! 💯",
      "تحدي يستحق الانتظار! 🏆"
    ];

    const getSenderDisplayName = () => {
      const namePart = senderName.trim() ? senderName.trim() : 'متفاعل';
      if (selectedTeam === 'viewer') return `📣 ${namePart}`;
      
      const teamObj = session?.teams?.find(t => t.id === selectedTeam);
      const teamName = teamObj ? teamObj.name : 'فريق';
      return `👥 ${namePart} (${teamName})`;
    };

    const handleSendReaction = async (emoji: string) => {
      if (!persistentSessionId) return;
      try {
        playSound('click');
        await dataService.sendReaction(persistentSessionId, {
          emoji,
          senderName: getSenderDisplayName()
        });
        
        // Brief success feedback
        setSentStatus(`تم إرسال الرمز ${emoji} تم بنجاح!`);
        setTimeout(() => setSentStatus(null), 1500);
      } catch (e) {
        console.error("Failed to send reaction", e);
      }
    };

    const handleSendComment = async (commentText: string) => {
      const text = commentText.trim();
      if (!text || !persistentSessionId) return;
      setIsSending(true);
      try {
        playSound('click');
        await dataService.sendReaction(persistentSessionId, {
          comment: text,
          senderName: getSenderDisplayName()
        });
        setCustomComment('');
        
        // Success notification
        setSentStatus(`تم إرسال التعليق " ${text} "`);
        setTimeout(() => setSentStatus(null), 2000);
      } catch (e) {
        console.error("Failed to send comment", e);
      } finally {
        setIsSending(false);
      }
    };

    return (
      <div dir="rtl" className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between p-4 relative overflow-hidden font-sans">
        {/* Decorative radiant background circles */}
        <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[50%] h-[40%] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Header Block */}
        <div className="w-full max-w-md mx-auto space-y-6 pt-4 pb-2 z-10 flex-grow">
          <div className="flex items-center justify-between bg-slate-900 border border-white/5 p-4 rounded-[28px] shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-500 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/20">
                📣
              </div>
              <div className="text-right">
                <h1 className="text-sm font-black tracking-tight text-white">منصة تفاعل الجمهور</h1>
                <p className="text-[10px] text-slate-400 font-bold line-clamp-1">
                  {competitionName || 'مسابقات أبوالفواطم الذكية'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-black rounded-full border border-emerald-500/20 uppercase">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              متصل بالبث
            </div>
          </div>

          {/* Persona Settings */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-[32px] space-y-4 shadow-xl">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2 text-right">إعدادات الهوية والتفاعل</h3>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-[11px] font-black text-slate-400 mb-2 text-right">اسم المتفاعل (اختياري)</label>
                <input
                  type="text"
                  maxLength={15}
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="مثال: يوسف، أحمد..."
                  className="w-full h-12 px-4 bg-slate-950 border border-slate-850 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 placeholder:text-slate-600 transition-all text-right"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 mb-2 text-right">جهة الانتماء / الدور</label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full h-12 px-4 bg-slate-950 border border-slate-850 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all text-right cursor-pointer"
                >
                  <option value="viewer">📣 مشاهد ومتابع خارجي</option>
                  {(session?.teams || []).map((t, idx) => (
                    <option key={t.id} value={t.id}>
                      👥 متسابق مع : {t.name || `الفريق ${idx + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick Emojis Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">أرسل رموز تعبيرية طائرة 🚀</h3>
              <span className="text-[9px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full">اضغط لإرسال فوري</span>
            </div>
            
            <div className="grid grid-cols-4 gap-3 bg-slate-900/60 backdrop-blur-md p-4 rounded-[32px] border border-white/5">
              {emojisList.map((emoji) => (
                <motion.button
                  key={emoji}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => handleSendReaction(emoji)}
                  className="h-16 rounded-2xl bg-slate-900 border border-slate-850 flex items-center justify-center text-3xl font-black shadow-md hover:border-indigo-500/30 active:bg-indigo-950/20 transition-colors cursor-pointer"
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Quick Arabic Comments Panel */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider px-1 text-right">عبارات حماسية سريعة 📣</h3>
            <div className="flex flex-wrap gap-2.5 max-h-[140px] overflow-y-auto no-scrollbar pb-1">
              {quickComments.map((comment, i) => (
                <button
                  key={i}
                  onClick={() => handleSendComment(comment)}
                  className="px-4 py-2.5 bg-slate-900 border border-slate-855 text-xs font-black rounded-full text-slate-200 hover:border-indigo-500/35 hover:text-white transition-all cursor-pointer whitespace-nowrap active:bg-slate-850"
                >
                  {comment}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message Field */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider px-1 text-right">رسالة خاصة على الشاشة 💬</h3>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-[32px] space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={35}
                  value={customComment}
                  onChange={(e) => setCustomComment(e.target.value)}
                  placeholder="اكتب تعليقك هنا (أقصى 35 حرفاً)..."
                  className="flex-grow h-12 px-4 bg-slate-950 border border-slate-850 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-600 transition-all text-right"
                />
                <button
                  onClick={() => handleSendComment(customComment)}
                  disabled={isSending || !customComment.trim()}
                  className="h-12 w-12 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shrink-0 hover:bg-indigo-600 disabled:opacity-30 disabled:hover:bg-indigo-500 transition-colors cursor-pointer shadow-lg shadow-indigo-500/20"
                >
                  <Send className="w-5 h-5 rotate-180" />
                </button>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold px-1">
                <span>الحد الأقصى مسموح 35 حرفاً</span>
                <span className={customComment.length > 30 ? 'text-amber-500' : 'text-slate-500'}>
                  {customComment.length} / 35
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Temporary Feedback notification floating bar */}
        <AnimatePresence>
          {sentStatus && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-10 left-4 right-4 z-50 p-4 bg-indigo-500 border-2 border-indigo-400 text-white font-black text-xs text-center rounded-2xl shadow-2xl"
            >
              {sentStatus}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full text-center py-4 text-[10px] text-slate-500 font-black uppercase tracking-widest border-t border-slate-900 z-10 shrink-0 mt-6 flex items-center justify-center gap-1.5">
          <span>{competitionName || 'مسابقات أبوالفواطم'}</span>
          <span className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
          <span>منصّة التفاعل التزامني</span>
        </div>
      </div>
    );
  };

  const ReactionsModal = () => {
    const [copiedLink, setCopiedLink] = useState(false);
    const contestantUrl = `${window.location.origin}${window.location.pathname}?view=interact&session=${persistentSessionId || 'default'}`;

    const handleCopyContestantLink = async () => {
      playSound('click');
      try {
        await navigator.clipboard.writeText(contestantUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } catch (err) {
        console.error(err);
      }
    };

    const handleSendDirectReaction = async (emoji: string) => {
      if (!persistentSessionId) return;
      playSound('click');
      await dataService.sendReaction(persistentSessionId, {
        emoji,
        senderName: isAdmin ? '👑 مسؤول المنصّة' : '🎯 متفاعل محلّي'
      });
    };

    const handleSendDirectComment = async (comment: string) => {
      if (!persistentSessionId) return;
      playSound('click');
      await dataService.sendReaction(persistentSessionId, {
        comment,
        senderName: isAdmin ? '👑 مسؤول المنصّة' : '🎯 متفاعل محلّي'
      });
    };

    const localEmojis = ['🎉', '🔥', '👏', '😂', '🤯', '😎', '💖', '👍', '🏆', '⭐'];
    const localComments = [
      "مبدعين جداً! 🌟",
      "سؤال حماسي! 🔥",
      "عاشت الأيادي 👏",
      "الوقت يداهمنا! ⏰",
      "سهل جداً 😎",
      "صعب جداً! 🤯"
    ];

    return (
      <AnimatePresence>
        {showReactionsSelector && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { playSound('click'); setShowReactionsSelector(false); }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.5)] border-8 border-white p-6 md:p-8 flex flex-col gap-6 overflow-hidden max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <button 
                  onClick={() => { playSound('click'); setShowReactionsSelector(false); }}
                  className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  ✕
                </button>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <h2 className="text-xl font-black text-slate-900">غرفة تفاعل ودعم المسابقة التفاعلية 📣</h2>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">شارك الجمهور والمتسابقين التفاعل الحي على الشاشة مباشرة!</p>
                  </div>
                  <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-lg shadow-amber-500/20">
                    <Smile className="w-6 h-6 animate-bounce" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-y-auto pr-1">
                {/* Left Column: Mobile Link & QR */}
                <div className="bg-gradient-to-br from-indigo-50/50 to-indigo-100/30 p-6 rounded-[32px] border-2 border-indigo-100/50 flex flex-col items-center justify-center gap-5 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 text-[120px] opacity-5 select-none pointer-events-none">📱</div>
                  
                  <div className="bg-indigo-600 text-white px-5 py-2 rounded-2xl text-xs font-black shadow-lg shadow-indigo-600/15 flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    تفاعل فوري عن بعد عبر الهواتف
                  </div>

                  <p className="text-slate-700 text-sm font-bold leading-relaxed max-w-xs">
                    امسح الرمز ضوئياً بهاتفك أو وزعه على الجمهور لإرسال رموز تعبيرية وتعليقات طائرة على الشاشة مباشرة!
                  </p>

                  <div className="bg-white p-4 rounded-3xl shadow-xl shadow-indigo-900/[0.04] border border-indigo-50/50 group hover:scale-105 transition-transform duration-300">
                    <QRCodeSVG 
                      value={contestantUrl} 
                      size={180} 
                      level="H"
                      includeMargin={false}
                      imageSettings={{
                        src: "https://img.icons8.com/color/512/trophy.png",
                        x: undefined,
                        y: undefined,
                        height: 36,
                        width: 36,
                        excavate: true,
                      }}
                    />
                  </div>

                  <div className="w-full space-y-2 max-w-sm">
                    <button
                      onClick={handleCopyContestantLink}
                      className={`w-full h-12 rounded-2xl text-xs font-black flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg ${
                        copiedLink 
                          ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                          : 'bg-slate-900 text-white shadow-slate-900/10 hover:bg-slate-800'
                      }`}
                    >
                      <Copy className="w-4 h-4" />
                      {copiedLink ? 'تم نسخ رابط تفاعل الجوال بنجاح!' : 'نسخ رابط تفاعل الجوال 🔗'}
                    </button>
                    <div className="text-[9px] text-slate-400 font-bold line-clamp-1 truncate select-all">{contestantUrl}</div>
                  </div>
                </div>

                {/* Right Column: Local instant feedback */}
                <div className="space-y-6">
                  {/* Local Emojis */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm justify-end">
                      <span>إرسال تفاعل سريع من هذا الجهاز :</span>
                      <span>🎯</span>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      {localEmojis.map((emoji) => (
                        <motion.button
                          key={emoji}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.85 }}
                          onClick={() => handleSendDirectReaction(emoji)}
                          className="h-14 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-slate-100 flex items-center justify-center text-2xl shadow-sm transition-all cursor-pointer"
                        >
                          {emoji}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Local Comments */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm justify-end">
                      <span>عبارات دعم سريعة :</span>
                      <span>💬</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {localComments.map((comment, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendDirectComment(comment)}
                          className="px-4 py-3 bg-slate-50 border border-slate-100 font-black rounded-2xl text-slate-700 text-xs hover:border-indigo-500/20 hover:bg-indigo-50/50 hover:text-slate-900 transition-all text-right cursor-pointer"
                        >
                          {comment}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active Status Info */}
                  <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-200/50 text-amber-900 text-[10px] md:text-sm font-bold leading-relaxed flex gap-3 text-right" dir="rtl">
                    <div className="text-lg shrink-0 mt-0.5">ℹ️</div>
                    <div>
                      <p className="font-extrabold text-amber-950 mb-0.5">ملاحظة أمنية تزامنية</p>
                      الرموز والتعليقات يتم نشرها في الوقت الفعلي عبر قواعد بيانات Firestore المشفرة وتظهر تلقائياً على كل الأجهزة والمسارح المفتوحة على هذا البث.
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5 text-center text-[10px] text-slate-400 font-black tracking-widest uppercase">
                {competitionName || 'مسابقات أبوالفواطم'} • التفاعل والابتكار الرقمي
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  const [showSettings, setShowSettings] = useState(false);

  const SettingsModal = () => (
    <AnimatePresence>
      {showSettings && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSettings(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col"
          >
            <div className="bg-slate-50 px-10 py-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100">
                  <Settings className="w-6 h-6 text-slate-800" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">إعدادات التطبيق</h2>
                  <p className="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-widest">تخصيص تجربة المسابقة</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSettings(false)}
                className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all shadow-sm"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* Appearance Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <Palette className="w-5 h-5 text-[var(--theme-primary)]" />
                  <h3 className="text-lg font-black text-slate-800">المظهر العام</h3>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => { playSound('click'); setTheme(t.id); }}
                      className={`h-16 rounded-2xl border-4 transition-all relative group overflow-hidden ${theme === t.id ? 'border-[var(--theme-primary)] scale-105 shadow-lg' : 'border-slate-50 hover:border-slate-200'}`}
                      style={{ backgroundColor: t.primary }}
                    >
                      {theme === t.id && (
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Account Section */}
              <div className="space-y-4 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-[var(--theme-primary)]" />
                  <h3 className="text-lg font-black text-slate-800">الحساب والإدارة</h3>
                </div>
                
                {!user ? (
                  <button 
                    onClick={() => { setShowSettings(false); handleLogin(); }}
                    className="w-full p-6 bg-slate-900 text-white rounded-3xl flex items-center justify-between group hover:bg-black transition-all shadow-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <Lock className="w-6 h-6 text-rose-400" />
                      </div>
                      <div className="text-right">
                        <p className="font-black">دخول كمسؤول</p>
                        <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-0.5">لوحة التحكم والمزامنة الذكية</p>
                      </div>
                    </div>
                    <ChevronLeft className="w-6 h-6 text-white/30 group-hover:translate-x-[-10px] transition-transform" />
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                           <img 
                              src={user.photoURL || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.uid}`} 
                              className="w-12 h-12 rounded-2xl border-2 border-white shadow-md"
                              alt="User"
                           />
                           {isAdmin && <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 text-white rounded-lg flex items-center justify-center shadow-lg transform rotate-12 border-2 border-white"><Trophy className="w-3 h-3" /></div>}
                        </div>
                        <div className="text-right">
                          <p className="font-black text-slate-900">{user.displayName || 'مستخدم'}</p>
                          <p className="text-[10px] text-slate-400 font-bold line-clamp-1">{user.email}</p>
                        </div>
                      </div>
                      {isAdmin ? (
                        <div className="px-3 py-1 bg-amber-500 text-white text-[9px] font-black rounded-lg shadow-md uppercase tracking-widest">مسؤول</div>
                      ) : (
                        <div className="px-3 py-1 bg-slate-200 text-slate-500 text-[9px] font-black rounded-lg uppercase tracking-widest">ضيف</div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {isAdmin && (
                        <button 
                          onClick={() => { setShowSettings(false); setView('admin'); }}
                          className="p-5 bg-gradient-to-br from-[var(--theme-primary)] to-[var(--theme-primary-hover)] text-white rounded-[24px] flex flex-col items-center gap-3 shadow-xl shadow-[var(--theme-glow)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                          <Database className="w-6 h-6" />
                          <span className="text-sm font-black">لوحة التحكم</span>
                        </button>
                      )}
                      {isAdmin && (
                        <button 
                          onClick={() => { setShowSettings(false); setView('stats'); }}
                          className="p-5 bg-white border border-slate-100 text-slate-800 rounded-[24px] flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-all"
                        >
                          <BarChart3 className="w-6 h-6 text-indigo-500" />
                          <span className="text-sm font-black">الإحصائيات</span>
                        </button>
                      )}
                    </div>

                    <button 
                      onClick={() => { playSound('click'); signOut(auth); setShowSettings(false); }}
                      className="w-full h-14 bg-rose-50 text-rose-500 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-rose-100 transition-all border border-rose-100"
                    >
                      <LogOut className="w-5 h-5" />
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 bg-slate-50 flex items-center justify-center gap-4 text-[10px] text-slate-400 font-black uppercase tracking-widest">
              <span>الإصدار 3.5.0</span>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span>مدعوم بالذكاء الاصطناعي</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (view === 'admin' && isAdmin) {
    const sessionAnsweredIds = (session?.categories || []).flatMap(c => (c.questions || []).filter(q => q.isAnswered).map(q => q.id));
    const allAnsweredIds = Array.from(new Set([...sessionAnsweredIds, ...(Array.isArray(playedQuestionIds) ? playedQuestionIds : [])]));
    return (
      <AdminDashboard 
        onBack={() => { playSound('click'); setView('game'); }} 
        answeredQuestionIds={allAnsweredIds} 
        playSound={playSound}
        appSettings={appSettings}
        onResetGame={handleResetSession}
        onResetPlayedQuestions={() => {
          if (window.confirm('هل أنت متأكد من تصفير سجل الأسئلة الملعوبة لجميع الأقسام؟')) {
            setPlayedQuestionIds([]);
            localStorage.removeItem('abf_played_questions');
          }
        }}
      />
    );
  }

  if (view === 'stats') {
    return <StatisticsDashboard isAdmin={isAdmin} currentUserId={user?.uid} onBack={() => { playSound('click'); setView('game'); }} playSound={playSound} />;
  }

  if (view === 'recent') {
    return <RecentCompetitions isAdmin={isAdmin} currentUserId={user?.uid} onBack={() => { playSound('click'); setView('game'); }} playSound={playSound} />;
  }

  if (isContestantView) {
    return <ContestantView />;
  }

  return (
    <div dir="rtl" className={`min-h-screen font-sans selection:bg-[var(--theme-primary-light)] selection:text-[var(--theme-primary)] flex flex-col items-center bg-[var(--theme-primary-light)] relative transition-colors duration-700`}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {appSettings?.logoUrl && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] flex items-center justify-center pointer-events-none"
          >
            <img src={appSettings.logoUrl} className="w-full h-full object-contain grayscale" alt="" />
          </motion.div>
        )}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[-15%] left-[-15%] w-[50%] h-[50%] bg-[var(--theme-primary)]/10 rounded-full blur-[150px]" 
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-200/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] bg-emerald-200/30 rounded-full blur-[150px]" 
        />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-amber-100/20 rounded-full blur-[120px]" />
      </div>

      <SettingsModal />
      <ReactionsModal />
      {showLeaderboardModal && (
        <LiveTeamLeaderboard
          teams={session?.teams || []}
          currentTurnId={session?.currentTurn}
          animatingTeamId={animatingTeamId}
          answerFeedback={answerFeedback}
          variant="modal"
          onCloseModal={() => setShowLeaderboardModal(false)}
          playSound={playSound}
        />
      )}

      {/* Absolute overlay for flying reactions (emojis) */}
      <div className="fixed inset-0 pointer-events-none z-[80] overflow-hidden">
        <AnimatePresence>
          {flyingReactions.map((reaction) => (
            <motion.div
              key={reaction.id}
              initial={{ 
                opacity: 0, 
                y: '100vh', 
                x: `${reaction.x}vw`, 
                scale: 0.5,
                rotate: 0 
              }}
              animate={{ 
                opacity: [0, 1, 1, 0], 
                y: '-20vh', 
                scale: [0.5, 1.2, 1, 0.8],
                rotate: reaction.rotation
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 3.5, 
                ease: "easeOut" 
              }}
              className="absolute select-none pr-10 pl-10"
              style={{ fontSize: `${reaction.size}px` }}
            >
              <div className="relative drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)] font-black">
                {reaction.emoji}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Absolute overlay for rolling text comments */}
      <div className="fixed bottom-24 right-6 z-[80] flex flex-col gap-3 pointer-events-none max-w-sm text-right" dir="rtl">
        <AnimatePresence>
          {rollingComments.map((rc) => (
            <motion.div
              key={rc.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, y: -20, scale: 0.9 }}
              transition={{ type: "spring", damping: 15 }}
              className="p-4 rounded-2xl bg-slate-900/95 border border-slate-700/60 text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md flex items-start gap-3 border-r-4 border-r-indigo-500"
            >
              <div className="font-extrabold text-lg leading-none shrink-0 text-indigo-400 mt-0.5">💬</div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-indigo-300 block uppercase tracking-widest truncate max-w-[200px] text-right">
                  {rc.senderName}
                </span>
                <p className="text-xs font-bold text-slate-100 leading-relaxed break-words text-right">
                  {rc.comment}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Answer Feedback Overlay */}
      <AnimatePresence>
        {answerFeedback && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm pointer-events-none"
          >
            <div className="relative">
              <motion.div 
                initial={{ scale: 0.5, rotate: answerFeedback === 'wrong' ? 10 : 0 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0,
                  x: answerFeedback === 'wrong' ? [0, -20, 20, -20, 20, 0] : 0
                }}
                transition={{ 
                  scale: { type: 'spring', damping: 15 },
                  x: { duration: 0.5 }
                }}
                className={`relative p-12 rounded-[60px] border-[12px] bg-white shadow-[0_0_100px_rgba(0,0,0,0.3)] flex flex-col items-center gap-8 ${
                  answerFeedback === 'correct' ? 'border-emerald-500' : 'border-rose-500'
                }`}
              >
                <motion.div 
                  animate={{ 
                    y: [0, -10, 0],
                    scale: answerFeedback === 'correct' ? [1, 1.2, 1] : 1
                  }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-9xl"
                >
                  {answerFeedback === 'correct' ? '🎊' : '❌'}
                </motion.div>
                
                {answerFeedback === 'correct' && appSettings?.correctImageUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <img 
                      src={appSettings.correctImageUrl} 
                      className="w-80 h-80 object-contain rounded-3xl shadow-xl border-4 border-emerald-50"
                      alt="Celebration"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                )}
                
                {answerFeedback === 'wrong' && appSettings?.wrongImageUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <img 
                      src={appSettings.wrongImageUrl} 
                      className="w-80 h-80 object-contain rounded-3xl shadow-xl border-4 border-rose-50"
                      alt="Failure"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                )}

                <h2 className={`text-7xl font-black tracking-tight ${answerFeedback === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {answerFeedback === 'correct' ? 'إجابة صحيحة!' : 'إجابة خاطئة!'}
                </h2>
              </motion.div>
              
              {/* Better Confetti-like particles */}
              {answerFeedback === 'correct' && (
                <div className="absolute inset-0 -z-10">
                  {[...Array(40)].map((_, i) => {
                    const angle = (Math.PI * 2 * i) / 40;
                    const velocity = 200 + Math.random() * 400;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                        animate={{ 
                          opacity: [0, 1, 1, 0],
                          scale: [0, 1, 1, 0],
                          x: Math.cos(angle) * velocity,
                          y: Math.sin(angle) * velocity + (Math.random() * 200),
                          rotate: 360 * 2 * Math.random()
                        }}
                        transition={{ duration: 3, ease: "easeOut" }}
                        className={`absolute left-1/2 top-1/2 w-4 h-4 ${
                          ['bg-amber-400', 'bg-emerald-400', 'bg-indigo-400', 'bg-rose-400', 'bg-sky-400', 'bg-pink-400'][i % 6]
                        } ${i % 2 === 0 ? 'rounded-full' : 'rounded-sm rotate-45'}`}
                      />
                    );
                  })}
                </div>
              )}

              {/* Wrong feedback shockwaves */}
              {answerFeedback === 'wrong' && (
                <div className="absolute inset-0 -z-10">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{ scale: 2.5, opacity: 0 }}
                      transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" }}
                      className="absolute inset-0 border-8 border-rose-500 rounded-[60px]"
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {(['selection', 'question'].includes(session?.status || '')) && (!isFullscreen || session?.status === 'question') && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[5000] px-4 md:px-10 py-4 pointer-events-none"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-10">
              {!isFullscreen && (
                <div className="flex-1" />
              )}
              {isFullscreen && <div className="flex-1" />}

            <div className="flex-1 flex justify-center">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={session.currentTurn}
                  initial={{ scale: 0.8, opacity: 0, rotateX: 90 }}
                  animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                  exit={{ scale: 0.8, opacity: 0, rotateX: -90 }}
                  className="px-6 md:px-10 py-2 md:py-4 bg-white/95 backdrop-blur-3xl border-2 rounded-full shadow-2xl flex items-center gap-3 md:gap-5 transition-all"
                  style={{ borderColor: `${currentTeam?.color || '#000'}40`, boxShadow: `0 15px 40px -10px ${currentTeam?.color || '#000'}30` }}
                >
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl flex items-center justify-center text-white text-[10px] md:text-xs font-black shadow-lg" style={{ backgroundColor: currentTeam?.color || '#000' }}>
                    {currentTeam?.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 text-right">دور الفريق</span>
                    <span className="text-sm md:text-xl font-black text-slate-900 truncate max-w-[80px] md:max-w-xs text-right">{currentTeam?.name || '...'}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex-1 flex justify-end">
              {session.status === 'question' && (
                <div className={`px-4 md:px-8 py-2 md:py-3 bg-white/95 backdrop-blur-3xl border shadow-2xl rounded-full flex items-center gap-4 md:gap-6 transition-all ${timeLeft <= 10 ? 'border-rose-500 ring-4 ring-rose-50' : 'border-white'} ${isAdmin ? 'cursor-pointer hover:bg-slate-50' : ''}`}>
                  <div 
                    onClick={() => {
                      if (isAdmin) setTimerActive(!timerActive);
                    }}
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center transition-all ${timeLeft <= 10 ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-900 text-white'} ${isAdmin ? 'hover:scale-110 active:scale-95' : ''}`}
                  >
                    <RefreshCcw className={`w-4 h-4 md:w-5 md:h-5 ${timerActive ? 'animate-spin-slow' : ''}`} />
                  </div>
                  <div className="flex flex-col" onClick={() => {
                    if (isAdmin) {
                      setIsEditingTime(true);
                      setTempTime(timeLeft.toString());
                    }
                  }}>
                    <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 text-right">الوقت</span>
                    {isEditingTime && isAdmin ? (
                      <input 
                        type="number"
                        autoFocus
                        value={tempTime}
                        onChange={(e) => setTempTime(e.target.value)}
                        onBlur={() => {
                          setTimeLeft(parseInt(tempTime) || 0);
                          setIsEditingTime(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setTimeLeft(parseInt(tempTime) || 0);
                            setIsEditingTime(false);
                          }
                        }}
                        className="w-12 md:w-16 bg-slate-100 text-center rounded-lg text-base md:text-2xl font-black font-mono text-slate-900 outline-none"
                      />
                    ) : (
                      <span className={`text-base md:text-2xl font-black font-mono tracking-tighter ${timeLeft <= 10 ? 'text-rose-500' : 'text-slate-900'}`}>{timeLeft}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

      <motion.header 
        className={`fixed top-0 left-0 right-0 z-[200] w-full flex justify-between items-center px-4 py-3 bg-white/40 backdrop-blur-3xl border-b border-white/50 shadow-xl transition-all duration-500 ${isFullscreen && session.status === 'question' ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}
        initial={{ y: -100 }}
        animate={{ y: isFullscreen && session.status === 'question' ? -100 : 0 }}
      >
        <div className="flex items-center gap-6">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="logo h-14 md:h-16 cursor-pointer flex items-center bg-white rounded-2xl p-2 border border-slate-100 shadow-sm"
            onClick={() => { playSound('click'); setView('game'); }}
          >
            <img 
              src={logoSource} 
              alt="Logo" 
              className="h-full w-auto object-contain"
              onError={(e) => (e.currentTarget.src = "https://img.icons8.com/color/512/quiz.png")}
            />
          </motion.div>

          {/* Database Connection Status Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] md:text-[10px] font-black tracking-wide uppercase transition-all duration-300 shadow-sm ${
            dbConnected === 'connected' 
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
              : dbConnected === 'connecting'
                ? 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                : 'bg-rose-50 text-rose-600 border-rose-100'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              dbConnected === 'connected' 
                ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
                : dbConnected === 'connecting'
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-rose-500 animate-ping'
            }`} />
            <span>
              {dbConnected === 'connected' && 'متصل'}
              {dbConnected === 'connecting' && 'جاري الاتصال...'}
              {dbConnected === 'error' && 'غير متصل بالخادم'}
            </span>
          </div>
          
          <div className="flex items-center gap-2 p-1.5 bg-slate-900 rounded-[28px] border-4 border-slate-800 shadow-2xl">
            <button 
              onClick={() => { playSound('click'); setShowLeaderboardModal(true); }}
              className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${showLeaderboardModal ? 'bg-amber-400 text-slate-950 shadow-lg scale-105' : 'text-amber-400 hover:bg-slate-800 hover:text-amber-300'}`}
              title="لوحة صدارة وترتيب الفرق الحية 🏆"
            >
              <Trophy className="w-6 h-6 animate-pulse" />
            </button>
            <div className="w-px h-8 bg-slate-800 mx-1" />
            <button 
              onClick={() => { playSound('click'); setShowReactionsSelector(true); }}
              className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${showReactionsSelector ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              title="تفاعل الجمهور والمتسابقين 📣"
            >
              <Smile className="w-6 h-6" />
            </button>
            <div className="w-px h-8 bg-slate-800 mx-1" />
            <button 
              onClick={() => { playSound('click'); setShowSettings(true); }}
              className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${showSettings ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              title="إعدادات النظام"
            >
              <Settings className="w-6 h-6" />
            </button>
            <div className="w-px h-8 bg-slate-800 mx-1" />
            <button 
              onClick={handleShare}
              className="w-10 h-10 flex items-center justify-center rounded-xl transition-all text-slate-400 hover:text-white hover:bg-slate-800"
              title="مشاركة التطبيق"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showInstallBtn && (
            <button 
              onClick={handleInstallApp}
              className="px-6 py-3 bg-[var(--theme-primary)] text-white rounded-2xl hover:brightness-110 transition-all shadow-lg flex items-center gap-3 font-black text-xs uppercase"
            >
              <Download className="w-4 h-4" />
              تثبيت التطبيق
            </button>
          )}

          <button 
            onClick={() => { playSound('click'); resetGame(); }}
            className="w-12 h-12 flex items-center justify-center bg-white border-2 border-slate-100 rounded-2xl hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-all shadow-sm"
            title="إعادة تعيين المسابقة"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </motion.header>

      <main className="relative z-10 w-full flex-grow flex flex-col items-center pt-24 pb-12 px-4">
        <div className="w-full max-w-[98%] flex-grow flex flex-col">
          {error ? (
            <div className="w-full max-w-2xl mx-auto py-20 px-8 bg-white border border-rose-100 rounded-[48px] shadow-2xl flex flex-col items-center text-center gap-8 animate-in fade-in zoom-in duration-500">
               <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center shadow-lg">
                 <AlertCircle className="w-12 h-12" />
               </div>
               <div className="space-y-4">
                 <h2 className="text-3xl font-black text-slate-800 tracking-tight">عذراً، حدث خطأ ما</h2>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-500 font-medium whitespace-pre-wrap text-center">
                    {typeof error === 'string' && (error.includes('Quota limit exceeded') || error.includes('Quota exceeded'))
                      ? 'تم تجاوز حصة العمليات المجانية لليوم (Quota Exceeded).\nيرجى المحاولة غداً عند إعادة ضبط الحصة، أو ترقية الحساب لزيادة السعة.'
                      : String(error)}
                  </div>
               </div>
               <button 
                 onClick={() => window.location.reload()}
                 className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl flex items-center gap-3"
               >
                 <RotateCcw className="w-5 h-5" />
                 إعادة المحاولة
               </button>
            </div>
          ) : loading ? (
            <div className="w-full max-w-6xl mx-auto py-10 flex flex-col items-center gap-16">
               <motion.div 
                 animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.7, 0.4] }}
                 transition={{ duration: 2.5, repeat: Infinity }}
                 className="flex flex-col items-center gap-6"
               >
                 <img 
                    src={logoSource} 
                    className="w-32 h-32 object-contain grayscale" 
                    alt="Loading branding"
                    onError={(e) => (e.currentTarget.src = "https://img.icons8.com/color/512/trophy.png")}
                 />
                 <div className="flex flex-col items-center gap-2">
                    <div className="w-48 h-3 bg-slate-200 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ x: '-100%' }}
                         animate={{ x: '100%' }}
                         transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                         className="w-1/2 h-full bg-amber-500"
                       />
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">جاري التحميل...</span>
                 </div>
               </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                  {[...Array(6)].map((_, i) => (
                    <CardSkeleton key={i} />
                  ))}
               </div>
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                { (session?.status || 'welcome') === 'welcome' && (
                  <motion.div 
                    key="welcome"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8 }}
                    className="fixed inset-0 z-[90] flex flex-col items-center justify-center p-6 bg-slate-50/50 backdrop-blur-3xl overflow-hidden"
                  >
                    {/* Immersive Background */}
                    <div className="absolute inset-0 -z-10 bg-[var(--theme-primary-light)]/5">
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-primary-light)]/20 via-white to-slate-50" />
                      <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-[var(--theme-primary)] opacity-[0.08] blur-[180px] rounded-full animate-pulse" />
                      <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-[var(--theme-secondary)] opacity-[0.08] blur-[180px] rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
                      
                      {/* Technical Grid Overlay */}
                      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                           style={{ backgroundImage: `radial-gradient(var(--theme-primary) 1.5px, transparent 1.5px)`, backgroundSize: '60px 60px' }} />
                      
                      {/* Floating Particles Simulation */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{
                              y: [0, -150, 0],
                              opacity: [0.1, 0.4, 0.1],
                              scale: [1, 1.4, 1],
                              rotate: [0, 180, 360]
                            }}
                            transition={{
                              duration: 15 + i * 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: i * 2
                            }}
                            className="absolute bg-gradient-to-br from-[var(--theme-primary)] to-[var(--theme-primary-hover)] rounded-full blur-2xl opacity-20"
                            style={{
                              width: Math.random() * 300 + 100,
                              height: Math.random() * 300 + 100,
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="max-w-4xl w-full flex flex-col items-center text-center space-y-12 mt-16 md:mt-24">
                      {/* Logo Section */}
                      <motion.div
                        initial={{ y: 60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative group z-20"
                      >
                        <div className="absolute -inset-10 bg-[var(--theme-primary)] opacity-20 blur-[80px] rounded-full scale-110 active:scale-125 transition-all duration-1000" />
                        <div className="relative p-10 md:p-14 rounded-[56px] transition-all">
                           <img 
                              src={logoSource} 
                              alt="Logo" 
                              className="w-48 h-48 md:w-72 md:h-72 object-contain select-none pointer-events-none drop-shadow-[0_20px_60px_var(--theme-glow)] filter saturate-[1.1]"
                              onError={(e) => (e.currentTarget.src = "https://img.icons8.com/color/512/quiz.png")}
                           />
                        </div>
                      </motion.div>

                      {/* Text Content */}
                      <div className="space-y-6">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 }}
                          className="inline-flex items-center gap-3 px-6 py-2 bg-white/40 backdrop-blur-md text-[var(--theme-primary)] rounded-full text-xs font-black uppercase tracking-[0.4em] shadow-sm border border-white/50"
                        >
                          <Sparkles className="w-4 h-4 animate-pulse" />
                          {competitionSlogan}
                        </motion.div>
                        
                        <motion.h1 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.7, duration: 0.8 }}
                          className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1]"
                        >
                          {competitionName}
                        </motion.h1>

                        <motion.p
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.9, duration: 0.8 }}
                          className="text-lg md:text-2xl font-bold text-slate-500 max-w-2xl mx-auto leading-relaxed italic"
                        >
                          {appSettings?.welcomeDescription || "بوابة تنافسية ذكية تجمع بين الثقافة والترفيه"}
                        </motion.p>
                      </div>

                      {/* Action Buttons */}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.1 }}
                        className="w-full flex flex-col items-center gap-10"
                      >
                        <div className="flex flex-col md:flex-row items-center gap-6">
                          {(session?.categories?.length || 0) > 0 && (session?.teams || []).some(t => t.name) ? (
                            <motion.button 
                              whileHover={{ scale: 1.05, y: -8 }}
                              whileTap={{ scale: 0.95 }}
                              animate={{ 
                                shadow: ["0 20px 50px var(--theme-glow)", "0 30px 80px var(--theme-glow)", "0 20px 50px var(--theme-glow)"]
                              }}
                              transition={{ shadow: { duration: 3, repeat: Infinity } }}
                              onClick={() => { 
                                playSound('click'); 
                                const targetStatus = session.occupiedSlots.length > 0 || session.teams.some(t => t.score > 0) ? 'selection' : 'setup';
                                setSession(prev => ({ ...prev, status: targetStatus }));
                              }}
                              className="px-24 py-12 bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-primary-hover)] text-white rounded-[56px] text-5xl font-black flex items-center justify-center gap-12 group transition-all border-b-[16px] border-black/20 active:border-b-0 active:translate-y-2"
                            >
                              <span>استكمال المسابقة</span>
                              <ArrowRight className="w-14 h-14 group-hover:translate-x-5 transition-transform" />
                            </motion.button>
                          ) : (
                            <motion.button 
                              whileHover={{ scale: 1.05, y: -8 }}
                              whileTap={{ scale: 0.95 }}
                              animate={{ 
                                shadow: ["0 20px 50px var(--theme-glow)", "0 30px 80px var(--theme-glow)", "0 20px 50px var(--theme-glow)"]
                              }}
                              transition={{ shadow: { duration: 3, repeat: Infinity } }}
                              onClick={() => { playSound('click'); handleStartSetup(); }}
                              className="px-24 py-12 bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-primary-hover)] text-white rounded-[56px] text-5xl font-black flex items-center justify-center gap-12 group transition-all border-b-[16px] border-black/20 active:border-b-0 active:translate-y-2"
                            >
                              <span>ابدأ التحدي الآن</span>
                              <ArrowRight className="w-14 h-14 group-hover:translate-x-5 transition-transform" />
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {(session?.status === 'setup') && (
                  <motion.div 
                    key="setup"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="max-w-[95%] mx-auto w-full flex flex-col pb-32"
                  >
                    <div className="space-y-6">
                      <div className="flex justify-center">
                      <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md p-2 rounded-[24px] border border-slate-100 shadow-sm overflow-x-auto max-w-full no-scrollbar">
                        {steps.map((step, idx) => {
              const isActive = setupStep === step.id;
              const isCompleted = setupStep > step.id;
              const StepIcon = step.icon;
              const stepColor = step.id >= 2 ? session.teams[step.id - 2]?.color : '#f59e0b';

                          return (
                            <div key={step.id} className="flex items-center gap-4">
                              <div className="flex items-center gap-3 px-4 py-2 rounded-xl transition-all relative">
                                <div className={`
                                  w-8 h-8 rounded-lg flex items-center justify-center transition-all shadow-md
                                  ${isActive ? 'text-white' : isCompleted ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400'}
                                `}
                                style={isActive ? { backgroundColor: stepColor } : {}}
                                >
                                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <StepIcon className="w-4 h-4" />}
                                </div>
                                <div className="flex flex-col">
                                  <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>الخطوة {step.id}</span>
                                  <span className={`text-xs font-bold whitespace-nowrap ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{step.name}</span>
                                </div>
                                {isActive && (
                                  <motion.div 
                                    layoutId="activeStep"
                                    className="absolute inset-0 border-2 border-slate-900/5 bg-slate-900/5 rounded-2xl -z-10"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                  />
                                )}
                              </div>
                              {idx < steps.length - 1 && (
                                <div className="w-8 h-px bg-slate-200 shrink-0" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {setupStep <= 1 ? (
                      <div className="max-w-6xl mx-auto space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          {(session?.teams || []).map((team, idx) => (
                            <motion.div 
                              key={team.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="p-4 rounded-[24px] bg-white border-2 shadow-xl relative group transition-all"
                              style={{ 
                                borderColor: `${team.color}30`, 
                                boxShadow: `0 20px 40px -20px ${team.color}20` 
                              }}
                            >
                              {session.teams.length > 2 && (
                                <button 
                                  onClick={() => { playSound('click'); handleRemoveTeam(idx); }}
                                  aria-label={`حذف فريق ${team.name || (idx + 1)}`}
                                  className="absolute -top-3 -right-3 w-10 h-10 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-20"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                              )}
                              
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer" 
                                       style={{ backgroundColor: team.color }}
                                       onClick={() => {
                                         const input = document.createElement('input');
                                         input.type = 'color';
                                         input.value = team.color || '#4f46e5';
                                         input.oninput = (e) => handleSetTeamColor(idx, (e.target as HTMLInputElement).value);
                                         input.click();
                                       }}
                                  >
                                    <Users className="w-5 h-5" />
                                  </div>
                                  <div className="flex-grow">
                                    <div className="relative group/input pt-4">
                                      <h3 className={`absolute top-0 right-0 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${team.name ? 'text-[var(--theme-primary)] -translate-y-1 opacity-100' : 'text-slate-300 translate-y-4 opacity-0 pointer-events-none'}`}>فريق {idx + 1}</h3>
                                      <input 
                                        type="text"
                                        placeholder={`اكتب اسم الفريق ${idx + 1}...`}
                                        aria-label={`اسم الفريق ${idx + 1}`}
                                        value={team.name}
                                        onChange={(e) => handleSetTeamName(idx, e.target.value)}
                                        className="w-full bg-transparent border-none focus:ring-0 outline-none transition-all placeholder:text-slate-200 text-2xl font-black text-slate-800 p-0 mb-2 mt-1"
                                        dir="rtl"
                                      />
                                      <div className="relative h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <motion.div 
                                          initial={false}
                                          animate={{ 
                                            width: team.name ? '100%' : '20%',
                                            backgroundColor: team.color 
                                          }}
                                          className="absolute right-0 h-full origin-right" 
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-5 gap-2">
                                {teamColorOptions.map(option => (
                                  <button
                                    key={option.hex}
                                    title={option.name}
                                    onClick={() => { playSound('click'); handleSetTeamColor(idx, option.hex); }}
                                    className={`w-full aspect-square rounded-xl transition-all border-4 ${team.color === option.hex ? 'border-indigo-100 scale-110 shadow-md' : 'border-transparent hover:scale-105 opacity-40 hover:opacity-100'}`}
                                    style={{ backgroundColor: option.hex }}
                                  />
                                ))}
                              </div>
                            </motion.div>
                          ))}

                          {session.teams.length < 5 && (
                            <motion.button
                              onClick={() => { playSound('click'); handleAddTeam(); }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="p-4 rounded-[24px] border-4 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-500 transition-all"
                            >
                              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                                <Users className="w-8 h-8" />
                              </div>
                              <span className="text-xl font-black">إضافة فريق جديد</span>
                            </motion.button>
                          )}
                        </div>

                        <div className="flex flex-col items-center gap-4">
                          {!isNamesReady && session.teams.some(t => t.name.trim() !== '') && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-rose-500 font-black text-sm bg-rose-50 px-6 py-2 rounded-full border border-rose-100 shadow-sm flex items-center gap-2"
                            >
                              <AlertCircle className="w-4 h-4" />
                              {hasDuplicateNames ? 'يجب أن تكون أسماء الفرق مميزة وغير مكررة' : 'يرجى إكمال أسماء جميع الفرق للمتابعة'}
                            </motion.div>
                          )}
                          <motion.button
                            whileHover={isNamesReady ? { scale: 1.05 } : {}}
                            whileTap={isNamesReady ? { scale: 0.95 } : {}}
                            onClick={() => { playSound('click'); proceedSetup(); }}
                            disabled={!isNamesReady}
                            className={`
                              px-12 py-4 font-black text-2xl rounded-[24px] transition-all shadow-2xl flex items-center gap-4
                              ${isNamesReady
                                ? 'bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-primary-hover)] text-white shadow-[var(--theme-glow)] shadow-xl'
                                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                              }
                            `}
                          >
                            المتابعة لاختيار التخصصات
                            <ArrowRight className="w-8 h-8" />
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <div className="animate-fade-in w-full max-w-7xl mx-auto flex flex-col gap-6">
                        <div className="flex flex-col gap-6">
                          <div className="shrink-0">
                            <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-4 border border-white shadow-xl">
                              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex flex-col gap-1 items-center md:items-start">
                                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">التخصصات المختارة</h4>
                                  <div className="flex items-center gap-3">
                                    {[0, 1, 2].map(idx => {
                                      const setupTeam = session.teams[setupStep - 2];
                                      const catId = setupTeam?.selectedCategories?.[idx];
                                      const cat = session.categories.find(c => c.id === catId);
                                      return (
                                        <div key={idx} 
                                          className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl border-2 border-dashed flex items-center justify-center transition-all relative ${cat ? 'border-opacity-100 shadow-md scale-105' : 'bg-slate-50 border-slate-200 opacity-40'}`}
                                          style={cat ? { backgroundColor: `${setupTeam?.color}10`, borderColor: `${setupTeam?.color}40` } : {}}
                                        >
                                          {cat ? (
                                            <>
                                              <div className="w-full h-full rounded-xl overflow-hidden">
                                                {cat.imageUrl ? (
                                                  <img src={cat.imageUrl} className="w-full h-full object-cover" loading="lazy" />
                                                ) : (
                                                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <IconRenderer name={cat.iconUrl || 'LayoutGrid'} className="w-6 h-6 md:w-8 md:h-8" />
                                                  </div>
                                                )}
                                              </div>
                                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[var(--theme-primary)] rounded-lg flex items-center justify-center shadow-lg transform rotate-6">
                                                <Check className="w-3 h-3 text-white" />
                                              </div>
                                            </>
                                          ) : (
                                            <div className="text-[10px] font-black text-slate-300">{idx + 1}</div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                <div className="flex flex-col items-center gap-2">
                                  <motion.h3 
                                    key={setupStep}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-3xl font-black tracking-tight"
                                    style={{ color: session.teams[setupStep - 2]?.color }}
                                  >
                                    {session.teams[setupStep - 2]?.name}
                                  </motion.h3>
                                  <div className="flex items-center gap-2">
                                      {[...Array(3)].map((_, i) => (
                                        <motion.div 
                                          key={i}
                                          animate={{ 
                                            scale: i < (session.teams[setupStep - 2]?.selectedCategories?.length || 0) ? [1, 1.2, 1] : 1,
                                            backgroundColor: i < (session.teams[setupStep - 2]?.selectedCategories?.length || 0)
                                              ? session.teams[setupStep - 2]?.color 
                                              : '#e2e8f0',
                                          }}
                                          className="w-6 h-2 rounded-full"
                                        />
                                      ))}
                                  </div>
                                </div>

                                <div className="flex flex-col items-center gap-2 bg-white/40 backdrop-blur-md p-4 rounded-[32px] border border-white shadow-xl min-w-[260px]">
                                  <motion.button
                                    whileHover={session.teams[setupStep - 2]?.selectedCategories?.length === 3 ? { scale: 1.02 } : {}}
                                    whileTap={session.teams[setupStep - 2]?.selectedCategories?.length === 3 ? { scale: 0.98 } : {}}
                                    onClick={() => { playSound('click'); proceedSetup(); }}
                                    disabled={session.teams[setupStep - 2]?.selectedCategories?.length !== 3}
                                    className={`
                                      w-full py-4 font-black text-lg rounded-[20px] transition-all relative overflow-hidden group
                                      ${session.teams[setupStep - 2]?.selectedCategories?.length === 3
                                        ? 'bg-slate-900 text-white shadow-2xl hover:shadow-slate-300'
                                        : 'bg-slate-100 text-slate-400 opacity-50 cursor-not-allowed grayscale'
                                      }
                                    `}
                                  >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                      {setupStep < session.teams.length + 1 ? 'تأكيد وحفظ التخصصات' : 'بداية التحدي'}
                                      <ChevronLeft className="w-5 h-5" />
                                    </span>
                                    {session.teams[setupStep - 2]?.selectedCategories?.length === 3 && (
                                      <motion.div 
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                      />
                                    )}
                                  </motion.button>
                                  <div className="flex items-center gap-2 px-4">
                                     <div className={`w-2 h-2 rounded-full ${session.teams[setupStep - 2]?.selectedCategories?.length === 3 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-200'}`} />
                                     <p className="text-[11px] font-black text-slate-500 uppercase tracking-tight">
                                      {session.teams[setupStep - 2]?.selectedCategories?.length === 3 
                                        ? 'جاهز للانطلاق ✓' 
                                        : `اختر ${3 - (session.teams[setupStep - 2]?.selectedCategories?.length || 0)} تخصصات إضافية`}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row gap-8 w-full max-w-7xl mx-auto items-start">
                             <div className="hidden lg:block w-72 shrink-0 sticky top-24 max-h-[85vh] overflow-y-auto no-scrollbar py-4 px-2">
                               <div className="bg-white/90 backdrop-blur-2xl border border-white/50 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] rounded-[48px] p-8 space-y-10 sticky top-0 transition-all duration-700">
                                  <div className="flex flex-col gap-5">
                                     <div className="w-14 h-14 bg-slate-900 text-white rounded-[26px] flex items-center justify-center shadow-2xl transform hover:rotate-6 transition-transform">
                                        <CircleDashed className="w-7 h-7 text-indigo-500 animate-[spin_10s_linear_infinite]" />
                                     </div>
                                     <div>
                                       <h3 className="font-black text-xl text-slate-900 tracking-tight">التصنيفات</h3>
                                       <p className="text-[11px] font-bold text-slate-400 font-display uppercase tracking-[0.2em] mt-1">المجموعات الذكية</p>
                                     </div>
                                  </div>
                                  <div className="space-y-3">
                                     {selectionGroups.map((group, idx) => (
                                        <motion.button 
                                          key={group.id}
                                          initial={{ x: 20, opacity: 0 }}
                                          animate={{ x: 0, opacity: 1 }}
                                          transition={{ delay: idx * 0.05 }}
                                          whileHover={{ x: -6, backgroundColor: '#f8fafc' }}
                                          onClick={() => {
                                            playSound('click');
                                            const el = document.getElementById(`group-${group.id}`);
                                            if (el) {
                                              const yOffset = -120; 
                                              const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                                              window.scrollTo({ top: y, behavior: 'smooth' });
                                            }
                                          }}
                                          className="w-full flex items-center justify-between gap-4 px-6 py-4 rounded-[28px] text-right group transition-all border border-transparent hover:border-slate-100"
                                        >
                                          <span className="text-xs font-black text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{group.name}</span>
                                          <div className="w-2 h-2 bg-slate-200 rounded-full group-hover:bg-slate-900 group-hover:scale-125 transition-all" />
                                        </motion.button>
                                     ))}
                                  </div>
                               </div>
                            </div>

                            <div className="flex-grow space-y-12 pb-24 px-1 w-full lg:max-w-none">
                              {selectionGroups.map((group, gIdx) => {
                                const groupCategories = session.categories.filter(c => (c.group || 'عام') === group.name);
                                if (groupCategories.length === 0) return null;

                                return (
                                  <motion.div 
                                    key={group.id} 
                                    id={`group-${group.id}`}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: gIdx * 0.1 }}
                                    className="space-y-6 scroll-mt-24"
                                  >
                                    <div className="flex items-center justify-end px-10 py-5 bg-[var(--theme-primary)] rounded-[24px] shadow-xl mx-4 mb-8">
                                        <h4 className="text-2xl font-black text-white tracking-tight leading-tight">
                                          {group.name}
                                        </h4>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 pb-20 w-full mb-12">
                                      {groupCategories.map(cat => {
                                        const setupTeam = session.teams[setupStep - 2];
                                        if (!setupTeam) return null;
                                        
                                        const isSelectedByOther = session.teams.some((t, i) => i !== setupStep - 2 && (t.selectedCategories || []).includes(cat.id));
                                        const isSelectedCurrent = (setupTeam.selectedCategories || []).includes(cat.id);
                                        const isMaxReached = (setupTeam.selectedCategories || []).length >= 3;
                                        
                                        return (
                                          <motion.div
                                            key={cat.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            whileHover={!(isSelectedByOther || (isMaxReached && !isSelectedCurrent)) ? { y: -5, scale: 1.02 } : {}}
                                            whileTap={!(isSelectedByOther || (isMaxReached && !isSelectedCurrent)) ? { scale: 0.98 } : {}}
                                            onClick={() => {
                                              if (isSelectedByOther || (isMaxReached && !isSelectedCurrent)) return;
                                              playSound('click'); 
                                              toggleCategorySelection(cat.id);
                                            }}
                                            role="button"
                                            tabIndex={0}
                                            className={`
                                              group relative bg-white rounded-[40px] shadow-2xl border-4 transition-all duration-500 overflow-hidden flex flex-col h-full text-right
                                              ${isSelectedCurrent 
                                                ? 'shadow-[0_45px_100px_-20px_rgba(0,0,0,0.2)] z-10 scale-[1.03] cursor-pointer' 
                                                : isSelectedByOther 
                                                  ? 'opacity-40 grayscale pointer-events-none cursor-not-allowed'
                                                  : isMaxReached
                                                    ? 'opacity-60 grayscale pointer-events-none cursor-not-allowed'
                                                    : 'hover:shadow-[0_60px_100px_-30px_rgba(0,0,0,0.15)] cursor-pointer'
                                              }
                                            `}
                                            style={{ 
                                              borderColor: isSelectedCurrent ? setupTeam.color : 'transparent',
                                            }}
                                          >
                                            {/* Upper Image Section - Now taller */}
                                            <div className="relative h-96 lg:h-[450px] w-full overflow-hidden">
                                              {!cat.imageUrl ? (
                                                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                                  <IconRenderer name={cat.iconUrl || 'LayoutGrid'} className="w-1/4 h-1/4 text-slate-300" />
                                                </div>
                                              ) : (
                                                <img 
                                                  src={cat.imageUrl} 
                                                  alt={cat.name} 
                                                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                                  referrerPolicy="no-referrer" 
                                                />
                                              )}
                                              
                                              {/* Selection Overlay */}
                                              {isSelectedCurrent && (
                                                <motion.div 
                                                  initial={{ opacity: 0 }}
                                                  animate={{ opacity: 1 }}
                                                  className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[2px] flex items-center justify-center z-30"
                                                >
                                                  <div className="bg-emerald-500/90 text-white p-6 rounded-[32px] shadow-2xl scale-125 border-4 border-white/30">
                                                    <Check className="w-12 h-12 stroke-[5px]" />
                                                  </div>
                                                </motion.div>
                                              )}

                                              {/* Overlay with Name - Positioned at bottom of image */}
                                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col items-center justify-end pb-12 gap-4">
                                                <h3 className="text-4xl font-black text-white text-center drop-shadow-2xl px-6 leading-tight">
                                                  {cat.name}
                                                </h3>
                                                <div className="bg-white/20 backdrop-blur-xl px-6 py-2 rounded-full flex items-center gap-3 border border-white/20">
                                                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                                                  <span className="text-xs font-black text-white uppercase tracking-[0.2em]">
                                                    قسم: {cat.questions?.length || 0}
                                                  </span>
                                                </div>
                                              </div>

                                              {/* Static Icons from Reference */}
                                              <div className="absolute top-6 left-6 z-20">
                                                <div className="w-12 h-12 bg-black/30 backdrop-blur-md rounded-[18px] flex items-center justify-center border border-white/20 text-white transform transition-transform group-hover:rotate-12">
                                                  <Info className="w-6 h-6" />
                                                </div>
                                              </div>
                                              <div className="absolute top-6 right-6 z-20">
                                                <div className="w-12 h-12 bg-orange-500/80 backdrop-blur-md rounded-[18px] flex items-center justify-center border border-white/20 text-white shadow-xl transform transition-transform group-hover:-rotate-12">
                                                  <Heart className="w-6 h-6 fill-current" />
                                                </div>
                                              </div>
                                            </div>

                                            {/* Status Badge Overlays */}
                                            {isSelectedByOther && (
                                              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[4px] flex flex-col items-center justify-center z-50 p-8 text-center">
                                                <div className="bg-white/10 p-5 rounded-[32px] border border-white/20 mb-4 shadow-2xl">
                                                  <Lock className="w-12 h-12 text-white" />
                                                </div>
                                                <h4 className="text-xl font-black text-white uppercase tracking-widest">محجوز</h4>
                                                <p className="text-xs text-white/60 font-bold mt-2">وقع اختيار فريق آخر على هذا التصنيف</p>
                                              </div>
                                            )}
                                          </motion.div>
                                        );
                                      })}
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

            {(session?.status === 'selection') && (
              <motion.div 
                key="selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6 w-full px-2 lg:px-4 pb-32"
              >
                {/* Board Header / Timer & Teams Scores */}
                <div className="flex flex-col lg:flex-row gap-4 shrink-0 px-2 mt-4 lg:mt-0">
                   {/* Board Header / Timer */}
                   <div className="flex-none w-full lg:w-[320px] bg-slate-950 p-4 rounded-[32px] text-white shadow-xl flex items-center justify-between border-2 border-slate-900 overflow-hidden relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-primary)] opacity-10 to-transparent pointer-events-none" />
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                          <RefreshCcw className="w-6 h-6 text-amber-400 animate-spin-slow" />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1 leading-none">لوحة التحكم</span>
                           <h4 className="text-xl font-black text-white leading-none">وقت المسابقة</h4>
                        </div>
                      </div>
                      <div className="text-3xl font-black font-mono text-amber-400 relative z-10 leading-none">
                        {formatDuration(gameDuration)}
                      </div>
                   </div>

                   {/* Live Dynamic Teams Leaderboard */}
                   <div className="flex-grow min-w-0">
                      <LiveTeamLeaderboard
                        teams={session?.teams || []}
                        currentTurnId={session?.currentTurn}
                        animatingTeamId={animatingTeamId}
                        answerFeedback={answerFeedback}
                        variant="embedded"
                        onOpenModal={() => setShowLeaderboardModal(true)}
                        playSound={playSound}
                      />
                   </div>
                </div>

                {/* Categories Grid Area */}
                <div className="flex-none min-h-[400px]">
                  {allActiveCategories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                       <LayoutGrid className="w-20 h-20 mb-4 opacity-20" />
                       <p className="text-xl font-black">لا توجد أقسام مفعلة حالياً</p>
                       <p className="text-sm">يرجى مراجعة لوحة التحكم لتفعيل الأقسام.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-4">
                      {allActiveCategories.map((cat, idx) => {
                        const owningTeam = session.teams.find(t => t.selectedCategories.includes(cat.id));
                        const catPointValues = Array.from(new Set(cat.questions.map(q => q.points)));
                        const isFullyConsumed = catPointValues.length > 0 && catPointValues.every(pts => 
                          session.occupiedSlots.includes(`${cat.id}-${pts}`) || 
                          cat.questions.every(q => q.points !== pts || q.isAnswered)
                        );
                        
                        return (
                          <motion.div 
                            key={cat.id} 
                            layout
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ 
                              opacity: isFullyConsumed ? 0.7 : 1, 
                              y: 0,
                              scale: isFullyConsumed ? 0.95 : 1,
                              filter: isFullyConsumed ? 'grayscale(0.6)' : 'grayscale(0)'
                            }}
                            transition={{ delay: idx * 0.08, type: 'spring', damping: 20 }}
                            className={`group relative flex flex-col rounded-[32px] md:rounded-[44px] overflow-hidden shadow-[0_15px_45px_-12px_rgba(0,0,0,0.12)] transition-all duration-700 hover:-translate-y-4 border-2 bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] ${
                              isFullyConsumed ? 'border-slate-100' : 'border-white'
                            }`}
                          >
                           <div className={`relative h-72 flex items-center justify-center bg-slate-900 overflow-hidden shrink-0`}>
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10 opacity-70" />
                              
                              <div className="absolute inset-0 z-0 overflow-hidden">
                                {cat.imageUrl ? (
                                  <img 
                                    src={cat.imageUrl} 
                                    alt={cat.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] brightness-90 contrast-110" 
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-[var(--theme-primary)] to-slate-900 flex items-center justify-center">
                                    <div className="opacity-20 transform scale-[2] group-hover:rotate-6 transition-transform duration-[2000ms]">
                                      {cat.iconUrl && !cat.iconUrl.startsWith('http') ? (
                                        <IconRenderer name={cat.iconUrl} className="w-40 h-40 text-white" />
                                      ) : (
                                        <LayoutGrid className="w-40 h-40 text-white" />
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="absolute top-4 left-4 w-12 h-12 bg-white/10 backdrop-blur-3xl rounded-[18px] flex items-center justify-center shadow-xl transform group-hover:rotate-12 transition-all duration-700 z-30 border border-white/20">
                                 {cat.iconUrl?.startsWith('http') ? (
                                   <img src={cat.iconUrl} className="w-6 h-6 object-contain" />
                                 ) : (
                                   <IconRenderer name={cat.iconUrl || 'LayoutGrid'} className="w-6 h-6 text-white" />
                                 )}
                              </div>

                              <div className="absolute bottom-6 inset-x-6 z-30 flex flex-col items-center">
                                <motion.h3 
                                  layoutId={`cat-title-${cat.id}`}
                                  className="text-3xl lg:text-4xl font-black text-white text-center drop-shadow-2xl tracking-normal leading-tight mb-2 group-hover:scale-105 transition-transform"
                                >
                                  {cat.name}
                                </motion.h3>

                                <div className="flex gap-1.5 mb-2">
                                  {cat.letterMode && <div className="p-1 bg-indigo-500/80 backdrop-blur-md rounded text-white shadow-lg"><Languages className="w-2.5 h-2.5" /></div>}
                                  {cat.videoEnabled && <div className="p-1 bg-rose-500/80 backdrop-blur-md rounded text-white shadow-lg"><Video className="w-2.5 h-2.5" /></div>}
                                  {cat.mapMode && <div className="p-1 bg-sky-500/80 backdrop-blur-md rounded text-white shadow-lg"><Map className="w-2.5 h-2.5" /></div>}
                                  {cat.qrEnabled && <div className="p-1 bg-amber-500/80 backdrop-blur-md rounded text-white shadow-lg"><QrCode className="w-2.5 h-2.5" /></div>}
                                  {cat.imagesEnabled && <div className="p-1 bg-emerald-500/80 backdrop-blur-md rounded text-white shadow-lg"><ImageIcon className="w-2.5 h-2.5" /></div>}
                                </div>
                                
                                {owningTeam && (
                                  <motion.div 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="px-4 py-1.5 rounded-xl font-black text-[10px] text-white shadow-2xl backdrop-blur-3xl border border-white/20 uppercase tracking-[0.1em] flex items-center gap-2"
                                    style={{ backgroundColor: `${owningTeam.color}E6` }}
                                  >
                                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                    <span>قسم: {owningTeam.name}</span>
                                  </motion.div>
                                )}
                              </div>
                           </div>

                           <div className="p-3 lg:p-4 bg-white flex-grow flex flex-col gap-3 relative">
                              {isFullyConsumed && (
                                <motion.div 
                                  initial={{ scale: 2, opacity: 0, rotate: -20 }}
                                  animate={{ scale: 1, opacity: 1, rotate: -15 }}
                                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
                                >
                                  <div className="border-4 border-emerald-500/30 text-emerald-500 px-6 py-2 rounded-2xl border-double flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm shadow-xl">
                                    <span className="text-3xl font-black tracking-tighter uppercase mb-0.5">مكتمل</span>
                                  </div>
                                </motion.div>
                              )}
                              
                              {isFullyConsumed ? (
                                <div className="flex flex-col items-center justify-center py-6 gap-2 opacity-20">
                                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                     <CheckCircle2 className="w-8 h-8 text-slate-400" />
                                   </div>
                                </div>
                              ) : (
                                <div className="flex flex-col gap-3">
                                  {Array.from(new Set(cat.questions.map(q => q.points))).sort((a: number, b: number) => a - b).map((points, pIdx) => {
                                    const unanswered = cat.questions.filter(q => q.points === points && !q.isAnswered);
                                    const hasPoints = cat.questions.some(q => q.points === points);
                                    
                                    if (!hasPoints) return <div key={points} />;
                                    
                                    const isSlotOccupied = session.occupiedSlots.includes(`${cat.id}-${points}`);
                                    const isDepleted = unanswered.length === 0;
                                    const isDisabled = isSlotOccupied || isDepleted;
                                    
                                    return (
                                        <motion.button
                                          key={points}
                                          initial={{ opacity: 0, scale: 0.95 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ delay: 0.4 + (pIdx * 0.1) }}
                                          whileHover={!isDisabled ? { scale: 1.02 } : {}}
                                          whileTap={!isDisabled ? { scale: 0.98 } : {}}
                                          aria-label={`قسم: ${cat.name} لـ ${points} نقطة`}
                                          disabled={isDisabled}
                                          onClick={() => {
                                            if (!isDisabled) {
                                              playSound('click');
                                              handleSelectQuestion(cat.id, unanswered[0].id);
                                            }
                                          }}
                                          className={`
                                            group/btn relative py-4 px-6 rounded-2xl transition-all duration-500 border-2 flex items-center justify-between
                                            ${isDisabled 
                                              ? 'bg-slate-50 text-slate-300 border-slate-100 grayscale cursor-not-allowed opacity-50' 
                                              : 'bg-white text-slate-900 border-slate-100 shadow-sm hover:border-[var(--theme-primary)] hover:shadow-lg'}
                                          `}
                                        >
                                          <div className="flex items-center gap-4">
                                             <div className={`w-3 h-3 rounded-full ${isDisabled ? 'bg-slate-200' : 'bg-[var(--theme-primary)] animate-pulse'}`} />
                                             <span className="text-sm font-black uppercase opacity-60">نقطة</span>
                                          </div>
                                          <span className="text-3xl font-black">{points}</span>
                                          {isDepleted && (
                                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                              <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />
                                            </div>
                                          )}
                                        </motion.button>
                                    );
                                  })}
                                </div>
                              )}
                           </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

            {(session?.status === 'question') && (
              <motion.div 
                key="question"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`max-w-[98%] mx-auto w-full px-2 md:px-0 flex flex-col transition-all duration-700 ${isFullscreen ? 'pt-4 pb-12' : 'pb-32 pt-0'}`}
              >
                <div className={`bg-white rounded-[48px] text-center border-4 border-slate-100 shadow-[0_40px_100px_rgba(0,0,0,0.08)] relative flex-grow transition-all duration-700 ${isFullscreen ? 'p-6 lg:p-10' : 'p-4 lg:p-6'} ${isFullscreen ? 'min-h-[85vh] flex flex-col justify-center' : ''} space-y-4`}>
                  <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-accent-blue via-accent-pink to-accent-gold" />
                  
                    {/* Branding and Progress in Question View */}
                  <div className="absolute top-8 inset-x-0 flex flex-col items-center gap-2 z-10 pointer-events-none">
                    {/* Elements removed by user request */}
                  </div>
                  
                  <div className="absolute top-3 md:top-10 right-3 md:right-10 flex flex-row gap-2 md:gap-4 z-10 scale-[0.8] md:scale-100 origin-top-right">
                    {/* Previous and Swap buttons removed by user request */}
                    <div className="flex gap-2 md:gap-4">
                      <div className="relative group">
                        <button 
                          onClick={() => { playSound('click'); handleAnswer('none', true); }}
                          aria-label="سحب نقاط من الفريق الخصم"
                          className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white border-2 border-slate-100 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-md"
                        >
                          <Users className="w-5 h-5 md:w-7 md:h-7" />
                        </button>
                        <div className="absolute top-full right-0 mt-3 hidden group-hover:block bg-slate-900/95 backdrop-blur-md text-white text-sm px-4 py-2 rounded-xl border border-white/20 whitespace-nowrap shadow-2xl z-20">
                          سحب نقاط من الفريق الخصم
                        </div>
                      </div>

                      <div className="relative group">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => { playSound('click'); handleShowThreeOptions(); }}
                          disabled={isGeneratingOptions}
                          className={`p-4 md:p-5 rounded-[24px] bg-white border-2 border-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all shadow-xl hover:shadow-indigo-200 relative overflow-hidden ${isGeneratingOptions ? 'animate-pulse' : ''}`}
                        >
                          {isGeneratingOptions ? (
                            <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin" />
                          ) : (
                            <div className="flex items-center gap-2">
                              <ListOrdered className="w-6 h-6 md:w-8 md:h-8" />
                              <SparklesIcon className="w-3 h-3 md:w-4 md:h-4 absolute top-2 right-2 animate-pulse" />
                            </div>
                          )}
                        </motion.button>
                        <div className="absolute top-full right-0 mt-3 hidden group-hover:block bg-slate-900/95 backdrop-blur-md text-white text-xs px-4 py-2 rounded-xl border border-white/20 whitespace-nowrap shadow-2xl z-20">
                          {isGeneratingOptions ? 'جاري إنشاء الخيارات...' : 'خمن من 3 خيارات (Lifeline)'}
                        </div>
                      </div>

                      <div className="relative group">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => { playSound('click'); handleSmartFetchImage(); }}
                          disabled={isFetchingImage}
                          aria-label={isFetchingImage ? 'جاري استحضار الصورة...' : 'جلب صورة ذكية لهذا السؤال'}
                          className={`p-4 md:p-5 rounded-[24px] bg-white border-2 border-amber-100 text-amber-500 hover:bg-amber-500 hover:text-white transition-all shadow-xl hover:shadow-amber-200 relative overflow-hidden ${isFetchingImage ? 'animate-pulse' : ''}`}
                        >
                          {isFetchingImage ? (
                            <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin" />
                          ) : (
                            <div className="flex items-center gap-2">
                              <ImagePlus className="w-6 h-6 md:w-8 md:h-8" />
                              <SparklesIcon className="w-3 h-3 md:w-4 md:h-4 absolute top-2 right-2 animate-pulse" />
                            </div>
                          )}
                        </motion.button>
                        <div className="absolute top-full right-0 mt-3 hidden group-hover:block bg-slate-900/95 backdrop-blur-md text-white text-xs px-4 py-2 rounded-xl border border-white/20 whitespace-nowrap shadow-2xl z-20">
                          {isFetchingImage ? 'جاري استحضار الصورة بالذكاء الاصطناعي...' : 'جلب صورة ذكية لهذا السؤال (AI)'}
                        </div>
                      </div>


                    </div>
                  </div>

                  <div className="absolute top-3 md:top-10 left-3 md:left-10 flex items-center gap-2 md:gap-3 z-20 scale-75 md:scale-100 origin-top-left">
                    <button 
                      onClick={() => {
                        if (session.selectedQuestionId) {
                          setPlayedQuestionIds(prev => Array.from(new Set([...prev, session.selectedQuestionId!])));
                        }
                        setSession({ ...session, status: 'selection', selectedCategoryId: null, selectedQuestionId: null });
                        setShowAnswer(false);
                        setShowQrCode(false);
                        setTimerActive(false);
                      }}
                      className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                      title="العودة"
                      aria-label="العودة"
                    >
                      <ArrowRight className="w-6 h-6 md:w-7 md:h-7" />
                    </button>

                    <button 
                      onClick={handleToggleFullscreen}
                      className={`p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all shadow-md hover:scale-110 ${isFullscreen ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-100' : 'bg-white border-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                      title={isFullscreen ? 'تصغير الشاشة' : 'تكبير الشاشة'}
                      aria-label={isFullscreen ? 'تصغير الشاشة' : 'تكبير الشاشة'}
                    >
                      {isFullscreen ? <Minimize2 className="w-6 h-6 md:w-7 md:h-7" /> : <Maximize2 className="w-6 h-6 md:w-7 md:h-7" />}
                    </button>

                    <button 
                      onClick={() => { playSound('click'); handleResetTimer(); }}
                      className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white border-2 border-slate-50 text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-all shadow-md hover:scale-110"
                      title="إعادة ضبط الوقت"
                      aria-label="إعادة ضبط الوقت"
                    >
                      <RotateCcw className="w-6 h-6 md:w-7 md:h-7" />
                    </button>
                  </div>

                  <div className="pt-20 lg:pt-14 space-y-6 max-w-6xl mx-auto">
                    <div className="space-y-4 flex flex-col items-center">
                      <div className="flex items-center gap-4">
                        <motion.div 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="px-6 py-3 bg-indigo-900 border-2 border-indigo-500/30 text-white rounded-3xl text-lg font-black shadow-xl shadow-indigo-100"
                        >
                          {session.categories.find(c => c.id === session.selectedCategoryId)?.name}
                        </motion.div>
                        <motion.div 
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="px-6 py-3 bg-amber-500 text-white rounded-3xl text-lg font-black shadow-xl shadow-amber-100 flex items-center gap-2"
                        >
                          <Star className="w-5 h-5 fill-white" />
                          {selectedQuestion && usedHintQuestionIds.includes(selectedQuestion.id) 
                            ? Math.round(selectedQuestion.points * 0.75) 
                            : selectedQuestion?.points} نقطة
                        </motion.div>
                      </div>
                      <div className="h-1.5 w-32 bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full opacity-30" />
                    </div>
                    
                    <div className={`flex flex-col ${selectedQuestion?.imagesEnabled || (selectedQuestion?.videoEnabled && selectedQuestion?.videoUrl) || selectedQuestion?.qrEnabled || selectedQuestion?.letterMode || (selectedQuestion?.mapMode && !selectedQuestion?.imageUrl) ? 'gap-2' : 'gap-4'} items-center w-full`}>
                      {selectedQuestion?.qrEnabled && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="w-full max-w-lg bg-white rounded-[40px] border-8 border-white shadow-[0_30px_100px_rgba(0,0,0,0.1)] p-8 flex flex-col items-center gap-6 relative group overflow-hidden mb-6"
                        >
                           <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-50" />
                           <div className="flex items-center gap-3 bg-amber-500 text-white px-6 py-2.5 rounded-2xl shadow-lg shadow-amber-100 font-black text-xs uppercase tracking-widest relative z-10">
                             <QrCode className="w-4 h-4" />
                             تحدي الباركود الذكي
                           </div>
                           
                           <div className="bg-white p-6 rounded-[32px] shadow-inner border-2 border-slate-50 relative z-10 group-hover:scale-[1.02] transition-transform duration-500">
                              <QRCodeSVG 
                                value={selectedQuestion.text || selectedQuestion.answer} 
                                size={220} 
                                level="H"
                                includeMargin={false}
                                imageSettings={{
                                  src: "https://img.icons8.com/color/512/trophy.png",
                                  x: undefined,
                                  y: undefined,
                                  height: 48,
                                  width: 48,
                                  excavate: true,
                                }}
                              />
                           </div>

                           <div className="text-center relative z-10">
                              <p className="text-slate-900 font-black text-lg mb-1">امسح الرمز ضوئياً</p>
                              <p className="text-slate-400 text-[10px] font-bold max-w-[200px] leading-relaxed">سيظهر لك المطلوب في هاتفك لتقوم بشرحه للفريق دون أن يراه أحد</p>
                           </div>

                           <div className="absolute bottom-4 right-4 bg-amber-500 text-white text-[8px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                              <SparklesIcon className="w-2.5 h-2.5" />
                              مدعوم بالذكاء الاصطناعي
                           </div>
                        </motion.div>
                      )}

                      {selectedQuestion?.letterMode && selectedQuestion?.letter && (
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                          animate={{ scale: 1, opacity: 1, rotate: 0 }}
                          className="w-32 h-32 bg-white rounded-[32px] border-[8px] border-slate-50 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] flex items-center justify-center font-black text-[80px] text-slate-900 leading-none pb-2 hover:scale-105 transition-transform relative z-10"
                        >
                          <span className="drop-shadow-sm select-none">{selectedQuestion.letter}</span>
                          <div className="absolute -top-4 -right-4 px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black tracking-widest uppercase shadow-lg">
                            تحدي الحروف
                          </div>
                        </motion.div>
                      )}

                      {(selectedQuestion?.videoEnabled && selectedQuestion?.videoUrl) && (
                        <motion.div
                          initial={{ opacity: 0, y: 40, scale: 0.85, rotateX: -15 }}
                          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                          className="w-full max-w-5xl rounded-[48px] overflow-hidden border-[10px] border-white shadow-[0_50px_150px_-30px_rgba(0,0,0,0.5)] bg-slate-950 mb-10 relative group perspective-2000"
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none z-10" />
                          
                          <div className="relative aspect-video w-full overflow-hidden flex items-center justify-center">
                            {getYouTubeId(selectedQuestion.videoUrl) ? (
                              <div className="w-full h-full relative">
                                <iframe
                                  src={`https://www.youtube.com/embed/${getYouTubeId(selectedQuestion.videoUrl)}?autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0&iv_load_policy=3&enablejsapi=1&origin=${window.location.origin}`}
                                  title="YouTube video player"
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                  className="w-full h-full absolute inset-0"
                                ></iframe>
                              </div>
                            ) : isDirectVideoLink(selectedQuestion.videoUrl) ? (
                              <video 
                                src={selectedQuestion.videoUrl}
                                autoPlay 
                                controls
                                preload="auto"
                                className="w-full h-full max-h-[85vh] object-contain shadow-2xl"
                                onPlay={() => console.log('Video started playing')}
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-white bg-slate-900 p-16 text-center border-slate-800">
                                <div className="w-28 h-28 bg-rose-500/10 rounded-full flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(244,63,94,0.2)] border-2 border-rose-500/20 animate-pulse">
                                  <Video className="w-14 h-14 text-rose-500" />
                                </div>
                                <h3 className="font-black text-4xl mb-4 text-white tracking-tight drop-shadow-lg">رابط الفيديو غير مدعوم</h3>
                                <p className="text-slate-400 text-xl max-w-xl mx-auto leading-relaxed mb-10 opacity-80">
                                  نعتذر، لم نتمكن من تشغيل هذا المحتوى. يرجى استخدام روابط يوتيوب رسمية أو روابط مباشرة لملفات فيديو عالية الجودة.
                                </p>
                                <div className="bg-slate-800/90 backdrop-blur-md px-8 py-4 rounded-[24px] border border-white/10 font-mono text-sm break-all max-w-2xl text-rose-300 shadow-2xl group/link cursor-help">
                                  <span className="opacity-50 text-[10px] block mb-1 uppercase tracking-widest text-slate-400">الرابط المكتشف:</span>
                                  {selectedQuestion.videoUrl}
                                  <div className="absolute top-2 right-2 opacity-0 group-hover/link:opacity-100 transition-opacity">
                                    <ExternalLink className="w-4 h-4 text-slate-500" />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Floating Badge */}
                          <div className="absolute top-8 right-8 bg-rose-600/95 backdrop-blur-xl text-white px-8 py-3.5 rounded-3xl border border-rose-400/40 shadow-[0_15px_30px_rgba(225,29,72,0.3)] font-black text-sm uppercase tracking-[0.1em] flex items-center gap-3 z-20 transform hover:scale-105 transition-transform">
                            <div className="relative">
                              <Film className="w-5 h-5 text-white" />
                              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
                            </div>
                            تحدي مقطع الفيديو
                          </div>
                          
                          {/* Controls Overlay (Bottom) */}
                          <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                             <div className="bg-black/60 backdrop-blur-2xl px-6 py-3 rounded-2xl text-white/80 text-xs font-bold border border-white/10 flex items-center gap-3 shadow-2xl">
                               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                               {selectedQuestion.videoUrl.substring(0, 40)}...
                             </div>
                             <div className="flex gap-3">
                               <button 
                                 onClick={() => { playSound('click'); window.open(selectedQuestion.videoUrl, '_blank'); }}
                                 className="bg-white/10 hover:bg-rose-600 backdrop-blur-2xl p-3.5 rounded-2xl border border-white/20 transition-all active:scale-95 shadow-2xl group/btn"
                                 title="فتح في نافذة جديدة"
                               >
                                 <ExternalLink className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
                               </button>
                               <button 
                                 className="bg-white/10 hover:bg-indigo-600 backdrop-blur-2xl p-3.5 rounded-2xl border border-white/20 transition-all active:scale-95 shadow-2xl"
                                 onClick={() => {
                                   playSound('click');
                                   const vid = document.querySelector('video');
                                   if(vid) vid.currentTime = 0;
                                 }}
                               >
                                 <RotateCcw className="w-5 h-5 text-white" />
                               </button>
                             </div>
                          </div>
                        </motion.div>
                      )}

                      {selectedQuestion?.mapMode && !selectedQuestion?.imageUrl && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="w-full max-w-4xl bg-white rounded-[32px] border-4 border-slate-100 shadow-2xl p-4 flex flex-col items-center gap-4"
                        >
                           <div className="flex items-center gap-3 bg-sky-50 px-6 py-2 rounded-2xl border border-sky-100 text-sky-600 font-black text-sm uppercase tracking-widest">
                             <Globe className="w-5 h-5" />
                             تحدي الخرائط الذكي
                           </div>
                           <div className="w-full h-[300px] bg-slate-50 rounded-2xl overflow-hidden relative group">
                              <img 
                                src={`https://www.google.com/maps/vt/pb=!1m4!1m3!1i6!2i0!3i0!2m3!1e0!2sm!3i420120488!3m8!2sar!3s${encodeURIComponent(selectedQuestion.answer)}!5e1105!12m4!1e68!2m2!1sset!2m1!1sv!4e0!5m1!5f2`}
                                alt="Map view"
                                className="w-full h-full object-cover blur-sm hover:blur-none transition-all duration-700"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                                <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                                   <Map className="w-6 h-6 text-indigo-500 animate-pulse" />
                                   <span className="font-black text-slate-800">جاري عرض الخريطة...</span>
                                </div>
                              </div>
                           </div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase">ملاحظة: يتم عرض الخريطة بناءً على اسم الدولة أو المكان في الإجابة</p>
                        </motion.div>
                      )}

                      {selectedQuestion?.imagesEnabled && selectedQuestion?.imageUrl && (
                        <motion.div 
                          layoutId="question-image"
                          initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
                          animate={{ 
                            opacity: 1, 
                            scale: showAnswer ? 1.05 : 1, 
                            rotate: 0,
                            borderColor: showAnswer ? '#10b981' : '#ffffff'
                          }}
                          transition={{ type: 'spring', damping: 12 }}
                          className="w-full max-w-lg relative group mb-4"
                        >
                          <div className={`absolute inset-0 ${showAnswer ? 'bg-emerald-500/30' : 'bg-indigo-500/20'} blur-[100px] -z-10 rounded-full transition-colors duration-1000`} />
                          <div className={`relative rounded-[32px] overflow-hidden border-[8px] transition-all duration-700 shadow-[0_20px_40px_rgba(0,0,0,0.15)] bg-white p-4 ${isFetchingImage ? 'opacity-50 grayscale blur-sm' : ''} ${showAnswer ? 'border-emerald-500 scale-105 shadow-emerald-200' : 'border-white'} cursor-pointer group`}
                               onClick={() => {
                                 if (!isFetchingImage) {
                                   playSound('click');
                                   handleSmartFetchImage();
                                 }
                               }}
                          >
                            <img 
                              key={selectedQuestion.imageUrl}
                              src={getProxiedImageUrl(selectedQuestion.imageUrl, selectedQuestion.text, selectedQuestion.answer)} 
                              alt="Logo Challenge" 
                              className="w-full max-h-[250px] object-contain group-hover:scale-105 transition-transform duration-700"
                              referrerPolicy="no-referrer"
                              onError={(e) => handleImageError(e, selectedQuestion.text, selectedQuestion.answer)}
                            />
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                              <RefreshCcw className="w-10 h-10 text-white drop-shadow-lg" />
                              <span className="text-white font-bold text-xs bg-black/40 px-3 py-1 rounded-full">إعادة المحاولة</span>
                            </div>
                            {isFetchingImage && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white/40">
                                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                              </div>
                            )}
                            <div className={`absolute top-6 left-6 ${showAnswer ? 'bg-emerald-600' : 'bg-slate-900/60'} text-white text-[10px] font-black px-4 py-2 rounded-full backdrop-blur-md uppercase tracking-[0.2em] flex items-center gap-2 transition-colors duration-500`}>
                              {showAnswer ? 'الإجابة الصحيحة' : (selectedCategory?.name || 'تحدي الصور')}
                              {showAnswer ? <Check className="w-3 h-3" /> : <SparklesIcon className="w-3 h-3 text-amber-400" />}
                            </div>
                            <div className="absolute bottom-6 right-6 bg-amber-500 text-white text-[8px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <SparklesIcon className="w-2.5 h-2.5" />
                              AI مولد بـ
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {selectedQuestion?.letterMode && selectedQuestion?.letter && (
                        <div className="flex items-center justify-center gap-2 mb-4 px-6 py-2.5 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-700 font-extrabold text-sm md:text-base shadow-sm">
                          <Languages className="w-5 h-5 shrink-0" />
                          <span>يرتبط الجواب بحرف:</span>
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-xl bg-indigo-600 text-white text-lg font-black leading-none">{selectedQuestion.letter}</span>
                        </div>
                      )}

                      <motion.h2 
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className={`${selectedQuestion?.imageUrl || (selectedQuestion?.videoEnabled && selectedQuestion?.videoUrl) ? 'text-xl md:text-2xl lg:text-4xl' : 'text-2xl md:text-3xl lg:text-5xl'} font-black leading-[1.8] md:leading-[1.8] lg:leading-[1.8] tracking-normal text-center max-w-6xl drop-shadow-2xl relative group px-6 lg:px-8 mb-6`}
                      >
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-slate-950 via-slate-800 to-slate-700 block py-2">
                          {selectedQuestion?.qrEnabled 
                            ? "تحدي الباركود: امسح الرمز لمعرفة المطلوب وشرحه للفريق" 
                            : selectedQuestion?.text}
                        </span>
                        
                        {(activeOptions.length > 0 || (selectedQuestion?.options && selectedQuestion.options.length > 0)) && (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-4xl mx-auto"
                          >
                            {(activeOptions.length > 0 ? activeOptions : (selectedQuestion?.options || [])).map((opt, oIdx) => (
                              <motion.div
                                key={oIdx}
                                whileHover={{ scale: 1.02 }}
                                className={`p-6 rounded-[28px] border-4 bg-white shadow-xl flex items-center justify-center text-center transition-all duration-500 ${showAnswer && opt === selectedQuestion?.answer ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-100 text-slate-700'}`}
                              >
                                <span className={`${opt.length > 50 ? 'text-sm' : 'text-lg md:text-xl'} font-black`}>{opt}</span>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}

                        <div className="absolute -left-12 lg:-left-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              playSound('click');
                              const textToCopy = `${selectedQuestion?.text}\nالإجابة: ${selectedQuestion?.answer}`;
                              navigator.clipboard.writeText(textToCopy);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                            className={`p-3 bg-white border rounded-full shadow-lg transition-all active:scale-95 ${copied ? 'text-emerald-500 border-emerald-200' : 'text-slate-400 hover:text-indigo-600 hover:border-indigo-200 border-slate-200'}`}
                            title="نسخ السؤال والإجابة"
                          >
                            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                          </button>
                        </div>
                      </motion.h2>



                      {/* Fallback image block disabled */}
                      {false && (
                        <motion.div 
                          layoutId="question-image"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ 
                            opacity: 1, 
                            scale: showAnswer ? 1.02 : 1,
                            y: showAnswer ? -10 : 0
                          }}
                          transition={{ delay: 0.2, type: 'spring' }}
                          className="w-full relative group max-w-4xl"
                        >
                          <div className={`absolute inset-x-0 -bottom-10 h-20 ${showAnswer ? 'bg-emerald-600/20' : 'bg-indigo-600/10'} blur-[80px] -z-10 rounded-full scale-90 transition-colors duration-1000`} />
                          <div className={`relative rounded-[32px] overflow-hidden border-[8px] transition-all duration-1000 shadow-[0_30px_60px_rgba(0,0,0,0.12)] group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.18)] ${isFetchingImage ? 'opacity-50 grayscale blur-sm' : ''} ${showAnswer ? 'border-emerald-500 shadow-emerald-200' : 'border-white'} cursor-pointer group flex items-center justify-center min-h-[200px] bg-slate-50`}
                               onClick={() => !isFetchingImage && handleSmartFetchImage()}
                          >
                            {selectedQuestion?.imageUrl ? (
                              <>
                                <img 
                                  key={selectedQuestion.imageUrl}
                                  src={getProxiedImageUrl(selectedQuestion.imageUrl, selectedQuestion.text, selectedQuestion.answer)} 
                                  alt="Question visualization" 
                                  className="w-full h-full object-contain max-h-[250px] group-hover:scale-[1.02] transition-transform duration-1000"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => handleImageError(e, selectedQuestion?.text || "", selectedQuestion?.answer || "")}
                                />
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                  <div className="p-4 bg-white/20 backdrop-blur-md rounded-full shadow-2xl">
                                    <RefreshCcw className="w-12 h-12 text-white" />
                                  </div>
                                  <span className="text-white font-black text-sm drop-shadow-md">إعادة توليد الصورة</span>
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col items-center justify-center gap-4 py-20 px-8 text-center bg-slate-100 w-full h-full">
                                <div className="p-6 bg-white rounded-full text-indigo-500 shadow-lg mb-2">
                                  <ImagePlus className="w-12 h-12 animate-bounce" />
                                </div>
                                <h3 className="text-xl font-black text-slate-700">بانتظار الصورة...</h3>
                                <p className="text-slate-500 font-bold max-w-xs leading-relaxed">انقر هنا لمحاولة جلب صورة ذكية لهذا السؤال بشكل آلي</p>
                              </div>
                            )}
                            
                            {isFetchingImage && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                                <div className="flex flex-col items-center gap-4">
                                  <Loader2 className="w-16 h-16 text-white animate-spin drop-shadow-lg" />
                                  <span className="text-white font-black text-lg tracking-wider animate-pulse">جاري جلب الصورة...</span>
                                </div>
                              </div>
                            )}
                            <div className={`absolute bottom-10 right-10 ${showAnswer ? 'bg-emerald-600' : 'bg-amber-500'} text-white text-xs font-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 group-hover:scale-110 transition-all duration-500`}>
                              {showAnswer ? <CheckCircle2 className="w-4 h-4" /> : <SparklesIcon className="w-4 h-4" />}
                              {showAnswer ? 'التوافق الذكي للإجابة' : 'مدعوم بالذكاء الاصطناعي'}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t-4 border-slate-50 flex flex-col items-center gap-4">
                    {!showAnswer ? (
                      <div className="flex flex-col items-center gap-6">
                        <div className="relative group">
                          {/* Answer Reveal Button */}
                          <div className="absolute inset-x-0 -bottom-4 h-12 bg-slate-900/20 blur-2xl rounded-full scale-90 group-hover:scale-100 transition-transform duration-500" />
                          <motion.button 
                            whileHover={{ scale: 1.05, y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => { playSound('click'); setShowAnswer(true); }}
                            className="px-8 md:px-12 py-4 md:py-5 bg-slate-950/90 backdrop-blur-xl text-white rounded-[24px] font-black text-lg md:text-2xl hover:bg-slate-900 transition-all flex items-center gap-3 md:gap-4 relative z-10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] ring-1 ring-white/10"
                          >
                            <HelpCircle className="w-8 h-8 md:w-12 md:h-12 text-amber-400 animate-pulse" />
                            <span className="tracking-tight leading-none pt-1">كشف الإجابة الصحيحة</span>
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        transition={{ 
                          type: 'spring',
                          stiffness: 100,
                          damping: 15,
                          mass: 1
                        }}
                        className="w-full max-w-4xl"
                      >
                        <div className="p-8 rounded-[48px] bg-white border-4 border-emerald-500/30 text-slate-900 shadow-[0_30px_60px_-10px_rgba(16,185,129,0.2)] relative overflow-hidden group">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute top-0 inset-x-0 h-2 bg-emerald-500" 
                          />
                            <div className="text-[10px] font-black mb-4 opacity-40 tracking-[0.4em] uppercase flex items-center justify-center gap-4">
                            <div className="w-12 h-px bg-slate-300" />
                            الإجابة النموذجية
                            <div className="w-12 h-px bg-slate-300" />
                          </div>
                          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
                            {selectedQuestion?.imageUrl && (
                              <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="w-full lg:w-1/3 aspect-square rounded-[32px] overflow-hidden border-4 border-slate-50 shadow-lg relative group/answerimg"
                              >
                                <img 
                                  src={getProxiedImageUrl(selectedQuestion.imageUrl, selectedQuestion.text, selectedQuestion.answer)} 
                                  alt="Answer Visual"
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover/answerimg:scale-110"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => handleImageError(e, selectedQuestion?.text || "", selectedQuestion?.answer || "")}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                              </motion.div>
                            )}
                            
                            <div className="flex-1 text-center lg:text-right w-full">
                              <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-3xl lg:text-5xl font-black mb-6 leading-[1.8] tracking-normal"
                              >
                                {selectedQuestion?.answer}
                              </motion.div>
                              
                              {selectedQuestion?.source && (
                                <motion.div 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.6 }}
                                  className="text-sm font-black text-slate-400 pt-8 border-t-2 border-slate-100 flex items-center justify-center lg:justify-start gap-4"
                                >
                                  <Info className="w-5 h-5 text-indigo-500" />
                                  <span className="opacity-60">المصدر الموثق:</span>
                                  {selectedQuestion.sourceUrl || selectedCategory?.sourceUrl ? (
                                    <a 
                                      href={selectedQuestion.sourceUrl || selectedCategory?.sourceUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-slate-600 underline underline-offset-4 decoration-indigo-200 hover:text-indigo-600 transition-colors flex items-center gap-2 group/source"
                                    >
                                      {selectedQuestion.source}
                                      <ExternalLink className="w-3 h-3 opacity-40 group-hover/source:opacity-100 transition-opacity" />
                                    </a>
                                  ) : (
                                    <span className="text-slate-600 underline underline-offset-4 decoration-indigo-200">{selectedQuestion.source}</span>
                                  )}
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-4 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {session.teams.map((team, idx) => (
                        <motion.button 
                          initial={{ opacity: 0, x: idx === 0 ? -30 : 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + (idx * 0.1) }}
                          key={team.id}
                          onClick={() => { playSound('click'); handleAnswer(team.id); }}
                          className="group relative overflow-hidden py-4 lg:py-6 px-6 lg:px-10 rounded-[32px] bg-white border-4 transition-all flex flex-col items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-95"
                          style={{ borderColor: `${team.color}20`, boxShadow: `0 30px 60px -20px ${team.color}15` }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = team.color || '#4f46e5';
                            e.currentTarget.style.boxShadow = `0 40px 80px -20px ${team.color}30`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = `${team.color}20`;
                            e.currentTarget.style.boxShadow = `0 30px 60px -20px ${team.color}15`;
                          }}
                        >
                          <div className="flex items-center gap-4 md:gap-6">
                            <motion.div 
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center border-4"
                              style={{ borderColor: team.color, color: team.color }}
                            >
                              <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10" />
                            </motion.div>
                            <div className="text-right">
                              <div className="text-xl md:text-3xl font-black text-slate-800">إجابة صحيحة</div>
                              <div className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 px-3 py-1 rounded-lg border border-slate-100/50">
                                لفريق {team.name}
                              </div>
                            </div>
                          </div>
                          
                          <div className="absolute top-6 left-10 text-5xl font-black opacity-10 flex items-center gap-2" style={{ color: team.color }}>
                            <span className="text-2xl mt-4">+</span>
                            {selectedQuestion?.points}
                          </div>
                          
                          <div className="absolute inset-0 bg-white group-hover:bg-opacity-0 transition-opacity pointer-events-none -z-10" />
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none -z-10" style={{ backgroundColor: team.color }} />
                        </motion.button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {!isBonusTime && (
                        <motion.button 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          onClick={() => { playSound('click'); handlePassToOpponent(); }}
                          className="group py-4 md:py-6 px-6 md:px-8 rounded-[24px] md:rounded-[28px] bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 md:gap-4 font-black text-lg md:text-xl shadow-xl shadow-indigo-200 relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                          <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform h-mirror" />
                          <span>تمرير الدور</span>
                        </motion.button>
                      )}

                      <motion.button 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        onClick={() => { playSound('click'); handleSkipQuestion(); }}
                        className={`group py-4 md:py-6 px-6 md:px-8 rounded-[24px] md:rounded-[28px] bg-amber-500 text-white hover:bg-amber-600 transition-all flex items-center justify-center gap-3 md:gap-4 font-black text-lg md:text-xl shadow-xl shadow-amber-200 relative overflow-hidden ${isBonusTime ? 'md:col-span-1' : ''}`}
                      >
                        <FastForward className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform h-mirror" />
                        <span>تجاوز السؤال</span>
                      </motion.button>

                      <motion.button 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={() => { playSound('click'); handleAnswer('none'); }}
                        className={`group py-4 md:py-6 px-6 md:px-8 rounded-[24px] md:rounded-[28px] bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 border-[3px] border-slate-200/60 transition-all flex items-center justify-center gap-3 md:gap-4 font-black text-lg md:text-xl ${isBonusTime ? 'md:col-span-1' : ''}`}
                      >
                        <XCircle className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-90 transition-transform duration-500" />
                        <span>إلغاء السؤال</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {(session?.status === 'result') && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto text-center space-y-12 py-10 pb-32 px-4"
              >
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-amber-500 blur-[120px] opacity-30 animate-pulse" />
                  <div className="relative p-16 bg-white rounded-[60px] border-4 border-amber-500 shadow-2xl shadow-amber-200/50 mb-8 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-50/50 to-transparent" />
                    <img 
                      src={logoSource} 
                      alt="Victory Logo" 
                      className="w-56 h-56 object-contain mx-auto relative z-10 drop-shadow-2xl"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src = "https://img.icons8.com/color/512/trophy.png";
                        target.className = "w-48 h-48 opacity-60 mx-auto";
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-6xl font-black text-slate-800 tracking-tighter">نتائج المسابقة</h2>
                  <div className="flex justify-center gap-6 mt-6">
                    <div className="px-10 py-5 bg-white rounded-[32px] border-2 border-slate-100 shadow-xl flex items-center gap-6 group hover:border-indigo-100 transition-all">
                      <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <RefreshCcw className="w-8 h-8 text-indigo-600 animate-spin-slow" />
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">إجمالي الوقت المستغرق</div>
                        <div className="text-4xl font-black text-slate-800 tracking-tighter">{formatDuration(gameDuration)}</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xl font-bold mt-8">تحية طيبة لجميع المتسابقين على روحهم الرياضية</p>
                </div>
                
                <div className="space-y-16">
                  {/* Dynamic Winner Celebration Card */}
                  {(() => {
                    const sorted = [...session.teams].sort((a,b) => b.score - a.score);
                    const topScore = sorted[0].score;
                    const winners = session.teams.filter(t => t.score === topScore);
                    const isDraw = winners.length > 1;

                    if (isDraw) {
                      return (
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="bg-white p-16 rounded-[64px] border-8 border-slate-100 shadow-2xl text-center relative overflow-hidden"
                        >
                           <div className="absolute inset-0 pointer-events-none z-0">
                             {[...Array(50)].map((_, i) => {
                               const angle = (Math.PI * 2 * i) / 50;
                               const velocity = 300 + Math.random() * 500;
                               return (
                                 <motion.div
                                   key={i}
                                   initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                   animate={{ 
                                     opacity: [0, 1, 1, 0],
                                     scale: [0, 1.2, 1.2, 0],
                                     x: Math.cos(angle) * velocity,
                                     y: Math.sin(angle) * velocity + (Math.random() * 300),
                                     rotate: 360 * 2 * Math.random()
                                   }}
                                   transition={{ duration: 4, repeat: Infinity, delay: Math.random() * 2 }}
                                   className={`absolute left-1/2 top-1/2 w-4 h-4 ${
                                     ['bg-amber-400', 'bg-emerald-400', 'bg-indigo-400', 'bg-rose-400', 'bg-sky-400', 'bg-pink-400'][i % 6]
                                   } ${i % 2 === 0 ? 'rounded-full' : 'rounded-sm rotate-45'}`}
                                 />
                               );
                             })}
                           </div>

                           <motion.div
                             animate={{ rotate: [0, 10, -10, 0] }}
                             transition={{ duration: 5, repeat: Infinity }}
                             className="relative z-10"
                           >
                            <Users className="w-24 h-24 text-slate-300 mx-auto mb-6" />
                           </motion.div>
                           <h2 className="text-5xl font-black text-slate-800 mb-4 relative z-10">تعادل الأبطال!</h2>
                           <div className="flex flex-wrap justify-center gap-4 mb-6 relative z-10">
                             {winners.map(w => (
                               <div key={w.id} className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 bg-white/50 backdrop-blur-sm" style={{ borderColor: `${w.color}40`, color: w.color }}>
                                 <Star className="w-4 h-4 fill-current" />
                                 <span className="font-black">{w.name}</span>
                               </div>
                             ))}
                           </div>
                           <p className="text-slate-400 text-xl font-bold relative z-10">مباراة تاريخية وأداء متكافئ من العمالقة</p>
                        </motion.div>
                      );
                    }

                    const winner = winners[0];

                    return (
                      <>
                        <motion.div 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="p-16 rounded-[64px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] text-center relative overflow-hidden border-8 border-slate-100 bg-white z-10"
                      >
                        <div className="absolute inset-0 pointer-events-none z-0">
                           {[...Array(60)].map((_, i) => {
                             const angle = (Math.PI * 2 * i) / 60;
                             const velocity = 350 + Math.random() * 600;
                             return (
                               <motion.div
                                 key={i}
                                 initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                 animate={{ 
                                   opacity: [0, 1, 1, 0],
                                   scale: [0, 1.4, 1.4, 0],
                                   x: Math.cos(angle) * velocity,
                                   y: Math.sin(angle) * velocity + (Math.random() * 400),
                                   rotate: 360 * 3 * Math.random()
                                 }}
                                 transition={{ duration: 5, repeat: Infinity, delay: Math.random() * 2 }}
                                 className={`absolute left-1/2 top-1/2 w-4 h-4 ${
                                   ['bg-amber-400', 'bg-emerald-400', 'bg-indigo-400', 'bg-rose-400', 'bg-sky-400', 'bg-pink-400'][i % 6]
                                 } ${i % 2 === 0 ? 'rounded-full' : 'rounded-sm rotate-45'}`}
                               />
                             );
                           })}
                         </div>

                        <motion.div 
                          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05], rotate: 360 }}
                          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                          className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-[100px] pointer-events-none" 
                          style={{ backgroundColor: winner.color }}
                        />


                          <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1], rotate: 360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-[100px] pointer-events-none" 
                          />
                        <div className="relative z-10 flex flex-col items-center">
                          <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1.1, rotate: 0 }}
                            transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
                            className="mb-8 p-10 bg-slate-50 border-4 border-white rounded-[48px] shadow-2xl cursor-pointer hover:scale-105 transition-transform"
                            style={{ color: winner.color }}
                          >
                            <Trophy className="w-32 h-32 drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)]" />
                          </motion.div>
                          
                          <motion.span 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-slate-400 font-black text-xl uppercase tracking-[0.4em] mb-4"
                          >
                            بطل المسابقة
                          </motion.span>
                          
                          <motion.h1 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-8xl font-black mb-8 drop-shadow-xl tracking-tighter"
                            style={{ color: winner.color }}
                          >
                            {winner.name}
                          </motion.h1>

                           <motion.div 
                             initial={{ y: 20, opacity: 0 }}
                             animate={{ y: 0, opacity: 1 }}
                             transition={{ delay: 0.8 }}
                             className="flex flex-col items-center gap-6"
                           >
                             <div className="text-left py-6 px-12 bg-white border-2 border-slate-50 rounded-[40px] shadow-xl">
                                <span className="block text-slate-400 text-xs font-black uppercase tracking-widest leading-none mb-2 text-center">الرصيد النهائي</span>
                                <div className="flex items-center gap-4">
                                  <Star className="w-8 h-8 text-amber-400 fill-current" />
                                  <span className="text-7xl font-black text-slate-900 tracking-widest leading-none" style={{ color: winner.color }}>{winner.score}</span>
                                </div>
                             </div>
                            </motion.div>
                          </div>
                        </motion.div>

                       </>
                    );
                  })()}
                </div>

                <div className="grid gap-6 max-w-2xl mx-auto">
                  <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest text-center mb-2">الترتيب العام</h3>
                  {session.teams
                    .slice()
                    .sort((a,b) => b.score - a.score)
                    .map((team, idx) => {
                      return (
                        <motion.div 
                          key={team.id} 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1 + (idx * 0.1) }}
                          className={`p-8 rounded-[32px] border-2 transition-all shadow-xl bg-white flex items-center justify-between`}
                          style={{ borderColor: `${team.color}40` }}
                        >
                          <div className="flex items-center gap-6">
                            <span className="text-2xl font-black text-slate-300">#{idx + 1}</span>
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl" style={{ backgroundColor: team.color }}>
                              {team.name.charAt(0)}
                            </div>
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-2xl font-black text-slate-900 tracking-tight">{team.name}</span>
                            <div className="w-12 h-1 bg-current opacity-20 rounded-full" style={{ color: team.color }} />
                          </div>
                          </div>
                          <span className="text-4xl font-black text-slate-900" style={{ color: team.color }}>{team.score}</span>
                        </motion.div>
                      );
                    })}
                </div>

                {/* Question Auto-Generation Status Panel */}
                {(isRegenerating || regSuccess || regError) && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl mx-auto p-8 rounded-[32px] border bg-white flex flex-col gap-4 text-right shadow-xl relative overflow-hidden" 
                    style={{ borderColor: regError ? '#fee2e2' : regSuccess ? '#bbf7d0' : '#e2e8f0' }}
                  >
                    <div className="flex items-center gap-6 justify-between flex-row-reverse">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${regError ? 'bg-red-50 text-red-500' : regSuccess ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-indigo-600'}`}>
                        {regError ? <XCircle className="w-8 h-8" /> : regSuccess ? <CheckCircle2 className="w-8 h-8 animate-bounce" /> : <RefreshCcw className="w-8 h-8 animate-spin" />}
                      </div>
                      <div className="flex-1 text-right">
                        <h4 className="text-xl font-bold text-slate-800">التحديث التلقائي لأسئلة الجولة الجديدة</h4>
                        <p className={`text-md mt-1 font-bold ${regError ? 'text-red-500 font-bold' : regSuccess ? 'text-green-600 font-bold' : 'text-indigo-600 dark:text-indigo-500 font-bold'}`}>
                          {regProgress || regError}
                        </p>
                      </div>
                    </div>
                    {isRegenerating && (
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2 relative">
                        <motion.div 
                          className="bg-indigo-600 h-full rounded-full" 
                          animate={{ 
                            left: ["0%", "100%"],
                            width: ["30%", "10%"]
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 1.5,
                            ease: "easeInOut"
                          }}
                          style={{ position: 'absolute' }}
                        />
                      </div>
                    )}
                  </motion.div>
                )}

                <div className="flex justify-center pt-8">
                  <button 
                    disabled={isRegenerating}
                    onClick={() => { playSound('click'); resetGame(); }}
                    className={`px-12 py-5 bg-white border-2 border-slate-200 hover:bg-slate-50 rounded-2xl flex items-center justify-center gap-4 transition-all font-black text-xl text-slate-700 shadow-xl shadow-slate-100 ${isRegenerating ? 'opacity-40 cursor-not-allowed select-none bg-slate-50 border-slate-200' : ''}`}
                  >
                    {isRegenerating ? <RefreshCcw className="w-6 h-6 animate-spin text-slate-400" /> : <RotateCcw className="w-6 h-6" />}
                    مباراة جديدة
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  </main>

      <footer className={`w-full py-8 text-center shrink-0 mt-20 border-t border-slate-100 bg-white/50 backdrop-blur-sm transition-all duration-500 ${isFullscreen && session.status === 'question' ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
        <p className="text-sm font-black text-slate-600 tracking-tight">
          جميع حقوق الطبع محفوظة للمصمم ابوالفواطم 2026
        </p>
      </footer>
    </div>
  );
}
