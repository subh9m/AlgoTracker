import React, { useState, useEffect, useRef, useCallback } from 'react';

const FocusTimer = () => {
    const totalTime = 25 * 60;
    const [time, setTime] = useState(totalTime);
    const [isRunning, setIsRunning] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const intervalRef = useRef(null);
    const timerSectionRef = useRef(null);
    const totalDots = 10;

    const updateDisplay = (currentTime) => {
        const mins = Math.floor(currentTime / 60).toString().padStart(2, '0');
        const secs = (currentTime % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const enterFullscreen = async () => {
        if (timerSectionRef.current && !document.fullscreenElement) {
            try {
                await timerSectionRef.current.requestFullscreen();
            } catch (err) {
                console.warn("Fullscreen not available:", err);
            }
        }
    };

    const exitFullscreen = useCallback(() => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }, []);

    const startTimer = () => {
        if (isRunning) return;
        enterFullscreen();
        setIsRunning(true);
        intervalRef.current = setInterval(() => {
            setTime(prevTime => {
                if (prevTime > 0) return prevTime - 1;
                clearInterval(intervalRef.current);
                setIsRunning(false);
                exitFullscreen();
                return 0;
            });
        }, 1000);
    };
    
    const resetTimer = useCallback((shouldExitFullscreen = true) => {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setTime(totalTime);
        if (shouldExitFullscreen) exitFullscreen();
    }, [exitFullscreen, totalTime]);
    
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isCurrentlyFullscreen = !!document.fullscreenElement;
            setIsFullscreen(isCurrentlyFullscreen);
            if (!isCurrentlyFullscreen && isRunning) {
                resetTimer(false); 
            }
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, [isRunning, resetTimer]);

    const progress = 1 - time / totalTime;
    const activeDots = Math.floor(progress * totalDots);

    return (
        <section ref={timerSectionRef} className={`nothing-focus-timer ${isFullscreen ? 'fullscreen-active' : ''}`}>
            <div className="timer-display">{updateDisplay(time)}</div>
            <div className="timer-dots">
                {[...Array(totalDots)].map((_, i) => (
                    <div key={i} className={`dot ${i < activeDots ? 'active' : ''}`}></div>
                ))}
            </div>
            <div className="timer-controls">
                <button onClick={startTimer} className="timer-btn">START</button>
                <button onClick={() => resetTimer(true)} className="timer-btn">RESET</button>
            </div>
            <p className="timer-status">
                {time === 0 ? "Time’s up! Take a break." : isRunning ? "Focus mode: ON" : "Stay focused."}
            </p>
        </section>
    );
};

// 👇 THIS IS THE LINE THAT WAS LIKELY MISSING
export default FocusTimer;