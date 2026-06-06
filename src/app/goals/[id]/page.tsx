import { GoalDetailClient } from "@/components/goal-detail-client";

export default async function GoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GoalDetailClient id={id} />;
}
