"use client";

import { Component, type ReactNode } from "react";
import { Result, Button } from "antd";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Result
            status="error"
            title="Something went wrong"
            subTitle="An unexpected error occurred. Please try refreshing the page."
            extra={
              <Button type="primary" onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}
