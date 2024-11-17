import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { List } from "@refinedev/antd";
import { useTranslate } from "@refinedev/core";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Table,
} from "antd";
import { Typography } from "antd/lib";
import axios from "axios";
import React, { useState } from "react";
import type { ICourier } from "../../interfaces";

const { Text } = Typography;

export const UserManagement = () => {
  const t = useTranslate();
  const [users, setUsers] = useState<ICourier[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<ICourier | null>(null);
  const [form] = Form.useForm();

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token_timperio");
      if (!token) {
        throw new Error("No token found in localStorage");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized, please log in again");
      } else {
        console.error("Error fetching user data:", error);
      }
    }
  };

  const showCreateUserModal = () => {
    setIsModalVisible(true);
  };

  const handleCreateUser = async (values: any) => {
    try {
      await axios.post(`${import.meta.env.VITE_SERVER}/api/v1/user`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token_timperio")}`,
        },
      });
      message.success("User created successfully");
      form.resetFields();
      setIsModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error("Failed to create user");
    }
  };

  const showEditModal = (user: ICourier) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsEditModalVisible(true);
  };

  const handleEditUser = async (values: any) => {
    if (!editingUser) return;
    console.log(localStorage.getItem("token_timperio"));

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
      fetchUsers();
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

  const handleDeleteUser = async (userId: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER}/api/v1/user/id/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_timperio")}`,
          },
        }
      );
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      message.error("Failed to delete user");
    }
  };

  return (
    <div>
      <List
        title="User Management"
        headerButtons={() => (
          <Col>
            <Button
              type="primary"
              icon={
                <PlusOutlined
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              }
              onClick={showCreateUserModal}
              style={{ float: "right", backgroundColor: "#014214" }}
            >
              {t("Add New User")}
            </Button>
          </Col>
        )}
      />

      <Table dataSource={users} rowKey="userId" pagination={{ pageSize: 10 }}>
        <Table.Column title="ID" dataIndex="userId" key="userId" />
        <Table.Column title="Name" dataIndex="name" key="name" />
        <Table.Column title="Email" dataIndex="userEmail" key="userEmail" />
        <Table.Column title="Role" dataIndex="role" key="role" />
        {/* <Table.Column
          title="Status"
          dataIndex="enabled"
          key="enabled"
          render={(enabled) => (enabled ? "Enabled" : "Disabled")}
        /> */}

        <Table.Column
          title="Action"
          key="action"
          render={(_, record: ICourier) => {
            return record.role === "ADMIN" ? (
              <>
                <Text type="danger" style={{ textTransform: "uppercase" }}>
                  Not Allowed to Edit
                </Text>
              </>
            ) : (
              <div>
                <Button
                  icon={
                    <EditOutlined
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                  }
                  onClick={() => showEditModal(record)}
                  style={{ marginRight: 8 }}
                >
                  Edit
                </Button>
                <Popconfirm
                  title="Are you sure to delete this user?"
                  onConfirm={() => handleDeleteUser(record.userId)}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{
                    style: {
                      backgroundColor: "#014214",
                    },
                  }}
                >
                  <Button
                    icon={
                      <DeleteOutlined
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                    }
                    danger
                  >
                    Delete
                  </Button>
                </Popconfirm>
              </div>
            );
          }}
        />
      </Table>

      <Modal
        title="Create New User"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Create"
        cancelText="Cancel"
        okButtonProps={{
          style: {
            backgroundColor: "#014214",
          },
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateUser}>
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

      {/* Modal for editing a user */}
      <Modal
        title="Edit User"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={() => form.submit()}
        okText="Update"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" onFinish={handleEditUser}>
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
            <Input />
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
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select>
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
