import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  Input,
  Select,
  Typography,
  InputNumber,
  DatePicker,
  Button,
} from 'antd';
import { useTranslate, useNavigation } from '@refinedev/core';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

export const OrderList = () => {
  const t = useTranslate();
  const { show } = useNavigation();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data from server based on filters
  const fetchFilteredData = async (filterType, filterValue) => {
    setLoading(true);
    try {
      let url = `${import.meta.env.VITE_SERVER}/api/v1/purchaseHistory`;

      if (filterType && filterValue) {
        // Dynamically construct the URL based on filter type
        url += `/${filterType}/${filterValue}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token_timperio')}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredData(); // Initial data load
  }, []);

  return (
    <div>
      <Table
        dataSource={data}
        rowKey="salesId"
        loading={loading}
        onRow={(record) => ({
          onClick: () => {
            show('orders', record.salesId);
          },
        })}
      >
        <Table.Column
          key="salesId"
          dataIndex="salesId"
          title={t('orders.fields.order')}
          render={(value) => <Typography.Text>#{value}</Typography.Text>}
          filterDropdown={({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
          }) => (
            <div style={{ padding: 8 }}>
              <InputNumber
                placeholder={t('orders.filter.orderId.placeholder')}
                style={{ width: '100%' }}
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
          title={t('orders.fields.customerID')}
          filterDropdown={({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
          }) => (
            <div style={{ padding: 8 }}>
              <Input
                placeholder={t('orders.filter.customerId.placeholder')}
                style={{ width: '100%' }}
                value={selectedKeys[0]}
                onChange={(e) => {
                  setSelectedKeys(e.target.value ? [e.target.value] : []);
                }}
                onPressEnter={() => {
                  confirm();
                  fetchFilteredData('customerId', selectedKeys[0]);
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
                    fetchFilteredData('customerId', selectedKeys[0]);
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
          title={t('orders.fields.products')}
          filterDropdown={({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
          }) => (
            <div style={{ padding: 8 }}>
              <Input
                placeholder={t('orders.filter.product.placeholder')}
                style={{ width: '100%' }}
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
            return value
              ? record.product.toLowerCase().includes(value.toLowerCase())
              : true;
          }}
        />

        <Table.Column
          key="totalPrice"
          dataIndex="totalPrice"
          title={t('orders.fields.amount')}
          render={(value) => `SGD ${value}`}
          filterDropdown={({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
          }) => (
            <div style={{ padding: 8 }}>
              <InputNumber
                placeholder={t('orders.filter.amount.placeholder')}
                style={{ width: '100%' }}
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
          title={t('orders.fields.salesDate')}
          render={(value) => dayjs(value).format('YYYY-MM-DD')}
          filterDropdown={({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
          }) => (
            <div style={{ padding: 8 }}>
              <RangePicker
                style={{ width: '100%' }}
                value={selectedKeys[0]}
                onChange={(dates) => {
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
                  '[]'
                )
              : true;
          }}
        />
        <Table.Column
          key="salesType"
          dataIndex="salesType"
          title={t('orders.fields.salesType')}
          filterDropdown={({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
          }) => (
            <div style={{ padding: 8 }}>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                value={selectedKeys}
                onChange={(value) => {
                  setSelectedKeys(value || []);
                }}
                onPressEnter={() => {
                  confirm();
                  fetchFilteredData('salesType', selectedKeys.join(',')); // Join for multiple values
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
                    fetchFilteredData('salesType', selectedKeys.join(','));
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
    </div>
  );
};
