import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { Close, MyLocation } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface TrophySplashScreenProps {
    onClose: () => void;
    onShare: () => void;
}

export function TrophySplashScreen({ onClose, onShare }: TrophySplashScreenProps) {
    const [confetti, setConfetti] = useState<any[]>([]);

    useEffect(() => {
        // Simple confetti generation
        const newConfetti = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: -10,
            size: Math.random() * 8 + 4,
            color: ['#ffeb3b', '#4caf50', '#2196f3', '#f44336', '#ffffff'][Math.floor(Math.random() * 5)],
            delay: Math.random() * 2,
            duration: Math.random() * 2 + 2,
            angle: Math.random() * 360
        }));
        setConfetti(newConfetti);
    }, []);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#00b06a',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    borderRadius: 'inherit' // Inherit border radius from phone container
                }}
            >
                {/* Confetti Particles */}
                {confetti.map((c) => (
                    <motion.div
                        key={c.id}
                        initial={{ top: '-5%', left: `${c.x}%`, rotate: 0 }}
                        animate={{
                            top: '105%',
                            left: `${c.x + (Math.random() * 10 - 5)}%`,
                            rotate: c.angle + 360
                        }}
                        transition={{
                            duration: c.duration,
                            delay: c.delay,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{
                            position: 'absolute',
                            width: c.size,
                            height: c.size,
                            backgroundColor: c.color,
                            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                            pointerEvents: 'none', // Prevent particles from blocking clicks
                            zIndex: 0
                        }}
                    />
                ))}

                {/* Close Button */}
                <IconButton
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    sx={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        color: 'black',
                        zIndex: 10000, // Ensure it's above everything
                        pointerEvents: 'auto'
                    }}
                >
                    <Close fontSize="large" />
                </IconButton>

                {/* Trophy Content */}
                <Stack alignItems="center" spacing={4} sx={{ textAlign: 'center', zIndex: 1 }}>
                    <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.2 }}
                    >
                        <Box
                            sx={{
                                width: 220,
                                height: 220,
                                borderRadius: '50%',
                                bgcolor: '#1de9b6', // Slightly lighter mint green for the halo
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                                border: '8px solid white',
                                position: 'relative'
                            }}
                        >
                            <MyLocation sx={{ fontSize: 130, color: '#004d40' }} />
                        </Box>
                    </motion.div>

                    <Stack spacing={1}>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Typography variant="h2" fontWeight="900" sx={{ color: 'black', letterSpacing: '-1px' }}>
                                Challenge guru
                            </Typography>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'rgba(0,0,0,0.6)' }}>
                                {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </Typography>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <Typography variant="h6" sx={{ color: 'black', px: 4, mt: 1 }}>
                                Nice! You’ve completed 28 challenges!
                            </Typography>
                        </motion.div>
                    </Stack>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.9 }}
                    >
                        <Button
                            variant="contained"
                            onClick={onShare}
                            sx={{
                                bgcolor: 'white',
                                color: 'black',
                                fontWeight: '900',
                                borderRadius: '12px',
                                px: 6,
                                py: 1.5,
                                fontSize: '1.2rem',
                                textTransform: 'none',
                                '&:hover': { bgcolor: '#f5f5f5' },
                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                            }}
                        >
                            Share
                        </Button>
                    </motion.div>
                </Stack>
            </motion.div>
        </AnimatePresence>
    );
}
