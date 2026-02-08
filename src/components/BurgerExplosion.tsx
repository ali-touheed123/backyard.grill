import { useEffect, useRef, useState, useMemo } from 'react';
import { useScroll, useTransform, motion, useSpring } from 'framer-motion';
import { burgerFrames } from '@/data/burgerFrames';

export const BurgerExplosion = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Smooth out the scroll progress for that premium feel
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 50,
        damping: 20,
        restDelta: 0.001
    });

    // Map scroll progress to frame index
    // We start the animation slightly after it enters the viewport and end before it exits
    const frameIndex = useTransform(
        smoothProgress,
        [0.2, 0.8],
        [0, burgerFrames.length - 1]
    );

    // Preload images
    useEffect(() => {
        let loadedCount = 0;
        const totalFrames = burgerFrames.length;

        const loadImages = async () => {
            const loadedImages = await Promise.all(
                burgerFrames.map((frame, index) => {
                    return new Promise<HTMLImageElement>((resolve) => {
                        const img = new Image();
                        img.src = `/split/${frame}`;
                        img.onload = () => {
                            loadedCount++;
                            setLoadProgress(Math.floor((loadedCount / totalFrames) * 100));
                            resolve(img);
                        };
                        img.onerror = () => {
                            console.error(`Failed to load frame: ${frame}`);
                            resolve(new Image()); // Fallback to empty image to prevent total failure
                        };
                    });
                })
            );
            setImages(loadedImages);
            setIsLoading(false);
        };
        loadImages();
    }, []);

    // Optimized Resize & Canvas Setup
    useEffect(() => {
        if (isLoading) return;

        const handleResize = () => {
            if (canvasRef.current) {
                const canvas = canvasRef.current;
                const dpr = window.devicePixelRatio || 1;
                // Use the visual size of the canvas for layout
                const rect = canvas.getBoundingClientRect();

                // Set internal resolution based on DPR for sharpness
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;

                // Initial render update
                renderFrame(Math.round(frameIndex.get()));
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [isLoading]);

    // Independent rendering function
    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas || images.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const safeIndex = Math.max(0, Math.min(index, images.length - 1));
        const img = images[safeIndex];

        if (img && img.width > 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            // "COVER" scaling logic: Crop empty space so the burger fills the viewport
            // We scale based on WIDTH primarily to ensure it's large, but Max ensures we fill everything
            const scale = Math.max(canvasWidth / img.width, canvasHeight / img.height);

            // Center the image while scaled up (this naturally crops the edges/top/bottom)
            const x = (canvasWidth / 2) - (img.width / 2) * scale;
            const y = (canvasHeight / 2) - (img.height / 2) * scale;

            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        }
    };

    // Animation loop driven by Framer Motion's useTransform
    useEffect(() => {
        if (isLoading || images.length === 0) return;

        let animationFrameId: number;

        const update = () => {
            const currentIndex = Math.round(frameIndex.get());
            renderFrame(currentIndex);
            animationFrameId = requestAnimationFrame(update);
        };

        animationFrameId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationFrameId);
    }, [images, isLoading, frameIndex]);

    return (
        <div ref={containerRef} className="relative h-[250vh] md:h-[400vh] w-full z-0 pointer-events-none">
            {/* 
                We use z-0 to push it behind other content if needed, 
                and no margins to make it feel like a fixed background.
            */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-background">
                {/* 
                    Full viewport container for the canvas to allow it to 
                    "stick" properly without boundaries.
                */}
                <div className="relative w-full h-full flex items-center justify-center">
                    {!isLoading ? (
                        <motion.canvas
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            ref={canvasRef}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative w-24 h-24">
                                <div className="absolute inset-0 border-4 border-primary/10 rounded-full" />
                                <motion.div
                                    className="absolute inset-0 border-4 border-t-primary rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-foreground">Assembling Freshness</p>
                                <p className="text-sm text-muted-foreground">{loadProgress}%</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
