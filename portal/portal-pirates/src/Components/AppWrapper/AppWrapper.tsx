import { Box, Paper } from '@mui/material';
import { forwardRef } from 'react';

export const AppPhoneWrapper = forwardRef<HTMLDivElement, { children: React.ReactNode }>(
    ({ children }, ref) => (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f2eeeeff', // subtle background to mimic table/surface
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    height: '90vh',
                    aspectRatio: '9 / 16',
                    maxWidth: 400,
                    width: '100%',
                    position: 'relative',
                    overflow: 'scroll',
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: '#d4d4d4ff',
                    scrollbarWidth: 'none',
                }}
                ref={ref}
            >
                {children}
            </Paper>
        </Box>
    )
);