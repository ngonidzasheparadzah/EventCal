export default function Wishlist() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4" data-testid="title-wishlist">
        My Wishlist
      </h1>
      <p className="text-muted-foreground" data-testid="text-placeholder">
        Your saved properties will appear here.
      </p>
    </div>
  );
}