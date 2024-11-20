import { List } from "@refinedev/antd";
import { useTranslate } from "@refinedev/core";
import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  Row,
  Statistic,
  Table,
  Tabs,
  Tag,
  theme,
  Typography,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { PaginationTotal } from "../../components";
import { formatter, formatWithoutDollarSign } from "../../helper";

const { TabPane } = Tabs;

export const CustomerList = () => {
  const t = useTranslate();
  const { token } = theme.useToken();
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState("ALL_CUSTOMERS");
  const [overallMetrics, setOverallMetrics] = useState(null);

  const fetchCustomersBySegment = async (segment: any) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/customers/segment/${segment}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_timperio")}`,
          },
        }
      );
      await fetchMetrics(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/customers`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_timperio")}`,
          },
        }
      );
      await fetchMetrics(response.data);
      await fetchOverallMetrics();
    } catch (error) {
      console.error("Error fetching all customers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMetrics = async (customersData: any) => {
    try {
      const updatedCustomers = await Promise.all(
        customersData.map(async (customer: any) => {
          const metricsResponse = await axios.get(
            `${import.meta.env.VITE_SERVER}/api/v1/customers/metrics/${
              customer.customerId
            }`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem(
                  "token_timperio"
                )}`,
              },
            }
          );
          return {
            ...customer,
            totalSalesAmount: metricsResponse.data.totalSalesAmount,
            totalSalesCount: metricsResponse.data.totalSalesCount,
            totalAverageSales: metricsResponse.data.totalAverageSales,
          };
        })
      );
      setCustomers(updatedCustomers);
    } catch (error) {
      console.error("Error fetching customer metrics:", error);
    }
  };

  const fetchOverallMetrics = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/customers/metrics`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_timperio")}`,
          },
        }
      );
      setOverallMetrics(response.data);
    } catch (error) {
      console.error("Error fetching overall metrics:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "ALL_CUSTOMERS") {
      fetchAllCustomers();
    } else {
      fetchCustomersBySegment(activeTab);
    }
  }, [activeTab]);

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedCustomer(null);
  };

  const columns = [
    {
      key: "customerId",
      dataIndex: "customerId",
      title: "Customer ID",
      render: (value) => (
        <Typography.Text style={{ whiteSpace: "nowrap" }}>
          #{value}
        </Typography.Text>
      ),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => {
              confirm();
            }}
            placeholder="Search by Customer ID"
          />
          <div style={{ marginTop: 8 }}>
            <Button
              onClick={() => clearFilters()}
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Clear
            </Button>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                confirm();
              }}
              style={{ width: 90, backgroundColor: "#014214" }}
            >
              Apply
            </Button>
          </div>
        </div>
      ),
      onFilter: (value: any, record: any) => {
        return record.customerId.toString() === value.toString();
      },
    },
    {
      key: "customerEmail",
      dataIndex: "customerEmail",
      title: "Email",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => {
              confirm();
            }}
            placeholder="Search by Email"
          />
          <div style={{ marginTop: 8 }}>
            <Button
              onClick={() => clearFilters()}
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Clear
            </Button>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                confirm();
              }}
              style={{ width: 90, backgroundColor: "#014214" }}
            >
              Apply
            </Button>
          </div>
        </div>
      ),
      onFilter: (value: any, record: any) => {
        return record.customerEmail.toString() === value.toString();
      },
    },
    {
      key: "purchaseHistory",
      title: "Purchase History",
      render: (_: any, record: any) => {
        const limitedPurchases = record.purchaseHistory.slice(0, 5);

        return (
          <ul>
            {limitedPurchases.map((purchase: any) => {
              const { product, totalPrice } = purchase;
              const sanitisedTotalPrice = `$${totalPrice.toFixed(2)}`;

              if (limitedPurchases.length === 1) {
                return (
                  <Typography.Text key={purchase.salesId}>
                    {product} - {sanitisedTotalPrice}
                  </Typography.Text>
                );
              }
              return (
                <li
                  key={purchase.salesId}
                  style={{ listStyle: "none", marginBottom: "4" }}
                >
                  <Tag>
                    {product} - {sanitisedTotalPrice}
                  </Tag>
                </li>
              );
            })}
            {record.purchaseHistory.length > 5 && (
              <Typography.Text
                style={{ color: token.colorPrimary, cursor: "pointer" }}
                onClick={() => {
                  setSelectedCustomer(record);
                  setIsModalVisible(true);
                }}
              >
                + {record.purchaseHistory.length - 5} more
              </Typography.Text>
            )}
          </ul>
        );
      },
    },
    {
      key: "totalSalesAmount",
      title: "Total Sales Amount",
      dataIndex: "totalSalesAmount",
      render: (value: any) => (
        <Typography>
          $
          {value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
      ),
    },
    {
      key: "totalSalesCount",
      title: "No. of Purchases",
      dataIndex: "totalSalesCount",
      render: (value: any) => <Typography.Text>{value}</Typography.Text>,
      sorter: (a: any, b: any) => a.totalSalesCount - b.totalSalesCount,
    },
    {
      key: "totalAverageSales",
      title: "Avg. Sale Amount",
      dataIndex: "totalAverageSales",
      render: (value: any) => (
        <Typography.Text>
          $
          {value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography.Text>
      ),
    },
    // {
    //   key: "action",
    //   title: "Actions",
    //   render: (_: any, record: any) => (
    //     <Button
    //       icon={
    //         <EyeOutlined
    //           onPointerEnterCapture={undefined}
    //           onPointerLeaveCapture={undefined}
    //         />
    //       }
    //       onClick={() => {
    //         setSelectedCustomer(record);
    //         setIsModalVisible(true);
    //       }}
    //     />
    //   ),
    // },
  ];

  return (
    <List title="Customers">
      <Tabs
        defaultActiveKey="ALL_CUSTOMERS"
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{ marginBottom: 24 }}
      >
        <TabPane tab="All Customers" key="ALL_CUSTOMERS" />
        <TabPane tab="Low Spend (Bottom 20%)" key="LOW_SPEND" />
        <TabPane tab="Mid Tier (Between 10% and 80%)" key="MID_TIER" />
        <TabPane tab="High Value (Top 10%)" key="HIGH_VALUE" />
      </Tabs>

      {activeTab === "ALL_CUSTOMERS" && overallMetrics && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card title="Total Sales Amount ($)" bordered>
              <Statistic
                value={overallMetrics.totalSalesAmount}
                formatter={formatter}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Total Sales Count" bordered>
              <Statistic
                value={overallMetrics.totalSalesCount}
                formatter={formatWithoutDollarSign as any}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Average Sales Amount ($)" bordered>
              <Statistic
                value={overallMetrics.totalAverageSales}
                formatter={formatter}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Table
        rowKey="customerId"
        columns={columns as any}
        dataSource={customers}
        loading={isLoading}
        pagination={{
          pageSize: 10,
          total: customers.length,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="customers" />
          ),
        }}
      />
      {selectedCustomer && (
        <Modal
          title={`Purchase History for Customer #${selectedCustomer.customerId}`}
          open={isModalVisible}
          onCancel={handleModalClose}
          width={"80vw"}
          footer={[
            <Button key="close" onClick={handleModalClose}>
              Close
            </Button>,
          ]}
        >
          <Table
            dataSource={selectedCustomer.purchaseHistory.map(
              (purchase: any) => ({
                key: purchase.salesId, // Use a unique identifier as the key
                product: purchase.product,
                quantity: purchase.quantity,
                totalPrice: `$${purchase.totalPrice.toFixed(2)}`, // Format the price
                salesDate: purchase.salesDate,
              })
            )}
            columns={[
              {
                title: "Product",
                dataIndex: "product",
                key: "product",
              },
              {
                title: "Quantity",
                dataIndex: "quantity",
                key: "quantity",
              },
              {
                title: "Total Price",
                dataIndex: "totalPrice",
                key: "totalPrice",
              },
              {
                title: "Sales Date",
                dataIndex: "salesDate",
                key: "salesDate",
              },
            ]}
            pagination={false} // Optional: Disable pagination if not needed
          />
        </Modal>
      )}
    </List>
  );
};
