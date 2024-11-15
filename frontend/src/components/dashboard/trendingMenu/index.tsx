import { Typography } from "antd";
import { Statistic } from "antd/lib";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { formatWithoutDollarSign } from "../../../helper";

interface DateRangePickerProps {
  selectedDateRange: { start: string; end: string };
  height: number;
}

export const TrendingMenu = ({
  selectedDateRange,
  height,
}: DateRangePickerProps) => {
  const [data, setData] = useState<any[]>([]);
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
        (acc: any[], product: any) => {
          const productDate = dayjs(product.salesDate);
          if (
            (start && productDate.isBefore(start, "day")) ||
            (end && productDate.isAfter(end, "day"))
          ) {
            return acc;
          }

          const existingProduct = acc.find(
            (entry) => entry.product === product.product // Update to check `product` field
          );

          if (existingProduct) {
            existingProduct.count += 1;
          } else {
            acc.push({
              product: product.product, // Store product name
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

      setData(topProducts); // Set the top products to state
    } catch (error) {
      console.error("Error fetching trending data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect hook to fetch data when selectedDateRange changes
  useEffect(() => {
    const start = dayjs(selectedDateRange.start);
    const end = dayjs(selectedDateRange.end);
    fetchTrendingData(start, end);
  }, [selectedDateRange]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : data.length === 0 ? (
        <div style={{ padding: 20 }}>
          No data available for the selected range.
        </div>
      ) : (
        <div
          style={{
            paddingLeft: "20px",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          {data.map((product, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center" }}>
              <Typography.Text style={{ marginRight: "3px" }}>
                {product.product} -
              </Typography.Text>
              <Statistic
                value={product.count}
                formatter={formatWithoutDollarSign as any}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
