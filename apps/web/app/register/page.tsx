"use client";

import { Form, Input, Button, Card, Typography } from "antd";
import Link from "next/link";
import { useRegisterMutation } from "@/hooks/mutations/useAuthMutations";

const { Title } = Typography;

export default function RegisterPage() {
  const registerMutation = useRegisterMutation();

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f2f5" }}>
      <Card style={{ width: 400, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: 8 }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 24, marginTop: 0 }}>Register</Title>
        <Form layout="vertical" onFinish={(values) => registerMutation.mutate(values)}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter your name" }]}>
            <Input placeholder="John Doe" size="large" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}>
            <Input placeholder="john@example.com" size="large" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: "Please enter your password" }]}>
            <Input.Password placeholder="Password" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={registerMutation.isPending}>
              Register
            </Button>
          </Form.Item>
          <div style={{ textAlign: "center" }}>
            Already have an account? <Link href="/login">Login</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
