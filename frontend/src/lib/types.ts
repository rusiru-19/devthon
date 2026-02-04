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
