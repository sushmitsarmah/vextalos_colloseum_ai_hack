import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection } from '@solana/web3.js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

interface Transaction {
  signature: string
  blockTime: number | null
  status: string
  type: string
  amount: number
}

export function TransactionHistory() {
  const { publicKey } = useWallet()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!publicKey) return

    const fetchTransactions = async () => {
      try {
        const connection = new Connection('https://api.devnet.solana.com')
        
        const signatures = await connection.getSignaturesForAddress(
          publicKey,
          { limit: 10 }
        )

        const txData: Transaction[] = signatures.map((sig) => ({
          signature: sig.signature,
          blockTime: sig.blockTime,
          status: sig.confirmationStatus || 'unknown',
          type: sig.err ? 'Failed' : 'Success',
          amount: 0, // Would parse transaction details
        }))

        setTransactions(txData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching transactions:', error)
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [publicKey])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Loading recent transactions...</CardDescription>
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
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          Last {transactions.length} transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transactions found
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.signature}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <p className="font-mono text-sm">
                    {tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {tx.blockTime
                      ? new Date(tx.blockTime * 1000).toLocaleString()
                      : 'Unknown time'}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      tx.type === 'Success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {tx.type}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {tx.status}
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