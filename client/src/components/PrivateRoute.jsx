import { useSelector } from "react-redux/es/hooks/useSelector";
import { Outlet, Navigate } from "react-router-dom";

// Outlet is used to show the sub-route present in the current ( here - profile page)
// useNavigate is a react hook where as Navigate is component.

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}
