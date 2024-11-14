import { ExportOutlined } from "@ant-design/icons";
import { List } from "@refinedev/antd";
import { useNavigation, useTranslate } from "@refinedev/core";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Slider,
  Table,
  Typography,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
const { RangePicker } = DatePicker;
const { Option } = Select;

const SALES_TYPE = [
  {
    name: "Direct - B2C",
    value: "DIRECT_B2C",
  },
  {
    name: "Direct - B2B",
    value: "DIRECT_B2B",
  },
  {
    name: "Marketing",
    value: "MARKETING",
  },
  {
    name: "Wholesale",
    value: "WHOLESALER",
  },
  {
    name: "Consignment",
    value: "CONSIGNMENT",
  },
];

export const OrderList = () => {
  const t = useTranslate();
  const { show } = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const showCreateUserModal = () => {
    setIsModalVisible(true);
  };

  const exportData = async () => {
    const formValues = form.getFieldsValue();
    const {
      customerId = null,
      productPrice = null,
      salesType = null,
      salesDate = null,
    } = formValues;

    let minPrice = null;
    let maxPrice = null;
    if (Array.isArray(productPrice) && productPrice.length === 2) {
      [minPrice, maxPrice] = productPrice;
    }

    let startDateString = "";
    let endDateString = "";
    if (salesDate) {
      const [startDate, endDate] = salesDate;
      startDateString = startDate.format("YYYY-MM-DD");
      endDateString = endDate.format("YYYY-MM-DD");
    }

    let sanitisedSalesType = "";
    if (salesType) {
      sanitisedSalesType = salesType.join(",");
    }

    let queryParams: any = [];

    if (customerId) queryParams.push(`customerId=${customerId}`);
    if (startDateString) queryParams.push(`salesDate=${startDateString}`);
    if (minPrice != null) queryParams.push(`minPrice=${minPrice}`);
    if (maxPrice != null) queryParams.push(`maxPrice=${maxPrice}`);
    if (sanitisedSalesType) queryParams.push(`salesType=${sanitisedSalesType}`);
    queryParams = queryParams.join("&");

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/export?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_timperio")}`,
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "text/csv" });
      const link = document.createElement("a");
      const url = window.URL.createObjectURL(blob);

      link.href = url;
      link.setAttribute("download", "purchase_history.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success("Data exported successfully");
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      if (error.status == 403) {
        message.error(
          "You do not have the required permissions to perform this request"
        );
      }
    }
  };

  const fetchFilteredData = async (filterType?: any, filterValue?: any) => {
    setLoading(true);
    setData([]);

    try {
      let url = `${import.meta.env.VITE_SERVER}/api/v1/purchaseHistory`;

      if (filterType && filterValue) {
        url += `/${filterType}/${filterValue}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token_timperio")}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredData();
  }, []);

  return (
    <div>
      <List
        title={t("Purchase History")}
        headerButtons={() => (
          <Col>
            <Button
              type="primary"
              danger
              icon={
                <ExportOutlined
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              }
              onClick={showCreateUserModal}
              style={{ float: "right", marginBottom: "16px" }}
            >
              {t("Export to CSV")}
            </Button>
          </Col>
        )}
      />

      <Table
        dataSource={data}
        rowKey="salesId"
        loading={loading}
        onRow={(record) => ({
          onClick: () => {
            show("orders", record.salesId);
          },
        })}
      >
        <Table.Column
          key="salesId"
          dataIndex="salesId"
          title={t("orders.fields.order")}
          render={(value) => <Typography.Text>#{value}</Typography.Text>}
          filterDropdown={({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
          }) => (
            <div style={{ padding: 8 }}>
              <InputNumber
                placeholder={t("orders.filter.orderId.placeholder")}
                style={{ width: "100%" }}
                // @ts-ignore
                value={selectedKeys[0]}
                onChange={(value) => {
                  setSelectedKeys(value ? [value] : []);
                }}
                onPressEnter={() => confirm()}
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
                  onClick={() => confirm()}
                  style={{ width: 90 }}
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
          onFilter={(value, record) => {
            return value
              ? record.salesId.toString() === value.toString()
              : true;
          }}
        />

        <Table.Column
          key="customerId"
          dataIndex="customerId"
          title={t("orders.fields.customerID")}
          filterDropdown={({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
          }) => (
            <div style={{ padding: 8 }}>
              <Input
                placeholder={t("Search Customer ID")}
                style={{ width: "100%" }}
                value={selectedKeys[0]}
                onChange={(e) => {
                  setSelectedKeys(e.target.value ? [e.target.value] : []);
                }}
                onPressEnter={() => {
                  confirm();
                  fetchFilteredData("customerId", selectedKeys[0]);
                }}
              />
              <div style={{ marginTop: 8 }}>
                <Button
                  onClick={() => {
                    clearFilters();
                    fetchFilteredData();
                  }}
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
                    fetchFilteredData("customerId", selectedKeys[0]);
                  }}
                  style={{ width: 90 }}
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
        />

        <Table.Column
          key="product"
          dataIndex="product"
          title={t("orders.fields.products")}
          //   filterDropdown={({
          //     setSelectedKeys,
          //     selectedKeys,
          //     confirm,
          //     clearFilters,
          //   }) => (
          //     <div style={{ padding: 8 }}>
          //       <Input
          //         placeholder={t("Search Product")}
          //         style={{ width: "100%" }}
          //         value={selectedKeys[0]}
          //         onChange={(e) => {
          //           setSelectedKeys(e.target.value ? [e.target.value] : []);
          //         }}
          //         onPressEnter={() => confirm()}
          //       />
          //       <div style={{ marginTop: 8 }}>
          //         <Button
          //           onClick={() => clearFilters()}
          //           size="small"
          //           style={{ width: 90, marginRight: 8 }}
          //         >
          //           Clear
          //         </Button>
          //         <Button
          //           type="primary"
          //           size="small"
          //           onClick={() => confirm()}
          //           style={{ width: 90 }}
          //         >
          //           Apply
          //         </Button>
          //       </div>
          //     </div>
          //   )}
          onFilter={(value, record) => {
            return value ? record.product.toLowerCase().includes(value) : true;
          }}
        />

        <Table.Column
          key="totalPrice"
          dataIndex="totalPrice"
          title={t("orders.fields.amount")}
          render={(value) => `$${value.toFixed(2)}`}
          filterDropdown={({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
          }) => (
            <div style={{ padding: 8 }}>
              <InputNumber
                placeholder={t("orders.filter.amount.placeholder")}
                style={{ width: "100%" }}
                // @ts-ignore
                value={selectedKeys[0]}
                onChange={(value) => {
                  setSelectedKeys(value ? [value] : []);
                }}
                onPressEnter={() => confirm()}
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
                  onClick={() => confirm()}
                  style={{ width: 90 }}
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
          onFilter={(value, record) => {
            return value
              ? record.totalPrice.toString() === value.toString()
              : true;
          }}
        />

        <Table.Column
          key="salesDate"
          dataIndex="salesDate"
          title={t("orders.fields.salesDate")}
          render={(value) => dayjs(value).format("YYYY-MM-DD")}
          filterDropdown={({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
          }) => (
            <div style={{ padding: 8 }}>
              <RangePicker
                style={{ width: "100%" }}
                defaultValue={[
                  dayjs("2019-01-01", "YYYY-MM-DD"),
                  dayjs("2024-01-01", "YYYY-MM-DD"),
                ]}
                // @ts-ignore
                value={selectedKeys[0]}
                onChange={(dates) => {
                  // @ts-ignore
                  setSelectedKeys(dates ? [dates] : []);
                }}
                onPressEnter={() => confirm()}
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
                  onClick={() => confirm()}
                  style={{ width: 90 }}
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
          onFilter={(value, record) => {
            return value
              ? dayjs(record.salesDate).isBetween(
                  value[0],
                  value[1],
                  null,
                  "[]"
                )
              : true;
          }}
        />
        <Table.Column
          key="salesType"
          dataIndex="salesType"
          title={t("orders.fields.salesType")}
          filterDropdown={({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
          }) => (
            <div style={{ padding: 8 }}>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                value={selectedKeys}
                onChange={(value) => {
                  setSelectedKeys(value || []);
                }}
                onKeyDown={() => {
                  confirm();
                  fetchFilteredData("salesType", selectedKeys.join(","));
                }}
                placeholder="Select"
              >
                {SALES_TYPE.map(({ name, value }, i) => (
                  <Select.Option key={i} value={value}>
                    {name}
                  </Select.Option>
                ))}
              </Select>
              <div style={{ marginTop: 8 }}>
                <Button
                  onClick={() => {
                    clearFilters();
                    fetchFilteredData();
                  }}
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
                    fetchFilteredData("salesType", selectedKeys.join(","));
                  }}
                  style={{ width: 90 }}
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
        />
      </Table>

      <Modal
        title="Export to CSV"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Export"
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={exportData}
          style={{ marginTop: 20 }}
        >
          <Form.Item name="customerId" label="Customer ID">
            <InputNumber
              placeholder="Enter Customer ID"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item name="salesType" label="Sales Type">
            <Select placeholder="Select Sale Type" mode="multiple">
              {SALES_TYPE.map(({ name, value }, i) => (
                <Select.Option key={i} value={value}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="productPrice" label="Product Price">
            <Slider
              min={0}
              max={10000}
              step={100}
              range
              defaultValue={[0, 10000]}
              marks={{
                0: "$0",
                10000: "$10,000",
              }}
            />
          </Form.Item>

          <Form.Item name="salesDate" label="Sales Date">
            <RangePicker
              style={{ width: "100%" }}
              defaultValue={[
                dayjs("2019-01-01", "YYYY-MM-DD"),
                dayjs("2024-01-01", "YYYY-MM-DD"),
              ]}
              format="YYYY-MM-DD"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
