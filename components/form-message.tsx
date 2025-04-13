export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className="w-full max-w-md text-sm">
      {"success" in message && (
        <div className="my-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {message.success}
        </div>
      )}
      {"error" in message && (
        <div className="my-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {message.error}
        </div>
      )}
      {"message" in message && (
        <div className="mb-6 p-3 border rounded">
          {message.message}
          </div>
      )}
    </div>
  );
}
