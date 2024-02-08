import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer.jsx";
import Home from "./components/Home.jsx";
import OrderPopup from "./components/OrderPopup/OrderPopup.jsx";
import Login from "./components/login";
import Register from "./components/register";
import ForgotPassword from "./components/forgortpassword";
import ResetPassword from "./components/reset_password";
import TestFile from "./components/TestFile.jsx";
import UserProfile from "./components/Userprofile/Userprofile.jsx";
import AllBooks from "./components/AllBooks/AllBooks.jsx";
import "./cStyles/home.css";
// admin panle import
import Header from "./components/admin/AdminHeader.jsx";
import Sidebar from "./components/admin/AdminSidebar.jsx";
import Admin from "./components/admin/Admin.jsx";
import Books from "./components/admin/Books.jsx";
import Audiobooks from "./components/admin/Audiobooks.jsx";
import Genre from "./components/admin/Genre.jsx";
import Customer from "./components/admin/Customer.jsx";
import Inventory from "./components/admin/Inventory.jsx";
import Adddbook from "./components/admincompo/Adddbook.jsx";
import Addgenre from "./components/admincompo/Addgenre.jsx";
import Adduser from "./components/admincompo/Adduser.jsx";
import Addaudiobook from "./components/admincompo/Addaudiobook.jsx";
import Addpremiumuser from "./components/admincompo/Addpremiumuser.jsx";
import "./cStyles/admin.css";
import BookDetail from "./components/admin/BookDetail.jsx";
import AudiobookDetail from "./components/admin/AudiobookDetail.jsx";

const App = () => {
  const [orderPopup, setOrderPopup] = useState(false);
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const uData = JSON.parse(window.localStorage.getItem("user"));
  const user_role = uData?.role;
  // console.log(user_role);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  return (
    <div className="w-full h-auto bg-white dark:bg-neutral-950 dark:text-white duration-200">
      <Navbar handleOrderPopup={handleOrderPopup} />
      {user_role == "admin" && admin_href && (
        <div className="grid-container">
          <Header OpenSidebar={OpenSidebar} />
          <Sidebar
            openSidebarToggle={openSidebarToggle}
            OpenSidebar={OpenSidebar}
          />
          <Router>
            <Routes>
              {/* admin routing */}
              <Route exact path="/admin" element={<Admin />} />
              <Route path="/admin/books" element={<Books />} />
              <Route path="/admin/audiobooks" element={<Audiobooks />} />
              <Route path="/admin/genre" element={<Genre />} />
              <Route path="/admin/customer" element={<Customer />} />
              <Route path="/admin/inventory" element={<Inventory />} />
              <Route path="/admin/addbook" element={<Adddbook />} />
              <Route path="/admin/addaudio" element={<Addaudiobook />} />
              <Route path="/admin/addgenre" element={<Addgenre />} />
              <Route path="/admin/adduser" element={<Adduser />} />
              <Route path="/admin/addpreuser" element={<Addpremiumuser />} />
            </Routes>
          </Router>
        </div>
      )}
      <Router>
        <Routes>
          {/* {isLoggedIn == false ? <Loading /> : */}
          {uData && uData?.email && (
            <Route
              exact
              path="/"
              element={<Home handleOrderPopup={handleOrderPopup} />}
            />
          )}
          <Route
            path="/admin/books/book-detail/:bkname"
            element={<BookDetail />}
          />
          <Route
            path="/admin/books/audiobook-detail/:audioBkName"
            element={<AudiobookDetail />}
          />
          {uData == null && <Route exact path="/" element={<Login />} />}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgortpassword" element={<ForgotPassword />} />
          <Route
            path="/reset_password/:id/:token"
            element={<ResetPassword />}
          />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/allbooks" element={<AllBooks />} />
          <Route path="/test" element={<TestFile />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </Router>
      <Footer />
      <OrderPopup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
    </div>
  );
};

export default App;

export const admin_href =
  window.location.href == "http://localhost:5173/admin" ||
  window.location.href == "http://localhost:5173/admin/books" ||
  window.location.href == "http://localhost:5173/admin/audiobooks" ||
  window.location.href == "http://localhost:5173/admin/genre" ||
  window.location.href == "http://localhost:5173/admin/customer" ||
  window.location.href == "http://localhost:5173/admin/inventory" ||
  window.location.href == "http://localhost:5173/admin/addbook" ||
  window.location.href == "http://localhost:5173/admin/addaudio" ||
  window.location.href == "http://localhost:5173/admin/addgenre" ||
  window.location.href == "http://localhost:5173/admin/adduser" ||
  window.location.href == "http://localhost:5173/admin/addpreuser" ||
  window.location.href ==
    "http://localhost:5173/admin/books/book-detail/:bkname" ||
  window.location.href ==
    "http://localhost:5173/admin/books/audiobook-detail/:audioBkName";
