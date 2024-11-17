import { Suspense, useEffect, useState } from "react";
import { useTranslate } from "@refinedev/core";
import { Pie, type PieConfig } from "@ant-design/plots";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import axios from "axios";
import { useConfigProvider } from "../../../context";

// Extend dayjs with the isBetween plugin
dayjs.extend(isBetween);

type Props = {
  height: number;
  selectedDateRange: { start: string; end: string };
};

export const SalesTypePieChart = ({ height, selectedDateRange }: Props) => {
  const t = useTranslate();
  const { mode } = useConfigProvider();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch and aggregate data for pie chart
  const fetchSalesData = async (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
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

      const aggregatedData = response.data.reduce((acc: any[], order: any) => {
        const orderDate = dayjs(order.salesDate); // Parse the order date as a dayjs object

        const startDate = dayjs(start); // Convert start to a dayjs object
        const endDate = dayjs(end); // Convert end to a dayjs object

        if (orderDate.isBetween(startDate, endDate, null, "[]")) {
          const salesType = order.salesType || "NULL"; // Default to "Unknown" if no salesType is present
          const totalAmount = parseFloat(order.totalPrice) || 0; // Ensure totalPrice is a number

          const existingEntry = acc.find((entry) => entry.type === salesType);

          if (existingEntry) {
            existingEntry.value += totalAmount;
          } else {
            acc.push({
              type: salesType,
              value: totalAmount,
            });
          }
        }
        return acc;
      }, []);

      // Set the aggregated data
      setData(aggregatedData);

      console.log("Aggregated Data:", aggregatedData);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const start = dayjs(selectedDateRange.start);
    const end = dayjs(selectedDateRange.end);
    fetchSalesData(start, end);
  }, [selectedDateRange]);

  const config: PieConfig = {
    data,
    angleField: "value",
    colorField: "type",
    animation: true,
    radius: 1,
    innerRadius: 0.6, // Makes it a donut chart
    statistic: {
      title: {
        content: "Total Sales", // Title in the center of the donut
        style: {
          fontSize: "16", // Font size for the title
          fontWeight: "bold", // Font weight for the title
        },
      },
      content: {
        content: `$${data.reduce((sum, d) => sum + d.value, 0).toFixed(2)}`, // Total value in the center
        style: {
          fontSize: '14', // Font size for the total value
          color: "#666", // Font color
        },
      },
    },
    label: {
      type: "outer",
      formatter: (datum) =>
        `${datum.type}: ${new Intl.NumberFormat().format(datum.value)}`,
    },
    // statistic: {
    //   title: {
    //     content: "Total Sales",
    //     style: {
    //       fontSize: 12, // Font size for the title
    //       fontWeight: "bold", // Optional: Font weight
    //     },
    //   },
    // },
    // annotations: [
    //   {
    //     type: "html",
    //     position: ["50%", "50%"], // Center the annotation
    //     html: `
    //     <div style="text-align: center; font-size: 16px; font-weight: bold; color: #333;">
    //       <div>Total Sales</div>
    //       <div style="font-size: 20px; color: #4CAF50;">
    //         $${data.reduce((sum, d) => sum + d.value, 0).toFixed(2)}
    //       </div>
    //     </div>
    //   `,
    //   },
    // ],
    // content: {
    //   content: `$${data.reduce((sum, d) => sum + d.value, 0).toFixed(2)}`, // Dynamically calculate total value
    //   style: {
    //     fontSize: 1, // Font size for the content
    //     color: "#888", // Optional: Content color
    //   },
    // },
    tooltip: {
      formatter: (datum) => ({
        name: datum.type,
        value: `$${new Intl.NumberFormat().format(Number(datum.value))}`,
      }),
    },
    theme: mode, // Apply light or dark theme
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : data.length === 0 ? (
        <div>No data available for the selected range.</div>
      ) : (
        <Suspense fallback={<div>Loading Chart...</div>}>
          <Pie {...config} height={height} />
        </Suspense>
      )}
    </div>
  );
};
