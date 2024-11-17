import { Table, Typography, Spin, Statistic } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table/interface";

interface DateRangePickerProps {
  selectedDateRange: { start: string; end: string };
  height: number;
}

interface DataType {
  key: number; // Unique key for each row
  product: string; // Product name
  count: number; // Quantity of the product
}

export const TrendingMenu = ({
  selectedDateRange,
  height,
}: DateRangePickerProps) => {
  const [data, setData] = useState<DataType[]>([]); // Typed state for data
  const [loading, setLoading] = useState(false);

  const fetchTrendingData = async (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
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

      const aggregatedData = response.data.reduce(
        (acc: DataType[], product: any) => {
          const productDate = dayjs(product.salesDate);
          if (
            (start && productDate.isBefore(start, "day")) ||
            (end && productDate.isAfter(end, "day"))
          ) {
            return acc;
          }

          const existingProduct = acc.find(
            (entry) => entry.product === product.product
          );

          if (existingProduct) {
            existingProduct.count += 1;
          } else {
            acc.push({
              key: acc.length, // Ensure unique key
              product: product.product,
              count: 1,
            });
          }
          return acc;
        },
        []
      );

      const topProducts = aggregatedData
        .sort((a, b) => b.count - a.count) // Sort by highest count
        .slice(0, 5); // Get top 5 products

      setData(topProducts);
    } catch (error) {
      console.error("Error fetching trending data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const start = dayjs(selectedDateRange.start);
    const end = dayjs(selectedDateRange.end);
    fetchTrendingData(start, end);
  }, [selectedDateRange]);

  // Define columns with proper typing
  const columns: ColumnsType<DataType> = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Qty",
      dataIndex: "count",
      key: "count",
      align: "center",
      render: (count: number) => (
        <Statistic value={count} valueStyle={{ fontSize: "14px" }} />
      ),
    },
  ];

  return (
    <div>
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
        </div>
      ) : data.length === 0 ? (
        <div style={{ padding: 20, textAlign: "center" }}>
          No data available for the selected range.
        </div>
      ) : (
        <Table<DataType>
          dataSource={data}
          columns={columns}
          pagination={false}
          style={{ margin: "10px 20px" }}
        />
      )}
    </div>
  );
};
