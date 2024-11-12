import { Suspense, useEffect, useState } from 'react';
import { useTranslate } from '@refinedev/core';
import { Column, type ColumnConfig } from '@ant-design/plots';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import axios from 'axios';
import { useConfigProvider } from '../../../context';

// Extend dayjs with the isBetween plugin
dayjs.extend(isBetween);

type Props = {
  height: number;
  selectedDateRange: { start: string; end: string };
};

export const DailyOrders = ({ height, selectedDateRange }: Props) => {
  const t = useTranslate();
  const { mode } = useConfigProvider();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch the orders data and aggregate it for the chart
  const fetchOrdersData = async (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/purchaseHistory`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token_timperio')}`,
          },
        }
      );

      // Ensure the response data is an array
      const aggregatedData = Array.isArray(response.data)
        ? response.data.reduce((acc: any[], order: any) => {
            const date = dayjs(order.salesDate).format('YYYY-MM-DD');
            const existingEntry = acc.find((entry) => entry.timeText === date);

            // Count the order (or sum a specific value, like orderAmount, if provided)
            const orderCount = 1;

            if (existingEntry) {
              existingEntry.value += orderCount;
            } else {
              acc.push({ timeText: date, value: orderCount });
            }
            return acc;
          }, [])
        : [];

      // Filter data to only include the selected date range
      const filteredData = aggregatedData.filter((entry) =>
        dayjs(entry.timeText).isBetween(start, end, null, '[]')
      );

      setData(filteredData);
    } catch (error) {
      console.error('Error fetching orders data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const start = dayjs(selectedDateRange.start);
    const end = dayjs(selectedDateRange.end);
    fetchOrdersData(start, end);
  }, [selectedDateRange]);

  const config: ColumnConfig = {
    data,
    xField: 'timeText',
    yField: 'value',
    seriesField: 'state',
    animation: true,
    legend: false,
    theme: mode,
    columnStyle: {
      radius: [4, 4, 0, 0],
      fill:
        mode === 'dark'
          ? 'l(270) 0:#15171B 0.5:#1677FF 1:#1677FF'
          : 'l(270) 0:#ffffff 0.5:#D3EBFF 1:#1677FF',
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: t('dashboard.orders.title'),
          value: new Intl.NumberFormat().format(Number(datum.value)),
        };
      },
    },
    xAxis: {
      line: {
        style: {
          fill: mode === 'dark' ? '#262626' : '#D9D9D9',
        },
      },
      label: {
        formatter: (v) => {
          if (data.length > 7) {
            return dayjs(v).format('MM/DD');
          }

          return dayjs(v).format('ddd');
        },
      },
    },
    yAxis: {
      label: {
        formatter: (v) => {
          return new Intl.NumberFormat().format(Number(v));
        },
      },
    },
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : data.length === 0 ? (
        <div>No data available for the selected range.</div>
      ) : (
        <Suspense fallback={<div>Loading Chart...</div>}>
          <Column {...config} height={height} />
        </Suspense>
      )}
    </div>
  );
};
