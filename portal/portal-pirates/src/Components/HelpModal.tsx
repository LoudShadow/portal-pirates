import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface HelpModalProps {
    open: boolean;
    onClose: () => void;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

export const HelpModal = ({ open, onClose }: HelpModalProps) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="game-help-modal-title"
            aria-describedby="game-help-modal-description"
        >
            <Box sx={style}>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography id="game-help-modal-title" variant="h6" component="h2" gutterBottom>
                    How to play Guess Your Spend
                </Typography>
                <Typography id="game-help-modal-description" sx={{ mt: 2 }}>
                    Welcome to Guess Your Spend! The goal of the game is to guess the price of three transaction from your day.
                    <br /><br />
                    1. Look at the time for each transaction.
                    <br />
                    2. Enter your best guess for the price of what you think this transaction was.
                    <br />
                    3. After you guess, you'll see how close you were.
                    <br />
                    4. Once you've guessed all the prices, you can see your final results.
                    <br /><br />
                    Good luck!
                </Typography>
            </Box>
        </Modal>
    );
};
