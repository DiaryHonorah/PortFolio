import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Helmet } from 'react-helmet-async';
import SEO from './components/SEO';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Services from './components/Services';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import Stats from './components/Stats';
import CVDownload from './components/CVDownload';
import Newsletter from './components/Newsletter';
import NewsletterConfirmed from './components/NewsletterConfirmed';
import Loader from './components/Loader';
import Blog from './components/Blog';
import TimelineInteractive from './components/TimelineInteractive';
import Testimonials from './components/Testimonials';
import Certifications from './components/Certifications';
import Dashboard from './components/Admin/Dashboard';
import ProjectsPage from './components/ProjectsPage';
import SkillsPage from './components/SkillsPage';
import InstallPWA from './components/InstallPWA';

function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({ 
            duration: 1000, 
            once: true, 
            offset: 100,
            easing: 'ease-out-cubic'
        });

        setTimeout(() => setLoading(false), 800);

        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash === '#admin') setCurrentPage('admin');
            else if (hash === '#projects') setCurrentPage('projects');
            else if (hash === '#skills') setCurrentPage('skills');
            else if (hash === '#blog') setCurrentPage('blog');
            else if (hash.startsWith('#newsletter-confirmed')) setCurrentPage('newsletter-confirmed');
            else setCurrentPage('home');
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // ========== PAGE ADMIN ==========
    if (currentPage === 'admin') {
        return (
            <div className="overflow-x-hidden w-full max-w-full">
                <SEO 
                    noIndex={true} 
                    title="Administration - Portfolio" 
                />
                <Dashboard />
            </div>
        );
    }

    // ========== PAGE PROJETS ==========
    if (currentPage === 'projects') {
        return (
            <div className="overflow-x-hidden w-full max-w-full">
                <SEO 
                    title="Mes Projets - Portfolio Dev Web & Réseaux"
                    description="Découvrez tous mes projets de développement web et systèmes réseaux : React, PHP, Java, C#, et plus encore."
                    keywords="projets, développement web, React, PHP, Java, C#, réseaux"
                    url="https://votre-site.com/#projects"
                />
                <div className="gradient-bg min-h-screen text-white font-sans">
                    <Navbar />
                    <ProjectsPage />
                    <Footer />
                    <BackToTop />
                </div>
            </div>
        );
    }

    // ========== PAGE COMPÉTENCES ==========
    if (currentPage === 'skills') {
        return (
            <div className="overflow-x-hidden w-full max-w-full">
                <SEO 
                    title="Mes Compétences - Portfolio Dev Web & Réseaux"
                    description="Découvrez toutes mes compétences en développement web, réseaux, bases de données et systèmes embarqués."
                    keywords="compétences, développement web, réseaux, bases de données, systèmes embarqués"
                    url="https://votre-site.com/#skills"
                />
                <div className="gradient-bg min-h-screen text-white font-sans">
                    <Navbar />
                    <SkillsPage />
                    <Footer />
                    <BackToTop />
                </div>
            </div>
        );
    }

    // ========== PAGE BLOG ==========
    if (currentPage === 'blog') {
        return (
            <div className="overflow-x-hidden w-full max-w-full">
                <SEO 
                    title="Blog - Portfolio Dev Web & Réseaux"
                    description="Articles et conseils sur le développement web, les réseaux informatiques et la sécurité."
                    keywords="blog, développement web, réseaux, sécurité, conseils"
                    url="https://votre-site.com/#blog"
                />
                <div className="gradient-bg min-h-screen text-white font-sans">
                    <Navbar />
                    <Blog />
                    <Footer />
                    <BackToTop />
                </div>
            </div>
        );
    }

    // ========== PAGE NEWSLETTER CONFIRMÉE ==========
    if (currentPage === 'newsletter-confirmed') {
        return (
            <div className="overflow-x-hidden w-full max-w-full">
                <SEO 
                    title="Inscription confirmée - Newsletter"
                    description="Votre inscription à la newsletter est confirmée."
                    noIndex={true}
                />
                <NewsletterConfirmed />
            </div>
        );
    }

    // ========== PAGE D'ACCUEIL ==========
    if (loading) return <Loader />;

    return (
        <>
            <SEO 
                title="Portfolio Dev Web & Réseaux"
                description="Portfolio de RAKOTOSOLOFOHARISON Diary Honorah, étudiant en développement web et systèmes réseaux. Découvrez mes projets, compétences et expériences."
                keywords="portfolio, développeur web, réseaux, React, PHP, Java, C#, étudiant, ENI"
                url="https://votre-site.com/"
                image="/og-image.jpg"
            />

            <div className="gradient-bg min-h-screen text-white font-sans overflow-x-hidden w-full max-w-full">
                <Navbar />
                <Hero />
                <Stats />
                <About />
                <TimelineInteractive />
                <Skills />
                <Services />
                <CVDownload />
                <Projects />
                <Blog />
                <Testimonials />
                <Certifications />
                <Newsletter />
                <Contact />
                <Footer />
                <InstallPWA />
                <BackToTop />
            </div>
        </>
    );
}

export default App;