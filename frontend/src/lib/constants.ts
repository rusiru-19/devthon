import { Candidate, Interview, KPIData } from './types';

export const MOCK_USER = {
    id: 'u1',
    name: 'Alex Morgan',
    email: 'alex.morgan@talentflow.ai',
    role: 'RECRUITER',
    avatar: 'https://picsum.photos/seed/alex/100/100',
} as const;

export const MOCK_CANDIDATES: Candidate[] = [
    {
        id: 'c1',
        name: 'Sarah Chen',
        role: 'Senior Frontend Engineer',
        email: 'sarah.chen@example.com',
        appliedDate: '2023-10-24',
        status: 'Interview',
        skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
        matchScore: 92,
        resumeUrl: '#',
        resumeText: "Experienced Frontend Engineer with 6 years of experience building scalable web applications. Expert in React ecosystem, TypeScript, and cloud infrastructure. Led a team of 4 developers to ship a major dashboard redesign.",
    },
    {
        id: 'c2',
        name: 'Michael Ross',
        role: 'Product Designer',
        email: 'm.ross@example.com',
        appliedDate: '2023-10-25',
        status: 'Screening',
        skills: ['Figma', 'UI/UX', 'Prototyping', 'User Research'],
        matchScore: 78,
        resumeUrl: '#',
        resumeText: "Creative Product Designer with a focus on user-centric design. Proficient in Figma and Adobe Suite. 3 years of experience in SaaS startups.",
    },
    {
        id: 'c3',
        name: 'David Kim',
        role: 'Backend Intern',
        email: 'david.kim@uni.edu',
        appliedDate: '2023-10-26',
        status: 'New',
        skills: ['Python', 'Django', 'SQL', 'Docker'],
        matchScore: 65,
        resumeUrl: '#',
        resumeText: "Recent CS graduate looking for internship opportunities. Strong academic background in algorithms and database systems. Built a Django e-commerce project.",
    },
    {
        id: 'c4',
        name: 'Emily Davis',
        role: 'Marketing Manager',
        email: 'emily.d@example.com',
        appliedDate: '2023-10-22',
        status: 'Rejected',
        skills: ['SEO', 'Content Strategy', 'Google Analytics'],
        matchScore: 45,
        resumeUrl: '#',
        resumeText: "Marketing specialist with experience in B2C retail.",
    },
    {
        id: 'c5',
        name: 'James Wilson',
        role: 'Senior Frontend Engineer',
        email: 'j.wilson@example.com',
        appliedDate: '2023-10-20',
        status: 'Offer',
        skills: ['Vue.js', 'JavaScript', 'CSS', 'HTML'],
        matchScore: 88,
        resumeUrl: '#',
        resumeText: "Frontend developer specializing in Vue.js and performance optimization.",
    }
];

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
