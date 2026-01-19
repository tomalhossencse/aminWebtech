import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";

const AddServiceModal = ({ isOpen, onClose, onSubmit }) => {
  // Mock implementation without backend
  const createServiceMutation = {
    mutateAsync: async (data) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Service created:", data);
      return data;
    },
    isPending: false
  };
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
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

  const serviceIcons = [
    { icon: "code", label: "Code" },
    { icon: "brush", label: "Design" },
    { icon: "shopping_cart", label: "E-commerce" },
    { icon: "language", label: "Web" },
    { icon: "smartphone", label: "Mobile" },
    { icon: "cloud", label: "Cloud" },
    { icon: "security", label: "Security" },
    { icon: "analytics", label: "Analytics" },
    { icon: "view_in_ar", label: "3D" },
    { icon: "dns", label: "Server" },
    { icon: "psychology", label: "AI / ML" },
    { icon: "build", label: "Maintenance" },
    { icon: "campaign", label: "Digital Marketing" },
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
    try {
      console.log("Service Data:", data);

      // Use the mutation to create service
      await createServiceMutation.mutateAsync(data);

      // Call the onSubmit prop if provided
      if (onSubmit) {
        onSubmit(data);
      }

      // Reset form and close modal on success
      reset();
      onClose();
    } catch (error) {
      console.error("Error creating service:", error);
      // You can add toast notification here
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

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

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Add New Service</h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title *</span>
              </label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                className="input input-bordered"
                placeholder="Web Development"
              />
              {errors.title && (
                <span className="text-error text-sm">{errors.title.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Slug *</span>
              </label>
              <input
                type="text"
                {...register("slug", { required: "Slug is required" })}
                className="input input-bordered"
                placeholder="web-development"
              />
              {errors.slug && (
                <span className="text-error text-sm">{errors.slug.message}</span>
              )}
            </div>
          </div>

          {/* Icon Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Service Icon *</span>
            </label>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {serviceIcons.map((item) => (
                <button
                  key={item.icon}
                  type="button"
                  onClick={() => setValue("selectedIcon", item.icon)}
                  className={`btn btn-outline aspect-square p-2 flex-col ${
                    selectedIcon === item.icon ? "btn-primary" : ""
                  }`}
                >
                  <span className="material-icons text-lg">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
            <input type="hidden" {...register("selectedIcon")} />
          </div>

          {/* Descriptions */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Short Description *</span>
            </label>
            <textarea
              {...register("shortDescription", { required: "Short description is required" })}
              className="textarea textarea-bordered h-24"
              placeholder="Brief description of the service"
            />
            {errors.shortDescription && (
              <span className="text-error text-sm">{errors.shortDescription.message}</span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Detailed Description</span>
            </label>
            <textarea
              {...register("detailedDescription")}
              className="textarea textarea-bordered h-32"
              placeholder="Detailed description of the service"
            />
          </div>

          {/* Features */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Features</span>
            </label>
            
            {/* Add Feature Form */}
            <div className="card bg-base-200 p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                <input
                  type="text"
                  name="title"
                  value={newFeature.title}
                  onChange={handleFeatureChange}
                  className="input input-bordered input-sm"
                  placeholder="Feature title"
                />
                <input
                  type="text"
                  name="description"
                  value={newFeature.description}
                  onChange={handleFeatureChange}
                  className="input input-bordered input-sm"
                  placeholder="Feature description"
                />
                <input
                  type="text"
                  name="iconClass"
                  value={newFeature.iconClass}
                  onChange={handleFeatureChange}
                  className="input input-bordered input-sm"
                  placeholder="Icon class (optional)"
                />
              </div>
              <button
                type="button"
                onClick={addFeature}
                className="btn btn-primary btn-sm"
              >
                Add Feature
              </button>
            </div>

            {/* Features List */}
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="card bg-base-100 border p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="material-icons text-sm text-primary">
                          {field.iconClass || "check"}
                        </span>
                        <h5 className="font-medium">{field.title}</h5>
                      </div>
                      {field.description && (
                        <p className="text-sm text-base-content/70 mt-1">
                          {field.description}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="btn btn-sm btn-circle btn-ghost text-error"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Display Order</span>
              </label>
              <input
                type="number"
                {...register("displayOrder")}
                className="input input-bordered"
                placeholder="0"
              />
            </div>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Featured</span>
                <input
                  type="checkbox"
                  {...register("isFeatured")}
                  className="checkbox checkbox-primary"
                />
              </label>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Active</span>
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="checkbox checkbox-primary"
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createServiceMutation.isPending}
              className="btn btn-primary"
            >
              {createServiceMutation.isPending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Create Service"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;