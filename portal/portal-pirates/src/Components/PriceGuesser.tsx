import { Box, Button, Drawer, List, ListItem, ListItemButton, ListItemText, Stack, TextField, Typography } from "@mui/material";
import { useState, type RefObject } from "react";

interface Transaction {
    merchant: string;
    price: number;
    time: string;
}

interface PriceGuesserProps {
    transactions: Transaction[]
    container?: RefObject<HTMLDivElement | null>;
}

export const PriceGuesser = ({ transactions, container }: PriceGuesserProps) => {
    const [openIdx, setOpenIdx] = useState<number | null>(null);
    const [guesses, setGuesses] = useState<(number | null)[]>(Array(transactions.length).fill(null));
    const [input, setInput] = useState<string>("");

    const handleOpen = (idx: number) => {
        // Only allow opening if not already guessed
        if (guesses[idx] !== null) return;
        setOpenIdx(idx);
        setInput("");
    };

    const handleClose = () => {
        setOpenIdx(null);
        setInput("");
    };

    const handleGuess = () => {
        if (openIdx === null) return;
        const updated = [...guesses];
        updated[openIdx] = Number(input);
        setGuesses(updated);
        handleClose();
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 2, p: 1 }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
                Guess the amount spent for each transaction
            </Typography>
            <List>
                {transactions.map((tx, idx) => (
                    <ListItem key={idx} disablePadding>
                        <ListItemButton
                            onClick={() => handleOpen(idx)}
                            disabled={guesses[idx] !== null}
                        >
                            <ListItemText
                                primary={
                                    guesses[idx] !== null
                                        ? (
                                            <span style={{ color: "#222", fontWeight: 500 }}>
                                                <strong>{tx.time}</strong> at <strong>{tx.merchant}</strong>
                                            </span>
                                        )
                                        : `Time: ${tx.time}`
                                }
                                secondary={
                                    guesses[idx] !== null
                                        ? (
                                            <span style={{ color: "#222", fontWeight: 400 }}>
                                                Your guess: £{guesses[idx]}
                                                <br />
                                                Actual: £{tx.price}
                                            </span>
                                        )
                                        : "Tap to guess"
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Drawer
                anchor="bottom"
                open={openIdx !== null}
                onClose={handleClose}
                container={container?.current || undefined}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        p: 2,
                        width: '100%', // Ensures it doesn't exceed the container
                        maxWidth: 485, // Match your AppPhoneWrapper's max width if set
                        mx: 'auto',    // Center horizontally if there's extra space
                    }
                }}
            >
                {openIdx !== null && (
                    <Box sx={{
                        p: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Stack direction="column" gap={1} sx={{ width: '100%', maxWidth: 320 }}>
                            <Typography variant="subtitle1" align="center">
                                Guess for {transactions[openIdx].time}
                            </Typography>
                            <TextField
                                type="number"
                                label="Your guess (£)"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                fullWidth
                                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleGuess}
                                disabled={input === ""}
                            >
                                Submit Guess
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                            >
                                Get a Hint
                            </Button>
                        </Stack>
                    </Box>
                )}
            </Drawer>
        </Box>
    );

    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setGuesses([...guesses, Number(guess)]);
    //     setGuess("");
    //     if (step < transactions.length - 1) {
    //         setStep(step + 1);
    //     } else {
    //         setShowResult(true);
    //     }
    // };

    // if (transactions.length === 0) return null;

    // return (
    //     <Box
    //         sx={{
    //             maxWidth: 400,
    //             mx: "auto",
    //             mt: 4,
    //             p: 2,
    //             display: "flex",
    //             flexDirection: "column",
    //             alignItems: "center",
    //         }}
    //     >
    //         {!showResult ? (
    //             <>
    //                 <Typography variant="h6" sx={{ mb: 2 }}>
    //                     What do you think you spent at {transactions[step].time}?
    //                 </Typography>
    //                 <form onSubmit={handleSubmit} style={{ width: "100%" }}>
    //                     <TextField
    //                         type="number"
    //                         label="Your guess"
    //                         value={guess}
    //                         onChange={(e) => setGuess(e.target.value)}
    //                         fullWidth
    //                         inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
    //                         sx={{ mb: 2 }}
    //                     />
    //                     <Button
    //                         type="submit"
    //                         variant="contained"
    //                         color="primary"
    //                         fullWidth
    //                         disabled={guess === ""}
    //                     >
    //                         {step < transactions.length - 1 ? "Next" : "See Results"}
    //                     </Button>
    //                 </form>
    //             </>
    //         ) : (
    //             <Box sx={{ width: "100%" }}>
    //                 <Typography variant="h6" sx={{ mb: 2 }}>
    //                     Results
    //                 </Typography>
    //                 {transactions.map((tx, idx) => (
    //                     <Box
    //                         key={idx}
    //                         sx={{
    //                             display: "flex",
    //                             justifyContent: "space-between",
    //                             mb: 1,
    //                             fontSize: "1.1rem",
    //                         }}
    //                     >
    //                         <span>
    //                             {tx.time}: You guessed ${guesses[idx] ?? "-"}
    //                         </span>
    //                         <span>
    //                             Actual: ${tx.price}
    //                         </span>
    //                     </Box>
    //                 ))}
    //             </Box>
    //         )}
    //     </Box>
    // );
}