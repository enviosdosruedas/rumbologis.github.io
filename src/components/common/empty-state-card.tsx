
"use client";

import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

interface EmptyStateCardProps {
  title: string;
  message: string;
  createActionComponent?: React.ReactNode; // Optional: A button or component for creation
}

export function EmptyStateCard({ title, message, createActionComponent }: EmptyStateCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-muted-foreground opacity-50 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            data-ai-hint="empty box illustration"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
          <p className="text-muted-foreground">{message}</p>
        </div>
      </CardContent>
      {createActionComponent && (
        <CardFooter className="flex justify-center">
          {createActionComponent}
        </CardFooter>
      )}
    </Card>
  );
}

