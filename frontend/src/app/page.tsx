'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
import { Candidates } from '@/components/Candidates';
import { LandingPage } from '@/components/LandingPage';
import  Meeting  from '@/components/meeting'
import { MOCK_USER } from '@/lib/constants';
import { Icons } from '@/components/Icon';
import axios from 'axios';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

type Page = 'dashboard' | 'candidates' | 'interviews' | 'settings';

export default function Home() {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    
  })




  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(token){
      validating(token)
    }
  })

  async function validating(token:any){
    const api = process.env.NEXT_PUBLIC_API_URL+'/login'
    const res = await axios.post(api, {
    token: token
  });
  if(res.status == 200){
        setIsAuthenticated(true);
        setShowLogin(false);
        setIsLoading(false);
  }else{  
    console.log('wrong password')
  }
  }


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          );
          const token = await userCredential.user.getIdToken();
          localStorage.setItem('token',token)
          validating(token)
       
        } catch (error: any) {
          console.error(formData);
          alert(error.message);
        } finally {
          setIsLoading(false);
        }
};

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'candidates':
        return <Candidates />;
      case 'interviews':
        return <Meeting />
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400">
            <Icons.Briefcase size={48} className="mb-4 opacity-20" />
            <h2 className="text-xl font-medium text-slate-600">Work in Progress</h2>
            <p>The {activePage} module is coming soon.</p>
          </div>
        );
    }
  };

  if (!isAuthenticated && !showLogin) {
    return <LandingPage onLoginClick={() => setShowLogin(true)} />;
  }

  if (showLogin && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-slate-100 relative">
          <button
            onClick={() => setShowLogin(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          >
            <Icons.X size={20} />
          </button>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Icons.Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-slate-900">TalentFlow AI</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                placeholder='email address'
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                placeholder='password'
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              {isLoading && <Icons.Loader className="animate-spin" size={20} />}
              {isLoading ? 'Signing In...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Enterprise Grade Security • SOC2 Compliant
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout
      user={MOCK_USER}
      onLogout={() => setIsAuthenticated(false)}
      activePage={activePage}
      onNavigate={(page) => setActivePage(page as Page)}
    >
      {renderContent()}
    </Layout>
  );
}
