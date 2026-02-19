import { useState } from 'react';
import { ResultsPage } from './ResultsPage';
import { StorePage } from './StorePage';
import { TransferPage } from './TransferPage';
import { InsightPlayPage } from './InsightPlayPage';
import { PriceGuesser } from './PriceGuesser';
import { WhereDidYouShop } from './WhereDidYouShop';
import { WeeklyStatement } from './WeeklyStatement';

const transactions = [
    {
        merchant: "Northern Rail",
        price: 23.00,
        time: "2025-11-10T07:35:12Z",
    },
    {
        merchant: "Starbucks",
        price: 6.70,
        time: "2025-11-10T08:45:15Z",
    },
    {
        merchant: "Tesco Express",
        price: 3.85,
        time: "2025-11-10T12:23:21Z",
    },
]

export const transactions_weekly = [
    { merchant: "Tesco", price: 12.50, time: "2026-02-15T10:00:00Z", merchant_logo_url: "../assets/logos/Tesco_Logo.svg" },
    { merchant: "Starbucks", price: 5.40, time: "2026-02-16T08:30:00Z", merchant_logo_url: "../assets/logos/Starbucks_Logo.svg" },
    { merchant: "Amazon", price: 45.99, time: "2026-02-14T15:20:00Z", merchant_logo_url: "../assets/logos/Amazon_Logo.svg" },
    { merchant: "Tesco", price: 8.20, time: "2026-02-17T11:45:00Z", merchant_logo_url: "../assets/logos/Tesco_Logo.svg" },
    { merchant: "Netflix", price: 10.99, time: "2026-02-12T00:00:00Z", merchant_logo_url: "../assets/logos/Netflix_Logo.svg" },
    { merchant: "Uber", price: 15.50, time: "2026-02-18T19:00:00Z", merchant_logo_url: "../assets/logos/Uber_Logo.svg" },
    { merchant: "Starbucks", price: 4.80, time: "2026-02-18T09:15:00Z", merchant_logo_url: "../assets/logos/Starbucks_Logo.svg" },
];

export interface GameResultItem {
    guessedPrice: number;
    actualPrice: number;
}

export function PageController() {
    const [currentPage, setCurrentPage] = useState('insight-play'); // 'results', 'store', 'transfer', or 'insight-play'
    const [gameResultState, setGameResultState] = useState<GameResultItem[]>([]);
    const [playtime, setPlaytime] = useState<string>('');
    const [gameStartTime, setGameStartTime] = useState<number | null>(null);
    const [bonusPoints, setBonusPoints] = useState<number>(0);
    const [usersPoints, setUsersPoints] = useState<number>(1563);
    const [hintCount, setHintCount] = useState<number>(0);

    const gameResultScore = gameResultState.length > 0
        ? (gameResultState.reduce((sum, item) => {
            const percentageDifference = Math.min(100, (Math.abs(item.guessedPrice - item.actualPrice) / item.actualPrice) * 100);
            return sum + (100 - percentageDifference);
        }, 0) / gameResultState.length)
        : 0;

    const navigateToStore = () => {
        setCurrentPage('store');
    };

    const navigateToResults = () => {
        setCurrentPage('results');
    };

    const navigateToTransfer = () => {
        setCurrentPage('transfer');
    };

    const navigateToInsightPlay = () => {
        setCurrentPage('insight-play');
    };

    const navigateToPriceGuesser = () => {
        setCurrentPage('price-guesser');
        setGameStartTime(Date.now());
    };

    const navigateToWhereDidYouShop = () => {
        setCurrentPage('where-did-you-shop');
    };

    const navigateToWeeklyStatement = () => {
        setCurrentPage('weekly-statement');
    };

    return (
        <>
            {currentPage === 'insight-play' && <InsightPlayPage onNavigateBack={navigateToResults} onNavigateToPriceGuesser={navigateToPriceGuesser} onNavigateToWhereDidYouShop={navigateToWhereDidYouShop} usersPoints={usersPoints} />}
            {currentPage === 'results' && <ResultsPage onNavigateToStore={navigateToStore} onNavigateToTransfer={navigateToTransfer} playtime={playtime} bonusPoints={bonusPoints} usersPoints={usersPoints} setUsersPoints={setUsersPoints} onNavigateToInsightPlay={navigateToInsightPlay} gameResultScore={gameResultScore} hintCount={hintCount} />}
            {currentPage === 'store' && <StorePage onNavigateToResults={navigateToResults} usersPoints={usersPoints} />}
            {currentPage === 'transfer' && <TransferPage expectedPoints={gameResultScore} onNavigateBack={navigateToResults} setBonusPoints={setBonusPoints} />}
            {currentPage === 'price-guesser' && <PriceGuesser transactions={transactions} onFinishGame={(results) => {
                setGameResultState(results);
                navigateToResults();
            }} gameStartTime={gameStartTime} setPlaytime={setPlaytime} setHintCount={setHintCount} />}
            {currentPage === 'where-did-you-shop' && <WhereDidYouShop transactions_weekly={transactions_weekly} onFinishGame={() => {
                navigateToWeeklyStatement();
            }} />}
            {currentPage === 'weekly-statement' && <WeeklyStatement transactions={transactions_weekly} onBack={navigateToResults} />}
        </>
    );
}
