import React, { useState, useEffect, useRef, useCallback } from 'react';

const QuoteRotator = ({ quotes, duration }) => {
    const [index, setIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isFading, setIsFading] = useState(false);
    const [isRunning, setIsRunning] = useState(true);
    const lastTickRef = useRef(performance.now());
    const animationFrameRef = useRef();
    const rotatorRef = useRef(null);

    const showQuote = useCallback((newIndex, instant = false) => {
        setIsFading(true);
        setTimeout(() => {
            setIndex(newIndex % quotes.length);
            setIsFading(false);
        }, instant ? 0 : 400);
    }, [quotes.length]);

    useEffect(() => {
        const tick = (now) => {
            if (isRunning) {
                const elapsed = now - lastTickRef.current;
                lastTickRef.current = now;
                setProgress(prev => {
                    const newProgress = prev + (elapsed / duration) * 100;
                    if (newProgress >= 100) {
                        showQuote((index + 1));
                        return 0;
                    }
                    return newProgress;
                });
            } else {
                lastTickRef.current = now;
            }
            animationFrameRef.current = requestAnimationFrame(tick);
        };
        animationFrameRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animationFrameRef.current);
    }, [isRunning, duration, quotes, index, showQuote]);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsRunning(entry.isIntersecting), { threshold: 0.1 }
        );
        const currentRef = rotatorRef.current;
        if (currentRef) observer.observe(currentRef);
        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);

    const handleSliderChange = (e) => {
        const newProgress = Number(e.target.value);
        setProgress(newProgress);
        if (newProgress >= 100) {
            setProgress(0);
            showQuote((index + 1), false);
        }
    };
    
    const currentQuote = quotes[index];

    return (
        <section ref={rotatorRef} className="text-center py-20 px-6 md:px-10 border-t border-b border-gray-200 dark:border-border-color my-20">
            <div className={`max-w-4xl mx-auto transition-all duration-500 ${isFading ? 'quote-fade-out' : 'quote-fade-in'}`}>
                <blockquote className="text-2xl md:text-3xl font-light leading-snug text-gray-900 dark:text-white mb-6">
                    "{currentQuote.text}"
                </blockquote>
                <div className="text-sm font-semibold tracking-widest text-red-500">{currentQuote.author}</div>
            </div>
            <div className="max-w-2xl mx-auto mt-8">
                <div className="w-full h-1.5 bg-gray-200 dark:bg-border-color/30 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 to-red-400" style={{ width: `${progress}%`, transition: 'width 150ms linear' }}></div>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={Math.round(progress)}
                    className="w-full progress-slider"
                    aria-label="Quote progress slider"
                    onChange={handleSliderChange}
                    onPointerDown={() => setIsRunning(false)}
                    onPointerUp={() => { setIsRunning(true); }}
                />
            </div>
        </section>
    );
};

export default QuoteRotator;