export default function Bookings() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4" data-testid="title-bookings">
        My Trips
      </h1>
      <p className="text-muted-foreground" data-testid="text-placeholder">
        Your booking history and upcoming trips will appear here.
      </p>
    </div>
  );
}