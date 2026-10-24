import React, { useState, useEffect } from 'react';
import { logout, getCurrentUser, checkAuth } from '../../services/authService';
import DashboardStats from './DashboardStats';
import Charts from './Charts';
import MessageList from './MessageList';
import ProjectList from './ProjectList';
import SkillList from './SkillList';
import ServiceList from './ServiceList';
import UserList from './UserList';
import ExportData from './ExportData';
import BackupManager from './BackupManager';
import ActivityLog from './ActivityLog';
import AdminNotifications from './AdminNotifications';
import VisitStats from './VisitStats';
import NewsletterList from './NewsletterList';
import TestimonialList from './TestimonialList';
import RatingStats from './RatingStats';
import CommentList from './CommentList';
import TimelineList from './TimelineList';
import Login from './Login';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Détecter la taille de l'écran
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const isLoggedIn = await checkAuth();
                if (isLoggedIn) {
                    const currentUser = getCurrentUser();
                    setUser(currentUser);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Auth check error:', error);
            } finally {
                setLoading(false);
            }
        };
        checkAuthStatus();
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    // Tabs avec icônes et labels courts pour mobile
    const tabs = [
        { id: 'dashboard', label: '📊 Dashboard', shortLabel: '📊' },
        { id: 'projects', label: '📁 Projets', shortLabel: '📁' },
        { id: 'skills', label: '⚡ Compétences', shortLabel: '⚡' },
        { id: 'services', label: '💼 Services', shortLabel: '💼' },
        { id: 'messages', label: '✉️ Messages', shortLabel: '✉️' },
        { id: 'visits', label: '📈 Visites', shortLabel: '📈' },
        { id: 'newsletter', label: '📧 Newsletter', shortLabel: '📧' },
        { id: 'testimonials', label: '💬 Témoignages', shortLabel: '💬' },
        { id: 'comments', label: '💭 Commentaires', shortLabel: '💭' },
        { id: 'ratings', label: '⭐ Notes', shortLabel: '⭐' },
        { id: 'timeline', label: '📅 Timeline', shortLabel: '📅' },
        { id: 'users', label: '👥 Utilisateurs', shortLabel: '👥' },
        { id: 'export', label: '📤 Export', shortLabel: '📤' },
        { id: 'backup', label: '💾 Sauvegarde', shortLabel: '💾' },
        { id: 'logs', label: '📋 Logs', shortLabel: '📋' },
        { id: 'notifications', label: '🔔 Notifications', shortLabel: '🔔' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0F0F1A]">
                <div className="text-center">
                    <div className="loading-spinner mx-auto"></div>
                    <p className="text-gray-400 mt-4">Chargement...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="min-h-screen bg-[#0F0F1A]">
            {/* Header - Responsive */}
            <header className="fixed top-0 w-full z-50 glass bg-[#0F0F1A]/90 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex justify-between items-center">
                    <h1 className="text-base sm:text-xl md:text-2xl font-extrabold gradient-text truncate">
                        📊 Administration
                    </h1>
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Bouton menu mobile */}
                        <button
                            className="lg:hidden text-white text-xl sm:text-2xl hover:text-secondary transition p-1"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            aria-label="Ouvrir le menu"
                        >
                            ☰
                        </button>
                        <span className="text-gray-400 text-xs sm:text-sm hidden sm:block">
                            👤 {user?.username || 'Admin'}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition whitespace-nowrap"
                        >
                            🚪 Déconnexion
                        </button>
                    </div>
                </div>
            </header>

            {/* Menu mobile - Slide-in */}
            {sidebarOpen && (
                <>
                    <div 
                        className="lg:hidden fixed inset-0 bg-black/60 z-40"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="lg:hidden fixed top-0 left-0 h-full w-4/5 max-w-xs bg-[#0F0F1A] z-50 shadow-2xl border-r border-white/5 overflow-y-auto animate-slide-in">
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
                                <h2 className="text-lg font-bold text-white">Menu</h2>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="text-gray-400 hover:text-white text-2xl"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            setActiveTab(tab.id);
                                            setSidebarOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition ${
                                            activeTab === tab.id
                                                ? 'bg-primary text-white'
                                                : 'text-gray-300 hover:bg-white/5'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <p className="text-gray-500 text-xs text-center">v2.0</p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Body */}
            <div className="pt-14 sm:pt-16 md:pt-20 px-2 sm:px-4 pb-10">
                <div className="max-w-7xl mx-auto">
                    {/* Tabs - Responsive avec scroll horizontal sur mobile */}
                    <div className="flex flex-nowrap overflow-x-auto gap-1 sm:gap-2 mb-4 sm:mb-6 pb-1 scrollbar-thin scrollbar-thumb-primary/20">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition text-xs sm:text-sm whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'glass text-gray-300 hover:bg-white/10'
                                }`}
                            >
                                {isMobile ? tab.shortLabel : tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Contenu - Responsive */}
                    <div className="glass p-3 sm:p-4 md:p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-x-auto">
                        {activeTab === 'dashboard' && (
                            <div className="space-y-4 sm:space-y-6">
                                <DashboardStats />
                                <Charts />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <AdminNotifications />
                                    <ActivityLog />
                                </div>
                            </div>
                        )}
                        {activeTab === 'projects' && <ProjectList />}
                        {activeTab === 'skills' && <SkillList />}
                        {activeTab === 'services' && <ServiceList />}
                        {activeTab === 'messages' && <MessageList />}
                        {activeTab === 'visits' && <VisitStats />}
                        {activeTab === 'newsletter' && <NewsletterList />}
                        {activeTab === 'testimonials' && <TestimonialList />}
                        {activeTab === 'comments' && <CommentList />}
                        {activeTab === 'ratings' && <RatingStats />}
                        {activeTab === 'timeline' && <TimelineList />}
                        {activeTab === 'users' && <UserList />}
                        {activeTab === 'export' && <ExportData />}
                        {activeTab === 'backup' && <BackupManager />}
                        {activeTab === 'logs' && <ActivityLog />}
                        {activeTab === 'notifications' && <AdminNotifications />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;