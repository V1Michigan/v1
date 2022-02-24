import Account from "../components/Account";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <Account />
    </ProtectedRoute>
  );
}
