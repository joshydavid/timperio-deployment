import React, { useState } from 'react';
import axios from 'axios';
import { useTranslate, useNavigation, useGo } from '@refinedev/core';
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Table,
  Typography,
  message,
  Popconfirm,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ICourier } from '../../interfaces';

const { Title } = Typography;

export const UserManagement = () => {
  const go = useGo();
  const t = useTranslate();
  const { createUrl } = useNavigation();

  const [users, setUsers] = useState<ICourier[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<ICourier | null>(null);
  const [form] = Form.useForm();

  // Fetch users on component mount
  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token_timperio');
      if (!token) {
        throw new Error('No token found in localStorage');
      }

      const response = await axios.get('http://localhost:8080/api/v1/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized, please log in again');
      } else {
        console.error('Error fetching user data:', error);
      }
    }
  };

  // Show create user modal
  const showCreateUserModal = () => {
    setIsModalVisible(true);
  };

  // Handle modal submission for creating a new user
  const handleCreateUser = async (values: any) => {
    try {
      await axios.post('http://localhost:8080/api/v1/user', values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token_timperio')}`,
        },
      });
      message.success('User created successfully');
      form.resetFields();
      setIsModalVisible(false);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      message.error('Failed to create user');
    }
  };

  // Show edit modal with selected user's details
  const showEditModal = (user: ICourier) => {
    setEditingUser(user);
    form.setFieldsValue(user); // Populate form with user details
    setIsEditModalVisible(true);
  };

  // Handle user update
  const handleEditUser = async (values: any) => {
    if (!editingUser) return;
    console.log(localStorage.getItem('token_timperio'));

    try {
      await axios.put(
        `http://localhost:8080/api/v1/user/admin/${editingUser.userId}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token_timperio')}`,
          },
        }
      );
      message.success('User updated successfully');
      setIsEditModalVisible(false);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      if (error.status == 403) {
        message.error(
          'User is an admin account. You cannot update user details.'
        );
      } else {
        message.error('Failed to update user');
        console.log(values);
      }
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: string) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/user/id/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token_timperio')}`,
        },
      });
      message.success('User deleted successfully');
      fetchUsers(); // Refresh the user list
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  return (
    <div>
      <Title level={3}>{t('User Management')}</Title>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={showCreateUserModal}
        style={{ float: 'right', marginBottom: '16px' }}
      >
        {t('Add New User')}
      </Button>

      {/* Table displaying users */}
      <Table dataSource={users} rowKey="userId" pagination={{ pageSize: 5 }}>
        <Table.Column title="ID" dataIndex="userId" key="userId" />
        <Table.Column title="Name" dataIndex="name" key="name" />
        <Table.Column title="Email" dataIndex="userEmail" key="userEmail" />
        <Table.Column title="Role" dataIndex="role" key="role" />
        <Table.Column
          title="Status"
          dataIndex="enabled"
          key="enabled"
          render={(enabled) => (enabled ? 'Enabled' : 'Disabled')}
        />
        <Table.Column
          title="Actions"
          key="actions"
          render={(_, record: ICourier) => (
            <div>
              <Button
                icon={<EditOutlined />}
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
              >
                <Button icon={<DeleteOutlined />} danger>
                  Delete
                </Button>
              </Popconfirm>
            </div>
          )}
        />
      </Table>

      {/* Modal for creating a new user */}
      <Modal
        title="Create New User"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Create"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" onFinish={handleCreateUser}>
          <Form.Item
            name="userEmail"
            label="Email"
            rules={[
              {
                required: true,
                type: 'email',
                message: 'Please enter a valid email',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter a password' }]}
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
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select>
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
                type: 'email',
                message: 'Please enter a valid email',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter a password' }]}
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
            rules={[{ required: true, message: 'Please select a role' }]}
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
