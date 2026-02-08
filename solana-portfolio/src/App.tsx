import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { PortfolioOverview } from './components/PortfolioOverview'
import { TokenList } from './components/TokenList'
import { TransactionHistory } from './components/TransactionHistory'
import { PortfolioChart } from './components/PortfolioChart'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import './App.css'

function App() {
  const { publicKey, connected } = useWallet()
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">S</span>
            </div>
            <h1 className="text-xl font-bold">Solana Portfolio Tracker</h1>
          </div>
          <WalletMultiButton className="wallet-adapter-button" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!connected ? (
          <Card className="max-w-2xl mx-auto mt-12">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Welcome to Solana Portfolio Tracker</CardTitle>
              <CardDescription className="text-lg mt-2">
                Connect your Phantom wallet to view your portfolio, track assets, and analyze performance.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-8">
              <WalletMultiButton className="wallet-adapter-button wallet-adapter-button-trigger" />
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Portfolio</h2>
              <p className="text-muted-foreground">
                Wallet: {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tokens">Tokens</TabsTrigger>
                <TabsTrigger value="transactions">History</TabsTrigger>
                <TabsTrigger value="charts">Charts</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <PortfolioOverview />
              </TabsContent>

              <TabsContent value="tokens" className="space-y-4">
                <TokenList />
              </TabsContent>

              <TabsContent value="transactions" className="space-y-4">
                <TransactionHistory />
              </TabsContent>

              <TabsContent value="charts" className="space-y-4">
                <PortfolioChart />
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>

      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>Built for Colosseum Agent Hackathon • Powered by Solana</p>
        </div>
      </footer>
    </div>
  )
}

export default App