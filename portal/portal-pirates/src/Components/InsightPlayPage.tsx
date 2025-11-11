import { Box, Card, CardActionArea, CardContent, Grid, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { ArrowBack, SportsEsports, EmojiEvents, Storefront, AccountBalance } from "@mui/icons-material";

const games = [
    { title: "Guess your spend" },
    { title: "Higher Or Lower" },
    { title: "Supermarket Sweep" },
    { title: "Price is Right" },
];

const challenges = [
    { title: "Spend 5 times at Sainsbury's", description: "Earn 5% cashback on your next 5 purchases.", icon: <Storefront/> },
    { title: "Switch to Lloyds", description: "Get £175 for switching your current account.", icon: <AccountBalance/> },
    { title: "Use Spending Insights", description: "Engage with our spending insights tool to earn bonus points.", icon: <EmojiEvents/> },
];

export function InsightPlayPage(props: { onNavigateBack: () => void }) {
    const theme = useTheme();

    return (
        <Stack alignItems={'center'} spacing={2} paddingTop={2} paddingBottom={2}>
            <Stack direction={'row'} alignItems={'center'} spacing={2} width={'90%'}>
                <IconButton onClick={props.onNavigateBack}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h6">Insight Play</Typography>
            </Stack>

            <Box
                borderRadius={'24px'}
                bgcolor={theme.palette.background.paper}
                borderColor={theme.palette.primary.main}
                border={1}
                padding={3}
                width={'90%'}
                display={'flex'}
                flexDirection="column"
                gap={2}
            >
                <Stack direction="row" spacing={1} alignItems="center">
                    <SportsEsports sx={{color: theme.palette.primary.main}}/>
                    <Typography variant="h6">Games</Typography>
                </Stack>
                <Grid container spacing={2}>
                    {games.map((game, index) => (
                        <Grid size={6} key={index}>
                            <Card sx={{
                                height: '100%',
                                backgroundColor: ((theme.palette as any).additional as any)[`brand${6 + index}`],
                                color: theme.palette.getContrastText(((theme.palette as any).additional as any)[`brand${6 + index}`])
                            }}>
                                <CardActionArea sx={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
                                    <CardContent>
                                        <Typography variant="subtitle1" component="div" fontWeight="bold">
                                            {game.title}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box
                borderRadius={'24px'}
                bgcolor={theme.palette.background.paper}
                borderColor={theme.palette.primary.main}
                border={1}
                padding={3}
                width={'90%'}
                display={'flex'}
                flexDirection="column"
                gap={2}
            >
                <Stack direction="row" spacing={1} alignItems="center">
                    <EmojiEvents sx={{color: theme.palette.primary.main}}/>
                    <Typography variant="h6">Challenges</Typography>
                </Stack>
                <Stack spacing={2}>
                    {challenges.map((challenge, index) => (
                        <Card key={index}>
                            <CardActionArea>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {challenge.icon}
                                    <Box>
                                        <Typography variant="subtitle1" component="div" fontWeight="bold">
                                            {challenge.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {challenge.description}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))}
                </Stack>
            </Box>
        </Stack>
    );
}
