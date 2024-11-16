import { Suspense, useEffect, useState } from "react";
import { useTranslate } from "@refinedev/core";
import { Area, type AreaConfig } from "@ant-design/plots";
import dayjs from "dayjs";
import axios from "axios";
import { useConfigProvider } from "../../../context";

type Props = {
  height: number;
  selectedDateRange: { start: string; end: string };
};

export const DailyRevenue = ({ height, selectedDateRange }: Props) => {
  const t = useTranslate();
  const { mode } = useConfigProvider();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  // Fetch the purchase history data and aggregate it for the chart
  const fetchRevenueData = async (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/purchaseHistory`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_timperio")}`,
          },
        }
      );

      // Aggregate the total revenue per day
      const aggregatedData = response.data.reduce((acc: any[], order: any) => {
        const date = dayjs(order.salesDate).format("YYYY-MM-DD");
        const existingEntry = acc.find((entry) => entry.timeText === date);

        if (existingEntry) {
          existingEntry.value += order.totalPrice;
        } else {
          acc.push({ timeText: date, value: order.totalPrice });
        }
        return acc;
      }, []);

      // Filter data to only include the selected date range
      const filteredData = aggregatedData.filter((entry) =>
        dayjs(entry.timeText).isBetween(start, end, null, "[]")
      );

      setData(filteredData); // Set the filtered data
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect hook to fetch data when selectedDateRange changes
  useEffect(() => {
    const start = dayjs(selectedDateRange.start);
    const end = dayjs(selectedDateRange.end);
    fetchRevenueData(start, end);
  }, [selectedDateRange]);

  const config: AreaConfig = {
    isStack: false,
    data: data, // Use the local data state
    xField: "timeText",
    yField: "value",
    animation: true,
    startOnZero: false,
    smooth: true,
    legend: false,
    xAxis: {
      range: [0, 1],
      label: {
        formatter: (v) => {
          return dayjs(v).format("MM/DD");
        },
      },
    },
    yAxis: {
      label: {
        formatter: (v) => {
          return `$${Number(v) / 1000}k`; // Format y-axis values in thousands
        },
      },
    },
    tooltip: {
      formatter: (data) => {
        return {
          name: t('dashboard.revenue.title'),
          value: new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(data.value),
        };
      },
    },
    theme: mode,
    areaStyle: () => {
      return mode === 'dark'
        ? { fill: 'l(270) 0:#15171B 0.5:#1677FF 1:#1677FF' }
        : { fill: 'l(270) 0:#ffffff 0.5:#D3EBFF 1:#1677FF' };
    },
    color: () => {
      return mode === 'dark' ? '#65A9F3' : '#1677FF';
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
          <Area {...config} height={height} />
        </Suspense>
      )}
    </div>
  );
};
