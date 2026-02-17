import React from 'react'
import ReactECharts from 'echarts-for-react'

function PidChart({ currentParams, optimizedParams }) {
  // 配置图表选项
  const getOption = () => {
    return {
      title: {
        text: 'PID参数对比',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['当前参数', '优化参数'],
        bottom: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['KP', 'KI', 'KD'],
        axisLabel: {
          interval: 0
        }
      },
      yAxis: {
        type: 'value',
        name: '参数值'
      },
      series: [
        {
          name: '当前参数',
          type: 'bar',
          data: [currentParams.kp, currentParams.ki, currentParams.kd],
          itemStyle: {
            color: '#5470c6'
          }
        },
        {
          name: '优化参数',
          type: 'bar',
          data: [optimizedParams.kp, optimizedParams.ki, optimizedParams.kd],
          itemStyle: {
            color: '#91cc75'
          }
        }
      ]
    }
  }

  return (
    <div className="chart-container">
      <ReactECharts option={getOption()} style={{ height: '100%', width: '100%' }} />
    </div>
  )
}

export default PidChart