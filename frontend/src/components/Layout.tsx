'use client';

import { useState } from 'react';
import { Icons } from './Icon';
import { User } from '@/lib/types';

interface LayoutProps {
    children: React.ReactNode;
    user: User;
    onLogout: () => void;
    activePage: string;
    onNavigate: (page: string) => void;
}

export function Layout({ children, user, onLogout, activePage, onNavigate }: LayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
        { id: 'candidates', label: 'Candidates', icon: Icons.Users },
        { id: 'interviews', label: 'Interviews', icon: Icons.Calendar },
        { id: 'settings', label: 'Settings', icon: Icons.Settings },
    ];
    const logout = () =>{
        localStorage.removeItem('token')
        console.log("logingout")
        onLogout
        window.location.reload();

    }
    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-slate-900/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Icons.Sparkles className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold text-slate-800">Recruiter AI</span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500">
                        <Icons.X size={20} />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activePage === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onNavigate(item.id);
                                    setSidebarOpen(false);
                                }}
                                className={`flex items-center w-full gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 p-2 mb-2">
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-slate-200" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate capitalize">{user.role.toLowerCase()}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center w-full gap-3 px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <Icons.LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md"
                    >
                        <Icons.Menu size={20} />
                    </button>

                    <div className="flex-1 px-4 lg:px-8">
                        <div className="relative max-w-md">
                            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search candidates, jobs..."
                                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                            <Icons.Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
