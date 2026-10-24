import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!visible) return null;

    const styles = {
        success: {
            bg: 'bg-green-500/90',
            border: 'border-green-500/50',
            icon: '✅'
        },
        error: {
            bg: 'bg-red-500/90',
            border: 'border-red-500/50',
            icon: '❌'
        },
        info: {
            bg: 'bg-blue-500/90',
            border: 'border-blue-500/50',
            icon: 'ℹ️'
        },
        warning: {
            bg: 'bg-yellow-500/90',
            border: 'border-yellow-500/50',
            icon: '⚠️'
        }
    };

    const style = styles[type] || styles.info;

    return (
        <div className={`fixed top-4 right-4 z-[9999] max-w-sm w-full animate-slide-in-right`}>
            <div className={`${style.bg} backdrop-blur-sm border ${style.border} text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3`}>
                <span className="text-xl">{style.icon}</span>
                <p className="text-sm font-medium flex-1">{message}</p>
                <button
                    onClick={() => {
                        setVisible(false);
                        if (onClose) onClose();
                    }}
                    className="text-white/70 hover:text-white transition"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default Toast;