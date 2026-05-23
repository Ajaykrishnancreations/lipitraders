import React, { useEffect } from "react";
import "./App.css";
import { LanguageProvider } from "./hooks/useLanguage";
import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import Clients from "./components/landing/Clients";
import About from "./components/landing/About";
import Services from "./components/landing/Services";
import Materials from "./components/landing/Materials";
import WhyUs from "./components/landing/WhyUs";
import Gallery from "./components/landing/Gallery";
import Contact from "./components/landing/Contact";
import Footer from "./components/landing/Footer";
import WhatsAppFab from "./components/landing/WhatsAppFab";
import LanguagePrompt from "./components/landing/LanguagePrompt";
import ChatbotFab from "./components/landing/ChatbotFab";

function App() {
  // Ensure theme attr present (pre-set by inline script in index.html for no-flash)
  useEffect(() => {
    const root = document.documentElement;
    if (!root.getAttribute("data-theme")) root.setAttribute("data-theme", "light");
  }, []);

  return (
    <LanguageProvider>
      <div className="App min-h-screen">
        <Navbar />
        <main>
          <Hero />
          <Clients />
          <About />
          <Services />
          <Materials />
          <WhyUs />
          <Gallery />
          <Contact />
        </main>
        <Footer />
        <WhatsAppFab />
        <ChatbotFab />
        <LanguagePrompt />
      </div>
    </LanguageProvider>
  );
}

export default App;
