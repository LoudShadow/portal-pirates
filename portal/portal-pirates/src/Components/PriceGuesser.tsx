import { Accordion, Box, AccordionSummary, Chip, Stack, TextField, Typography, AccordionDetails, Button, Grid } from "@mui/material";
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { useState } from "react";
import { DateTime } from "luxon";
import CheckIcon from '@mui/icons-material/Check';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useHint from "../hook/useHint";

interface Transaction {
    merchant: string;
    price: number;
    time: string;
}

interface PriceGuesserProps {
    transactions: Transaction[];
    onFinishGame: (results: { guessedPrice: number; actualPrice: number }[]) => void;
}

export const PriceGuesser = ({ transactions,onFinishGame }: PriceGuesserProps) => {
    const [expanded, setExpanded] = useState<number | null>(null);
    const [guesses, setGuesses] = useState<(number | null)[]>(Array(transactions.length).fill(null));
    const [inputs, setInputs] = useState<string[]>(Array(transactions.length).fill(""));

    const handleAccordion = (idx: number) => {
        if (guesses[idx] !== null) return; // Don't expand if already guessed
        setExpanded(expanded === idx ? null : idx);
    };

    const handleInput = (idx: number, value: string) => {
        setInputs(inputs.map((v, i) => (i === idx ? value : v)));
    };

    const handleGuess = (idx: number) => {
        const val = parseFloat(inputs[idx]);
        if (isNaN(val)) return;
        setGuesses(guesses.map((g, i) => (i === idx ? val : g)));
        setExpanded(null);
    };

    return (
        <Box padding={3} mt={5} sx={{ bgcolor: 'background.default', borderRadius: 4, maxWidth: 500, margin: 'auto' }}>
            <Stack gap={2}>
                <Typography variant="h4" align="center" color="primary" sx={{ fontWeight: 'bold' }}>
                    Guess Your Spend
                </Typography>
                <Timeline
                    sx={{
                        [`& .${timelineItemClasses.root}:before`]: {
                            flex: 0,
                            padding: 0,
                        },
                        p: 0
                    }}
                >
                    {transactions.map((tx, idx) => {
                        const guessed = guesses[idx] !== null;
                        const guess = guesses[idx];
                        const actual = tx.price;
                        const time = DateTime.fromISO(tx.time).toFormat("HH:mm");

                        const [ showHint, setShowHint ] = useState(false);

                        let resultIcon = null;
                        let resultColor = undefined;
                        let resultText = null;

                        const hint = useHint(tx.merchant, actual.toString(), tx.time);

                        if (guessed) {
                            const diff = Math.abs(actual - (guess ?? 0));

                            if (diff < 0.01) {
                                resultColor = "success.main";
                                resultIcon = <CheckIcon sx={{ color: resultColor }} fontSize="small" />;
                            } else {
                                // Determine color: amber for close, red for far
                                if (diff <= actual * 0.20) { // Within 20% is "close"
                                    resultColor = "warning.main";
                                } else { // More than 20% is "far"
                                    resultColor = "error.main";
                                }

                                // Determine icon direction based on guess
                                if ((guess ?? 0) > actual) {
                                    resultIcon = <ArrowDropUpIcon sx={{ color: resultColor }} />;
                                } else {
                                    resultIcon = <ArrowDropDownIcon sx={{ color: resultColor }} />;
                                }
                            }

                            resultText = (
                                <Typography
                                    variant="caption"
                                    sx={{ color: resultColor, ml: 0.5, fontWeight: 600 }}
                                >
                                    {actual.toLocaleString("en-GB", { style: "currency", currency: "GBP" })}
                                </Typography>
                            );
                        }

                        return (
                            <TimelineItem key={idx}>
                                <TimelineSeparator>
                                    <TimelineDot
                                        variant={guessed ? "filled" : "outlined"}
                                        sx={{ bgcolor: guessed ? 'primary.main' : 'transparent', borderColor: 'grey.400' }}
                                    />
                                    {idx < transactions.length - 1 && <TimelineConnector sx={{ bgcolor: 'grey.400' }} />}
                                </TimelineSeparator>
                                <TimelineContent sx={{ pb: 3 }}>
                                    <Box>
                                        <Typography fontFamily="monospace" color="text.secondary" gutterBottom>
                                            {time}
                                        </Typography>
                                        <Accordion
                                            expanded={expanded === idx}
                                            onChange={() => handleAccordion(idx)}
                                            elevation={1}
                                            sx={{
                                                bgcolor: 'background.paper',
                                                borderRadius: 2,
                                                '&.Mui-expanded': {
                                                    margin: 0,
                                                },
                                                '&:before': {
                                                    display: 'none',
                                                }
                                            }}
                                        >
                                            <AccordionSummary
                                                expandIcon={!guessed && <ExpandMoreIcon />}
                                                sx={{
                                                    '& .MuiAccordionSummary-content': {
                                                        alignItems: 'center',
                                                    }
                                                }}
                                            >
                                                <Chip
                                                    label={
                                                        guessed
                                                            ? guess?.toLocaleString("en-GB", { style: "currency", currency: "GBP" })
                                                            : "?"
                                                    }
                                                    sx={{
                                                        width: '100px',
                                                        fontWeight: 'bold',
                                                        bgcolor: guessed ? 'grey.200' : 'primary.main',
                                                        color: guessed ? 'text.primary' : 'primary.contrastText',
                                                    }}
                                                />
                                                {guessed && (
                                                    <Box display="flex" alignItems="center" ml={2}>
                                                        {resultIcon}
                                                        {resultText}
                                                    </Box>
                                                )}
                                            </AccordionSummary>
                                            <AccordionDetails >
                                                <Stack direction="column" gap={2}>
                                                    <TextField
                                                        type="number"
                                                        label="Your guess (£)"
                                                        value={inputs[idx]}
                                                        onChange={e => handleInput(idx, e.target.value)}
                                                        fullWidth
                                                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                                                        disabled={guessed}
                                                    />
                                                    <Grid container spacing={1}>
                                                        <Grid size={6}>
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                fullWidth
                                                                onClick={() => handleGuess(idx)}
                                                                disabled={inputs[idx] === "" || guessed}
                                                            >
                                                                Submit
                                                            </Button>
                                                        </Grid>
                                                        <Grid size={6}>
                                                            <Button
                                                                variant="outlined"
                                                                color="primary"
                                                                fullWidth
                                                                disabled={showHint || hint?.loading || !!hint?.error} 
                                                                onClick={() => setShowHint(true)}  
                                                            >
                                                                Hint
                                                            </Button>
                                                        </Grid>
                                                        {showHint && hint && hint.value && (
                                                            <Box mt={2} p={2} bgcolor="grey.100" borderRadius={2}>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {hint.value}
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </Grid>
                                                </Stack>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Box>
                                </TimelineContent>
                            </TimelineItem>
                        );
                    })}
                </Timeline>
                {guesses.every(guess => guess !== null) && (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => onFinishGame(transactions.map((tx, idx) => ({
                            guessedPrice: guesses[idx]!,
                            actualPrice: tx.price,
                        })))}
                        sx={{ mt: 3, py: 1.5, fontSize: '1.1rem' }}
                    >
                        Finish Game
                    </Button>
                )}
            </Stack>
        </Box>
    )
}