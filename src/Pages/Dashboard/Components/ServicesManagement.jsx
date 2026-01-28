import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
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
import ConfirmDialog from "../../../components/ConfirmDialog";
import useServicesAPI from "../../../hooks/useServicesAPI";
import { useToast } from "../../../Context/ToastContext";

const ServicesManagement = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // Use the services API hook
  const {
    services,
    loading: isLoading,
    error: servicesError,
    createService,
    updateService,
    deleteService,
    refetchServices,
    clearError
  } = useServicesAPI();

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
      service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || service.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalEntries = filteredServices.length;
  const entriesPerPage = 5;
  const startEntry =
    totalEntries > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0;
  const endEntry = Math.min(currentPage * entriesPerPage, totalEntries);

  // Clear API errors when component mounts
  useEffect(() => {
    if (servicesError) {
      clearError();
    }
  }, [servicesError, clearError]);

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleAction = async (action, serviceId, service = null) => {
    switch (action) {
      case "add":
        setEditingService(null);
        setIsAddModalOpen(true);
        break;
      case "edit":
        setEditingService(service);
        setIsAddModalOpen(true);
        break;
      case "delete":
        setServiceToDelete({
          id: serviceId,
          name: service?.name || "this service",
        });
        setDeleteConfirmOpen(true);
        break;
      case "view":
        // Navigate to service detail page using slug or service name
        if (!service) {
          error("Unable to view service details. Service data not found.");
          return;
        }

        let slug = service.slug;

        // If no slug exists, generate one from the service name
        if (!slug && service.name) {
          slug = service.name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
            .replace(/\s+/g, "-") // Replace spaces with hyphens
            .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
            .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
            .trim();
        }

        if (slug && slug.length > 0) {
          navigate(`/services/${slug}`);
        } else {
          error(
            `Unable to view service details. Could not generate slug from service name: "${service.name || "Unknown"}"`,
          );
        }
        break;
      default:
        console.log(`Unknown action: ${action}`);
        break;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;

    try {
      await deleteService(serviceToDelete.id);
      success(`Service "${serviceToDelete.name}" deleted successfully!`);
    } catch (err) {
      console.error("Delete failed", err);
      error("Failed to delete service. Please try again.");
    } finally {
      setDeleteConfirmOpen(false);
      setServiceToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setServiceToDelete(null);
  };

  const handleAddService = async (serviceData) => {
    // Validate required fields on frontend
    if (!serviceData.title?.trim()) {
      error("Service title is required");
      throw new Error("Service title is required");
    }

    if (!serviceData.shortDescription?.trim()) {
      error("Service description is required");
      throw new Error("Service description is required");
    }

    // Validate field lengths
    if (serviceData.title.length < 3 || serviceData.title.length > 200) {
      error("Service title must be between 3 and 200 characters");
      throw new Error("Service title must be between 3 and 200 characters");
    }

    if (serviceData.shortDescription.length < 10 || serviceData.shortDescription.length > 2000) {
      error("Service description must be between 10 and 2000 characters");
      throw new Error("Service description must be between 10 and 2000 characters");
    }

    try {
      if (editingService) {
        // Update existing service
        const updatedService = {
          name: serviceData.title,
          description:
            serviceData.shortDescription?.length > 50
              ? serviceData.shortDescription.substring(0, 50) + "..."
              : serviceData.shortDescription,
          icon: serviceData.selectedIcon,
          iconBg: "bg-blue-100 dark:bg-blue-900/30",
          iconColor: "text-blue-600 dark:text-blue-400",
          features: serviceData.features?.length || 0,
          status: serviceData.isActive ? "Active" : "Inactive",
          featured: serviceData.isFeatured ? "Yes" : "No",
          created: editingService.created, // Keep original creation date
          // Include additional fields from the form
          slug: serviceData.slug,
          shortDescription: serviceData.shortDescription,
          detailedDescription: serviceData.detailedDescription,
          displayOrder: serviceData.displayOrder || 0,
        };

        console.log("🔄 Attempting to update service:", editingService._id);
        console.log("📝 Update data:", updatedService);

        try {
          await updateService(editingService._id, updatedService);
          setIsAddModalOpen(false);
          setEditingService(null);
          success("Service updated successfully!");
        } catch (updateError) {
          console.error(
            "❌ PUT request failed:",
            updateError.response?.status,
            updateError.response?.data,
          );

          if (updateError.response?.status === 404) {
            error(
              "Update endpoint not available. The server needs to be updated with the latest code. For now, you can delete and recreate the service.",
            );
          } else if (updateError.response?.status === 400) {
            const errorMessage = updateError.response?.data?.error || "Invalid service data";
            error(`Validation error: ${errorMessage}`);
          } else {
            throw updateError; // Re-throw other errors to be handled below
          }
        }
      } else {
        // Create new service
        const newService = {
          name: serviceData.title,
          description:
            serviceData.shortDescription?.length > 50
              ? serviceData.shortDescription.substring(0, 50) + "..."
              : serviceData.shortDescription,
          icon: serviceData.selectedIcon,
          iconBg: "bg-blue-100 dark:bg-blue-900/30",
          iconColor: "text-blue-600 dark:text-blue-400",
          features: serviceData.features?.length || 0,
          status: serviceData.isActive ? "Active" : "Inactive",
          featured: serviceData.isFeatured ? "Yes" : "No",
          created: new Date().toLocaleDateString("en-GB"),
          // Include additional fields from the form
          slug: serviceData.slug,
          shortDescription: serviceData.shortDescription,
          detailedDescription: serviceData.detailedDescription,
          displayOrder: serviceData.displayOrder || 0,
        };

        console.log("📝 Creating new service:", newService);
        await createService(newService);
        setIsAddModalOpen(false);
        success("Service created successfully!");
      }
    } catch (err) {
      console.error(editingService ? "Update failed" : "Add failed", err);

      // More specific error messages
      if (err.response?.status === 400) {
        const errorMessage = err.response?.data?.error || "Invalid service data. Please check all required fields.";
        error(`Validation error: ${errorMessage}`);
      } else if (err.response?.status === 404 && editingService) {
        // This error is already handled above for updates
        return;
      } else if (err.response?.status === 500) {
        error("Server error. Please configure backend environment variables.");
      } else if (err.message && err.message.includes("required")) {
        // Handle frontend validation errors
        return; // Error already shown above
      } else {
        error(
          `Failed to ${editingService ? "update" : "create"} service. Please try again.`,
        );
      }

      throw err; // Re-throw to let the modal handle the error state
    }
  };

  if (isLoading) return <div className="p-10 text-center">Loading......</div>;

  // Show error if services failed to load
  if (servicesError) {
    return (
      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Failed to Load Services
          </h2>
          <p className="text-red-600 dark:text-red-300 mb-4">
            {servicesError || "Unable to connect to the server. Please check your connection."}
          </p>
          <button
            onClick={() => refetchServices()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
              {filteredServices.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    {services.length === 0
                      ? "No services found. Create your first service!"
                      : "No services match your search criteria."}
                  </td>
                </tr>
              ) : (
                filteredServices
                  .slice(
                    (currentPage - 1) * entriesPerPage,
                    currentPage * entriesPerPage,
                  )
                  .map((service) => {
                    const IconComponent = getIconComponent(service.icon);
                    return (
                      <tr
                        key={service._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-start gap-4">
                            <div
                              className={`h-10 w-10 rounded-lg ${service.iconBg || "bg-blue-100 dark:bg-blue-900/30"} flex items-center justify-center flex-shrink-0 ${service.iconColor || "text-blue-600 dark:text-blue-400"}`}
                            >
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {service.name || "Untitled Service"}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[240px]">
                                {service.description ||
                                  "No description available"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                            {service.features || 0} features
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                              service.status,
                            )}`}
                          >
                            {service.status || "Active"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${getFeaturedBadge(
                              service.featured,
                            )}`}
                          >
                            {service.featured || "No"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {service.created || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() =>
                                handleAction("view", service._id, service)
                              }
                              className="text-blue-500 hover:text-blue-700 p-1 transition-colors"
                              title="View service"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() =>
                                handleAction("edit", service._id, service)
                              }
                              className="text-amber-500 hover:text-amber-700 p-1 transition-colors"
                              title="Edit service"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() =>
                                handleAction("delete", service._id, service)
                              }
                              className="text-red-500 hover:text-red-700 p-1 transition-colors"
                              title="Delete service"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
              )}
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
              className="flex items-center gap-1 px-3 py-1 text-sm border rounded bg-white dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={endEntry >= totalEntries}
              className="flex items-center gap-1 px-3 py-1 text-sm border rounded bg-white dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingService(null);
        }}
        onSubmit={handleAddService}
        service={editingService}
      />

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Service"
        message={`Are you sure you want to delete "${serviceToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default ServicesManagement;
