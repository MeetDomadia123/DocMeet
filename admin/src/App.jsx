import React, { useContext } from "react";
import Login from "./pages/Login.jsx";
import { ToastContainer } from "react-toastify";
import { AdminContext } from "./context/AdminContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import AllApointment from "./pages/Admin/AllApointment.jsx";
import AddDoctor from "./pages/Admin/AddDoctor.jsx";
import DoctorsList from "./pages/Admin/DoctorsList.jsx";

const App = () => {
  const { atoken } = useContext(AdminContext);

  return atoken ? (
    <div className="bg-[#F8F9FD] ">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard></Dashboard>} />
          <Route path="/all-appointments" element={<AllApointment></AllApointment>} />
          <Route path="/add-doctor" element={<AddDoctor></AddDoctor>} />
          <Route path="/doctor-list" element={<DoctorsList></DoctorsList>} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
