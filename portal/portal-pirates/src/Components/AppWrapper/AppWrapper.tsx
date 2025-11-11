import { Paper } from '@mui/material';


export function AppPhoneWrapper({ children }: { children: React.ReactNode }) {
    return (
        <Paper
            elevation={3}
            sx={{
                height: '95%',
                aspectRatio: '9 / 16',
            }}
        >
            {children}
        </Paper>
    );
}