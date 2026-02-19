import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Grid, IconButton, LinearProgress, Stack, Typography, useTheme } from "@mui/material";
import { ExpandMore, Lock, Storefront, LocalCafe, ShoppingCart, Train, LocalFireDepartment, EmojiEvents, Close, AccessTime, AdsClick } from "@mui/icons-material";
import { motion } from "framer-motion";
import trophy1 from "../assets/trophies/1.png";
import trophy2 from "../assets/trophies/2.png";
import trophy3 from "../assets/trophies/3.png";
import trophy4 from "../assets/trophies/4.png";
import imgUrl from '../assets/cancara.png';

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

export function SubCard(props: {
    title: string;
    content: string;
    icon: React.ReactNode;
    index: number;
    centerContent?: boolean;
}) {
    const theme = useTheme();
    return (
        <motion.div
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            whileHover={{ scale: 1.05, rotateY: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 10, delay: props.index * 0.3 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
            <Box bgcolor={theme.palette.primary.main} sx={{
                borderTopRightRadius: '12px',
                borderTopLeftRadius: '12px',
                padding: '6px 4px',
                color: theme.palette.primary.contrastText,
                textAlign: 'center',
                minHeight: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.65rem' }}>
                    {props.title}
                </Typography>
            </Box>
            <Box sx={{
                borderBottomLeftRadius: '12px',
                borderBottomRightRadius: '12px',
                border: `2px solid ${theme.palette.primary.main}`,
                padding: '10px 4px',
                display: 'flex',
                gap: 0.5,
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'white',
                flexGrow: 1,
                minHeight: '48px'
            }}>
                {props.icon && <Box sx={{ display: 'flex', color: theme.palette.primary.main, mr: props.centerContent ? 0 : 0.5 }}>{props.icon}</Box>}
                <Typography variant="h6" sx={{ fontWeight: 900, fontSize: '1rem', lineHeight: 1 }}>
                    {props.content}
                </Typography>
            </Box>
        </motion.div>
    );
}

export function ResultsPage(props: {
    onNavigateToStore: () => void,
    onNavigateToTransfer: () => void,
    playtime: string,
    bonusPoints: number,
    usersPoints: number,
    setUsersPoints: (points: number) => void,
    onNavigateToInsightPlay: () => void,
    gameResultScore: number,
    hintCount: number,
    userStreak: number,
    isPulsing?: boolean
}) {
    const theme = useTheme();

    const groupedItems = TROPHY_TIERS.map(tier => ({
        ...tier,
        items: allItems.filter(item => item.tier === tier.name),
        unlocked: props.userStreak >= tier.minStreak
    }));

    const defaultExpanded = props.isPulsing ? 'Challenge guru' : groupedItems.reduce((prev, curr) =>
        (curr.unlocked ? curr.name : prev), 'Prize draw fiend');

    const handleFinish = () => {
        props.setUsersPoints(props.usersPoints + Math.round(props.gameResultScore) + props.bonusPoints);
        props.onNavigateToInsightPlay();
    };

    return (
        <Stack alignItems={'center'} spacing={2} paddingTop={2} paddingBottom={4} sx={{ position: 'relative' }}>
            {/* Close Button Top Left */}
            <IconButton
                onClick={handleFinish}
                sx={{ position: 'absolute', top: 16, left: 16 }}
            >
                <Close />
            </IconButton>

            <Stack alignItems={'center'} spacing={2}>
                <Stack direction={'row'} alignItems={'center'} spacing={2}>
                    <Typography variant="h6">Guess Your Spend</Typography>
                </Stack>
                <Typography variant="h4">Nice Work</Typography>
                <Box
                    width={'35%'}
                    sx={{
                        aspectRatio: '1 / 1',
                    }}
                >
                    <img src={imgUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
            </Stack>

            <Stack
                width={'90%'}
                padding={1}
                direction="row"
                alignContent={'stretch'}
                justifyContent={'center'}
                spacing={1.5}
            >
                <SubCard
                    title="Time"
                    content={props.playtime}
                    icon={<AccessTime sx={{ fontSize: '1.1rem' }} />}
                    index={1}
                />
                <SubCard
                    title="Hints"
                    content={props.hintCount.toString()}
                    icon={null}
                    index={2}
                    centerContent
                />
                <SubCard
                    title="Score"
                    content={`${Math.round(props.gameResultScore)}%`}
                    icon={<AdsClick sx={{ fontSize: '1.1rem' }} />}
                    index={3}
                    centerContent
                />
            </Stack>

            {/* Achievements Content */}
            <Box width="90%" sx={{ mt: 2 }}>
                {/* Streaks Accordion */}
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
                            <EmojiEvents sx={{ color: theme.palette.primary.main }} />
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
                                                        bgcolor: trophy.earned ? theme.palette.primary.main : '#FFB100',
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

                <Typography variant="h5" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>Rewards</Typography>

                <style>
                    {`
                        @keyframes pulse {
                            0% { box-shadow: 0 0 0 0 rgba(27, 94, 32, 0.6); border-color: #1b5e20; }
                            70% { box-shadow: 0 0 0 15px rgba(27, 94, 32, 0); border-color: #2e7d32; }
                            100% { box-shadow: 0 0 0 0 rgba(27, 94, 32, 0); border-color: #1b5e20; }
                        }
                    `}
                </style>

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
                            opacity: tier.unlocked ? 1 : 0.8,
                            animation: (props.isPulsing && tier.name === 'Challenge guru') ? 'pulse 2s 3' : 'none'
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
                        <AccordionDetails sx={{ p: 2, bgcolor: tier.unlocked ? `#a8f5cc40` : theme.palette.action.disabledBackground }}>
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
