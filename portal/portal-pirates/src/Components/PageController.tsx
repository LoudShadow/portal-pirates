import { useState } from 'react';
import { ResultsPage } from './ResultsPage';
import { StorePage } from './StorePage';
import { TransferPage } from './TransferPage';
import { InsightPlayPage } from './InsightPlayPage';
import { PriceGuesser } from './PriceGuesser';
import { HigherOrLower } from './HigherOrLower';
import { TrophySplashScreen } from './TrophySplashScreen';
import { useAuth } from './AuthContext';
import { LoginPage } from './LoginPage';

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

export interface GameResultItem {
    guessedPrice: number;
    actualPrice: number;
}

export function PageController() {
    const { isAuthenticated } = useAuth();
    const [currentPage, setCurrentPage] = useState('insight-play'); // 'results', 'store', 'transfer', or 'insight-play'
    const [gameResultState, setGameResultState] = useState<GameResultItem[]>([]);
    const [playtime, setPlaytime] = useState<string>('');
    const [gameStartTime, setGameStartTime] = useState<number | null>(null);
    const [bonusPoints, setBonusPoints] = useState<number>(0);
    const [usersPoints, setUsersPoints] = useState<number>(1563);
    const [hintCount, setHintCount] = useState<number>(0);
    const [userStreak] = useState<number>(28);
    const [higherOrLowerScore, setHigherOrLowerScore] = useState<number>(0);
    const [showSplash, setShowSplash] = useState(false);
    const [shouldPulseStore, setShouldPulseStore] = useState(false);

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

    const navigateToHigherOrLower = () => {
        setCurrentPage('higher-or-lower');
    };

    if (!isAuthenticated) {
        return <LoginPage />;
    }

    return (
        <>

            {currentPage === 'insight-play' && <InsightPlayPage onNavigateBack={navigateToResults} onNavigateToPriceGuesser={navigateToPriceGuesser} onNavigateToHigherOrLower={navigateToHigherOrLower} usersPoints={usersPoints} userStreak={userStreak} />}
            {currentPage === 'results' && <ResultsPage onNavigateToStore={() => {
                setShouldPulseStore(true);
                navigateToStore();
            }} onNavigateToTransfer={navigateToTransfer} playtime={playtime} bonusPoints={bonusPoints} usersPoints={usersPoints} setUsersPoints={setUsersPoints} onNavigateToInsightPlay={navigateToInsightPlay} gameResultScore={gameResultScore || higherOrLowerScore} hintCount={hintCount} />}
            {currentPage === 'store' && <StorePage onNavigateToResults={navigateToResults} userStreak={userStreak} isPulsing={shouldPulseStore} />}
            {currentPage === 'transfer' && <TransferPage expectedPoints={gameResultScore} onNavigateBack={navigateToResults} setBonusPoints={setBonusPoints} />}
            {currentPage === 'price-guesser' && <PriceGuesser transactions={transactions} onFinishGame={(results) => {
                setGameResultState(results);
                setShowSplash(true);
                navigateToResults();
            }} gameStartTime={gameStartTime} setPlaytime={setPlaytime} setHintCount={setHintCount} />}
            {currentPage === 'higher-or-lower' && <HigherOrLower onFinishGame={(score) => {
                setHigherOrLowerScore(score);
                setShowSplash(true);
                navigateToResults();
            }} />}

            {showSplash && (
                <TrophySplashScreen
                    onClose={() => setShowSplash(false)}
                    onShare={() => {
                        console.log("Sharing trophy...");
                        setShowSplash(false);
                    }}
                />
            )}
        </>
    );
}
