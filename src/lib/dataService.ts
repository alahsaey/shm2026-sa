import { 
  collection, 
  getDocs, 
  addDoc, 
  setDoc, 
  doc, 
  query, 
  where, 
  serverTimestamp,
  orderBy,
  limit,
  deleteDoc,
  updateDoc,
  FirestoreError,
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from './firebase';

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: { providerId: string; displayName: string; email: string; }[];
  }
}

const handleFirestoreError = (error: any, operationType: FirestoreErrorInfo['operationType'], path: string | null = null, shouldThrow = true) => {
  const isQuotaError = error?.message?.includes('Quota') || error?.code === 'resource-exhausted';
  
  if (isQuotaError) {
    const quotaMsg = "تم تجاوز حصة العمليات المجانية (Quota Exceeded). يرجى المحاولة غداً عند إعادة ضبط الحصة.";
    if (shouldThrow) {
      throw new Error(quotaMsg);
    } else {
      console.error(quotaMsg, error);
      return new Error(quotaMsg);
    }
  }

  if (error && (error as FirestoreError).code === 'permission-denied') {
    const user = auth.currentUser;
    const errorInfo: FirestoreErrorInfo = {
      error: (error as Error).message,
      operationType,
      path,
      authInfo: {
        userId: user?.uid || 'not-signed-in',
        email: user?.email || '',
        emailVerified: user?.emailVerified || false,
        isAnonymous: user?.isAnonymous || false,
        providerInfo: user?.providerData.map(p => ({
          providerId: p.providerId,
          displayName: p.displayName || '',
          email: p.email || ''
        })) || []
      }
    };
    const finalErr = new Error(JSON.stringify(errorInfo));
    if (shouldThrow) {
      throw finalErr;
    } else {
      console.error("Firestore Access Denied info:", finalErr);
      return finalErr;
    }
  }
  
  if (shouldThrow) {
    throw error;
  } else {
    console.error("Firestore async background error:", error);
    return error;
  }
};

/**
 * Removes undefined fields from an object to prevent Firestore from crashing
 */
const cleanData = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return obj;
  if (obj.constructor && obj.constructor.name !== 'Object' && obj.constructor.name !== 'Array') return obj;
  if (Array.isArray(obj)) return obj.map(cleanData);

  const newObj: any = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      newObj[key] = cleanData(obj[key]);
    }
  });
  return newObj;
};

export interface DBCategory {
  id: string;
  name: string;
  group?: string;
  sourceUrl?: string;
  sourceText?: string;
  lastSyncedAt?: any; // New field for sync tracking
  imageUrl?: string;
  iconUrl?: string;
  borderColor?: string;
  customShadow?: string;
  order?: number;
  letterMode?: boolean; // New field for Letter based questions for whole category
  imagesEnabled?: boolean; // New field to enable images specifically or for the category
  qrEnabled?: boolean;
  videoEnabled?: boolean;
  mapMode?: boolean;
  imageMode?: boolean;
  timerDuration?: number;
  letter?: string;
  description?: string;
  isActive?: boolean;
  createdAt?: any;
}

export interface DBQuestion {
  id: string;
  categoryId: string;
  text: string;
  answer: string;
  source?: string;
  sourceUrl?: string;
  points: number;
  imageUrl?: string;
  videoUrl?: string;
  videoEnabled?: boolean;
  qrEnabled?: boolean;
  letterMode?: boolean; // New field for Letter based questions
  imagesEnabled?: boolean; // New field to enable images for the question
  mapMode?: boolean;
  letter?: string; // The specific Arabic letter
  options?: string[]; // New field for multiple choice options
  hint?: string; // New field for smart hints
  createdAt?: any;
}

export interface DBGroup {
  id: string;
  name: string;
  order: number;
  createdAt?: any;
}

export interface DBGameSession {
  id?: string;
  creatorId?: string;
  createdAt: any;
  teams: { name: string, score: number, color?: string, selectedCategories: string[] }[];
  winnerId?: string;
  categories: string[];
  duration?: number; // in seconds
  isCompleted?: boolean;
  currentTurn?: string;
  selectedCategoryId?: string | null;
  selectedQuestionId?: string | null;
  status?: string;
  occupiedSlots?: string[];
}

