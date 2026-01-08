import { useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Globe,
  Smartphone,
  Code,
  Brush,
  Megaphone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AddServiceModal from "../../../components/AddServiceModal";
import useAxios from "../../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";

const ServicesManagement = () => {
  const axiosSecure = useAxios();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
    data: services = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/services`);
      return res.data;
    },
  });

  // Helper to map string names to Lucide Components
  const getIconComponent = (iconName) => {
    const iconMap = {
      Globe: Globe,
      Smartphone: Smartphone,
      Code: Code,
      Brush: Brush,
      Megaphone: Megaphone,
      // Lowercase versions for form submission compatibility
      code: Code,
      brush: Brush,
      smartphone: Smartphone,
      campaign: Megaphone,
      language: Globe,
    };
    return iconMap[iconName] || Globe;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Active:
        "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
      Inactive: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
      Draft:
        "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
    };
    return statusConfig[status] || statusConfig["Active"];
  };

  const getFeaturedBadge = (featured) => {
    return featured === "Yes"
      ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
      : "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300";
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || service.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalEntries = filteredServices.length;
  const entriesPerPage = 5;
  const startEntry = (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, totalEntries);

  const handleAction = async (action, serviceId) => {
    switch (action) {
      case "add":
        setIsAddModalOpen(true);
        break;
      case "delete":
        if (window.confirm("Are you sure you want to delete this service?")) {
          try {
            await axiosSecure.delete(`/services/${serviceId}`);
            refetch();
          } catch (err) {
            console.error("Delete failed", err);
          }
        }
        break;
      default:
        console.log(`${action} logic for ID: ${serviceId}`);
        break;
    }
  };

  const handleAddService = async (serviceData) => {
    const newService = {
      name: serviceData.title,
      description: serviceData.shortDescription.substring(0, 50) + "...",
      icon: serviceData.selectedIcon, // Send the string to backend
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      features: serviceData.features.length,
      status: serviceData.isActive ? "Active" : "Inactive",
      featured: serviceData.isFeatured ? "Yes" : "No",
      created: new Date().toLocaleDateString("en-GB"),
    };

    try {
      await axiosSecure.post("/services", newService);
      refetch();
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Add failed", err);
    }
  };

  if (isLoading) return <div className="p-10 text-center">Loading......</div>;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Services
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your services and offerings
          </p>
        </div>
        <button
          onClick={() => handleAction("add", null)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add New Service
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search services..."
            />
          </div>
          <div className="sm:w-64">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none cursor-pointer"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Service
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Features
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Featured
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Created
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredServices.map((service) => {
                const IconComponent = getIconComponent(service.icon);
                return (
                  <tr
                    key={service.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-start gap-4">
                        <div
                          className={`h-10 w-10 rounded-lg ${service.iconBg} flex items-center justify-center flex-shrink-0 ${service.iconColor}`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {service.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[240px]">
                            {service.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                        {service.features} features
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                          service.status
                        )}`}
                      >
                        {service.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getFeaturedBadge(
                          service.featured
                        )}`}
                      >
                        {service.featured}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {service.created}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleAction("view", service.id)}
                          className="text-blue-500 hover:text-blue-700 p-1"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleAction("edit", service.id)}
                          className="text-amber-500 hover:text-amber-700 p-1"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleAction("delete", service.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing {startEntry} to {endEntry} of {totalEntries} entries
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1 text-sm border rounded bg-white dark:bg-gray-700 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={endEntry >= totalEntries}
              className="flex items-center gap-1 px-3 py-1 text-sm border rounded bg-white dark:bg-gray-700 disabled:opacity-50"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddService}
      />
    </div>
  );
};

export default ServicesManagement;
