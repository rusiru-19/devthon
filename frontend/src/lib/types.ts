export type Role = 'ADMIN' | 'RECRUITER' | 'INTERVIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

export type CandidateStatus = 'New' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';

export interface Candidate {
  id: string;
  name: string;
  role: string;
  email: string;
  appliedDate: string;
  status: CandidateStatus;
  skills: string[];
  matchScore: number;
  resumeUrl: string;
  resumeText: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  date: string;
  time: string;
  interviewers: string[];
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  type: 'Technical' | 'Behavioral' | 'System Design';
}

export interface KPIData {
  label: string;
  value: string | number;
  trend: number;
  icon: string;
}

export interface AIAnalysisResult {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  matchScore: number;
  recommendedQuestions: string[];
}

export interface CVAnalysis {
  candidate: {
    full_name: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
    linkedin: string | null;
    portfolio: string | null;
  };
  target_role: string | null;
  summary: string | null;
  skills: {
    technical: string[];
    soft: string[];
    tools: string[];
  };
  experience: {
    job_title: string | null;
    company: string | null;
    duration: string | null;
    key_points: string[];
  }[];
  education: {
    degree: string | null;
    institution: string | null;
    year: string | null;
  }[];
  certifications: string[];
  strengths: string[];
  weaknesses: string[];
  improvement_suggestions: string[];
  cv_score: {
    score: number;
    rating: string | null;
  };
}

export interface Candidate {
  id: string;
  fileName: string;
  uploadedAt: string;
  resumeText: string;
  aiAnalysis?: CVAnalysis;
}
