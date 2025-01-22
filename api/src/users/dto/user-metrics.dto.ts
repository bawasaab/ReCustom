export class UserMetricsDto {
  userId: number;
  userName: string;
  totalActivities: number;
  lastActivityDate: Date | null;
  activityBreakdown: {
    [key: string]: number;
  };
} 