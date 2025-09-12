export default function Messages() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4" data-testid="title-messages">
        Messages
      </h1>
      <p className="text-muted-foreground" data-testid="text-placeholder">
        Your messages and conversations will appear here.
      </p>
    </div>
  );
}