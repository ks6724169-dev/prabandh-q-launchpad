import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Clock, Users } from "lucide-react";

export const Route = createFileRoute("/teacher/classes")({});

const classList = [
  { id: 1, name: "Class XII-A", time: "09:00 AM - 10:00 AM", subject: "Mathematics", room: "A101", students: 45 },
  { id: 2, name: "Class XII-B", time: "10:15 AM - 11:15 AM", subject: "Physics", room: "A201", students: 42 },
  { id: 3, name: "Class XI-A", time: "11:30 AM - 12:30 PM", subject: "Chemistry", room: "A102", students: 48 },
  { id: 4, name: "Class X-B", time: "02:00 PM - 03:00 PM", subject: "Biology", room: "A203", students: 50 },
  { id: 5, name: "Prep Class", time: "03:15 PM - 04:15 PM", subject: "Mathematics", room: "A104", students: 35 },
];

export default function MyClasses() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">My Classes & Timetable</h1>
        <p className="mt-1 text-muted-foreground">View your teaching schedule and class details</p>
      </div>

      <div className="grid gap-4">
        {classList.map((cls) => (
          <Card key={cls.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold">{cls.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">Subject: {cls.subject}</p>
                <div className="mt-3 flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>{cls.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-green-600" />
                    <span>{cls.students} Students</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Room: {cls.room}</div>
                </div>
              </div>
              <div className="ml-4 inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                Active Today
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
