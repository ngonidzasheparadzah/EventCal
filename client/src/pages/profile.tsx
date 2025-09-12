export default function Profile() {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold mb-4" data-testid="title-profile">
        My Profile
      </h1>
      <p className="text-muted-foreground" data-testid="text-placeholder">
        Your profile settings and information will appear here.
      </p>
    </div>
  );
}