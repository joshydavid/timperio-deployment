import { ExportOutlined } from "@ant-design/icons";
import { useNavigation, useTranslate } from "@refinedev/core";
import {
  Button,
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
    const { customerId, productPrice, salesType, salesDate } = formValues;
    const [minPrice, maxPrice] = productPrice;

    const [startDate, endDate] = salesDate;
    const startDateString = startDate.format("YYYY-MM-DD");
    const endDateString = endDate.format("YYYY-MM-DD");

    // TODO: Export filtered data

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/export`,
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
      message.error("Failed to create user");
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
                placeholder={t("orders.filter.customerId.placeholder")}
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
          filterDropdown={({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
          }) => (
            <div style={{ padding: 8 }}>
              <Input
                placeholder={t("orders.filter.product.placeholder")}
                style={{ width: "100%" }}
                value={selectedKeys[0]}
                onChange={(e) => {
                  setSelectedKeys(e.target.value ? [e.target.value] : []);
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
            return value ? record.product.toLowerCase().includes(value) : true;
          }}
        />

        <Table.Column
          key="totalPrice"
          dataIndex="totalPrice"
          title={t("orders.fields.amount")}
          render={(value) => `SGD ${value.toFixed(2)}`}
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
              >
                <Select.Option value="DIRECT_B2B">DIRECT_B2B</Select.Option>
                <Select.Option value="DIRECT_B2C">DIRECT_B2C</Select.Option>
                <Select.Option value="CONSIGNMENT">CONSIGNMENT</Select.Option>
                <Select.Option value="MARKETING">MARKETING</Select.Option>
                <Select.Option value="WHOLESALER">WHOLESALER</Select.Option>
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
        okText="Create"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" onFinish={exportData}>
          <Form.Item
            name="customerId"
            label="Customer ID"
            rules={[{ required: true, message: "Please enter a Customer ID" }]}
          >
            <InputNumber
              placeholder="Enter Customer ID"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="saleType"
            label="Sale Type"
            rules={[{ required: true, message: "Please select a Sale Type" }]}
          >
            <Select placeholder="Select Sale Type">
              <Option value="Marketing">Marketing</Option>
              <Option value="Direct-B2C">Direct - B2C</Option>
              <Option value="Direct-B2B">Direct - B2B</Option>
              <Option value="Wholesale">Wholesale</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="productPrice"
            label="Product Price"
            rules={[{ required: true, message: "Please select a value range" }]}
          >
            <Slider
              min={0}
              max={1000}
              step={100}
              range
              defaultValue={[100, 1000]}
              marks={{
                0: "0",
                1000: "1000",
              }}
            />
          </Form.Item>

          <Form.Item
            name="salesDate"
            label="Sales Date"
            rules={[
              { required: false, message: "Please select a sales date range" },
            ]}
          >
            <RangePicker
              style={{ width: "100%" }}
              defaultValue={[
                dayjs("2024-01-01", "YYYY-MM-DD"),
                dayjs("2024-12-31", "YYYY-MM-DD"),
              ]}
              format="YYYY-MM-DD"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
