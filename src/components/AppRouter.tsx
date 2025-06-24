
import { Routes, Route } from "react-router-dom";
import PublicRoutes from "@/components/PublicRoutes";
import ProtectedRoutes from "@/components/ProtectedRoutes";
import NotFound from "@/pages/NotFound";

const AppRouter = () => {
  return (
    <Routes>
      <PublicRoutes />
      <ProtectedRoutes />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
