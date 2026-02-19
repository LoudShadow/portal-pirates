import React from 'react';
import { Box, Typography, Stack, Paper, IconButton, useTheme, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion';
import { DateTime } from 'luxon';

interface Transaction {
    merchant: string;
    price: number;
    time: string;
    merchant_logo_url?: string;
}

interface WeeklyStatementProps {
    transactions: Transaction[];
    onBack: () => void;
}

export const WeeklyStatement: React.FC<WeeklyStatementProps> = ({ transactions, onBack }) => {
    const theme = useTheme();

    const totalSpend = transactions.reduce((acc, curr) => acc + curr.price, 0);
    const sortedTransactions = [...transactions].sort((a, b) =>
        DateTime.fromISO(b.time).toMillis() - DateTime.fromISO(a.time).toMillis()
    );

    return (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#F5F6F7',
            position: 'relative'
        }}>
            {/* Header */}
            <Paper elevation={0} sx={{
                p: 2,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                borderRadius: '0 0 24px 24px'
            }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <IconButton onClick={onBack} size="small" sx={{ color: 'inherit' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" fontWeight="bold">Weekly Spending</Typography>
                </Stack>

                <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="body2" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>Total Spend</Typography>
                    <Typography variant="h3" fontWeight="900">
                        £{totalSpend.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Last 7 Days</Typography>
                </Box>
            </Paper>

            {/* List */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 'bold' }}>TRANSACTIONS</Typography>
                <Stack spacing={1.5}>
                    {sortedTransactions.map((tx, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Paper elevation={0} sx={{
                                p: 1.5,
                                borderRadius: 3,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                border: '1px solid rgba(0,0,0,0.05)'
                            }}>
                                <Box sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    bgcolor: '#fff',
                                    p: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #eee'
                                }}>
                                    <img
                                        src={tx.merchant_logo_url}
                                        alt={tx.merchant}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography fontWeight="bold">{tx.merchant}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {DateTime.fromISO(tx.time).toFormat('cccc, d MMM')}
                                    </Typography>
                                </Box>
                                <Typography fontWeight="900" sx={{ color: theme.palette.text.primary }}>
                                    £{tx.price.toFixed(2)}
                                </Typography>
                            </Paper>
                        </motion.div>
                    ))}
                </Stack>
            </Box>

            <Box sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #eee' }}>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={onBack}
                    sx={{ borderRadius: 3, py: 1.5, fontWeight: 'bold' }}
                >
                    Back to InsightPlay
                </Button>
            </Box>
        </Box>
    );
};
