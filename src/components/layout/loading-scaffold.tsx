
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LoadingScaffoldProps {
  pageTitle: string;
  cardTitle: string;
  loadingText: string;
}

export function LoadingScaffold({ pageTitle, cardTitle, loadingText }: LoadingScaffoldProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">{pageTitle}</h2>
        {/* Actions (like a create button) are typically not interactive or hidden during the main loading state.
            If specific actions are needed here during loading, the page component should handle them
            or this scaffold could be extended with an optional 'actionsElement' prop. */}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{cardTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">{loadingText}</p>
        </CardContent>
      </Card>
    </div>
  );
}
