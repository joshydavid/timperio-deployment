import { EyeOutlined } from "@ant-design/icons";
import { useTranslate } from "@refinedev/core";
import {
  Button,
  Card,
  Col,
  Input,
  List,
  Modal,
  Row,
  Table,
  Tabs,
  theme,
  Typography,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { PaginationTotal } from "../../components";

const { TabPane } = Tabs;

export const CustomerList = () => {
  const t = useTranslate();
  const { token } = theme.useToken();

  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState("ALL_CUSTOMERS"); // Default to All Customers
  const [overallMetrics, setOverallMetrics] = useState(null); // Holds the aggregate metrics data

  // Fetch customer data from the API
  const fetchCustomersBySegment = async (segment) => {
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
      await fetchOverallMetrics(); // Fetch aggregate metrics for All Customers
    } catch (error) {
      console.error("Error fetching all customers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch metrics for each customer and add it to the customers data
  const fetchMetrics = async (customersData) => {
    try {
      const updatedCustomers = await Promise.all(
        customersData.map(async (customer) => {
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

  // Fetch aggregate metrics for All Customers tab
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

  // Fetch customers based on the active tab
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
      sorter: (a, b) => a.customerId - b.customerId,
    },
    {
      key: "customerEmail",
      dataIndex: "customerEmail",
      title: "Email",
      filterDropdown: (props) => (
        <Input {...props} placeholder={t("users.filter.email.placeholder")} />
      ),
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
                <li key={purchase.salesId}>
                  <Typography.Text>
                    {product} - {sanitisedTotalPrice}
                  </Typography.Text>
                </li>
              );
            })}
            {record.purchaseHistory.length > 5 && (
              <Typography.Text style={{ color: token.colorPrimary }}>
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
    {
      key: "action",
      title: "Actions",
      render: (_: any, record: any) => (
        <Button
          icon={
            <EyeOutlined
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          }
          onClick={() => {
            setSelectedCustomer(record);
            setIsModalVisible(true);
          }}
        />
      ),
    },
  ];

  return (
    <List
    //   breadcrumb={true}
    //   headerProps={{
    //     extra: <Button loading={isLoading} icon={<SearchOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} />,
    //   }}
    >
      <Tabs
        defaultActiveKey="ALL_CUSTOMERS"
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{ marginBottom: 24 }}
      >
        <TabPane tab="All Customers" key="ALL_CUSTOMERS" />
        <TabPane tab="Low Spend" key="LOW_SPEND" />
        <TabPane tab="Mid Tier" key="MID_TIER" />
        <TabPane tab="High Value" key="HIGH_VALUE" />
      </Tabs>

      {activeTab === "ALL_CUSTOMERS" && overallMetrics && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card title="Total Sales Amount ($)" bordered>
              <Typography.Paragraph>
                $
                {overallMetrics.totalSalesAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography.Paragraph>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Total Sales Count" bordered>
              <Typography.Text>
                {overallMetrics.totalSalesCount}
              </Typography.Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Average Sale Amount ($)" bordered>
              <Typography.Text>
                $
                {overallMetrics.totalAverageSales.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography.Text>
            </Card>
          </Col>
        </Row>
      )}

      <Table
        rowKey="customerId"
        columns={columns}
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
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button key="close" onClick={handleModalClose}>
              Close
            </Button>,
          ]}
        >
          <ul>
            {selectedCustomer.purchaseHistory.map((purchase: any) => {
              const { salesId, product, totalPrice } = purchase;
              const sanitisedTotalPrice = `$${totalPrice.toFixed(2)}`;
              return (
                <li key={salesId}>
                  <Typography.Text>
                    {product} - {sanitisedTotalPrice}
                  </Typography.Text>
                </li>
              );
            })}
          </ul>
        </Modal>
      )}
    </List>
  );
};
