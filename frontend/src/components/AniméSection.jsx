import useIntersectionObserver from '../hooks/useIntersectionObserver';

const AnimatedSection = ({ children, className = '', delay = 0 }) => {
    const ref = useIntersectionObserver({ threshold: 0.1 });

    return (
        <div 
            ref={ref} 
            className={`opacity-0 translate-y-10 transition-all duration-700 ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

export default AnimatedSection;