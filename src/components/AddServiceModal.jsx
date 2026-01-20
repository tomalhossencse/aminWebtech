import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";

const AddServiceModal = ({ isOpen, onClose, onSubmit, service = null }) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      slug: "",
      shortDescription: "",
      detailedDescription: "",
      displayOrder: 0,
      metaTitle: "",
      metaKeywords: "",
      metaDescription: "",
      isFeatured: false,
      isActive: true,
      selectedIcon: "code",
      features: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  const [newFeature, setNewFeature] = useState({
    title: "",
    description: "",
    iconClass: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceIcons = [
    { icon: "code", label: "Code", color: "text-blue-600", bg: "bg-blue-100" },
    { icon: "brush", label: "Design", color: "text-purple-600", bg: "bg-purple-100" },
    { icon: "shopping_cart", label: "E-commerce", color: "text-green-600", bg: "bg-green-100" },
    { icon: "language", label: "Web", color: "text-indigo-600", bg: "bg-indigo-100" },
    { icon: "smartphone", label: "Mobile", color: "text-pink-600", bg: "bg-pink-100" },
    { icon: "cloud", label: "Cloud", color: "text-sky-600", bg: "bg-sky-100" },
    { icon: "security", label: "Security", color: "text-red-600", bg: "bg-red-100" },
    { icon: "analytics", label: "Analytics", color: "text-orange-600", bg: "bg-orange-100" },
    { icon: "view_in_ar", label: "3D", color: "text-teal-600", bg: "bg-teal-100" },
    { icon: "dns", label: "Server", color: "text-gray-600", bg: "bg-gray-100" },
    { icon: "psychology", label: "AI / ML", color: "text-violet-600", bg: "bg-violet-100" },
    { icon: "build", label: "Maintenance", color: "text-amber-600", bg: "bg-amber-100" },
    { icon: "campaign", label: "Marketing", color: "text-rose-600", bg: "bg-rose-100" },
  ];

  // Watch title field for auto-slug generation
  const watchTitle = watch("title");
  const watchSlug = watch("slug");
  const selectedIcon = watch("selectedIcon");

  const handleFeatureChange = (e) => {
    const { name, value } = e.target;
    setNewFeature((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addFeature = () => {
    if (newFeature.title.trim()) {
      append({
        title: newFeature.title,
        description: newFeature.description,
        iconClass: newFeature.iconClass || "check",
      });
      setNewFeature({ title: "", description: "", iconClass: "" });
    }
  };

  const onSubmitForm = async (data) => {
    // Basic validation
    if (!data.title?.trim()) {
      console.error("Title is required");
      return;
    }

    if (!data.shortDescription?.trim()) {
      console.error("Short description is required");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Service Data:", data);

      // Call the onSubmit prop if provided
      if (onSubmit) {
        await onSubmit(data);
      }

      // Reset form and close modal on success
      reset();
      onClose();
    } catch (error) {
      console.error("Error saving service:", error);
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Populate form when editing
  useEffect(() => {
    if (service && isOpen) {
      // Handle features array properly
      const serviceFeatures = Array.isArray(service.features) 
        ? service.features 
        : [];

      reset({
        title: service.name || service.title || "",
        slug: service.slug || generateSlug(service.name || service.title || ""),
        shortDescription: service.shortDescription || service.description || "",
        detailedDescription: service.detailedDescription || "",
        displayOrder: service.displayOrder || 0,
        isFeatured: service.featured === "Yes" || service.isFeatured || false,
        isActive: service.status === "Active" || service.isActive !== false,
        selectedIcon: service.icon || service.selectedIcon || "code",
        features: serviceFeatures,
      });
    }
  }, [service, isOpen, reset]);

  // Auto-generate slug when title changes
  useEffect(() => {
    if (watchTitle && !watchSlug) {
      setValue("slug", generateSlug(watchTitle));
    }
  }, [watchTitle, watchSlug, setValue]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setNewFeature({ title: "", description: "", iconClass: "" });
    }
  }, [isOpen, reset]);

  const isEditing = !!service;

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-10/12 max-w-2xl h-[95vh] overflow-y-scroll scrollbar-hide">
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="material-icons text-primary text-xl">
                {isEditing ? "edit" : "add"}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {isEditing ? "Edit Service" : "Add New Service"}
              </h3>
              <p className="text-sm text-base-content/60">
                {isEditing ? "Update service information" : "Create a new service offering"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
          {/* Basic Information Section */}
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-icons text-primary">info</span>
                <h4 className="font-semibold text-lg">Basic Information</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Service Title *</span>
                  </label>
                  <input
                    type="text"
                    {...register("title", { required: "Title is required" })}
                    className="input input-bordered focus:input-primary"
                    placeholder="e.g. Web Development"
                  />
                  {errors.title && (
                    <span className="text-error text-sm mt-1">{errors.title.message}</span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">URL Slug *</span>
                  </label>
                  <input
                    type="text"
                    {...register("slug", { required: "Slug is required" })}
                    className="input input-bordered focus:input-primary"
                    placeholder="web-development"
                  />
                  {errors.slug && (
                    <span className="text-error text-sm mt-1">{errors.slug.message}</span>
                  )}
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Short Description *</span>
                </label>
                <textarea
                  {...register("shortDescription", { required: "Short description is required" })}
                  className="textarea textarea-bordered focus:textarea-primary h-24 resize-none"
                  placeholder="Brief description of the service (used in cards and previews)"
                />
                {errors.shortDescription && (
                  <span className="text-error text-sm mt-1">{errors.shortDescription.message}</span>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Detailed Description</span>
                </label>
                <textarea
                  {...register("detailedDescription")}
                  className="textarea textarea-bordered focus:textarea-primary h-32 resize-none"
                  placeholder="Comprehensive description of the service (used on service detail pages)"
                />
              </div>
            </div>
          </div>

          {/* Icon Selection Section */}
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-icons text-primary">palette</span>
                <h4 className="font-semibold text-lg">Service Icon</h4>
              </div>
              
              <div className="grid grid-cols-4 grid-rows-3 gap-4">
                {serviceIcons.map((item) => (
                  <button
                    key={item.icon}
                    type="button"
                    onClick={() => setValue("selectedIcon", item.icon)}
                    className={`btn h-auto p-4 flex-col gap-2 transition-all duration-200 border-2 group w-full ${
                      selectedIcon === item.icon 
                        ? "btn-primary border-primary bg-primary hover:bg-primary/90" 
                        : "btn-ghost border-base-300 hover:border-primary/30 hover:bg-primary/5"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      selectedIcon === item.icon 
                        ? "bg-white/20 text-white group-hover:text-white" 
                        : `${item.bg} ${item.color} group-hover:scale-105`
                    }`}>
                      <span className="material-icons text-xl">{item.icon}</span>
                    </div>
                    <span className={`text-sm font-medium transition-colors duration-200 ${
                      selectedIcon === item.icon 
                        ? "text-white group-hover:text-white" 
                        : "text-base-content/70 group-hover:text-primary"
                    }`}>
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
              <input type="hidden" {...register("selectedIcon")} />
            </div>
          </div>

          {/* Features Section */}
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-icons text-primary">star</span>
                <h4 className="font-semibold text-lg">Key Features</h4>
              </div>
              
              {/* Add Feature Form */}
              <div className="card bg-base-200/50 border border-base-300">
                <div className="card-body p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <input
                      type="text"
                      name="title"
                      value={newFeature.title}
                      onChange={handleFeatureChange}
                      className="input input-bordered input-sm focus:input-primary"
                      placeholder="Feature title"
                    />
                    <input
                      type="text"
                      name="description"
                      value={newFeature.description}
                      onChange={handleFeatureChange}
                      className="input input-bordered input-sm focus:input-primary"
                      placeholder="Feature description"
                    />
                    <input
                      type="text"
                      name="iconClass"
                      value={newFeature.iconClass}
                      onChange={handleFeatureChange}
                      className="input input-bordered input-sm focus:input-primary"
                      placeholder="Icon (optional)"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addFeature}
                    disabled={!newFeature.title.trim()}
                    className="btn btn-primary btn-sm w-full"
                  >
                    <span className="material-icons text-sm">add</span>
                    Add Feature
                  </button>
                </div>
              </div>

              {/* Features List */}
              {fields.length > 0 && (
                <div className="space-y-2 mt-4 max-h-48 overflow-y-auto">
                  {fields.map((field, index) => (
                    <div key={field.id} className="card bg-base-50 border border-base-300">
                      <div className="card-body p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="material-icons text-sm text-primary">
                                {field.iconClass || "check_circle"}
                              </span>
                              <h5 className="font-medium text-sm">{field.title}</h5>
                            </div>
                            {field.description && (
                              <p className="text-xs text-base-content/70 mt-1 ml-6">
                                {field.description}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="btn btn-xs btn-circle btn-ghost text-error hover:bg-error/10"
                          >
                            <span className="material-icons text-sm">close</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Settings Section */}
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-icons text-primary">settings</span>
                <h4 className="font-semibold text-lg">Service Settings</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Display Order</span>
                  </label>
                  <input
                    type="number"
                    {...register("displayOrder")}
                    className="input input-bordered focus:input-primary"
                    placeholder="0"
                    min="0"
                  />
                  <label className="label">
                    <span className="label-text-alt">Lower numbers appear first</span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input
                      type="checkbox"
                      {...register("isFeatured")}
                      className="checkbox checkbox-primary"
                    />
                    <div>
                      <span className="label-text font-medium">Featured Service</span>
                      <div className="text-xs text-base-content/60">Show in featured section</div>
                    </div>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input
                      type="checkbox"
                      {...register("isActive")}
                      className="checkbox checkbox-primary"
                    />
                    <div>
                      <span className="label-text font-medium">Active Service</span>
                      <div className="text-xs text-base-content/60">Visible to users</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-base-300">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary min-w-32"
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <span className="material-icons text-sm">
                    {isEditing ? "save" : "add"}
                  </span>
                  {isEditing ? "Update Service" : "Create Service"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;