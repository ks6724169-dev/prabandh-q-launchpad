import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/staff/complaints")({});

const complaints = [
  { id: 1, title: "Fee Payment Issue", student: "Aarav Singh", status: "open", date: "2025-06-19", priority: "high" },
  { id: 2, title: "Attendance Discrepancy", student: "Bhavna Sharma", status: "in_progress", date: "2025-06-18", priority: "medium" },
  { id: 3, title: "Exam Schedule Confusion", student: "Chitra Patel", status: "resolved", date: "2025-06-17", priority: "low" },
  { id: 4, title: "Library Card Issue", student: "Deepak Kumar", status: "open", date: "2025-06-16", priority: "medium" },
  { id: 5, title: "Hostel Facility Request", student: "Esha Gupta", status: "in_progress", date: "2025-06-15", priority: "low" },
];

export default function ComplaintsTracker() {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const filteredComplaints = filterStatus ? complaints.filter((c) => c.status === filterStatus) : complaints;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-red-100 text-red-700",
      in_progress: "bg-yellow-100 text-yellow-700",
      resolved: "bg-green-100 text-green-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: "text-red-600",
      medium: "text-yellow-600",
      low: "text-blue-600",
    };
    return colors[priority] || "text-gray-600";
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Complaints & Inquiries Tracker</h1>
        <p className="mt-1 text-muted-foreground">Manage student complaints and inquiries</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Open</p>
          <p className="mt-1 text-2xl font-bold text-red-600">2</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">In Progress</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600">2</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Resolved</p>
          <p className="mt-1 text-2xl font-bold text-green-600">1</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="mt-1 text-2xl font-bold">{complaints.length}</p>
        </Card>
      </div>

      {/* Filter Buttons */}
      <Card className="p-4 flex gap-2 flex-wrap">
        <Button
          variant={filterStatus === null ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus(null)}
        >
          All Complaints
        </Button>
        <Button
          variant={filterStatus === "open" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("open")}
        >
          Open
        </Button>
        <Button
          variant={filterStatus === "in_progress" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("in_progress")}
        >
          In Progress
        </Button>
        <Button
          variant={filterStatus === "resolved" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("resolved")}
        >
          Resolved
        </Button>
      </Card>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.map((complaint) => (
          <Card key={complaint.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{complaint.title}</h3>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(complaint.status)}`}>
                    {complaint.status.replace("_", " ").toUpperCase()}
                  </span>
                  <span className={`text-xs font-medium uppercase ${getPriorityColor(complaint.priority)}`}>
                    {complaint.priority}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">From: {complaint.student}</p>
                <p className="text-xs text-muted-foreground mt-1">Date: {complaint.date}</p>
              </div>
              <Button size="sm" variant="outline">
                Update Status
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
