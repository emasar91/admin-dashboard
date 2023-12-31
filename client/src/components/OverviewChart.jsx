import React, { useMemo } from 'react'

//import material ui
import { Box, useTheme } from '@mui/material'

//import libraries foreign
import { ResponsiveLine } from '@nivo/line'
import { FormattedMessage } from 'react-intl'

//import own components
import LoadingContainer from './LoadingContainer'

//import fetch data
import { useGetSalesQuery } from 'state/api'

const OverviewChart = ({ isDashboard = false, view }) => {
  const theme = useTheme()
  const { data, isLoading } = useGetSalesQuery()

  const [totalSalesLine, totalUnitsLine] = useMemo(() => {
    if (!data) return []

    const { monthlyData } = data
    const totalSalesLine = {
      id: <FormattedMessage id={'overView.chart.totalSales'} />,
      color: theme.palette.overviewScene.chart.line1,
      data: [],
    }
    const totalUnitsLine = {
      id: <FormattedMessage id={'overView.chart.totalUnits'} />,
      color: theme.palette.overviewScene.chart.line2,
      data: [],
    }

    Object.values(monthlyData).reduce(
      (acc, { month, totalSales, totalUnits }) => {
        const curSales = acc.sales + totalSales
        const curUnits = acc.units + totalUnits

        totalSalesLine.data = [
          ...totalSalesLine.data,
          { x: month.substring(0, 3), y: curSales },
        ]
        totalUnitsLine.data = [
          ...totalUnitsLine.data,
          { x: month.substring(0, 3), y: curUnits },
        ]

        return { sales: curSales, units: curUnits }
      },
      { sales: 0, units: 0 }
    )

    return [[totalSalesLine], [totalUnitsLine]]
  }, [data])

  const leftChartText =
    view === 'sales' ? (
      <FormattedMessage id={'overView.chart.totalRevenueYearly'} />
    ) : (
      <FormattedMessage id={'overView.chart.totalUnitsYearly'} />
    )

  return (
    <Box height={'90%'}>
      <LoadingContainer isLoading={isLoading}>
        <ResponsiveLine
          data={view === 'sales' ? totalSalesLine : totalUnitsLine}
          theme={{
            axis: {
              domain: {
                line: {
                  stroke: theme.palette.overviewScene.chart.values,
                },
              },
              legend: {
                text: {
                  fill: theme.palette.overviewScene.chart.values,
                },
              },
              ticks: {
                line: {
                  stroke: theme.palette.overviewScene.chart.values,
                  strokeWidth: 1,
                },
                text: {
                  fill: theme.palette.overviewScene.chart.values,
                },
              },
            },
            legends: {
              text: {
                fill: theme.palette.overviewScene.chart.values,
              },
            },
          }}
          colors={{ datum: 'color' }}
          margin={{ top: 20, right: 10, bottom: 50, left: 70 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false,
          }}
          yFormat=' >-.2f'
          curve='catmullRom'
          axisTop={null}
          axisRight={null}
          axisBottom={{
            format: (v) => {
              if (isDashboard) return v.slice(0, 3)
              return v
            },
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: isDashboard ? (
              ''
            ) : (
              <FormattedMessage id={'overView.chart.month'} />
            ),
            legendOffset: 36,
            legendPosition: 'middle',
          }}
          axisLeft={{
            orient: 'left',
            tickValues: 5,
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: isDashboard ? '' : leftChartText,
            legendOffset: -60,
            legendPosition: 'middle',
          }}
          pointSize={10}
          pointColor={{ from: 'color', modifiers: [] }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          enableArea={true}
          enableGridX={false}
          enableGridY={false}
          legends={
            !isDashboard
              ? [
                  {
                    anchor: 'top-left',
                    direction: 'column',
                    justify: false,
                    translateX: 15,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                  },
                ]
              : undefined
          }
        />
      </LoadingContainer>
    </Box>
  )
}

export default OverviewChart