export interface DBAppSettings {
  logoUrl?: string;
  adminImageUrl?: string;
  competitionName?: string;
  competitionSlogan?: string;
  correctSoundUrl?: string;
  wrongSoundUrl?: string;
  beepSoundUrl?: string;
  introSoundUrl?: string;
  clickSoundUrl?: string;
  correctImageUrl?: string;
  wrongImageUrl?: string;
  correctSoundVolume?: number;
  wrongSoundVolume?: number;
  beepVolume?: number;
  introSoundVolume?: number;
  clickSoundVolume?: number;
  victorySoundUrl?: string;
  victorySoundVolume?: number;
  enableSounds?: boolean;
  timerDuration?: number;
  enableCrowdNoise?: boolean;
  crowdNoiseVolume?: number;
  crowdNoiseUrl?: string;
  themeId?: string;
}

export const dataService = {
  // Global Settings
  subscribeSettings(callback: (settings: DBAppSettings | null) => void, onError?: (err: any) => void): () => void {
    const q = collection(db, 'settings');
    return onSnapshot(q, (snap) => {
      if (snap.empty) {
        callback(null);
      } else {
        callback(snap.docs[0].data() as DBAppSettings);
      }
    }, (e) => {
      if (onError) onError(e);
      handleFirestoreError(e, 'list', 'settings', false);
    });
  },

  async getSettings(): Promise<DBAppSettings | null> {
    try {
      const snap = await getDocs(collection(db, 'settings'));
      if (snap.empty) return null;
      return snap.docs[0].data() as DBAppSettings;
    } catch (e) {
      return handleFirestoreError(e, 'list', 'settings');
    }
  },

  async updateSettings(settings: DBAppSettings) {
    try {
      const snap = await getDocs(collection(db, 'settings'));
      const cleaned = cleanData(settings);
      if (snap.empty) {
        await addDoc(collection(db, 'settings'), cleaned);
      } else {
        await updateDoc(doc(db, 'settings', snap.docs[0].id), cleaned);
      }
    } catch (e) {
      return handleFirestoreError(e, 'update', 'settings');
    }
  },

  // Statistics/Sessions
  subscribeGameSessions(isAdmin: boolean, userId?: string, callback?: (sessions: DBGameSession[]) => void, onError?: (err: any) => void): () => void {
    let q = query(collection(db, 'sessions'), orderBy('createdAt', 'desc'), limit(200));
    
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as DBGameSession));
      if (isAdmin) {
        callback?.(data);
      } else {
        callback?.(data.filter(s => s.creatorId === userId));
      }
    }, (e) => {
      if (onError) onError(e);
      handleFirestoreError(e, 'list', 'sessions', false);
    });
  },

  subscribeSession(sessionId: string, callback: (session: DBGameSession | null) => void, onError?: (err: any) => void): () => void {
    return onSnapshot(doc(db, 'sessions', sessionId), (snap) => {
      if (snap.exists()) {
        callback({ id: snap.id, ...snap.data() } as DBGameSession);
      } else {
        callback(null);
      }
    }, (e) => {
      if (onError) onError(e);
      handleFirestoreError(e, 'get', `sessions/${sessionId}`, false);
    });
  },

  async saveGameSession(session: Omit<DBGameSession, 'id'>, sessionId?: string) {
    try {
      const data = {
        ...session,
        createdAt: session.createdAt || serverTimestamp()
      };
      const cleaned = cleanData(data);
      if (sessionId) {
        await setDoc(doc(db, 'sessions', sessionId), cleaned, { merge: true });
        return { id: sessionId };
      } else {
        return await addDoc(collection(db, 'sessions'), cleaned);
      }
    } catch (e) {
      return handleFirestoreError(e, 'create', 'sessions');
    }
  },

  async getGameSessions(): Promise<DBGameSession[]> {
    try {
      const q = query(collection(db, 'sessions'), orderBy('createdAt', 'desc'), limit(100));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as DBGameSession));
    } catch (e) {
      return handleFirestoreError(e, 'list', 'sessions');
    }
  },

  // Reactions & Comments subcollection methods
  async sendReaction(sessionId: string, reaction: { emoji?: string, comment?: string, senderName?: string }) {
    try {
      const data = {
        ...reaction,
        createdAt: serverTimestamp()
      };
      const cleaned = cleanData(data);
      return await addDoc(collection(db, `sessions/${sessionId}/reactions`), cleaned);
    } catch (e) {
      return handleFirestoreError(e, 'create', `sessions/${sessionId}/reactions`);
    }
  },

  subscribeReactions(sessionId: string, onNewReaction: (reaction: any) => void, onError?: (err: any) => void): () => void {
    const q = query(
      collection(db, `sessions/${sessionId}/reactions`),
      orderBy('createdAt', 'asc')
    );
    
    let isInitial = true;
    return onSnapshot(q, (snap) => {
      snap.docChanges().forEach((change) => {
        if (change.type === 'added') {
          if (isInitial) return;
          const data = { id: change.doc.id, ...change.doc.data() };
          onNewReaction(data);
        }
      });
      isInitial = false;
    }, (e) => {
      if (onError) onError(e);
      handleFirestoreError(e, 'list', `sessions/${sessionId}/reactions`, false);
    });
  },

  // Groups
  subscribeGroups(callback: (groups: DBGroup[]) => void, onError?: (err: any) => void): () => void {
    const q = query(collection(db, 'groups'), orderBy('order', 'asc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as DBGroup)));
    }, (e) => {
      if (onError) onError(e);
      handleFirestoreError(e, 'list', 'groups', false);
    });
  },

  async getGroups(): Promise<DBGroup[]> {
    try {
      const q = query(collection(db, 'groups'), orderBy('order', 'asc'));
      const caps = await getDocs(q);
      return caps.docs.map(d => ({ id: d.id, ...d.data() } as DBGroup));
    } catch (e) {
      return handleFirestoreError(e, 'list', 'groups');
    }
  },

  async addGroup(group: Omit<DBGroup, 'id' | 'createdAt'>) {
    try {
      return await addDoc(collection(db, 'groups'), cleanData({
        ...group,
        createdAt: serverTimestamp()
      }));
    } catch (e) {
      return handleFirestoreError(e, 'create', 'groups');
    }
  },

  async updateGroup(groupId: string, data: Partial<DBGroup>) {
    try {
      await updateDoc(doc(db, 'groups', groupId), cleanData(data));
    } catch (e) {
      return handleFirestoreError(e, 'update', `groups/${groupId}`);
    }
  },

  async deleteGroup(groupId: string) {
    try {
      await deleteDoc(doc(db, 'groups', groupId));
    } catch (e) {
      return handleFirestoreError(e, 'delete', `groups/${groupId}`);
    }
  },

  // Categories
  subscribeCategories(callback: (categories: DBCategory[]) => void, onError?: (err: any) => void): () => void {
    const q = collection(db, 'categories');
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as DBCategory)));
    }, (e) => {
      if (onError) onError(e);
      handleFirestoreError(e, 'list', 'categories', false);
    });
  },

  async getCategories(): Promise<DBCategory[]> {
    try {
      const caps = await getDocs(collection(db, 'categories'));
      return caps.docs.map(d => ({ id: d.id, ...d.data() } as DBCategory));
    } catch (e) {
      return handleFirestoreError(e, 'list', 'categories');
    }
  },

  async addCategory(cat: Omit<DBCategory, 'id'>) {
    try {
      return await addDoc(collection(db, 'categories'), cleanData({
        ...cat,
        createdAt: serverTimestamp()
      }));
    } catch (e) {
      return handleFirestoreError(e, 'create', 'categories');
    }
  },

  async deleteCategory(catId: string) {
    try {
      await deleteDoc(doc(db, 'categories', catId));
    } catch (e) {
      return handleFirestoreError(e, 'delete', `categories/${catId}`);
    }
  },

  async updateCategory(catId: string, data: Partial<DBCategory>) {
    try {
      await updateDoc(doc(db, 'categories', catId), cleanData(data));
    } catch (e) {
      return handleFirestoreError(e, 'update', `categories/${catId}`);
    }
  },

  // Questions
  subscribeQuestions(catId: string, callback: (questions: DBQuestion[]) => void, onError?: (err: any) => void): () => void {
    const q = query(collection(db, `categories/${catId}/questions`), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, categoryId: catId, ...d.data() } as DBQuestion)));
    }, (e) => {
      if (onError) onError(e);
      handleFirestoreError(e, 'list', `categories/${catId}/questions`, false);
    });
  },

  async getQuestions(catId: string): Promise<DBQuestion[]> {
    try {
      const q = query(collection(db, `categories/${catId}/questions`), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, categoryId: catId, ...d.data() } as DBQuestion));
    } catch (e) {
      return handleFirestoreError(e, 'list', `categories/${catId}/questions`);
    }
  },

  async addQuestion(catId: string, question: Omit<DBQuestion, 'id' | 'categoryId'>) {
    try {
      return await addDoc(collection(db, `categories/${catId}/questions`), cleanData({
        ...question,
        createdAt: serverTimestamp()
      }));
    } catch (e) {
      return handleFirestoreError(e, 'create', `categories/${catId}/questions`);
    }
  },

  async updateQuestion(catId: string, qId: string, data: Partial<DBQuestion>) {
    try {
      await updateDoc(doc(db, `categories/${catId}/questions`, qId), cleanData(data));
    } catch (e) {
      return handleFirestoreError(e, 'update', `categories/${catId}/questions/${qId}`);
    }
  },

  async deleteQuestion(catId: string, qId: string) {
    try {
      await deleteDoc(doc(db, `categories/${catId}/questions`, qId));
    } catch (e) {
      return handleFirestoreError(e, 'delete', `categories/${catId}/questions/${qId}`);
    }
  },

  // Seed initial data
  async seedInitialData(categories: any[]) {
    try {
      // 1. Ensure Groups exist first
      const groupsSnap = await getDocs(collection(db, 'groups'));
      const existingGroups = new Set(groupsSnap.docs.map(d => d.data().name));
      
      const distinctGroups = Array.from(new Set(categories.map(c => c.group || 'عام')));
      for (let i = 0; i < distinctGroups.length; i++) {
        const groupName = distinctGroups[i];
        if (!existingGroups.has(groupName)) {
          await addDoc(collection(db, 'groups'), {
            name: groupName,
            order: groupsSnap.size + i,
            createdAt: serverTimestamp()
          });
        }
      }

      // 2. Add / Update Categories
      for (const cat of categories) {
        const q = query(collection(db, 'categories'), where('name', '==', cat.name));
        const existing = await getDocs(q);
        
        let catId;
        if (existing.empty) {
          const newCat = await addDoc(collection(db, 'categories'), {
            name: cat.name,
            group: cat.group || 'عام',
            imageUrl: cat.imageUrl || '',
            iconUrl: cat.iconUrl || 'LayoutGrid',
            sourceUrl: cat.sourceUrl || '',
            imagesEnabled: cat.imagesEnabled || false,
            videoEnabled: cat.videoEnabled || false,
            qrEnabled: cat.qrEnabled || false,
            mapMode: cat.mapMode || false,
            imageMode: cat.imageMode || false,
            letterMode: cat.letterMode || false,
            letter: cat.letter || '',
            timerDuration: cat.timerDuration || 60,
            createdAt: serverTimestamp()
          });
          catId = newCat.id;
        } else {
          catId = existing.docs[0].id;
          // Update metadata to ensure all flags are correctly synced
          await updateDoc(doc(db, 'categories', catId), {
            group: cat.group || 'عام',
            imageUrl: cat.imageUrl || '',
            iconUrl: cat.iconUrl || 'LayoutGrid',
            sourceUrl: cat.sourceUrl || '',
            imagesEnabled: cat.imagesEnabled || false,
            videoEnabled: cat.videoEnabled || false,
            qrEnabled: cat.qrEnabled || false,
            mapMode: cat.mapMode || false,
            imageMode: cat.imageMode || false,
            letterMode: cat.letterMode || false,
            letter: cat.letter || '',
            timerDuration: cat.timerDuration || 60,
          });
        }

        // 3. Add or Update Questions
        const qsSnap = await getDocs(collection(db, `categories/${catId}/questions`));
        const existingQsMap = new Map(qsSnap.docs.map(d => [d.data().text, { id: d.id, ...d.data() }]));
        
        for (const question of cat.questions) {
          const existingQ = existingQsMap.get(question.text) as any;
          
          if (!existingQ) {
            // New question
            await addDoc(collection(db, `categories/${catId}/questions`), {
              text: question.text,
              answer: question.answer,
              points: question.points,
              imageUrl: question.imageUrl || '',
              source: ' مسابقات أبوالفواطم',
              createdAt: serverTimestamp()
            });
          } else {
            // Check if update is needed
            const needsUpdate = 
              existingQ.answer !== question.answer || 
              existingQ.points !== question.points || 
              existingQ.imageUrl !== (question.imageUrl || '');
              
            if (needsUpdate) {
              await updateDoc(doc(db, `categories/${catId}/questions`, existingQ.id), {
                answer: question.answer,
                points: question.points,
                imageUrl: question.imageUrl || '',
                updatedAt: serverTimestamp()
              });
            }
          }
        }
      }
    } catch (e) {
       return handleFirestoreError(e, 'write', 'bulk-seed');
    }
  }
};
