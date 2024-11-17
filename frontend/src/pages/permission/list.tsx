import { EditOutlined } from "@ant-design/icons";
import { List } from "@refinedev/antd";
import { Button, Form, Input, message, Modal, Select, Table } from "antd";
import { Typography } from "antd/lib";
import axios from "axios";
import React, { useState } from "react";
import { Role } from "../../constant";
import type { ICourier } from "../../interfaces";

// TODO: fetch from backend
const dataSource = [
  { action: "VIEW PURCHASE HISTORY", role: [Role.MARKETING] },
  { action: "VIEW CUSTOMERS", role: ["SALES"] },
  { action: "ALLOW EXPORT", role: ["MARKETING"] },
  { action: "NEWSLETTER MANAGEMENT", role: ["MARKETING", "ADMIN"] },
  { action: "VIEW, CREATE, DELETE USER", role: ["ADMIN"] },
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

  const handleEditUser = async (values: any) => {
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
      message.success("User updated successfully");
      setIsEditModalVisible(false);
    } catch (error) {
      if (error.status == 403) {
        message.error(
          "User is an admin account. You cannot update user details."
        );
      } else {
        message.error("Failed to update user");
      }
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
      <Table dataSource={dataSource} columns={columns} />
      <Modal
        title="Create New User"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Create"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" onFinish={() => {}}>
          <Form.Item
            name="userEmail"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input placeholder="joshy@timperio.com" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter a password" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please enter the user's name" },
            ]}
          >
            <Input placeholder="Joshua" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Marketing">
              <Select.Option value="MARKETING">Marketing</Select.Option>
              <Select.Option value="SALES">Sales</Select.Option>
              <Select.Option value="ADMIN">Admin</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Update Permission"
        visible={isEditModalVisible}
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
        <Form form={form} layout="vertical" onFinish={handleEditUser}>
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
