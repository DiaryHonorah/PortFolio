const Loader = () => {
    return (
        <div className="fixed inset-0 bg-[#0F0F1A] flex items-center justify-center z-50">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-400 mt-4">Chargement...</p>
            </div>
        </div>
    );
};

export default Loader;