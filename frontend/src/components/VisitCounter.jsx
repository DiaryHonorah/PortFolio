import React, { useState, useEffect } from 'react';
import { registerVisit } from '../services/visitService';

const VisitCounter = () => {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const trackVisit = async () => {
            try {
                // Déterminer la page actuelle
                const hash = window.location.hash || '#home';
                const page = hash.replace('#', '') || 'home';
                
                const result = await registerVisit(page);
                if (result.count) {
                    setCount(result.count);
                }
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };
        
        trackVisit();
    }, []);

    if (loading) return null;

    return (
        <div className="text-center text-gray-500 text-xs py-2 flex items-center justify-center gap-2">
            <span>👁️</span>
            <span>{count} visite(s)</span>
        </div>
    );
};

export default VisitCounter;