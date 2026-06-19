import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Clock, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/teacher/")({});

export default function TeacherOverview() {
  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

        {/* Students Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Students</p>
              <p className="mt-2 text-3xl font-bold">127</p>
              <p className="mt-1 text-xs text-green-600">Across 4 classes</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        {/* Attendance Rate */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Attendance</p>
              <p className="mt-2 text-3xl font-bold">94%</p>
              <p className="mt-1 text-xs text-green-600">✓ Above avg</p>
            </div>
            <AlertCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        {/* Pending Tasks */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
              <p className="mt-2 text-3xl font-bold">3</p>
              <p className="mt-1 text-xs text-orange-600">⚠ Need attention</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-bold">Quick Actions</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button variant="outline" className="w-full justify-start">
            ✓ Mark Today's Attendance
          </Button>
          <Button variant="outline" className="w-full justify-start">
            📚 View My Timetable
          </Button>
          <Button variant="outline" className="w-full justify-start">
            👥 Access Student Directory
          </Button>
          <Button className="w-full justify-start bg-gradient-hero text-primary-foreground">
            📝 Create New Assignment
          </Button>
        </div>
      </Card>
    </div>
  );
}
