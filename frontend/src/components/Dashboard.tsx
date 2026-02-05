'use client';

import { KPI_STATS } from '@/lib/constants';
import { Icons } from './Icon';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';


export function Dashboard() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500">Welcome back, here&apos;s what&apos;s happening today.</p>
                </div>
                <div className="flex gap-2">
              
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {KPI_STATS.map((stat, idx) => {
                    const IconKey = stat.icon as keyof typeof Icons;
                    const IconComp = Icons[IconKey] || Icons.Users;

                    return (
                        <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 rounded-lg ${stat.trend > 0 ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'}`}>
                                    <IconComp size={20} />
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                    }`}>
                                    {stat.trend > 0 ? '+' : ''}{stat.trend}%
                                </span>
                            </div>
                            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}
