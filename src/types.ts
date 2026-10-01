/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Team = {
  id: string;
  name: string;
  score: number;
  selectedCategories: string[];
  color?: string;
};

export type Question = {
  id: string;
  text: string;
  answer: string;
  points: number;
  isAnswered: boolean;
  imageUrl?: string;
  videoUrl?: string; // New field for YouTube support
  qrEnabled?: boolean; // New field for QR code feature
  letterMode?: boolean; // New field for Letter based questions
  imagesEnabled?: boolean; // New field to enable images specifically
  mapMode?: boolean; // New field for Map based questions
  letter?: string; // The specific Arabic letter
  source?: string;
  sourceUrl?: string;
  options?: string[]; // New field for multiple choice options
  hint?: string; // New field for smart hints
};

export type Category = {
  id: string;
  name: string;
  questions: Question[];
  imageUrl?: string;
  iconUrl?: string;
  group?: string;
  sourceUrl?: string;
  lastSyncedAt?: any; // New field for sync tracking
  borderColor?: string;
  customShadow?: string;
  order?: number;
  imagesEnabled?: boolean; // New field to enable images for the whole category
  letterMode?: boolean; // Consistent with question
  qrEnabled?: boolean; // New field to enable QR for whole category
  videoEnabled?: boolean; // New field to enable video for whole category
  mapMode?: boolean; // New field to enable maps for whole category
  imageMode?: boolean; // New field for full backdrop image card
  timerDuration?: number;
  letter?: string;
  description?: string; // New field for category details
  isActive?: boolean; // New field to enable/disable category from display
};

export type GameState = 'welcome' | 'setup' | 'selection' | 'question' | 'result';

export type GameSession = {
  teams: Team[];
  categories: Category[];
  currentTurn: string; // teamId
  selectedCategoryId: string | null;
  selectedQuestionId: string | null;
  status: GameState;
  occupiedSlots: string[]; // Keep track of categoryId-points occupied (answered) in current session
};
