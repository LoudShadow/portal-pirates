import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Grid, IconButton, LinearProgress, Stack, TextField, Typography, useTheme } from "@mui/material";
import { ArrowBack, ExpandMore, Lock, Casino, MyLocation, WorkspacePremium, Storefront, LocalCafe, ShoppingCart, Train, LocalFireDepartment, EmojiEvents } from "@mui/icons-material";
import { motion } from "framer-motion";
import trophy1 from "../assets/trophies/1.png";
import trophy2 from "../assets/trophies/2.png";
import trophy3 from "../assets/trophies/3.png";
import trophy4 from "../assets/trophies/4.png";

const allItems = [
    { name: "Car Insurance", icon: <Storefront />, streak: 36, tier: 'Back to back' },
    { name: "Pet Insurance", icon: <Storefront />, streak: 28, tier: 'Challenge guru' },
    { name: "Coffee", icon: <LocalCafe />, streak: 2, tier: 'Prize draw fiend' },
    { name: "Tesco", icon: <ShoppingCart />, streak: 2, tier: 'Prize draw fiend' },
    { name: "Sainsbury's", icon: <ShoppingCart />, streak: 2, tier: 'Prize draw fiend' },
    { name: "Asda", icon: <ShoppingCart />, streak: 2, tier: 'Prize draw fiend' },
    { name: "Nike", icon: <ShoppingCart />, streak: 28, tier: 'Challenge guru' },
    { name: "LNER", icon: <Train />, streak: 28, tier: 'Challenge guru' },
];

const TROPHY_TIERS = [
    { name: 'Prize draw fiend', minStreak: 2, color: '#cd7f32', image: trophy1 },
    { name: 'Challenge guru', minStreak: 28, color: '#c0c0c0', image: trophy2 },
    { name: 'Back to back', minStreak: 36, color: '#ffd700', image: trophy3 },
];

const trophies = [
    { name: "Challenge Guru", id: "guru", earned: true, image: trophy1, current: 5, total: 5 },
    { name: "Amazing Spender", id: "spender", earned: true, image: trophy2, current: 10, total: 10 },
    { name: "Goal Getter", id: "goal", earned: false, image: trophy3, current: 3, total: 10 },
    { name: "Savings Star", id: "savings", earned: false, image: trophy4, current: 7, total: 15 },
];

const currentMonthDays = Array.from({ length: 31 }, (_, i) => i + 1);
const streakDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
const daysToNextTrophy = 5;


