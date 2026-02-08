import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

export function PortfolioChart() {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Initialize chart
    chartInstance.current = echarts.init(chartRef.current)

    // Sample data - in production this would be real portfolio data
    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '5%',
        left: 'center',
      },
      series: [
        {
          name: 'Portfolio Allocation',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 1048, name: 'SOL', itemStyle: { color: '#9945FF' } },
            { value: 735, name: 'USDC', itemStyle: { color: '#2775CA' } },
            { value: 580, name: 'BONK', itemStyle: { color: '#F2A900' } },
            { value: 484, name: 'JUP', itemStyle: { color: '#00C2FF' } },
            { value: 300, name: 'Other', itemStyle: { color: '#888888' } },
          ],
        },
      ],
    }

    chartInstance.current.setOption(option)

    // Handle resize
    const handleResize = () => {
      chartInstance.current?.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chartInstance.current?.dispose()
    }
  }, [])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Allocation</CardTitle>
          <CardDescription>
            Distribution of assets in your wallet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Value Over Time</CardTitle>
          <CardDescription>
            Historical performance (7 days)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Historical chart coming soon...
          </div>
        </CardContent>
      </Card>
    </div>
  )
}