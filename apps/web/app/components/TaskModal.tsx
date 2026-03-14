"use client";

import { Modal, Form } from "antd";
import type { Task } from "@/types";
import RichTextEditor from "./RichTextEditor";
import SimpleRichTextEditor from "./SimpleRichTextEditor";

interface TaskModalProps {
  open: boolean;
  editingTask: Task | null;
  confirmLoading: boolean;
  onSubmit: (values: { title: string; description?: string }) => void;
  onCancel: () => void;
}

export default function TaskModal({
  open,
  editingTask,
  confirmLoading,
  onSubmit,
  onCancel,
}: TaskModalProps) {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={editingTask ? "Edit Task" : "Create Task"}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
      okText="Save"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 24 }}
        initialValues={
          editingTask
            ? { title: editingTask.title, description: editingTask.description }
            : undefined
        }
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please input task title!" }]}
          getValueFromEvent={(value: string) => value}
        >
          <SimpleRichTextEditor />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          getValueFromEvent={(value: string) => value}
        >
          <RichTextEditor />
        </Form.Item>
      </Form>
    </Modal>
  );
}
