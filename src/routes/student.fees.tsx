import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/student/fees")({});

const feeRecords = [
  { id: 1, month: "June 2025", amount: 5000, status: "paid", date: "2025-06-01", receipt: "RCP-2025-06-001" },
  { id: 2, month: "May 2025", amount: 5000, status: "paid", date: "2025-05-01", receipt: "RCP-2025-05-001" },
  { id: 3, month: "April 2025", amount: 5000, status: "paid", date: "2025-04-01", receipt: "RCP-2025-04-001" },
  { id: 4, month: "March 2025", amount: 5000, status: "paid", date: "2025-03-01", receipt: "RCP-2025-03-001" },
];

export default function StudentFees() {
  const totalPaid = feeRecords.filter((f) => f.status === "paid").reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">My Fees</h1>
        <p className="mt-1 text-muted-foreground">View payment history and receipts</p>
      </div>

      {/* Fee Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Paid</p>
          <p className="mt-2 text-3xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Due Amount</p>
          <p className="mt-2 text-3xl font-bold text-gray-600">₹0</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Status</p>
          <p className="mt-2 text-lg font-bold text-green-600">✓ All Clear</p>
        </Card>
      </div>

      {/* Fee Records */}
      <Card className="overflow-hidden">
        <div className="border-b border-border bg-card p-4">
          <h3 className="font-bold">Payment History</h3>
        </div>
        <div className="divide-y divide-border">
          {feeRecords.map((record) => (
            <div key={record.id} className="flex items-center justify-between p-4 hover:bg-accent/50">
              <div className="flex-1">
                <p className="font-medium">{record.month}</p>
                <p className="text-sm text-muted-foreground">Receipt: {record.receipt}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium">₹{record.amount.toLocaleString()}</p>
                  <p className="text-xs text-green-600">Paid on {record.date}</p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
