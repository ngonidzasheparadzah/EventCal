export default function HostMore() {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold mb-4" data-testid="title-host-more">
        More Options
      </h1>
      <p className="text-muted-foreground" data-testid="text-placeholder">
        Additional host tools and settings will be available here.
      </p>
    </div>
  );
}