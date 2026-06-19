import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, AlertCircle, DollarSign, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/staff/")({});

export default function StaffOverview() {
  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Fees Collected Today */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Today's Collection</p>
              <p className="mt-2 text-3xl font-bold text-green-600">₹45,000</p>
              <p className="mt-1 text-xs text-green-600">↑ 8 payments</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        {/* Pending Complaints */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Issues</p>
              <p className="mt-2 text-3xl font-bold text-red-600">5</p>
              <p className="mt-1 text-xs text-red-600">Require attention</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </Card>

        {/* Total Monthly Collection */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Collection</p>
              <p className="mt-2 text-3xl font-bold text-blue-600">₹2,85,000</p>
              <p className="mt-1 text-xs text-blue-600">75% of target</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        {/* Open Inquiries */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Open Inquiries</p>
              <p className="mt-2 text-3xl font-bold text-purple-600">12</p>
              <p className="mt-1 text-xs text-purple-600">Awaiting response</p>
            </div>
            <MessageSquare className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-bold">Quick Actions</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Button variant="outline" className="w-full justify-start">
            💳 Record Payment
          </Button>
          <Button variant="outline" className="w-full justify-start">
            🧾 Generate Receipt
          </Button>
          <Button className="w-full justify-start bg-gradient-hero text-primary-foreground">
            📋 View Complaints
          </Button>
        </div>
      </Card>
    </div>
  );
}
