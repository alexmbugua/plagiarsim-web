export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  isAdmin?: boolean;
  roles?: string[];
}

export interface UploadSlot {
  id: string;
  userId: string;
  status: 'available' | 'used' | 'expired';
  createdAt: Date;
  expiresAt?: Date;
  usedAt?: Date;
}

export interface Document {
  id: string;
  userId: string;
  filename: string;
  originalName: string;
  fileSize: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  uploadedAt: Date;
  completedAt?: Date;
  aiScore?: number;
  plagiarismScore?: number;
  reportUrl?: string;
}

export interface Report {
  id: string;
  documentId: string;
  type: 'ai' | 'plagiarism' | 'both';
  aiScore: number;
  plagiarismScore: number;
  aiDetails: AIReportDetails;
  plagiarismDetails: PlagiarismReportDetails;
  generatedAt: Date;
}

export interface AIReportDetails {
  overallScore: number;
  sections: AISection[];
  modelDetection: {
    chatgpt: number;
    claude: number;
    other: number;
  };
}

export interface AISection {
  start: number;
  end: number;
  text: string;
  aiProbability: number;
  highlighted: boolean;
}

export interface PlagiarismReportDetails {
  overallScore: number;
  matches: PlagiarismMatch[];
  sources: PlagiarismSource[];
}

export interface PlagiarismMatch {
  start: number;
  end: number;
  text: string;
  similarity: number;
  sourceId: string;
}

export interface PlagiarismSource {
  id: string;
  url: string;
  title: string;
  similarity: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  slots: number;
  features: string[];
  popular?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