export function AchievementsPage(props: { onNavigateToResults: () => void, userStreak: number }) {
    const theme = useTheme();
    const groupedItems = TROPHY_TIERS.map(tier => ({
        ...tier,
        items: allItems.filter(item => item.tier === tier.name),
        unlocked: props.userStreak >= tier.minStreak
    }));

    // Find the highest unlocked tier to expand it by default
    const defaultExpanded = groupedItems.reduce((prev, curr) =>
        (curr.unlocked ? curr.name : prev), 'Prize draw fiend');

    return (
        <Stack alignItems={'center'} spacing={2} paddingTop={2} paddingBottom={4}>
            <Stack alignItems={'center'} spacing={2} width="100%">
                <Stack direction={'row'} alignItems={'center'} spacing={2} width={'90%'} justifyContent={'space-between'}>
                    <Stack direction={'row'} alignItems={'center'} spacing={2}>
                        <IconButton onClick={props.onNavigateToResults}>
                            <ArrowBack />
                        </IconButton>
                        <Typography variant="h6" fontWeight="bold">Achievements</Typography>
                    </Stack>
                    <Box sx={{
                        background: 'linear-gradient(45deg, #005A42 0%, #008563 100%)',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: '20px',
                        boxShadow: '0 4px 10px rgba(0, 90, 66, 0.3)'
                    }}>
                        <Typography variant="subtitle2" fontWeight="bold">{props.userStreak} Day Streak 🔥</Typography>
                    </Box>
                </Stack>
            </Stack>

            <Box width="90%">
                {/* Streaks Accordion */}
                <Accordion
                    defaultExpanded
                    sx={{
                        mb: 2,
                        borderRadius: '16px !important',
                        '&:before': { display: 'none' },
                        boxShadow: theme.shadows[2],
                        overflow: 'hidden',
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Stack direction="row" alignItems="center" spacing={2} width="100%">
                            <LocalFireDepartment sx={{ color: theme.palette.primary.main }} />
                            <Box flexGrow={1}>
                                <Typography variant="subtitle1" fontWeight="bold">Current Streak</Typography>
                                <Stack direction="row" spacing={0.5} mt={0.5}>
                                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                        <Avatar
                                            key={i}
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                fontSize: '0.7rem',
                                                bgcolor: i < 5 ? theme.palette.primary.main : 'grey.300',
                                                color: 'white'
                                            }}
                                        >
                                            {day}
                                        </Avatar>
                                    ))}
                                </Stack>
                            </Box>
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>February 2026</Typography>
                        <Grid container spacing={1}>
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
                                <Grid size={1.7} key={day} sx={{ textAlign: 'center' }}>
                                    <Typography variant="caption" fontWeight="bold">{day}</Typography>
                                </Grid>
                            ))}
                            {currentMonthDays.map(day => (
                                <Grid size={1.7} key={day}>
                                    <Box
                                        sx={{
                                            aspectRatio: '1/1',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '50%',
                                            bgcolor: streakDays.includes(day) ? (day === 31 ? theme.palette.primary.main : `${theme.palette.primary.main}20`) : 'transparent',
                                            color: day === 31 ? 'white' : (streakDays.includes(day) ? theme.palette.primary.main : 'text.primary'),
                                            fontWeight: streakDays.includes(day) ? 'bold' : 'normal',
                                            fontSize: '0.8rem',
                                            position: 'relative'
                                        }}
                                    >
                                        {day}
                                        {day === 31 && (
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.2, 1],
                                                    opacity: [0.8, 1, 0.8]
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    top: -12,
                                                    right: -8,
                                                    color: theme.palette.primary.main,
                                                    fontSize: '1.2rem',
                                                    display: 'flex'
                                                }}
                                            >
                                                🔥
                                            </motion.div>
                                        )}
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{ mt: 3, p: 2, bgcolor: theme.palette.background.default, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography variant="subtitle2" fontWeight="bold">Next Achievement: Back to back</Typography>
                                <Typography variant="caption" fontWeight="bold">
                                    {props.userStreak}/36
                                </Typography>
                            </Stack>
                            <LinearProgress
                                variant="determinate"
                                value={(props.userStreak / 36) * 100}
                                sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    bgcolor: 'grey.200',
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: theme.palette.primary.main,
                                        borderRadius: 5,
                                    }
                                }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                                Just <strong>{36 - props.userStreak}</strong> more days to unlock the gold trophy!
                            </Typography>
                        </Box>
                    </AccordionDetails>
                </Accordion>

                {/* Trophies Accordion */}
                <Accordion
                    sx={{
                        mb: 2,
                        borderRadius: '16px !important',
                        '&:before': { display: 'none' },
                        boxShadow: theme.shadows[2],
                        overflow: 'hidden',
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <EmojiEvents sx={{ color: '#006A4D' }} />
                            <Typography variant="subtitle1" fontWeight="bold">Trophies</Typography>
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2}>
                            {trophies.map((trophy) => (
                                <Grid size={6} key={trophy.id}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 3,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 1,
                                            textAlign: 'center',
                                            background: trophy.earned ? 'linear-gradient(135deg, #f0fff4 0%, #ffffff 100%)' : 'white',
                                        }}
                                    >
                                        <Box sx={{ width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <img src={trophy.image} alt={trophy.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        </Box>
                                        <Typography variant="subtitle2" fontWeight="bold">{trophy.name}</Typography>

                                        <Box sx={{ width: '100%', mt: 1 }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                                                <Typography variant="caption" color="text.secondary">Progress</Typography>
                                                <Typography variant="caption" fontWeight="bold">
                                                    {trophy.current}/{trophy.total}
                                                </Typography>
                                            </Stack>
                                            <LinearProgress
                                                variant="determinate"
                                                value={(trophy.current / trophy.total) * 100}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    bgcolor: 'grey.200',
                                                    '& .MuiLinearProgress-bar': {
                                                        bgcolor: trophy.earned ? '#006A4D' : '#FFB100',
                                                        borderRadius: 4,
                                                    }
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Box>


            <Stack direction="row" justifyContent="space-between" width="90%" alignItems="center" mt={3} mb={1}>
                <Typography variant="h5" fontWeight="bold">Rewards</Typography>
            </Stack>

            <Box width="90%">
                {groupedItems.map(tier => (
                    <Accordion
                        key={tier.name}
                        defaultExpanded={tier.name === defaultExpanded}
                        sx={{
                            mb: 2,
                            borderRadius: '16px !important',
                            '&:before': { display: 'none' },
                            boxShadow: theme.shadows[2],
                            overflow: 'hidden',
                            border: `1px solid ${tier.unlocked ? '#a8f5cc' : theme.palette.divider}`,
                            opacity: tier.unlocked ? 1 : 0.8
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            sx={{
                                bgcolor: tier.unlocked ? `#a8f5cc40` : theme.palette.action.disabledBackground,
                                minHeight: 72
                            }}
                        >
                            <Stack direction="row" alignItems="center" spacing={2} width="100%">
                                <Box sx={{
                                    width: 64,
                                    height: 64,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    filter: tier.unlocked ? 'none' : 'grayscale(100%)',
                                    opacity: tier.unlocked ? 1 : 0.5
                                }}>
                                    <img src={tier.image} alt={tier.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1.2, color: tier.unlocked ? 'text.primary' : 'text.disabled' }}>
                                        {tier.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: tier.unlocked ? '#2e7d32' : 'text.disabled', fontWeight: 'bold' }}>
                                        {tier.minStreak} days
                                    </Typography>
                                </Box>
                                {!tier.unlocked && <Lock sx={{ fontSize: 18, color: 'text.disabled', ml: 1 }} />}
                                <Box flexGrow={1} />
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 2, bgcolor: theme.palette.background.default }}>
                            <Grid container spacing={2}>
                                {tier.items.map(item => (
                                    <Grid size={6} key={item.name}>
                                        <Box
                                            borderRadius={'24px'}
                                            bgcolor={theme.palette.background.paper}
                                            border={1}
                                            borderColor={theme.palette.divider}
                                            padding={3}
                                            display={'flex'}
                                            flexDirection={'column'}
                                            alignItems={'center'}
                                            gap={1}
                                            sx={{
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                '&:hover': tier.unlocked ? {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: theme.shadows[8],
                                                    borderColor: '#a8f5cc'
                                                } : {},
                                                position: 'relative',
                                                cursor: tier.unlocked ? 'pointer' : 'default'
                                            }}
                                        >
                                            <Box sx={{
                                                fontSize: '2.5rem',
                                                lineHeight: 1,
                                                filter: tier.unlocked ? 'none' : 'grayscale(100%)',
                                                opacity: tier.unlocked ? 1 : 0.5,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: tier.unlocked ? '#2e7d32' : 'text.disabled'
                                            }}>
                                                {item.icon}
                                            </Box>
                                            <Typography fontWeight="800" fontSize="0.9rem" textAlign="center" sx={{ color: tier.unlocked ? 'text.primary' : 'text.disabled' }}>
                                                {item.name}
                                            </Typography>
                                            <Box sx={{
                                                bgcolor: tier.unlocked ? `#d1f7e3` : 'transparent',
                                                px: 1,
                                                borderRadius: '8px'
                                            }}>
                                                <Typography variant="caption" sx={{ color: tier.unlocked ? '#1b5e20' : 'text.disabled', fontWeight: 'bold' }}>
                                                    {item.streak} days
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Stack>
    );
}
