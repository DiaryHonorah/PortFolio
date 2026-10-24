import React, { useState, useEffect } from 'react';

const ShareButtons = ({ 
    title = 'Portfolio Dev Web & Réseaux', 
    url = null, 
    compact = false,
    showQR = true 
}) => {
    const [copied, setCopied] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);
    const [shareUrl, setShareUrl] = useState('');

    // ============================================
    // GÉNÉRER L'URL DE PARTAGE AVEC IP RÉSEAU
    // ============================================
    useEffect(() => {
        const generateShareUrl = () => {
            // Si une URL est fournie, l'utiliser
            if (url) {
                setShareUrl(url);
                return;
            }
            
            const hostname = window.location.hostname;
            const port = window.location.port;
            const protocol = window.location.protocol;
            const hash = window.location.hash || '#projects';
            
            // ✅ Si on est sur localhost, utiliser l'IP réseau
            if (hostname === 'localhost' || hostname === '127.0.0.1') {
                const networkIP = import.meta.env.VITE_NETWORK_IP || '192.168.1.111';
                const baseUrl = `${protocol}//${networkIP}${port ? ':' + port : ''}`;
                setShareUrl(`${baseUrl}${hash}`);
            } else {
                setShareUrl(`${window.location.origin}${hash}`);
            }
        };
        
        generateShareUrl();
    }, [url]);

    const shareTitle = title || 'Découvrez mon portfolio !';

    // ============================================
    // PARTAGE NATIF
    // ============================================
    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: 'Découvrez mon portfolio !',
                    url: shareUrl
                });
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Erreur partage:', error);
                }
            }
        }
    };

    // ============================================
    // PARTAGE PAR PLATEFORME
    // ============================================
    const handleShare = (platform) => {
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedTitle = encodeURIComponent(shareTitle);
        const encodedText = encodeURIComponent('Découvrez mon portfolio !');

        const links = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
            telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
            email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`
        };

        if (links[platform]) {
            window.open(links[platform], '_blank', 'width=600,height=500,noopener,noreferrer');
        }
    };

    // ============================================
    // COPIER LE LIEN
    // ============================================
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // ============================================
    // VERSION COMPACTE
    // ============================================
    if (compact) {
        return (
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={() => handleShare('facebook')}
                    className="text-gray-400 hover:text-blue-400 transition p-1 text-lg"
                    title="Facebook"
                >
                    📘
                </button>
                <button
                    type="button"
                    onClick={() => handleShare('twitter')}
                    className="text-gray-400 hover:text-sky-400 transition p-1 text-lg"
                    title="Twitter"
                >
                    🐦
                </button>
                <button
                    type="button"
                    onClick={() => handleShare('linkedin')}
                    className="text-gray-400 hover:text-blue-500 transition p-1 text-lg"
                    title="LinkedIn"
                >
                    🔗
                </button>
                <button
                    type="button"
                    onClick={() => handleShare('whatsapp')}
                    className="text-gray-400 hover:text-green-400 transition p-1 text-lg"
                    title="WhatsApp"
                >
                    💬
                </button>
                <button
                    type="button"
                    onClick={handleCopyLink}
                    className="text-gray-400 hover:text-secondary transition p-1 text-lg"
                    title={copied ? 'Copié !' : 'Copier le lien'}
                >
                    {copied ? '✅' : '📋'}
                </button>
            </div>
        );
    }

    // ============================================
    // VERSION COMPLÈTE
    // ============================================
    return (
        <div className="space-y-4">
            <h4 className="text-gray-300 text-sm font-semibold flex items-center gap-2">
                📤 Partager ce projet
            </h4>

            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => handleShare('facebook')}
                    className="flex items-center gap-2 bg-[#1877F2]/20 hover:bg-[#1877F2]/30 text-[#1877F2] px-3 py-2 rounded-lg text-sm font-semibold transition border border-[#1877F2]/20"
                >
                    <span>📘</span>
                    <span className="hidden sm:inline">Facebook</span>
                </button>

                <button
                    type="button"
                    onClick={() => handleShare('twitter')}
                    className="flex items-center gap-2 bg-black/30 hover:bg-black/50 text-white px-3 py-2 rounded-lg text-sm font-semibold transition border border-white/10"
                >
                    <span>𝕏</span>
                    <span className="hidden sm:inline">Twitter</span>
                </button>

                <button
                    type="button"
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center gap-2 bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30 text-[#0A66C2] px-3 py-2 rounded-lg text-sm font-semibold transition border border-[#0A66C2]/20"
                >
                    <span>🔗</span>
                    <span className="hidden sm:inline">LinkedIn</span>
                </button>

                <button
                    type="button"
                    onClick={() => handleShare('whatsapp')}
                    className="flex items-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] px-3 py-2 rounded-lg text-sm font-semibold transition border border-[#25D366]/20"
                >
                    <span>💬</span>
                    <span className="hidden sm:inline">WhatsApp</span>
                </button>

                <button
                    type="button"
                    onClick={() => handleShare('telegram')}
                    className="flex items-center gap-2 bg-[#0088cc]/20 hover:bg-[#0088cc]/30 text-[#0088cc] px-3 py-2 rounded-lg text-sm font-semibold transition border border-[#0088cc]/20"
                >
                    <span>✈️</span>
                    <span className="hidden sm:inline">Telegram</span>
                </button>

                <button
                    type="button"
                    onClick={() => handleShare('email')}
                    className="flex items-center gap-2 glass hover:bg-white/10 px-3 py-2 rounded-lg text-sm font-semibold transition text-gray-300"
                >
                    <span>📧</span>
                    <span className="hidden sm:inline">Email</span>
                </button>

                <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition border ${
                        copied 
                            ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                            : 'glass hover:bg-white/10 text-gray-300 border-white/10'
                    }`}
                >
                    <span>{copied ? '✅' : '📋'}</span>
                    <span className="hidden sm:inline">{copied ? 'Copié !' : 'Copier'}</span>
                </button>

                {navigator.share && (
                    <button
                        type="button"
                        onClick={handleNativeShare}
                        className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary px-3 py-2 rounded-lg text-sm font-semibold transition border border-primary/20 md:hidden"
                    >
                        <span>📤</span>
                        <span>Partager</span>
                    </button>
                )}

                {showQR && (
                    <button
                        type="button"
                        onClick={() => setShowQRCode(!showQRCode)}
                        className="flex items-center gap-2 glass hover:bg-white/10 px-3 py-2 rounded-lg text-sm font-semibold transition text-gray-300"
                    >
                        <span>📱</span>
                        <span className="hidden sm:inline">QR Code</span>
                    </button>
                )}
            </div>

            {/* QR Code */}
            {showQR && showQRCode && shareUrl && (
                <div className="glass p-4 rounded-xl flex flex-col items-center gap-3 animate-fadeIn">
                    <p className="text-gray-400 text-sm">Scannez pour ouvrir</p>
                    <div className="bg-white p-3 rounded-lg">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`}
                            alt="QR Code"
                            className="w-48 h-48"
                            loading="lazy"
                        />
                    </div>
                    <div className="text-center">
                        <p className="text-gray-400 text-xs">URL :</p>
                        <p className="text-secondary text-xs break-all max-w-xs font-mono">
                            {shareUrl}
                        </p>
                    </div>
                    <p className="text-yellow-400 text-xs text-center">
                        ⚠️ Connectez votre téléphone au même Wi-Fi
                    </p>
                    <button
                        type="button"
                        onClick={() => setShowQRCode(false)}
                        className="text-gray-400 hover:text-white text-xs transition"
                    >
                        ✕ Fermer
                    </button>
                </div>
            )}
        </div>
    );
};

export default ShareButtons;