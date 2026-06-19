import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, BookOpen, Zap } from "lucide-react";

export const Route = createFileRoute("/student/")({});

export default function StudentOverview() {
  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Attendance Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Attendance</p>
              <p className="mt-2 text-3xl font-bold">92%</p>
              <p className="mt-1 text-xs text-green-600">✓ On track</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        {/* Fees Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fees Status</p>
              <p className="mt-2 text-3xl font-bold">₹0</p>
              <p className="mt-1 text-xs text-green-600">✓ All paid</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>

        {/* Classes Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Classes Today</p>
              <p className="mt-2 text-3xl font-bold">5</p>
              <p className="mt-1 text-xs text-blue-600">📅 Scheduled</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        {/* AI Credits Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">AI Credits</p>
              <p className="mt-2 text-3xl font-bold">150</p>
              <p className="mt-1 text-xs text-purple-600">✨ Available</p>
            </div>
            <Zap className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-bold">Quick Links</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button variant="outline" className="w-full justify-start">
            📍 View Attendance Details
          </Button>
          <Button variant="outline" className="w-full justify-start">
            💳 Download Fee Receipt
          </Button>
          <Button variant="outline" className="w-full justify-start">
            📚 View Assignments
          </Button>
          <Button className="w-full justify-start bg-gradient-hero text-primary-foreground">
            🤖 Start AI Session
          </Button>
        </div>
      </Card>
    </div>
  );
}
