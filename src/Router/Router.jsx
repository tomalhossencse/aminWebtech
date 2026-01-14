import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home/Home/Home";
import About from "../Pages/About/About/About";
import Services from "../Pages/Services/Services/Services";
import Projects from "../Pages/Projects/Projects/Projects";
import Blog from "../Pages/Blog/Blog/Blog";
import BlogDetailPage from "../Pages/Blog/Components/BlogDetailPage";
import Contact from "../Pages/Contact/Contact/Contact";
import Dashboard from "../Pages/Dashboard/Dashboard/Dashboard";
import DashboardHome from "../Pages/Dashboard/Components/DashboardHome";
import ServicesManagement from "../Pages/Dashboard/Components/ServicesManagement";
import AnalyticsDashboard from "../Pages/Dashboard/Components/AnalyticsDashboard";
import ProjectsManagement from "../Pages/Dashboard/Components/ProjectsManagement";
import BlogManagement from "../Pages/Dashboard/Components/BlogManagement";
import TeamManagement from "../Pages/Dashboard/Components/TeamManagement";
import TestimonialsManagement from "../Pages/Dashboard/Components/TestimonialsManagement";
import ContactsManagement from "../Pages/Dashboard/Components/ContactsManagement";
import MediaManagement from "../Pages/Dashboard/Components/MediaManagement";
import SettingsManagement from "../Pages/Dashboard/Components/SettingsManagement";
import AdminLogin from "../Pages/Auth/AdminLogin";
import AdminRoute from "../components/AdminRoute";
import NotFound from "../Pages/NotFound/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/about",
        Component: About,
      },
      {
        path: "/services",
        Component: Services,
      },
      {
        path: "/projects",
        Component: Projects,
      },
      {
        path: "/blog",
        Component: Blog,
      },
      {
        path: "/blog/:id",
        Component: BlogDetailPage,
      },
      {
        path: "/contact",
        Component: Contact,
      },
    ],
  },
  {
    path: "/admin",
    Component: AdminLogin,
  },
  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <Dashboard></Dashboard>
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: "services",
        Component: ServicesManagement,
      },
      {
        path: "analytics",
        Component: AnalyticsDashboard,
      },
      {
        path: "projects",
        Component: ProjectsManagement,
      },
      {
        path: "blog",
        Component: BlogManagement,
      },
      {
        path: "team",
        Component: TeamManagement,
      },
      {
        path: "testimonials",
        Component: TestimonialsManagement,
      },
      {
        path: "contacts",
        Component: ContactsManagement,
      },
      {
        path: "media",
        Component: MediaManagement,
      },
      {
        path: "settings",
        Component: SettingsManagement,
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
