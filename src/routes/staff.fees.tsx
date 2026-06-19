import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Plus, Download } from "lucide-react";

export const Route = createFileRoute("/staff/fees")({});

const payments = [
  { id: 1, student: "Aarav Singh", amount: 5000, date: "2025-06-19", receipt: "RCP-2025-06-001" },
  { id: 2, student: "Bhavna Sharma", amount: 5000, date: "2025-06-18", receipt: "RCP-2025-06-002" },
  { id: 3, student: "Deepak Kumar", amount: 5000, date: "2025-06-17", receipt: "RCP-2025-06-003" },
  { id: 4, student: "Esha Gupta", amount: 5000, date: "2025-06-16", receipt: "RCP-2025-06-004" },
];

export default function FeesCollection() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ student: "", amount: "", paymentMethod: "cash" });

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Payment recorded: ₹${formData.amount} from ${formData.student}`);
    setFormData({ student: "", amount: "", paymentMethod: "cash" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fees Collection Counter</h1>
          <p className="mt-1 text-muted-foreground">Record student payments and generate receipts</p>
        </div>
        <Button className="bg-gradient-hero text-primary-foreground gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" />
          New Payment
        </Button>
      </div>

      {/* Collection Summary */}
      <Card className="p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Today's Collection</p>
            <p className="mt-2 text-3xl font-bold text-green-600">₹{totalCollected.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Receipts Issued</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">{payments.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg Payment</p>
            <p className="mt-2 text-3xl font-bold">₹{(totalCollected / payments.length).toLocaleString()}</p>
          </div>
        </div>
      </Card>

      {/* Payment Form */}
      {showForm && (
        <Card className="p-6">
          <h3 className="mb-4 font-bold">Record New Payment</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="student">Student Name</Label>
                <Input
                  id="student"
                  value={formData.student}
                  onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                  placeholder="Student name or ID"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-gradient-hero text-primary-foreground">
                Save Payment
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Recent Payments */}
      <Card className="overflow-hidden">
        <div className="border-b border-border bg-card p-4">
          <h3 className="font-bold">Recent Payments</h3>
        </div>
        <div className="divide-y divide-border">
          {payments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-4 hover:bg-accent/50">
              <div className="flex-1">
                <p className="font-medium">{payment.student}</p>
                <p className="text-sm text-muted-foreground">Receipt: {payment.receipt}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium">₹{payment.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{payment.date}</p>
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
