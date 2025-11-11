import { useState } from 'react';
import { ResultsPage } from './ResultsPage';
import { StorePage } from './StorePage';
import { TransferPage } from './TransferPage';
import { InsightPlayPage } from './InsightPlayPage';
import { PriceGuesser } from './PriceGuesser';

const transactions = [
  {
    merchant: "Pret A Manger",
    price: 3.21,
    time: "2025-11-10T08:35:00Z",
  },
  {
    merchant: "Starbucks",
    price: 9.50,
    time: "2025-11-10T11:19:00Z",
  },
  {
    merchant: "Tesco Express",
    price: 18.00,
    time: "2025-11-10T12:23:00Z",
  },
  {
    merchant: "Sainsbury's Local",
    price: 5.75,
    time: "2025-11-10T15:42:00Z",
  },
  {
    merchant: "Boots",
    price: 12.99,
    time: "2025-11-10T18:10:00Z",
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
