
"use client";

import type React from 'react';

interface CrudPageHeaderProps {
  title: string;
  createDialogComponent: React.ReactNode;
}

export function CrudPageHeader({ title, createDialogComponent }: CrudPageHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      {createDialogComponent}
    </div>
  );
}
