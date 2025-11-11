import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { AccessTime, ArrowBack, StackedLineChart, Storefront, TrackChanges } from "@mui/icons-material";
import { AnimatedCounter } from "./AnimatedCounter";
import imgUrl from '../assets/cancara.png'

export function SubCard(props: {
    title: string;
    content: string;
    icon: React.ReactNode;
    index: number;
}){
    const theme = useTheme();
    return (
        <motion.div
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            whileHover={{ scale: 1.05, rotateY: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 10, delay: props.index * 0.3 }}
        >
            <Box bgcolor={theme.palette.primary.main} sx={{
                borderTopRightRadius: '8px',
                borderTopLeftRadius: '8px',
                padding: '8px',
                color: theme.palette.primary.contrastText
            }}>
                <Typography>{props.title}</Typography>
            </Box>
            <Box sx={{
                borderBottomLeftRadius: '8px',
                borderBottomRightRadius: '8px',
                border: `2px solid ${theme.palette.primary.main}`,
                padding: '8px',
                display: 'flex',
                gap: 1
            }}>
                {props.icon}
                <Typography>{props.content}</Typography>
            </Box>
        </motion.div>
    );
}

export function ResultsPage(props: { onNavigateToStore: () => void, onNavigateToTransfer: () => void }) {
    const theme = useTheme();
    return <Stack alignItems={'center'} spacing={2} paddingTop={2}>
        <Stack alignItems={'center'} spacing={2}>
            <Stack direction={'row'} alignItems={'center'} spacing={2}>
                <IconButton>
                    <ArrowBack/>
                </IconButton>
                <Typography variant="h6">Guess Your Spend</Typography>
            </Stack>
            <Typography variant="h4">Nice Work</Typography>
            <Box
                width={'50%'}
                sx={{
                    aspectRatio: '1 / 1',
                }}
            >
                <img src={imgUrl} style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
            </Box>
        </Stack>
        <Stack 
            width={'100%'}
            padding={1} direction="row" alignContent={'center'} justifyContent={'center'} spacing={1}>
            <SubCard
                title="Points Earned"
                content="+150"
                icon={<TrackChanges/>}
                index={0}
            />
            <SubCard
                title="Time Taken"
                content="2:15"
                icon={<AccessTime/>}
                index={1}
            />
            <SubCard
                title="Hints Used"
                content="1"
                icon={<></>}
                index={2}
            />
        </Stack>
        <Box 
            borderRadius={'24px'} 
            bgcolor={theme.palette.primary.light} 
            borderColor={theme.palette.primary.main}
            border={1}
            padding={1} 
            paddingLeft={2} 
            paddingRight={2}
            width={'80%'}
        >
            <Typography><AnimatedCounter from={0} to={1563}/> Points</Typography>
        </Box>

        <Box 
            borderRadius={'24px'} 
            bgcolor={theme.palette.background.paper} 
            borderColor={theme.palette.primary.main}
            border={1}
            padding={3} 
            width={'90%'}
            display={'flex'}
            gap={2}
            onClick={props.onNavigateToTransfer}
            sx={{ cursor: 'pointer' }}
        >
            <StackedLineChart/>
            <Typography>Save To double your points!</Typography>
        </Box>

        <Box 
            borderRadius={'24px'} 
            bgcolor={theme.palette.background.paper} 
            borderColor={theme.palette.primary.main}
            border={1}
            padding={3} 
            width={'90%'}
            display={'flex'}
            gap={2}
            onClick={props.onNavigateToStore}
            sx={{ cursor: 'pointer' }}
        >
            <Storefront/>
            <Typography>Store</Typography>
        </Box>

    </Stack>
}