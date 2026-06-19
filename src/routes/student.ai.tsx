import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Lock, Unlock, MessageCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/student/ai")({});

const aiTopics = [
  { id: 1, title: "Algebra Fundamentals", locked: false, sessions: 12, credits: 50 },
  { id: 2, title: "Photosynthesis Explained", locked: false, sessions: 8, credits: 40 },
  { id: 3, title: "World War II Timeline", locked: true, sessions: 0, credits: 60 },
  { id: 4, title: "Advanced Calculus", locked: true, sessions: 0, credits: 80 },
  { id: 5, title: "Organic Chemistry Deep Dive", locked: true, sessions: 0, credits: 75 },
  { id: 6, title: "English Literature Analysis", locked: false, sessions: 5, credits: 45 },
];

export default function StudentAI() {
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const userCredits = 150;
  const unlockedTopics = aiTopics.filter((t) => !t.locked).length;

  const handleUnlock = (credits: number) => {
    if (userCredits >= credits) {
      alert(`Unlocked! Used ${credits} credits. Remaining: ${userCredits - credits}`);
    } else {
      alert("Insufficient credits. Please buy more credits.");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Prabandh Q AI Study Assistant</h1>
        <p className="mt-1 text-muted-foreground">Premium AI-powered learning with credit-based access</p>
      </div>

      {/* Credits & Info */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Available Credits</p>
          <p className="mt-2 text-3xl font-bold text-purple-600">{userCredits}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Unlocked Topics</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">{unlockedTopics}/{aiTopics.length}</p>
        </Card>
        <Card className="p-6">
          <Button className="w-full bg-gradient-hero text-primary-foreground">Buy Credits</Button>
        </Card>
      </div>

      {/* AI Topics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {aiTopics.map((topic) => (
          <Card key={topic.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <h3 className="font-bold">{topic.title}</h3>
                {topic.locked ? (
                  <Lock className="h-5 w-5 text-red-500" />
                ) : (
                  <Unlock className="h-5 w-5 text-green-600" />
                )}
              </div>

              {!topic.locked ? (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">Sessions: {topic.sessions}</p>
                  <Button className="w-full gap-2" size="sm">
                    <MessageCircle className="h-4 w-4" />
                    Continue Learning
                  </Button>
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-muted-foreground">Unlock cost: {topic.credits} credits</p>
                  <Button
                    onClick={() => handleUnlock(topic.credits)}
                    className="w-full gap-2"
                    size="sm"
                    variant="outline"
                  >
                    <Zap className="h-4 w-4" />
                    Unlock Now
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
