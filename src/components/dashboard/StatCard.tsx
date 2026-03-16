
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  colorClass: string;
}

export function StatCard({ label, value, icon: Icon, colorClass }: StatCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-md">
      <CardContent className="p-6 flex items-center space-x-4">
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <h3 className="text-2xl font-bold font-headline">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
