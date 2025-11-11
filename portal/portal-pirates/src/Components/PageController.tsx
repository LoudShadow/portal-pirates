import { useState } from 'react';
import { ResultsPage } from './ResultsPage';
import { StorePage } from './StorePage';
import { TransferPage } from './TransferPage';
import { InsightPlayPage } from './InsightPlayPage';

export function PageController() {
    const [currentPage, setCurrentPage] = useState('insight-play'); // 'results', 'store', 'transfer', or 'insight-play'

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

    return (
        <>
            {currentPage === 'insight-play' && <InsightPlayPage onNavigateBack={navigateToResults} />}
            {currentPage === 'results' && <ResultsPage onNavigateToStore={navigateToStore} onNavigateToTransfer={navigateToTransfer} />}
            {currentPage === 'store' && <StorePage onNavigateToResults={navigateToResults} />}
            {currentPage === 'transfer' && <TransferPage expectedPoints={150} onNavigateBack={navigateToResults} />}
        </>
    );
}
