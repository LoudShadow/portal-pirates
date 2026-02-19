import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, IconButton, Stack, TextField, Typography, useTheme } from "@mui/material";
import { ArrowBack, ExpandMore, Lock, Casino, MyLocation, WorkspacePremium, Storefront, LocalCafe, ShoppingCart, Train } from "@mui/icons-material";
import { useState } from "react";

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
    { name: 'Prize draw fiend', minStreak: 2, color: '#cd7f32', icon: <Casino /> },
    { name: 'Challenge guru', minStreak: 28, color: '#c0c0c0', icon: <MyLocation /> },
    { name: 'Back to back', minStreak: 36, color: '#ffd700', icon: <WorkspacePremium /> },
];

export function StorePage(props: { onNavigateToResults: () => void, userStreak: number }) {
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredItems = allItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groupedItems = TROPHY_TIERS.map(tier => ({
        ...tier,
        items: filteredItems.filter(item => item.tier === tier.name),
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
                        <Typography variant="h6" fontWeight="bold">Store</Typography>
                    </Stack>
                    <Box sx={{
                        background: 'linear-gradient(45deg, #FF512F 0%, #DD2476 100%)',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: '20px',
                        boxShadow: '0 4px 10px rgba(221, 36, 118, 0.3)'
                    }}>
                        <Typography variant="subtitle2" fontWeight="bold">{props.userStreak} Day Streak 🔥</Typography>
                    </Box>
                </Stack>
            </Stack>

            <Stack direction="row" justifyContent="space-between" width="90%" alignItems="center" mt={3} mb={1}>
                <Typography variant="h5" fontWeight="bold">Rewards</Typography>
                <TextField
                    placeholder="Search rewards..."
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            bgcolor: theme.palette.background.paper
                        }
                    }}
                />
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
                                    fontSize: '2rem',
                                    color: tier.unlocked ? '#2e7d32' : 'text.disabled',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    filter: tier.unlocked ? 'none' : 'grayscale(100%)',
                                    opacity: tier.unlocked ? 1 : 0.5
                                }}>
                                    {tier.icon}
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
