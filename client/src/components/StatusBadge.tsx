import { Badge } from "@radix-ui/themes";

type BadgeColor = "blue" | "amber" | "green" | "red" | "gray";

const colorMap: Record<string, BadgeColor> = {
  APPLIED: "blue",
  INTERVIEW: "amber",
  OFFER: "green",
  REJECTED: "red",
  WITHDRAWN: "gray",
};

export default function StatusBadge({ status }: Readonly<{ status: string }>) {
  return (
    <Badge color={colorMap[status] ?? "gray"} variant="soft" radius="full">
      {status}
    </Badge>
  );
}
