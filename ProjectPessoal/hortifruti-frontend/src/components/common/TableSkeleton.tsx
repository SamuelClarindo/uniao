// src/components/common/TableSkeleton.tsx
import { Table } from 'flowbite-react';

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export function TableSkeleton({ columns, rows = 5 }: TableSkeletonProps) {
  return (
    <Table.Body className="divide-y">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Table.Row key={rowIndex} className="bg-white dark:border-gray-700 dark:bg-gray-800 animate-pulse">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Table.Cell key={colIndex}>
              <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
            </Table.Cell>
          ))}
        </Table.Row>
      ))}
    </Table.Body>
  );
}