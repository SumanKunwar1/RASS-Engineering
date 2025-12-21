import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminProvider } from "@/contexts/AdminContext";

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetails';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import RequestQuote from './pages/RequestQuote';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from "./pages/NotFound";

// Admin imports
import AdminLayout from "@/components/admin/AdminLayout";
import {
  AdminDashboard,
  AdminHomePage,
  AdminAbout,
  AdminServices,
  AdminProjects,
  AdminBlog,
  AdminLogin,
  AdminContact,
  AdminSubmissions,
  AdminSettings,
} from "@/pages/admin";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <AdminProvider>
            <Toaster />
            <Sonner position="top-right" richColors />
            <BrowserRouter>
              <Routes>
                {/* Public Routes with Navbar and Footer */}
                <Route path="/" element={
                  <>
                    <Navbar />
                    <Home />
                    <Footer />
                  </>
                } />
                <Route path="/about" element={
                  <>
                    <Navbar />
                    <About />
                    <Footer />
                  </>
                } />
                <Route path="/services" element={
                  <>
                    <Navbar />
                    <Services />
                    <Footer />
                  </>
                } />
                <Route path="/projects" element={
                  <>
                    <Navbar />
                    <Projects />
                    <Footer />
                  </>
                } />
                <Route path="/projects/:id" element={
                  <>
                    <Navbar />
                    <ProjectDetail />
                    <Footer />
                  </>
                } />
                <Route path="/blog" element={
                  <>
                    <Navbar />
                    <Blog />
                    <Footer />
                  </>
                } />
                <Route path="/blog/:id" element={
                  <>
                    <Navbar />
                    <BlogDetail />
                    <Footer />
                  </>
                } />
                <Route path="/contact" element={
                  <>
                    <Navbar />
                    <Contact />
                    <Footer />
                  </>
                } />
                <Route path="/request-quote" element={
                  <>
                    <Navbar />
                    <RequestQuote />
                    <Footer />
                  </>
                } />
                <Route path="/privacy" element={
                  <>
                    <Navbar />
                    <Privacy />
                    <Footer />
                  </>
                } />
                <Route path="/terms" element={
                  <>
                    <Navbar />
                    <Terms />
                    <Footer />
                  </>
                } />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Admin Routes (without Navbar and Footer) */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="home" element={<AdminHomePage />} />
                  <Route path="about" element={<AdminAbout />} />
                  <Route path="services" element={<AdminServices />} />
                  <Route path="projects" element={<AdminProjects />} />
                  <Route path="blog" element={<AdminBlog />} />
                  <Route path="contact" element={<AdminContact />} />
                  <Route path="submissions" element={<AdminSubmissions />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* 404 Not Found - Catch all routes */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AdminProvider>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;