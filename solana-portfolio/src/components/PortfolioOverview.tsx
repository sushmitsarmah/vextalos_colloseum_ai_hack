import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface PortfolioData {
  solBalance: number
  usdValue: number
  tokenCount: number
}

export function PortfolioOverview() {
  const { publicKey } = useWallet()
  const [portfolio, setPortfolio] = useState<PortfolioData>({
    solBalance: 0,
    usdValue: 0,
    tokenCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!publicKey) return

    const fetchPortfolio = async () => {
      try {
        const connection = new Connection('https://api.devnet.solana.com')
        const balance = await connection.getBalance(publicKey)
        
        // Placeholder for token accounts fetch
        // In production, this would fetch all SPL tokens
        
        setPortfolio({
          solBalance: balance / LAMPORTS_PER_SOL,
          usdValue: (balance / LAMPORTS_PER_SOL) * 100, // Placeholder price
          tokenCount: 1, // Placeholder
        })
        setLoading(false)
      } catch (error) {
        console.error('Error fetching portfolio:', error)
        setLoading(false)
      }
    }

    fetchPortfolio()
  }, [publicKey])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-24 bg-muted" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{portfolio.solBalance.toFixed(4)} SOL</div>
          <p className="text-xs text-muted-foreground">
            ${portfolio.usdValue.toFixed(2)} USD
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Token Count</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{portfolio.tokenCount}</div>
          <p className="text-xs text-muted-foreground">
            SPL tokens
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Network</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Devnet</div>
          <p className="text-xs text-muted-foreground">
            Connected
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Just now</div>
          <p className="text-xs text-muted-foreground">
            Auto-refresh
          </p>
        </CardContent>
      </Card>
    </div>
  )
}