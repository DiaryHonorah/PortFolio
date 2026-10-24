const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F0F1A] px-4">
            <div className="text-center">
                <h1 className="text-6xl md:text-8xl font-bold gradient-text mb-4">404</h1>
                <p className="text-2xl text-gray-300 mb-2">Page non trouvée</p>
                <p className="text-gray-400 mb-8">Oups ! La page que vous cherchez n'existe pas.</p>
                <a href="/" className="bg-primary hover:bg-blue-700 px-6 py-3 rounded-full font-semibold transition text-white">
                    Retourner à l'accueil
                </a>
            </div>
        </div>
    );
};

export default NotFound;