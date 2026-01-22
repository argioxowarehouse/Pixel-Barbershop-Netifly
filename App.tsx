
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Locations from './components/Locations';
import Careers from './components/Careers';
import Academy from './components/Academy';
import Contact from './components/Contact';
import Gallery from './components/Gallery';
import Blog from './components/Blog';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './components/LoginPage';
import { ContentProvider, useContent } from './context/ContentContext';
import { LayoutDashboard } from 'lucide-react';

type ViewState = 'home' | 'login' | 'careers' | 'academy' | 'contact' | 'blog';

function AppContent() {
  const [view, setView] = useState<ViewState>('home');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const { session, isLoading, signIn, signOut, heroSettings } = useContent();

  // Update Favicon Dynamically
  useEffect(() => {
    if (heroSettings.websiteIcon) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = heroSettings.websiteIcon;
    }
  }, [heroSettings.websiteIcon]);

  // Hidden Admin Access via Keyboard Shortcut (Ctrl + Alt + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl + Alt + A
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handleAdminClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#careers-page') {
        setView('careers');
        window.scrollTo(0, 0);
      } else if (hash === '#academy-page') {
        setView('academy');
        window.scrollTo(0, 0);
      } else if (hash === '#contact-page') {
        setView('contact');
        window.scrollTo(0, 0);
      } else if (hash === '#blog-page') {
        setView('blog');
        window.scrollTo(0, 0);
      } else if (hash === '#login') {
        setView('login');
        window.scrollTo(0, 0);
      } else if (hash === '#home' || hash === '') {
        setView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleAdminClick = () => {
    setErrorMsg('');
    window.location.hash = '#login';
    setView('login');
    window.scrollTo(0, 0);
  };

  const handleLogin = async (email: string, pass: string) => {
    setErrorMsg('');
    const { error } = await signIn(email, pass);
    if (error) {
      setErrorMsg(error.message || "Email atau Password salah!");
    } else {
      setView('home');
      setShowPreview(false);
      window.location.hash = '#home';
    }
  };

  const handleBackToHome = () => {
    window.location.hash = '#home';
    setView('home');
    setErrorMsg('');
    window.scrollTo(0, 0);
  };

  const navigateToCareers = () => {
    window.location.hash = '#careers-page';
    setView('careers');
    window.scrollTo(0, 0);
  };

  const navigateToAcademy = () => {
    window.location.hash = '#academy-page';
    setView('academy');
    window.scrollTo(0, 0);
  };

  const navigateToContact = () => {
    window.location.hash = '#contact-page';
    setView('contact');
    window.scrollTo(0, 0);
  };

  const navigateToBlog = () => {
    window.location.hash = '#blog-page';
    setView('blog');
    window.scrollTo(0, 0);
  };

  if (session && !showPreview) {
    return <AdminDashboard onLogout={signOut} onTogglePreview={() => setShowPreview(true)} />;
  }

  const PageLayout = ({ children }: { children?: React.ReactNode }) => (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#0c7565] selection:text-white">
      <Navbar onNavigateHome={handleBackToHome} onNavigateCareers={navigateToCareers} onNavigateAcademy={navigateToAcademy} onNavigateContact={navigateToContact} onNavigateBlog={navigateToBlog} isStandalonePage={true} />
      <main className="pt-20">
        {children}
      </main>
      <Footer onAdminClick={handleAdminClick} onNavigateHome={handleBackToHome} onNavigateCareers={navigateToCareers} onNavigateAcademy={navigateToAcademy} onNavigateContact={navigateToContact} onNavigateBlog={navigateToBlog} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-[#0c7565] selection:text-white relative">
      {session && showPreview && (
        <button 
          onClick={() => setShowPreview(false)}
          className="fixed bottom-8 right-8 z-[999] bg-[#0c7565] text-white px-6 py-4 rounded-full shadow-2xl shadow-[#0c7565]/40 flex items-center gap-3 font-bold hover:scale-105 active:scale-95 transition-all animate-in slide-in-from-bottom-10"
        >
          <LayoutDashboard size={20} />
          Kembali ke Dashboard
        </button>
      )}

      {view === 'login' ? (
        <LoginPage 
          onLogin={handleLogin} 
          onBack={handleBackToHome} 
          error={errorMsg}
          isLoading={isLoading}
        />
      ) : view === 'careers' ? (
        <PageLayout><Careers isStandalonePage={true} /></PageLayout>
      ) : view === 'academy' ? (
        <PageLayout><Academy isStandalonePage={true} /></PageLayout>
      ) : view === 'contact' ? (
        <PageLayout><Contact isStandalonePage={true} /></PageLayout>
      ) : view === 'blog' ? (
        <PageLayout><Blog isStandalonePage={true} /></PageLayout>
      ) : (
        <>
          <Navbar onNavigateHome={handleBackToHome} onNavigateCareers={navigateToCareers} onNavigateAcademy={navigateToAcademy} onNavigateContact={navigateToContact} onNavigateBlog={navigateToBlog} />
          <main>
            <Hero />
            <About />
            <Services />
            <Locations />
            <Gallery />
          </main>
          <Footer onAdminClick={handleAdminClick} onNavigateHome={handleBackToHome} onNavigateCareers={navigateToCareers} onNavigateAcademy={navigateToAcademy} onNavigateContact={navigateToContact} onNavigateBlog={navigateToBlog} />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <ContentProvider>
      <AppContent />
    </ContentProvider>
  );
}

export default App;
