import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/auth/Home";
import Login from "./pages/auth/Login";
import { ToastContainer } from "react-toastify";
import VerifyOtp from "./pages/auth/VerifyOtp";
import Loading from "./Loading";
import { AppData } from "./context/AppContext";

function App() {
  const { isAuth, loading } = AppData();
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={isAuth ? <Home /> : <Login />} />
            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route
              path="/verifyotp"
              element={isAuth ? <Home /> : <VerifyOtp />}
            />
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
