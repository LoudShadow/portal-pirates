import { Box, Button, Card, CardContent, Stack, Typography, Grid } from "@mui/material";
import { useState } from "react";
import { DateTime } from "luxon";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface DailySpend {
    date: string;
    amount: number;
}

// Mock data for the last 7 days
const dailySpendData: DailySpend[] = [
    { date: "2025-11-04", amount: 67.80 },
    { date: "2025-11-05", amount: 32.10 },
    { date: "2025-11-06", amount: 5.50 },
    { date: "2025-11-07", amount: 88.00 },
    { date: "2025-11-08", amount: 12.75 },
    { date: "2025-11-09", amount: 45.20 },
    { date: "2025-11-10", amount: 23.50 },
];

interface HigherOrLowerProps {
    onFinishGame: (score: number) => void;
}

export const HigherOrLower = ({ onFinishGame }: HigherOrLowerProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [guesses, setGuesses] = useState<( 'higher' | 'lower' | null)[]>(Array(dailySpendData.length - 1).fill(null));
    const [results, setResults] = useState<(boolean | null)[]>(Array(dailySpendData.length - 1).fill(null));

    const handleGuess = (guess: 'higher' | 'lower') => {
        const newGuesses = [...guesses];
        newGuesses[currentStep] = guess;
        setGuesses(newGuesses);

        const previousDaySpend = dailySpendData[currentStep].amount;
        const currentDaySpend = dailySpendData[currentStep + 1].amount;
        const isCorrect = (guess === 'higher' && currentDaySpend > previousDaySpend) || (guess === 'lower' && currentDaySpend < previousDaySpend);
        
        const newResults = [...results];
        newResults[currentStep] = isCorrect;
        setResults(newResults);

        setTimeout(() => {
            if (currentStep < dailySpendData.length - 2) {
                setCurrentStep(currentStep + 1);
            }
        }, 1000);
    };

    const score = results.filter(r => r === true).length / (dailySpendData.length - 1) * 100;
    const isGameFinished = currentStep === dailySpendData.length - 2 && guesses[currentStep] !== null;

    return (
        <Box padding={3} mt={5} sx={{ bgcolor: 'background.default', borderRadius: 4, maxWidth: 500, margin: 'auto' }}>
            <Stack gap={2} alignItems="center">
                <Typography variant="h4" align="center" color="primary" sx={{ fontWeight: 'bold' }}>
                    Higher or Lower
                </Typography>
                <Typography variant="subtitle1" align="center" color="text.secondary">
                    Was your spending higher or lower than the day before?
                </Typography>

                {currentStep < dailySpendData.length - 1 && (
                    <Card sx={{ width: '100%' }}>
                        <CardContent>
                            <Grid container spacing={2} textAlign="center">
                                <Grid size={6}>
                                    <Typography variant="h6">{DateTime.fromISO(dailySpendData[currentStep].date).toFormat("cccc, d MMM")}</Typography>
                                    <Typography variant="h5" fontWeight="bold">£{dailySpendData[currentStep].amount.toFixed(2)}</Typography>
                                </Grid>
                                <Grid size={6}>
                                    <Typography variant="h6">{DateTime.fromISO(dailySpendData[currentStep + 1].date).toFormat("cccc, d MMM")}</Typography>
                                    {guesses[currentStep] === null ? (
                                        <Typography variant="h5" fontWeight="bold">?</Typography>
                                    ) : (
                                        <Typography variant="h5" fontWeight="bold">£{dailySpendData[currentStep + 1].amount.toFixed(2)}</Typography>
                                    )}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}

                {guesses[currentStep] !== null && (
                    <Box display="flex" alignItems="center" gap={1}>
                        {results[currentStep] ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                        <Typography color={results[currentStep] ? "success.main" : "error.main"}>
                            {results[currentStep] ? "Correct!" : "Incorrect!"}
                        </Typography>
                    </Box>
                )}

                <Stack direction="row" spacing={2} mt={2}>
                    <Button
                        variant="contained"
                        startIcon={<ArrowUpwardIcon />}
                        onClick={() => handleGuess('higher')}
                        disabled={guesses[currentStep] !== null}
                        sx={{ bgcolor: 'success.light', '&:hover': { bgcolor: 'success.main' } }}
                    >
                        Higher
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<ArrowDownwardIcon />}
                        onClick={() => handleGuess('lower')}
                        disabled={guesses[currentStep] !== null}
                        sx={{ bgcolor: 'error.light', '&:hover': { bgcolor: 'error.main' } }}
                    >
                        Lower
                    </Button>
                </Stack>

                {isGameFinished && (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => onFinishGame(score)}
                        sx={{ mt: 3, py: 1.5, fontSize: '1.1rem' }}
                    >
                        Finish Game
                    </Button>
                )}
            </Stack>
        </Box>
    );
};
