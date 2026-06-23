import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/teacher/modules")({
  component: () => <Outlet />,
});
