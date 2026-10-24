const PasswordStrength = ({ password }) => {
    const getStrength = (pass) => {
        let score = 0;
        if (pass.length >= 8) score++;
        if (pass.length >= 12) score++;
        if (/[a-z]/.test(pass)) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^a-zA-Z0-9]/.test(pass)) score++;
        return score;
    };

    const strength = getStrength(password);
    const maxStrength = 6;
    const percentage = (strength / maxStrength) * 100;

    const getColor = () => {
        if (strength <= 2) return 'bg-red-500';
        if (strength <= 3) return 'bg-yellow-500';
        if (strength <= 4) return 'bg-blue-500';
        return 'bg-green-500';
    };

    const getLabel = () => {
        if (strength <= 2) return 'Faible';
        if (strength <= 3) return 'Moyen';
        if (strength <= 4) return 'Fort';
        return 'Très fort';
    };

    if (!password) return null;

    return (
        <div className="mt-2 space-y-1">
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                    className={`h-full ${getColor()} transition-all duration-500 rounded-full`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="flex justify-between text-xs">
                <span className="text-gray-400">Force:</span>
                <span className={`${getColor().replace('bg-', 'text-')}`}>
                    {getLabel()}
                </span>
            </div>
        </div>
    );
};

export default PasswordStrength;