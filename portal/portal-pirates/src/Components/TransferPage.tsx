import { Box, IconButton, Stack, Typography, useTheme, Select, MenuItem, FormControl, InputLabel, Button, Slider } from "@mui/material";
import { ArrowBack, Savings } from "@mui/icons-material";
import { useState } from "react";

export function TransferPage(props: { expectedPoints: number; onNavigateBack: () => void; setBonusPoints: (points: number) => void }) {
    const theme = useTheme();
    const [amount, setAmount] = useState(10);
    const [showSlider, setShowSlider] = useState(false);

    const pointsToEarn = Math.round((amount / 10) * props.expectedPoints);

    return (
        <Stack alignItems={'center'} spacing={2} paddingTop={2}>
            <Stack direction={'row'} alignItems={'center'} spacing={2} width={'90%'}>
                <IconButton onClick={props.onNavigateBack}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h6">Transfer to Save</Typography>
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
                alignItems="center"
            >
                <Savings sx={{ fontSize: 60, color: theme.palette.primary.main }} />
                <Typography variant="h5" textAlign="center">Double Your Points!</Typography>
                <Typography textAlign="center">
                    Save £{amount.toFixed(2)} to earn an extra {pointsToEarn} points!
                </Typography>
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
                gap={3}
            >
                <Typography variant="h6">Transfer Details</Typography>
                <FormControl fullWidth>
                    <InputLabel id="source-account-label">From</InputLabel>
                    <Select
                        labelId="source-account-label"
                        id="source-account-select"
                        value={'current'}
                        label="From"
                    >
                        <MenuItem value={'current'}>Current Account (£543.21)</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel id="destination-account-label">To</InputLabel>
                    <Select
                        labelId="destination-account-label"
                        id="destination-account-select"
                        value={'savings'}
                        label="To"
                    >
                        <MenuItem value={'savings'}>Savings Account (£1,234.56)</MenuItem>
                    </Select>
                </FormControl>
                <Typography variant="h5" textAlign="center">Amount: £{amount.toFixed(2)}</Typography>

                {showSlider && (
                    <Slider
                        value={amount}
                        onChange={(_, newValue) => setAmount(newValue as number)}
                        aria-labelledby="transfer-amount-slider"
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={1}
                        max={10}
                    />
                )}

                <Button variant="contained" size="large" onClick={() => {
                    props.setBonusPoints(pointsToEarn);
                    props.onNavigateBack();
                }}>
                    Transfer & Earn {pointsToEarn} Points
                </Button>
                {!showSlider && (
                    <Button variant="text" onClick={() => setShowSlider(true)}>
                        Adjust Savings ammount
                    </Button>
                )}
            </Box>
        </Stack>
    );
}
