import { Candidate, Interview, KPIData } from './types';

export const MOCK_USER = {
    id: 'u1',
    name: 'Alex Morgan',
    email: 'alex.morgan@talentflow.ai',
    role: 'RECRUITER',
    avatar: 'https://picsum.photos/seed/alex/100/100',
} as const;


export const MOCK_INTERVIEWS: Interview[] = [
    {
        id: 'i1',
        candidateId: 'c1',
        candidateName: 'Sarah Chen',
        jobTitle: 'Senior Frontend Engineer',
        date: '2023-10-28',
        time: '14:00',
        interviewers: ['Alex Morgan', 'John Doe'],
        status: 'Scheduled',
        type: 'Technical',
    },
    {
        id: 'i2',
        candidateId: 'c2',
        candidateName: 'Michael Ross',
        jobTitle: 'Product Designer',
        date: '2023-10-29',
        time: '10:00',
        interviewers: ['Alex Morgan'],
        status: 'Scheduled',
        type: 'Behavioral',
    }
];

export const KPI_STATS: KPIData[] = [
    { label: 'Total Candidates', value: 1248, trend: 12, icon: 'Users' },
    { label: 'Interviews Scheduled', value: 86, trend: 5, icon: 'Calendar' },
    { label: 'Offers Extended', value: 24, trend: -2, icon: 'Briefcase' },
    { label: 'Time to Hire (Avg)', value: '18 Days', trend: 8, icon: 'Clock' },
];
