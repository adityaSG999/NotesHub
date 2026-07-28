export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-surface p-8 rounded-card shadow-soft border border-outline">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-text-primary tracking-tight">
            NotesHub
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Share your thoughts with clarity.
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
