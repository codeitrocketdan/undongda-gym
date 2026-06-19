"use client";

import { Component, ReactNode, Suspense } from "react";

class ErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

interface Props {
  children: ReactNode;
  fallback: ReactNode;
  errorFallback: ReactNode;
}

export default function AsyncBoundary({
  children,
  fallback,
  errorFallback,
}: Props) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}
