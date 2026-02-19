import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Box, Typography, Button, Paper, Stack, useTheme, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';

import sainsburysLogo from '../assets/logos/Sainsburys_Logo.svg';
import costaLogo from '../assets/logos/Costa_Coffee_Logo.svg';
import waitroseLogo from '../assets/logos/Waitrose_Logo.svg';
import boltLogo from '../assets/logos/Bolt_Logo.svg';
import ebayLogo from '../assets/logos/EBay_Logo.svg';

interface Transaction {
    merchant: string;
    price: number;
    time: string;
    merchant_logo_url?: string;
}

interface BrandGrabProps {
    transactions_weekly: Transaction[];
    onFinishGame: () => void;
}

interface GameIcon {
    id: string;
    name: string;
    logo: string;
    isDecoy: boolean;
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    visits?: number;
    price?: number;
    caught: boolean;
    caughtTime?: number;
    rotation: number;
    rotationSpeed: number;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    alpha: number;
    color: string;
    life: number;
}

const DECOY_DATA = [
    { name: "Sainsbury's", logo: sainsburysLogo },
    { name: "Costa Coffee", logo: costaLogo },
    { name: "Waitrose", logo: waitroseLogo },
    { name: "Bolt", logo: boltLogo },
    { name: "eBay", logo: ebayLogo },
];

