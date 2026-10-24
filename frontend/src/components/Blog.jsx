import { useState } from 'react';

const blogPosts = [
    {
        id: 1,
        title: "Comment bien préparer son stage en développement web",
        excerpt: "Guide pratique pour réussir son stage en tant que développeur web. Découvrez les bonnes pratiques et les erreurs à éviter.",
        content: "Contenu complet de l'article...",
        date: "15 Juillet 2026",
        readTime: "5 min",
        category: "Conseils",
        image: "📝",
        author: "RAKOTOSOLOFOHARISON Diary Honorah"
    },
    {
        id: 2,
        title: "Les bases de la sécurité réseau",
        excerpt: "Comprendre les fondamentaux de la sécurité des réseaux informatiques. Protégez vos données et vos systèmes.",
        content: "Contenu complet de l'article...",
        date: "10 Juillet 2026",
        readTime: "8 min",
        category: "Réseaux",
        image: "🔐",
        author: "RAKOTOSOLOFOHARISON Diary Honorah"
    },
    {
        id: 3,
        title: "React vs Vue : Quel framework choisir ?",
        excerpt: "Comparaison détaillée entre React et Vue.js pour vous aider à faire le bon choix pour vos projets.",
        content: "Contenu complet de l'article...",
        date: "5 Juillet 2026",
        readTime: "10 min",
        category: "Développement",
        image: "⚛️",
        author: "RAKOTOSOLOFOHARISON Diary Honorah"
    },
    {
        id: 4,
        title: "Comment optimiser son CV pour les stages",
        excerpt: "Les conseils essentiels pour créer un CV qui attire l'attention des recruteurs dans le domaine informatique.",
        content: "Contenu complet de l'article...",
        date: "28 Juin 2026",
        readTime: "6 min",
        category: "Carrière",
        image: "📄",
        author: "RAKOTOSOLOFOHARISON Diary Honorah"
    }
];

const Blog = () => {
    const [selectedCategory, setSelectedCategory] = useState('Tous');
    const [selectedPost, setSelectedPost] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Extraire les catégories uniques
    const categories = ['Tous', ...new Set(blogPosts.map(post => post.category))];

    // Filtrer les articles
    const filteredPosts = blogPosts.filter(post => {
        const matchCategory = selectedCategory === 'Tous' || post.category === selectedCategory;
        const matchSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
    });

    // Fonction pour lire un article
    const handleReadMore = (post) => {
        setSelectedPost(post);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Fonction pour fermer l'article
    const handleClose = () => {
        setSelectedPost(null);
    };

    // Si un article est sélectionné, afficher son contenu
    if (selectedPost) {
        return (
            <div className="min-h-screen pt-20 px-4 pb-10 bg-[#0F0F1A]">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition mb-6 flex items-center gap-2"
                    >
                        ← Retour aux articles
                    </button>
                    
                    <div className="glass p-8 rounded-2xl">
                        <div className="text-6xl mb-4">{selectedPost.image}</div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            {selectedPost.title}
                        </h1>
                        <div className="flex flex-wrap gap-4 text-gray-400 text-sm mb-6">
                            <span>📅 {selectedPost.date}</span>
                            <span>⏱️ {selectedPost.readTime}</span>
                            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full">
                                {selectedPost.category}
                            </span>
                            <span>✍️ {selectedPost.author}</span>
                        </div>
                        <div className="border-t border-white/10 pt-6">
                            <p className="text-gray-300 text-lg leading-relaxed">
                                {selectedPost.content || "Article en cours de rédaction. Revenez bientôt pour découvrir le contenu complet !"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section id="blog" className="py-20">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" data-aos="fade-up">
                    📝 Mon <span className="gradient-text">Blog</span>
                </h2>
                <p className="text-gray-400 text-center mb-8" data-aos="fade-up">
                    Partager mes connaissances et expériences
                </p>

                {/* Barre de recherche et filtres */}
                <div className="flex flex-col md:flex-row gap-4 mb-8" data-aos="fade-up">
                    <input
                        type="text"
                        placeholder="🔍 Rechercher un article..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition"
                    />
                    <div className="flex gap-2 flex-wrap">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                                    selectedCategory === category
                                        ? 'bg-primary text-white'
                                        : 'glass text-gray-300 hover:bg-white/10'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grille d'articles */}
                <div className="grid md:grid-cols-2 gap-6">
                    {filteredPosts.map((post) => (
                        <div 
                            key={post.id} 
                            className="glass p-6 rounded-2xl hover:scale-[1.02] transition cursor-pointer"
                            data-aos="fade-up"
                            onClick={() => handleReadMore(post)}
                        >
                            <div className="text-5xl mb-3">{post.image}</div>
                            <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                            <p className="text-gray-400 text-sm mb-3">{post.excerpt}</p>
                            <div className="flex flex-wrap justify-between items-center text-gray-500 text-xs">
                                <span>📅 {post.date}</span>
                                <span>⏱️ {post.readTime}</span>
                                <span className="bg-primary/20 text-primary px-3 py-0.5 rounded-full">
                                    {post.category}
                                </span>
                            </div>
                            <button className="mt-4 text-secondary hover:text-cyan-300 transition text-sm font-medium">
                                Lire la suite →
                            </button>
                        </div>
                    ))}
                </div>

                {filteredPosts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-4xl mb-4">🔍</p>
                        <p className="text-gray-400">Aucun article trouvé</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Blog;