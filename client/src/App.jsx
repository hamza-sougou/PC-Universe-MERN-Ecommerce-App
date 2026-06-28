import { Outlet, useLocation } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const location = useLocation();
  const hideNavPaths = ["/login", "/register"];
  const showNav = !hideNavPaths.includes(location.pathname);

  return (
    <>
      <ToastContainer />
      {showNav && <Navigation />}
      <main className="py-3">
        <Outlet />
      </main>
    </>
  );
}

export default App;
