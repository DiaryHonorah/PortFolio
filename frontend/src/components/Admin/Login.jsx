import { useState, useEffect } from 'react';

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // Effet de particules pour le fond
    useEffect(() => {
        const canvas = document.createElement('canvas');
        canvas.id = 'particles-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 80;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 102, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            // Lignes entre particules proches
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 102, 255, ${0.1 * (1 - distance / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        };
        animate();

        return () => {
            document.body.removeChild(canvas);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetch('http://localhost/portfolio/backend/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Sauvegarder le token si "Se souvenir de moi" est coché
                if (rememberMe) {
                    localStorage.setItem('rememberedUser', username);
                } else {
                    localStorage.removeItem('rememberedUser');
                }
                
                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('isLoggedIn', 'true');
                
                // Animation de succès
                document.querySelector('.login-card')?.classList.add('login-success');
                setTimeout(() => {
                    onLoginSuccess(result.user);
                }, 500);
            } else {
                setError(result.error || 'Identifiants incorrects');
                // Animation d'erreur
                document.querySelector('.login-card')?.classList.add('login-error');
                setTimeout(() => {
                    document.querySelector('.login-card')?.classList.remove('login-error');
                }, 500);
            }
        } catch (err) {
            setError('Erreur de connexion au serveur');
        } finally {
            setLoading(false);
        }
    };

    // Charger le nom d'utilisateur sauvegardé
    useEffect(() => {
        const remembered = localStorage.getItem('rememberedUser');
        if (remembered) {
            setUsername(remembered);
            setRememberMe(true);
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#0F0F1A] relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 animate-pulse"></div>
            
            {/* Floating decoration */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '8s' }}></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>

            <div className="login-card glass p-8 rounded-2xl w-full max-w-md border border-white/10 relative z-10 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
                {/* Logo/Icon */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-4 transform hover:scale-110 transition duration-500">
                        <span className="text-3xl font-bold text-white">🔐</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">
                        Connexion
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm">
                        Accédez au tableau de bord
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2 flex items-center gap-2">
                            <span className="text-secondary">👤</span>
                            Nom d'utilisateur
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition focus:ring-2 focus:ring-secondary/20"
                                placeholder="admin"
                                required
                                autoFocus
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2 flex items-center gap-2">
                            <span className="text-secondary">🔑</span>
                            Mot de passe
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition focus:ring-2 focus:ring-secondary/20"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer transition">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 accent-primary rounded border-white/10 bg-white/5"
                            />
                            Se souvenir de moi
                        </label>
                        <button
                            type="button"
                            className="text-secondary hover:text-cyan-300 transition text-sm"
                            onClick={() => alert('Contactez l\'administrateur pour réinitialiser votre mot de passe.')}
                        >
                            Mot de passe oublié ?
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-center text-sm animate-shake">
                            ❌ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full px-6 py-3 rounded-lg font-semibold transition text-white relative overflow-hidden ${
                            loading 
                                ? 'bg-blue-900 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-primary to-secondary hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/30'
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Connexion...
                            </span>
                        ) : (
                            'Se connecter'
                        )}
                    </button>
                </form>

                {/* <div className="mt-6 text-center text-sm text-gray-500 border-t border-white/5 pt-6">
                    <p>Identifiants par défaut</p>
                    <div className="flex justify-center gap-4 mt-2 text-xs">
                        <span className="text-gray-400">👤 <span className="font-mono text-white">admin</span></span>
                        <span className="text-gray-600">|</span>
                        <span className="text-gray-400">🔑 <span className="font-mono text-white">admin123</span></span>
                    </div>
                </div> */}

                {/* Version */}
                <p className="text-center text-gray-600 text-xs mt-4">
                    v2.0 · Sécurisé
                </p>
            </div>
        </div>
    );
};

export default Login;