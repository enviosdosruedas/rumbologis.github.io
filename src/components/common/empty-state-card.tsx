
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EmptyStateCardProps {
  title: string;
  message: string;
}

export function EmptyStateCard({ title, message }: EmptyStateCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}
