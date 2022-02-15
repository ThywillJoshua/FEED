import AuthCheck from "@/components/AuthCheck";

export default function AdminPage({}) {
  return (
    <main>
      <AuthCheck> Admin Homepage </AuthCheck>
    </main>
  );
}
