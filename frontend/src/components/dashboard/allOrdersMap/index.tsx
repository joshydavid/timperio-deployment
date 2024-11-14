import { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";

interface Props {
  selectedDateRange: { start: string; end: string };
}

export const AllOrdersMap: React.FC<Props> = ({ selectedDateRange }) => {
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch the orders and filter based on selected date range
  const fetchTopCustomers = async (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
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

      // Aggregate spending data per customer
      const aggregatedData = response.data.reduce((acc: any[], order: any) => {
        const orderDate = dayjs(order.salesDate);
        if (
          (start && orderDate.isBefore(start, "day")) ||
          (end && orderDate.isAfter(end, "day"))
        ) {
          return acc;
        }

        const customerId = order.customerId;
        const totalPrice = order.totalPrice;
        const existingCustomer = acc.find(
          (entry) => entry.customerId === customerId
        );

        if (existingCustomer) {
          existingCustomer.totalSpending += totalPrice;
        } else {
          acc.push({
            customerId,
            totalSpending: totalPrice,
          });
        }
        return acc;
      }, []);

      // Sort by total spending in descending order and get top 10 customers
      const topCustomersArray = aggregatedData
        .sort((a, b) => b.totalSpending - a.totalSpending)
        .slice(0, 10);

      setTopCustomers(topCustomersArray);
    } catch (error) {
      console.error("Error fetching top customers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect hook to fetch data when selectedDateRange changes
  useEffect(() => {
    const start = dayjs(selectedDateRange.start);
    const end = dayjs(selectedDateRange.end);
    fetchTopCustomers(start, end);
  }, [selectedDateRange]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : topCustomers.length === 0 ? (
        <div>No data available for the selected range.</div>
      ) : (
        <div style={{ marginTop: "10px" }}>
          <ol>
            {topCustomers.map((customer, index) => (
              <li key={customer.customerId}>
                <strong>{`Customer ID: ${customer.customerId}`}</strong>
                <br />
                Total Spending: ${customer.totalSpending.toFixed(2)}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};
