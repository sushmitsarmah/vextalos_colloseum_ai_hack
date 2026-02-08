import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey } from '@solana/web3.js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

interface Token {
  mint: string
  symbol: string
  name: string
  balance: number
  decimals: number
  usdValue: number
}

export function TokenList() {
  const { publicKey } = useWallet()
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!publicKey) return

    const fetchTokens = async () => {
      try {
        const connection = new Connection('https://api.devnet.solana.com')
        
        // Fetch token accounts
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
        )

        const tokenData: Token[] = tokenAccounts.value
          .map((account) => {
            const parsedInfo = account.account.data.parsed.info
            const mint = parsedInfo.mint
            const balance = parsedInfo.tokenAmount.uiAmount
            const decimals = parsedInfo.tokenAmount.decimals

            return {
              mint,
              symbol: 'TOKEN', // Would fetch from token metadata
              name: 'Unknown Token',
              balance,
              decimals,
              usdValue: balance * 1, // Placeholder price
            }
          })
          .filter((token) => token.balance > 0)

        setTokens(tokenData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching tokens:', error)
        setLoading(false)
      }
    }

    fetchTokens()
  }, [publicKey])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Token Holdings</CardTitle>
          <CardDescription>Loading your tokens...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-12 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Holdings</CardTitle>
        <CardDescription>
          {tokens.length} tokens found in your wallet
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tokens.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No tokens found in this wallet
          </div>
        ) : (
          <div className="space-y-2">
            {tokens.map((token) => (
              <div
                key={token.mint}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {token.symbol.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{token.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {token.mint.slice(0, 4)}...{token.mint.slice(-4)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{token.balance.toFixed(4)}</p>
                  <p className="text-sm text-muted-foreground">
                    ${token.usdValue.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}