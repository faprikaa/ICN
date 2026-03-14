"use client";

import { List, Checkbox, Button, Popconfirm, Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { Task, TaskUpdateType } from "@/types";
import type { UseMutationResult } from "@tanstack/react-query";
import { sanitizeHtml } from "@/lib/sanitize";

const PAGE_SIZE = 5;

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  updateMutation: UseMutationResult<
    unknown,
    Error,
    TaskUpdateType & { id: number }
  >;
  deleteMutation: UseMutationResult<unknown, Error, number>;
}

export default function TaskList({
  tasks,
  onEdit,
  updateMutation,
  deleteMutation,
}: TaskListProps) {
  return (
    <List
      itemLayout="horizontal"
      dataSource={tasks}
      pagination={{
        pageSize: PAGE_SIZE,
        hideOnSinglePage: true,
        size: "small",
        style: { marginTop: 16 },
      }}
      renderItem={(task: Task) => {
        const isDeleting =
          deleteMutation.isPending && deleteMutation.variables === task.id;
        const isTogglingComplete =
          updateMutation.isPending &&
          updateMutation.variables?.id === task.id &&
          updateMutation.variables?.completed !== undefined;

        return (
          <List.Item
            style={{
              background: "#fff",
              padding: "16px 24px",
              marginBottom: 16,
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              opacity: isDeleting ? 0.5 : 1,
              transition: "opacity 0.2s ease",
            }}
            actions={[
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit(task)}
                key="edit"
                disabled={isDeleting}
              />,
              <Popconfirm
                key="delete"
                title="Delete task"
                description="Are you sure to delete this task?"
                onConfirm={() => deleteMutation.mutate(task.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  loading={isDeleting}
                  disabled={isDeleting}
                />
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              title={
                <Space size="middle">
                  <Checkbox
                    checked={task.completed}
                    disabled={isTogglingComplete}
                    onChange={(e) =>
                      updateMutation.mutate({
                        id: task.id,
                        completed: e.target.checked,
                      })
                    }
                  />
                  <div
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                      color: task.completed ? "#8c8c8c" : "inherit",
                      fontSize: "16px",
                      transition: "all 0.3s ease",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(task.title),
                    }}
                  />
                </Space>
              }
              description={
                task.description ? (
                  <div
                    style={{ paddingLeft: 34 }}
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(task.description),
                    }}
                  />
                ) : null
              }
            />
          </List.Item>
        );
      }}
      locale={{ emptyText: "No tasks found. Create one to get started!" }}
    />
  );
}
