import { useSession, signIn } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    return (
      <div className="p-6">
        <p>You must sign in first.</p>
        <button
          onClick={() => signIn("google")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign in
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1>Welcome to Dashboard</h1>
      <p>{session.user.email}</p>
    </div>
  );
}
