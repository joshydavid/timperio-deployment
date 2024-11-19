import { EditOutlined } from "@ant-design/icons";
import { List } from "@refinedev/antd";
import { Button, Form, message, Modal, Select, Table, Tag } from "antd";
import { Typography } from "antd/lib";
import axios from "axios";
import React, { useState } from "react";

export const PermissionManagement = () => {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editPerm, setEditPerm] = useState<any | null>(null);
  const [form] = Form.useForm();

  React.useEffect(() => {
    fetchPermission();
  }, []);

  const fetchPermission = async () => {
    try {
      const token = localStorage.getItem("token_timperio");
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/permission`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data } = response;
      setPermissions(data);
    } catch (err) {}
  };

  const showEditModal = (record: any) => {
    setEditPerm(record);
    form.setFieldsValue(record);
    setIsEditModalVisible(true);
  };

  const handleEditPermission = async (values: any) => {
    const { action } = editPerm;
    const { role } = values;

    const requestBody = [
      {
        action,
        role,
      },
    ];

    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER}/api/v1/permission`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_timperio")}`,
          },
        }
      );
      message.success("Permission updated successfully");
      setIsEditModalVisible(false);
      fetchPermission();
    } catch (error) {
      console.log(error);
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
      <Table dataSource={permissions} columns={columns} pagination={false} />
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
            <Tag color="green">
              <Typography.Text>{editPerm?.action}</Typography.Text>
            </Tag>
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
