export default function HostListings() {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold mb-4" data-testid="title-host-listings">
        My Listings
      </h1>
      <p className="text-muted-foreground" data-testid="text-placeholder">
        Manage your property listings here.
      </p>
    </div>
  );
}