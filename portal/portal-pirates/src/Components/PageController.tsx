import { useState } from 'react';
import { ResultsPage } from './ResultsPage';
import { StorePage } from './StorePage';
import { TransferPage } from './TransferPage';
import { InsightPlayPage } from './InsightPlayPage';
import { PriceGuesser } from './PriceGuesser';

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
    const [currentPage, setCurrentPage] = useState('insight-play'); // 'results', 'store', 'transfer', or 'insight-play'
    const [gameResultState, setGameResultState] = useState<GameResultItem[]>([]);

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
    };

    return (
        <>
            {currentPage === 'insight-play' && <InsightPlayPage onNavigateBack={navigateToResults} onNavigateToPriceGuesser={navigateToPriceGuesser} />}
            {currentPage === 'results' && <ResultsPage onNavigateToStore={navigateToStore} onNavigateToTransfer={navigateToTransfer} />}
            {currentPage === 'store' && <StorePage onNavigateToResults={navigateToResults} />}
            {currentPage === 'transfer' && <TransferPage expectedPoints={150} onNavigateBack={navigateToResults} />}
            {currentPage === 'price-guesser' && <PriceGuesser transactions={transactions} onFinishGame={(results) => {
                setGameResultState(results);
                navigateToResults();
            }} />}
        </>
    );
}
