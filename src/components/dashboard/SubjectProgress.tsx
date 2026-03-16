
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface SubjectProgressProps {
  subject: string;
  proficiency: number;
}

export function SubjectProgress({ subject, proficiency }: SubjectProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium font-headline">{subject}</span>
        <Badge variant="secondary" className="font-mono">{proficiency}%</Badge>
      </div>
      <Progress value={proficiency} className="h-2" />
    </div>
  );
}
