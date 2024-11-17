import { EditOutlined } from "@ant-design/icons";
import { List } from "@refinedev/antd";
import { Button, Form, message, Modal, Select, Table } from "antd";
import { Typography } from "antd/lib";
import axios from "axios";
import React, { useState } from "react";
import { Role } from "../../constant";
import type { ICourier } from "../../interfaces";

// TODO: fetch from backend
const dataSource = [
  { action: "VIEW PURCHASE HISTORY", role: [Role.MARKETING] },
  { action: "VIEW CUSTOMERS", role: [Role.SALES] },
  { action: "ALLOW EXPORT", role: [Role.MARKETING] },
  { action: "NEWSLETTER MANAGEMENT", role: [Role.MARKETING, Role.ADMIN] },
  { action: "VIEW, CREATE, DELETE USER", role: [Role.ADMIN] },
];

export const PermissionManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<ICourier | null>(null);
  const [form] = Form.useForm();

  React.useEffect(() => {}, []);

  const showEditModal = (user: ICourier) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsEditModalVisible(true);
  };

  const handleEditPermission = async (values: any) => {
    if (!editingUser) return;
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER}/api/v1/user/admin/${
          editingUser.userId
        }`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_timperio")}`,
          },
        }
      );
      message.success("Permission updated successfully");
      setIsEditModalVisible(false);
    } catch (error) {
      message.error("Failed to update permission");
    }
  };

  const columns = [
    {
      title: "Access Control",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (roles: any) => roles.join(", "),
    },
    {
      title: "Action",
      key: "actions",
      render: (_: any, record: any) => {
        return (
          <div>
            <Button
              icon={
                <EditOutlined
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              }
              style={{ marginRight: 8 }}
              onClick={() => showEditModal(record)}
            >
              Edit
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <List title="Permission" />
      <Table dataSource={dataSource} columns={columns} pagination={false} />
      <Modal
        title="Update Permission"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={() => form.submit()}
        okText="Update"
        cancelText="Cancel"
        okButtonProps={{
          style: {
            backgroundColor: "#014214",
          },
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleEditPermission}>
          <Form.Item>
            <Typography.Text> VIEW PURCHASE HISTORY</Typography.Text>
          </Form.Item>
          <Form.Item
            name="role"
            label="Assign to these roles:"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select mode="multiple">
              <Select.Option value="MARKETING">Marketing</Select.Option>
              <Select.Option value="SALES">Sales</Select.Option>
              <Select.Option value="ADMIN">Admin</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
