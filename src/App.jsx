import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./components/layout/Footer.jsx";
import Header from "./components/layout/Header.jsx";
import "./index.css"; 
import WhatsAppButton from "./components/whatsapp/WhatsAppButton.jsx";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      {loading ? (
        <div className="preloader min-h-screen flex items-center justify-center bg-customDarkBlue relative">
          <div className="ring"></div>
          <img src="/assets/favicon.png" alt="Loading Logo" className="logo-loader h-40 w-40 absolute" />
        </div>
      ) : (
        <>
          <Header />
          <Outlet />
          {/* <WhatsAppButton
        phoneNumber="13327774177"
        message="Hi! I need assistance."
      /> */}
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
