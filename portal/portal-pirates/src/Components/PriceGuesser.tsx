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

interface Transaction {
    merchant: string;
    price: number;
    time: string;
}

interface PriceGuesserProps {
    transactions: Transaction[]
}

export const PriceGuesser = ({ transactions }: PriceGuesserProps) => {
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
        <Box padding={2} mt={5}>
            <Stack gap={1}>
                <Typography variant="h4" align="center" color="secondary">
                    Guess Your Spend
                </Typography>
                <Timeline
                    sx={{
                        [`& .${timelineItemClasses.root}:before`]: {
                        flex: 0,
                        padding: 0,
                        },
                    }}
                >
                    {transactions.map((tx, idx) => {
                        const guessed = guesses[idx] !== null;
                        const guess = guesses[idx];
                        const actual = tx.price;
                        const time = DateTime.fromISO(tx.time).toFormat("HH:mm");

                        let resultIcon = null;
                        let resultColor = undefined;
                        let resultText = null;

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
                                    sx={{ color: resultColor, ml: 1, fontWeight: 600 }}
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
                                        color={guessed ? "primary" : "grey"}
                                    />
                                    {idx < transactions.length - 1 && <TimelineConnector />}
                                </TimelineSeparator>
                                <TimelineContent>
                                    <Box>
                                        <Typography fontFamily="monospace">
                                            {time}
                                        </Typography>
                                        <Accordion
                                            expanded={expanded === idx}
                                            onChange={() => handleAccordion(idx)}
                                            elevation={0}
                                            sx={{ bgcolor: "#a3cec3", borderRadius: 2 }}
                                        >
                                            <AccordionSummary
                                                expandIcon={!guessed && <ExpandMoreIcon />}
                                            >
                                                <Chip
                                                    label={
                                                        guessed
                                                            ? guess?.toLocaleString("en-GB", { style: "currency", currency: "GBP" })
                                                            : "?"
                                                    }
                                                    sx={{ width: '100px' }}
                                                />
                                                {guessed && (
                                                    <Button
                                                        variant="text"
                                                        disabled={true}
                                                        endIcon={resultIcon}
                                                    >
                                                        {resultText}
                                                    </Button>
                                                )}
                                            </AccordionSummary>
                                            <AccordionDetails >
                                                <Stack direction="column" gap={1}>
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
                                                                Submit Guess
                                                            </Button>
                                                        </Grid>
                                                        <Grid size={6}>
                                                            <Button
                                                                variant="outlined"
                                                                color="secondary"
                                                                fullWidth
                                                                disabled
                                                            >
                                                                Hint
                                                            </Button>
                                                        </Grid>
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
            </Stack>
        </Box>
    )


    return (
        <Box padding={2} mt={5}>
            <Stack gap={1}>
                <Typography variant="h4" align="center" color="secondary">
                    Guess Your Spend
                </Typography>
                <Timeline >
                    {transactions.map((tx, idx) => {
                        const guessed = guesses[idx] !== null;
                        const guess = guesses[idx];
                        const actual = tx.price;
                        const time = DateTime.fromISO(tx.time).toFormat("HH:mm");

                        let resultIcon = null;
                        let resultColor = undefined;
                        let resultText = null;

                        if (guessed) {
                            if (Math.abs(actual - (guess ?? 0)) < 0.01) {
                                resultIcon = <CheckIcon color="success" fontSize="small" />;
                                resultColor = "success.main";
                            } else if ((guess ?? 0) < actual) {
                                resultIcon = <ArrowDropUpIcon sx={{ color: "success.main" }} fontSize="small" />;
                                resultColor = "success.main";
                            } else {
                                resultIcon = <ArrowDropDownIcon sx={{ color: "error.main" }} fontSize="small" />;
                                resultColor = "error.main";
                            }
                            resultText = (
                                <Typography
                                    variant="caption"
                                    sx={{ color: resultColor, ml: 1, fontWeight: 600 }}
                                >
                                    {actual.toLocaleString("en-GB", { style: "currency", currency: "GBP" })}
                                </Typography>
                            );
                        }

                        return (
                            <TimelineItem key={idx} sx={{ minHeight: 0 }}>
                                <TimelineSeparator>
                                    <TimelineDot
                                        variant={guessed ? "filled" : "outlined"}
                                        color={guessed ? "primary" : "grey"}
                                        sx={{
                                            borderWidth: 3,
                                            width: 32,
                                            height: 32,
                                            bgcolor: guessed ? "primary.main" : "background.paper",
                                        }}
                                    />
                                    {idx < transactions.length - 1 && <TimelineConnector sx={{ bgcolor: "primary.main", width: 4 }} />}
                                </TimelineSeparator>
                                <TimelineContent sx={{ py: 1, px: 0 }}>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Typography
                                            variant="h6"
                                            sx={{ fontFamily: "monospace", fontWeight: 700, minWidth: 60 }}
                                        >
                                            {time}
                                        </Typography>
                                        <Box flex={1}>
                                            <Accordion
                                                expanded={expanded === idx}
                                                onChange={() => handleAccordion(idx)}
                                                elevation={0}
                                                sx={{
                                                    bgcolor: "transparent",
                                                    boxShadow: "none",
                                                    '&:before': { display: 'none' },
                                                    p: 0,
                                                    m: 0,
                                                }}
                                                disabled={guessed}
                                            >
                                                <AccordionSummary
                                                    expandIcon={!guessed && <ExpandMoreIcon />}
                                                    aria-controls={`panel${idx}-content`}
                                                    id={`panel${idx}-header`}
                                                    sx={{ p: 0, minHeight: 0 }}
                                                >
                                                    <Chip
                                                        label={
                                                            guessed
                                                                ? actual.toLocaleString("en-GB", { style: "currency", currency: "GBP" })
                                                                : (guess !== null
                                                                    ? guess.toLocaleString("en-GB", { style: "currency", currency: "GBP" })
                                                                    : "?")
                                                        }
                                                        sx={{
                                                            fontSize: 22,
                                                            fontWeight: 700,
                                                            px: 2,
                                                            py: 1,
                                                            bgcolor: "#dbeee7",
                                                            color: "#005A42",
                                                            border: "2px solid #005A42",
                                                            minWidth: 110,
                                                            justifyContent: "center",
                                                        }}
                                                    />
                                                    {guessed && (
                                                        <>
                                                            {resultText}
                                                            {resultIcon}
                                                        </>
                                                    )}
                                                </AccordionSummary>
                                                <AccordionDetails sx={{ p: 0, pt: 2 }}>
                                                    <Stack direction="column" gap={1}>
                                                        <TextField
                                                            type="number"
                                                            label="Your guess (£)"
                                                            value={inputs[idx]}
                                                            onChange={e => handleInput(idx, e.target.value)}
                                                            fullWidth
                                                            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                                                            disabled={guessed}
                                                        />
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            fullWidth
                                                            onClick={() => handleGuess(idx)}
                                                            disabled={inputs[idx] === "" || guessed}
                                                        >
                                                            Submit Guess
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            color="secondary"
                                                            fullWidth
                                                            disabled
                                                        >
                                                            Get a Hint
                                                        </Button>
                                                    </Stack>
                                                </AccordionDetails>
                                            </Accordion> 
                                        </Box>
                                    </Box>
                                </TimelineContent>
                            </TimelineItem>
                        );
                    })}

                </Timeline>
            </Stack>
        </Box>
    )
}