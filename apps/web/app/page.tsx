"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout, Typography, Button, Skeleton } from "antd";
import { PlusOutlined, LogoutOutlined } from "@ant-design/icons";
import type { Task } from "@/types";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "@/hooks/mutations/useTaskMutations";
import TaskList from "./components/TaskList";
import TaskModal from "./components/TaskModal";

const { Header, Content } = Layout;
const { Title } = Typography;

export default function DashboardPage() {
  const { isReady, isAuthenticated, logout, clearAuthOnError } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await api.get("/tasks/my-tasks");
      return res.data;
    },
    retry: false,
    enabled: isReady && isAuthenticated,
  });

  const createTaskMutation = useCreateTaskMutation(() => {
    setIsModalVisible(false);
  });

  const updateTaskMutation = useUpdateTaskMutation(() => {
    setIsModalVisible(false);
    setEditingTask(null);
  });

  const deleteMutation = useDeleteTaskMutation();

  if (isError) {
    clearAuthOnError();
  }

  if (!isReady) return null;

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalVisible(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalVisible(true);
  };

  const handleModalSubmit = (values: {
    title: string;
    description?: string;
  }) => {
    if (editingTask) {
      updateTaskMutation.mutate({ id: editingTask.id, ...values });
    } else {
      createTaskMutation.mutate(values);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fff",
          padding: "0 24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Task Manager
        </Title>
        <Button icon={<LogoutOutlined />} onClick={logout} danger>
          Logout
        </Button>
      </Header>

      <Content
        style={{
          padding: "40px 24px",
          maxWidth: 800,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 24,
            alignItems: "center",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            My Tasks
          </Title>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
          >
            New Task
          </Button>
        </div>

        {isLoading ? (
          <Skeleton active />
        ) : (
          <TaskList
            tasks={tasks || []}
            onEdit={openEditModal}
            updateMutation={updateTaskMutation}
            deleteMutation={deleteMutation}
          />
        )}
      </Content>

      <TaskModal
        open={isModalVisible}
        editingTask={editingTask}
        confirmLoading={
          createTaskMutation.isPending || updateTaskMutation.isPending
        }
        onSubmit={handleModalSubmit}
        onCancel={() => setIsModalVisible(false)}
      />
    </Layout>
  );
}
