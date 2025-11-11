import { Box, Card, CardContent, CardMedia, Grid, IconButton, Stack, TextField, Typography, useTheme } from "@mui/material";
import { ArrowBack, Storefront, LocalCafe, ShoppingCart, Train } from "@mui/icons-material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect } from "react";

const allItems = [
    { name: "Car Insurance", icon: <Storefront />, points: 1200 },
    { name: "Pet Insurance", icon: <Storefront />, points: 800 },
    { name: "Coffee", icon: <LocalCafe />, points: 200 },
    { name: "Tesco", icon: <ShoppingCart />, points: 150 },
    { name: "Sainsbury's", icon: <ShoppingCart />, points: 150 },
    { name: "Asda", icon: <ShoppingCart />, points: 150 },
    { name: "Nike", icon: <ShoppingCart />, points: 500 },
    { name: "LNER", icon: <Train />, points: 800 },
];

export function StorePage(props: { onNavigateToResults: () => void }) {
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredItems, setFilteredItems] = useState(allItems);

    useEffect(() => {
        setFilteredItems(
            allItems.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery]);


    return (
        <Stack alignItems={'center'} spacing={2} paddingTop={2}>
            <Stack alignItems={'center'} spacing={2}>
                <Stack direction={'row'} alignItems={'center'} spacing={2} width={'100%'} justifyContent={'space-between'}>
                    <Stack direction={'row'} alignItems={'center'} spacing={2}>
                        <IconButton onClick={props.onNavigateToResults}>
                            <ArrowBack/>
                        </IconButton>
                        <Typography variant="h6">Store</Typography>
                    </Stack>
                    <Typography variant="h6">Your Points: 1234</Typography>
                </Stack>
            </Stack>

            <Typography variant="h5">Featured Items</Typography>
            <Box width={'90%'} padding={2}>
                <Slider {...{
                    dots: true,
                    infinite: true,
                    speed: 500,
                    slidesToShow: 1,
                    slidesToScroll: 1
                }}>
                    <div>
                        <Card sx={{ height: '100%' }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image="https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                                alt="A modern house"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Home Insurance
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Protect your home and belongings with our comprehensive home insurance plans.
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <Card sx={{ height: '100%' }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image="https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                                alt="A silver sports car"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Car Insurance
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Get the best coverage for your vehicle. Drive with peace of mind.
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <Card sx={{ height: '100%' }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image="https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80"
                                alt="A happy dog"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Pet Insurance
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Keep your furry friends safe and healthy with our pet insurance policies.
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                </Slider>
            </Box>

            <Stack direction="row" justifyContent="space-between" width="90%" alignItems="center">
                <Typography variant="h5">All Items</Typography>
                <TextField 
                    id="outlined-basic" 
                    label="Search" 
                    variant="outlined" 
                    size="small" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Stack>

            <Grid container spacing={2} width="90%">
                {filteredItems.map(item => (
                    <Grid size={6} key={item.name}>
                        <Box 
                            borderRadius={'24px'} 
                            bgcolor={theme.palette.background.paper} 
                            borderColor={theme.palette.primary.main}
                            border={1}
                            padding={3} 
                            display={'flex'}
                            flexDirection={'column'}
                            alignItems={'center'}
                            gap={1}
                        >
                            {item.icon}
                            <Typography>{item.name}</Typography>
                            <Typography variant="body2" color="text.secondary">{item.points} points</Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
}
