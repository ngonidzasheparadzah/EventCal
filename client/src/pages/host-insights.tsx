export default function HostInsights() {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold mb-4" data-testid="title-host-insights">
        Insights & Analytics
      </h1>
      <p className="text-muted-foreground" data-testid="text-placeholder">
        View your booking analytics and performance metrics here.
      </p>
    </div>
  );
}