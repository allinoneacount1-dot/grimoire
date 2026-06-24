import { Routes, Route, Navigate } from 'react-router-dom';
import { TopBar } from '../components/layout/TopBar';
import { Sidebar } from '../components/layout/Sidebar';
import { Overview } from '../components/terminal/MarketOverview/index';
import { SignalFeed } from '../components/terminal/SignalFeed/index';
import { TokenScanner } from '../components/terminal/TokenScanner/index';
import { NewsIntel } from '../components/terminal/NewsIntel/index';
import { OracleChat } from '../components/terminal/OracleChat/index';
import { WalletTracker } from '../components/terminal/WalletTracker/index';

export default function Terminal() {
  return (
    <div className="min-h-screen bg-void flex flex-col">
      <TopBar />
      <div className="flex flex-1 pt-14">
        <Sidebar />
        <main className="flex-1 ml-[220px] overflow-auto">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="signals" element={<SignalFeed />} />
            <Route path="scanner" element={<TokenScanner />} />
            <Route path="wallets" element={<WalletTracker />} />
            <Route path="news" element={<NewsIntel />} />
            <Route path="oracle" element={<OracleChat />} />
            <Route path="*" element={<Navigate to="/terminal" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