export const WhereDidYouShop: React.FC<BrandGrabProps> = ({ transactions_weekly, onFinishGame }) => {
    const theme = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [timeLeft, setTimeLeft] = useState(15);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [iconsState, setIconsState] = useState<{ id: string, x: number, y: number, radius: number, logo: string, name: string, caught: boolean, rotation: number }[]>([]);
    const [score, setScore] = useState({ caught: 0, total: 0 });
    const [showSummary, setShowSummary] = useState(false);

    const requestRef = useRef<number>(null);
    const iconsRef = useRef<GameIcon[]>([]);
    const particlesRef = useRef<Particle[]>([]);

    const activeMerchants = useMemo(() => {
        const unique = new Map<string, { count: number, maxPrice: number, logo: string }>();
        transactions_weekly.forEach(tx => {
            const current = unique.get(tx.merchant) || { count: 0, maxPrice: 0, logo: tx.merchant_logo_url || '' };
            unique.set(tx.merchant, {
                count: current.count + 1,
                maxPrice: Math.max(current.maxPrice, tx.price),
                logo: current.logo
            });
        });
        return Array.from(unique.entries()).map(([name, data]) => ({
            name,
            ...data
        }));
    }, [transactions_weekly]);

    const initGame = () => {
        const container = containerRef.current;
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        const newIcons: GameIcon[] = [];

        // Add Active Icons
        activeMerchants.forEach((m, i) => {
            newIcons.push({
                id: `active-${i}`,
                name: m.name,
                logo: m.logo,
                isDecoy: false,
                x: Math.random() * width,
                y: Math.random() * (height - 200),
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                radius: 40,
                visits: m.count,
                price: m.maxPrice,
                caught: false,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.05
            });
        });

        // Add Decoy Icons
        const decoys = DECOY_DATA.sort(() => 0.5 - Math.random()).slice(0, 4);
        decoys.forEach((d, i) => {
            newIcons.push({
                id: `decoy-${i}`,
                name: d.name,
                logo: d.logo,
                isDecoy: true,
                x: Math.random() * width,
                y: Math.random() * (height - 200),
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                radius: 40,
                caught: false,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.05
            });
        });

        iconsRef.current = newIcons;
        setIconsState(newIcons.map(i => ({ id: i.id, x: i.x, y: i.y, radius: i.radius, logo: i.logo, name: i.name, caught: i.caught, rotation: i.rotation })));
        setScore({ caught: 0, total: activeMerchants.length });
        setGameStarted(true);
        setTimeLeft(15);
    };

    useEffect(() => {
        if (!gameStarted) {
            initGame();
        }
    }, [gameStarted]);

    useEffect(() => {
        if (gameStarted && timeLeft > 0 && !gameEnded) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !gameEnded) {
            setGameEnded(true);
            setTimeout(() => setShowSummary(true), 1000);
        }
    }, [gameStarted, timeLeft, gameEnded]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (gameEnded) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = (e as any).touches[0].clientX;
            clientY = (e as any).touches[0].clientY;
        } else {
            clientX = (e as any).clientX;
            clientY = (e as any).clientY;
        }

        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;

        iconsRef.current = iconsRef.current.map(icon => {
            if (icon.caught) return icon;

            const dx = icon.x - mouseX;
            const dy = icon.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < icon.radius) {
                if (icon.isDecoy) {
                    return { ...icon, rotationSpeed: 0.3 };
                } else {
                    createParticles(icon.x, icon.y, theme.palette.primary.main);
                    if (navigator.vibrate) navigator.vibrate(50);
                    setScore(s => ({ ...s, caught: s.caught + 1 }));
                    return { ...icon, caught: true, caughtTime: Date.now() };
                }
            }
            return icon;
        });

        // Update visual state for icons that fly away
        setIconsState(iconsRef.current.map(i => ({ id: i.id, x: i.x, y: i.y, radius: i.radius, logo: i.logo, name: i.name, caught: i.caught, rotation: i.rotation })));
    };

    const createParticles = (x: number, y: number, color: string) => {
        for (let i = 0; i < 15; i++) {
            particlesRef.current.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                alpha: 1,
                color,
                life: 30 + Math.random() * 20
            });
        }
    };

    const update = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        // Update icons
        const nextIcons = iconsRef.current.map(icon => {
            if (icon.caught) {
                const targetX = width / 2;
                const targetY = height - 50;
                const dx = targetX - icon.x;
                const dy = targetY - icon.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 20) {
                    return { ...icon, x: targetX, y: targetY, vx: 0, vy: 0 };
                }

                return {
                    ...icon,
                    x: icon.x + dx * 0.1,
                    y: icon.y + dy * 0.1,
                    rotation: icon.rotation + 0.1
                };
            }

            let nx = icon.x + icon.vx;
            let ny = icon.y + icon.vy;
            let nvx = icon.vx;
            let nvy = icon.vy;

            if (nx - icon.radius < 0) {
                nx = icon.radius;
                nvx *= -1;
            } else if (nx + icon.radius > width) {
                nx = width - icon.radius;
                nvx *= -1;
            }

            if (ny - icon.radius < 0) {
                ny = icon.radius;
                nvy *= -1;
            } else if (ny + icon.radius > height - 150) {
                ny = height - 150 - icon.radius;
                nvy *= -1;
            }

            const time = Date.now() / 1000;
            nvy += Math.sin(time + icon.id.length) * 0.05;

            let nRotationSpeed = icon.rotationSpeed;
            if (icon.isDecoy && Math.abs(nRotationSpeed) > 0.05) {
                nRotationSpeed *= 0.9;
            }

            return {
                ...icon,
                x: nx,
                y: ny,
                vx: nvx,
                vy: nvy,
                rotation: icon.rotation + nRotationSpeed,
                rotationSpeed: nRotationSpeed
            };
        });

        // Collision detection
        for (let i = 0; i < nextIcons.length; i++) {
            for (let j = i + 1; j < nextIcons.length; j++) {
                const a = nextIcons[i];
                const b = nextIcons[j];
                if (a.caught || b.caught) continue;

                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < a.radius + b.radius) {
                    const angle = Math.atan2(dy, dx);
                    const sin = Math.sin(angle);
                    const cos = Math.cos(angle);

                    const vx1 = a.vx * cos + a.vy * sin;
                    const vy1 = a.vy * cos - a.vx * sin;
                    const vx2 = b.vx * cos + b.vy * sin;
                    const vy2 = b.vy * cos - b.vx * sin;

                    a.vx = vx2 * cos - vy1 * sin;
                    a.vy = vy1 * cos + vx2 * sin;
                    b.vx = vx1 * cos - vy2 * sin;
                    b.vy = vy2 * cos + vx1 * sin;

                    const overlap = (a.radius + b.radius - dist) / 2;
                    a.x -= overlap * cos;
                    a.y -= overlap * sin;
                    b.x += overlap * cos;
                    b.y += overlap * sin;
                }
            }
        }

        iconsRef.current = nextIcons;

        // Draw icons
        iconsRef.current.forEach(icon => {
            if (icon.y > height - 20 && icon.caught) return;

            ctx.save();
            ctx.translate(icon.x, icon.y);
            ctx.rotate(icon.rotation);
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(0,0,0,0.2)';
            ctx.beginPath();
            ctx.arc(0, 0, icon.radius, 0, Math.PI * 2);
            ctx.fillStyle = theme.palette.background.paper;
            ctx.fill();
            ctx.restore();

            if (icon.caught && icon.visits) {
                ctx.save();
                ctx.fillStyle = theme.palette.primary.main;
                ctx.font = 'bold 20px sans-serif';
                ctx.fillText(`${icon.visits}x`, icon.x + 20, icon.y - 20);
                ctx.restore();
            }
        });

        // Particles
        particlesRef.current = particlesRef.current.map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            alpha: p.alpha * 0.95,
            life: p.life - 1
        })).filter(p => p.life > 0);

        particlesRef.current.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // sync iconsState for React overlay
        setIconsState(iconsRef.current.map(i => ({ id: i.id, x: i.x, y: i.y, radius: i.radius, logo: i.logo, name: i.name, caught: i.caught, rotation: i.rotation })));

        requestRef.current = requestAnimationFrame(update);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(update);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    // Resize handler
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current && containerRef.current) {
                canvasRef.current.width = containerRef.current.clientWidth;
                canvasRef.current.height = containerRef.current.clientHeight;
                // Re-init or adjust icons if size changes significantly? 
                // For now just adjust canvas size
            }
        };
        const resizeObserver = new ResizeObserver(handleResize);
        if (containerRef.current) resizeObserver.observe(containerRef.current);
        handleResize();
        return () => resizeObserver.disconnect();
    }, []);

    const mvp = activeMerchants.sort((a, b) => b.count - a.count)[0];
    const bigSpender = activeMerchants.sort((a, b) => b.maxPrice - a.maxPrice)[0];

    return (
        <Box
            ref={containerRef}
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                bgcolor: 'background.default',
                zIndex: 9999,
                overflow: 'hidden',
                touchAction: 'none'
            }}
        >
            {/* Background Images Layer (simulating logos better) */}
            <div style={{ position: 'absolute', pointerEvents: 'none', width: '100%', height: '100%' }}>
                {iconsState.map(icon => (
                    !icon.caught && (
                        <div
                            key={icon.id}
                            style={{
                                position: 'absolute',
                                left: icon.x - icon.radius,
                                top: icon.y - icon.radius,
                                width: icon.radius * 2,
                                height: icon.radius * 2,
                                borderRadius: '50%',
                                background: '#fff',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                transform: `rotate(${icon.rotation}rad)`
                            }}
                        >
                            <img
                                src={icon.logo}
                                alt={icon.name}
                                style={{ width: '70%', height: '70%', objectFit: 'contain' }}
                            />
                        </div>
                    )
                ))}
            </div>

            <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                onTouchStart={handleCanvasClick}
                style={{ width: '100%', height: '100%' }}
            />

            {/* Top UI */}
            <Stack
                direction="row"
                justifyContent="center"
                sx={{ position: 'absolute', top: 40, width: '100%', pointerEvents: 'none' }}
            >
                <Paper sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 1
                }}>
                    <Typography variant="h4" sx={{ fontWeight: '900', color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                        {timeLeft}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                        seconds
                    </Typography>
                </Paper>
            </Stack>

            {/* Collection Bucket */}
            <Box sx={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                pb: 4,
                pointerEvents: 'none'
            }}>
                <motion.div
                    animate={{
                        y: gameEnded ? 200 : 0,
                        opacity: gameEnded ? 0 : 1
                    }}
                    style={{
                        width: '80%',
                        height: 80,
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: '20px 20px 40px 40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        boxShadow: '0 -10px 20px rgba(0,0,0,0.1)'
                    }}
                >
                    <Typography fontWeight="bold">COLLECTION BUCKET</Typography>
                </motion.div>
            </Box>

            {/* Icons flying to bucket (visual overlay) */}
            {iconsState.filter(i => i.caught).map(icon => (
                <motion.div
                    key={icon.id}
                    initial={{ left: icon.x, top: icon.y, scale: 1 }}
                    animate={{
                        left: (containerRef.current?.clientWidth || 200) / 2 - icon.radius,
                        top: (containerRef.current?.clientHeight || 400) - 80,
                        scale: 0.5,
                        opacity: 0
                    }}
                    transition={{ duration: 0.5, ease: "circIn" }}
                    style={{
                        position: 'absolute',
                        width: icon.radius * 2,
                        height: icon.radius * 2,
                        borderRadius: '50%',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        zIndex: 10
                    }}
                >
                    <img src={icon.logo} alt={icon.name} style={{ width: '60%', height: '60%', objectFit: 'contain' }} />
                </motion.div>
            ))}

            <AnimatePresence>
                {showSummary && (
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        bgcolor: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(5px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 100
                    }}>
                        <motion.div
                            initial={{ y: 500, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 500, opacity: 0 }}
                        >
                            <Paper sx={{ p: 4, borderRadius: 6, maxWidth: 350, textAlign: 'center' }}>
                                <Typography variant="h4" fontWeight="900" gutterBottom color="primary">
                                    Weekly Summary
                                </Typography>

                                <Stack spacing={3} sx={{ my: 4 }}>
                                    <Box>
                                        <Typography variant="h2" fontWeight="900">
                                            {score.caught}/{score.total}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">Brands Caught</Typography>
                                    </Box>

                                    <Paper elevation={0} sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 4 }}>
                                        <Typography variant="caption" fontWeight="bold" color="text.secondary">MOST VISITED</Typography>
                                        <Typography variant="h6" fontWeight="bold">{mvp?.name}</Typography>
                                        <Typography variant="body2">{mvp?.count} times</Typography>
                                    </Paper>

                                    <Paper elevation={0} sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 4 }}>
                                        <Typography variant="caption" fontWeight="bold" color="text.secondary">BIG SPENDER</Typography>
                                        <Typography variant="h6" fontWeight="bold">{bigSpender?.name}</Typography>
                                        <Typography variant="body2">£{bigSpender?.maxPrice.toFixed(2)}</Typography>
                                    </Paper>
                                </Stack>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    sx={{ borderRadius: 4, py: 2, fontWeight: 'bold' }}
                                    onClick={onFinishGame}
                                >
                                    View Full Statement
                                </Button>
                            </Paper>
                        </motion.div>
                    </Box>
                )}
            </AnimatePresence>

            <IconButton
                onClick={onFinishGame}
                sx={{ position: 'absolute', top: 20, left: 20, bgcolor: 'rgba(255,255,255,0.8)' }}
            >
                <CloseIcon />
            </IconButton>
        </Box>
    );
};
