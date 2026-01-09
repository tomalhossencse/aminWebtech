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

  const [editingFeature, setEditingFeature] = useState(null);
  const [editFeatureData, setEditFeatureData] = useState({
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

  const startEditFeature = (index, feature) => {
    console.log('✏️ Starting to edit feature at index:', index);
    console.log('📝 Feature data:', feature);
    setEditingFeature(index);
    setEditFeatureData({
      title: feature.title,
      description: feature.description,
      iconClass: feature.iconClass
    });
  };

  const handleEditFeatureChange = (e) => {
    const { name, value } = e.target;
    console.log('📝 Edit feature input changed:', { field: name, value: value });
    
    setEditFeatureData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };
      console.log('🔄 Updated editFeatureData:', updated);
      return updated;
    });
  };

  const saveEditFeature = () => {
    console.log('💾 Saving edited feature at index:', editingFeature);
    console.log('📝 Updated feature data:', editFeatureData);
    
    if (editFeatureData.title.trim()) {
      const updatedFeature = {
        title: editFeatureData.title,
        description: editFeatureData.description,
        iconClass: editFeatureData.iconClass || 'check'
      };
      
      // Update the feature using react-hook-form's update method
      const currentFields = [...fields];
      currentFields[editingFeature] = updatedFeature;
      
      // Remove all fields and re-add them with updates
      for (let i = fields.length - 1; i >= 0; i--) {
        remove(i);
      }
      
      currentFields.forEach(field => append(field));
      
      console.log('✅ Feature updated successfully!');
      cancelEditFeature();
    } else {
      console.log('❌ Cannot save feature - title is empty');
    }
  };

  const cancelEditFeature = () => {
    console.log('❌ Cancelling feature edit');
    setEditingFeature(null);
    setEditFeatureData({ title: "", description: "", iconClass: "" });
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

  return (
    <>
      {/* Professional Modal with Backdrop Blur */}
      <div
        className={`modal ${isOpen ? "modal-open" : ""}`}
        style={{ zIndex: 1000 }}
      >
        <div className="modal-box w-full sm:w-11/12 md:w-10/12 lg:w-8/12 max-w-3xl h-[95vh] max-h-[95vh] p-0 overflow-hidden rounded-lg shadow-2xl border border-base-300/50 backdrop-blur-sm mx-2 sm:mx-4">
          {/* Scrollable Content Container */}
          <div
            className="overflow-y-auto h-full scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>

            {/* Professional Header with Gradient */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-base-300/50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 backdrop-blur-sm">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="material-icons text-primary text-xl sm:text-2xl">
                    add_business
                  </span>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-base-content">
                    Add New Service
                  </h3>
                  <p className="text-xs sm:text-sm text-base-content/60 mt-1">
                    Create a new service offering for your business
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="btn btn-sm btn-circle btn-ghost hover:bg-error/10 hover:text-error transition-all duration-200 text-base-content/70 self-end sm:self-auto"
              >
                <span className="material-icons text-lg sm:text-xl">close</span>
              </button>
            </div>

            {/* Professional Form Content */}
            <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-base-100 to-base-200/30">
              <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6 sm:space-y-8">
                {/* Basic Information Section */}
                <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                  <div className="card-body p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-info/20 rounded-lg flex items-center justify-center">
                        <span className="material-icons text-info text-sm sm:text-lg">
                          info
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold text-base-content">
                        Basic Information
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base-content flex items-center gap-2">
                            <span className="material-icons text-sm text-primary">
                              title
                            </span>
                            Title <span className="text-error">*</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          {...register("title", {
                            required: "Title is required",
                            minLength: {
                              value: 2,
                              message: "Title must be at least 2 characters",
                            },
                          })}
                          className={`input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200 ${
                            errors.title ? "input-error" : ""
                          }`}
                          placeholder="Enter service title"
                        />
                        {errors.title && (
                          <label className="label">
                            <span className="label-text-alt text-error flex items-center gap-1">
                              <span className="material-icons text-xs">
                                error
                              </span>
                              {errors.title.message}
                            </span>
                          </label>
                        )}
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base-content flex items-center gap-2">
                            <span className="material-icons text-sm text-primary">
                              link
                            </span>
                            Slug <span className="text-error">*</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          {...register("slug", {
                            required: "Slug is required",
                            pattern: {
                              value: /^[a-z0-9-]+$/,
                              message:
                                "Slug can only contain lowercase letters, numbers, and hyphens",
                            },
                          })}
                          className={`input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200 ${
                            errors.slug ? "input-error" : ""
                          }`}
                          placeholder="web-development"
                        />
                        {errors.slug && (
                          <label className="label">
                            <span className="label-text-alt text-error flex items-center gap-1">
                              <span className="material-icons text-xs">
                                error
                              </span>
                              {errors.slug.message}
                            </span>
                          </label>
                        )}
                        <label className="label">
                          <span className="label-text-alt text-base-content/60 flex items-center gap-1">
                            <span className="material-icons text-xs">
                              auto_awesome
                            </span>
                            Auto-generated from title if left empty
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Icon & Display Order Section */}
                <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                  <div className="card-body p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                        <span className="material-icons text-warning text-lg">
                          palette
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-base-content">
                        Visual & Display Settings
                      </h4>
                    </div>

                    <div className="space-y-6">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base-content flex items-center gap-2">
                            <span className="material-icons text-sm text-primary">
                              category
                            </span>
                            Service Icon <span className="text-error">*</span>
                          </span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
                          {serviceIcons.map((item) => (
                            <button
                              key={item.icon}
                              type="button"
                              onClick={() =>
                                setValue("selectedIcon", item.icon)
                              }
                              className={`btn btn-outline aspect-square h-auto p-1 sm:p-2 flex-col justify-center items-center transition-all duration-200 hover:scale-105 min-h-[60px] sm:min-h-[80px] ${
                                selectedIcon === item.icon
                                  ? "btn-primary shadow-lg scale-105"
                                  : "hover:btn-primary hover:shadow-md"
                              }`}
                            >
                              <span className="material-icons-outlined text-lg sm:text-xl mb-1 flex-shrink-0">
                                {item.icon}
                              </span>
                              <span className="text-xs font-medium leading-tight text-center break-words overflow-hidden line-clamp-2 max-w-full">
                                {item.label}
                              </span>
                            </button>
                          ))}
                        </div>
                        <input type="hidden" {...register("selectedIcon")} />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base-content flex items-center gap-2">
                            <span className="material-icons text-sm text-primary">
                              sort
                            </span>
                            Display Order
                          </span>
                        </label>
                        <input
                          type="number"
                          {...register("displayOrder", {
                            valueAsNumber: true,
                            min: {
                              value: 0,
                              message: "Display order must be 0 or greater",
                            },
                          })}
                          className={`input input-bordered w-full max-w-xs text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200 ${
                            errors.displayOrder ? "input-error" : ""
                          }`}
                          placeholder="0"
                        />
                        {errors.displayOrder && (
                          <label className="label">
                            <span className="label-text-alt text-error flex items-center gap-1">
                              <span className="material-icons text-xs">
                                error
                              </span>
                              {errors.displayOrder.message}
                            </span>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                  <div className="card-body p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                        <span className="material-icons text-success text-lg">
                          description
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-base-content">
                        Service Description
                      </h4>
                    </div>

                    <div className="space-y-6">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base-content flex items-center gap-2">
                            <span className="material-icons text-sm text-primary">
                              short_text
                            </span>
                            Short Description{" "}
                            <span className="text-error">*</span>
                          </span>
                        </label>
                        <textarea
                          {...register("shortDescription", {
                            required: "Short description is required",
                            minLength: {
                              value: 10,
                              message:
                                "Short description must be at least 10 characters",
                            },
                            maxLength: {
                              value: 200,
                              message:
                                "Short description must be less than 200 characters",
                            },
                          })}
                          className={`textarea textarea-bordered h-24 resize-none text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200 ${
                            errors.shortDescription ? "textarea-error" : ""
                          }`}
                          placeholder="Brief description of the service"
                        />
                        {errors.shortDescription && (
                          <label className="label">
                            <span className="label-text-alt text-error flex items-center gap-1">
                              <span className="material-icons text-xs">
                                error
                              </span>
                              {errors.shortDescription.message}
                            </span>
                          </label>
                        )}
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base-content flex items-center gap-2">
                            <span className="material-icons text-sm text-primary">
                              article
                            </span>
                            Detailed Description
                          </span>
                        </label>
                        <textarea
                          {...register("detailedDescription", {
                            maxLength: {
                              value: 1000,
                              message:
                                "Detailed description must be less than 1000 characters",
                            },
                          })}
                          className={`textarea textarea-bordered h-32 resize-none text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200 ${
                            errors.detailedDescription ? "textarea-error" : ""
                          }`}
                          placeholder="Write full service description here..."
                        />
                        {errors.detailedDescription && (
                          <label className="label">
                            <span className="label-text-alt text-error flex items-center gap-1">
                              <span className="material-icons text-xs">
                                error
                              </span>
                              {errors.detailedDescription.message}
                            </span>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Features Section */}
                <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                  <div className="card-body p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                          <span className="material-icons text-accent text-lg">
                            star
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold text-base-content">
                          Service Features
                        </h4>
                      </div>
                      <div className="badge badge-primary badge-lg">
                        {fields.length} features
                      </div>
                    </div>

                    {/* Existing Features */}
                    {fields.length > 0 && (
                      <div className="space-y-4 mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="text-sm font-medium text-base-content/70 uppercase tracking-wide">Added Features</h5>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                            <span className="text-xs text-success font-medium">{fields.length} Active</span>
                          </div>
                        </div>
                        
                        {fields.map((field, index) => (
                          <div 
                            key={field.id} 
                            className="group card bg-gradient-to-r from-base-100 via-base-50 to-base-100 border border-base-300/50 shadow-md hover:shadow-xl transition-all duration-300 rounded-lg hover:scale-[1.02] animate-fade-in-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            {editingFeature === index ? (
                              // Edit Form
                              <div className="card-body p-5">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                                    <span className="material-icons text-warning text-lg">edit</span>
                                  </div>
                                  <h6 className="font-semibold text-warning">Edit Feature</h6>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div className="form-control">
                                    <label className="label">
                                      <span className="label-text font-medium text-base-content">Title *</span>
                                    </label>
                                    <input
                                      type="text"
                                      name="title"
                                      value={editFeatureData.title}
                                      onChange={handleEditFeatureChange}
                                      className="input input-bordered input-sm bg-base-100 focus:bg-base-100 focus:border-primary text-base-content transition-all duration-200"
                                      placeholder="Feature title"
                                    />
                                  </div>
                                  
                                  <div className="form-control">
                                    <label className="label">
                                      <span className="label-text font-medium text-base-content">Icon Class</span>
                                    </label>
                                    <input
                                      type="text"
                                      name="iconClass"
                                      value={editFeatureData.iconClass}
                                      onChange={handleEditFeatureChange}
                                      className="input input-bordered input-sm bg-base-100 focus:bg-base-100 focus:border-primary text-base-content transition-all duration-200"
                                      placeholder="check"
                                    />
                                  </div>
                                  
                                  <div className="form-control md:col-span-2">
                                    <label className="label">
                                      <span className="label-text font-medium text-base-content">Description</span>
                                    </label>
                                    <input
                                      type="text"
                                      name="description"
                                      value={editFeatureData.description}
                                      onChange={handleEditFeatureChange}
                                      className="input input-bordered input-sm bg-base-100 focus:bg-base-100 focus:border-primary text-base-content transition-all duration-200"
                                      placeholder="Feature description"
                                    />
                                  </div>
                                </div>
                                
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={cancelEditFeature}
                                    className="btn btn-sm btn-ghost"
                                  >
                                    <span className="material-icons text-sm mr-1">close</span>
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={saveEditFeature}
                                    disabled={!editFeatureData.title.trim()}
                                    className="btn btn-sm btn-success"
                                  >
                                    <span className="material-icons text-sm mr-1">save</span>
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              // Display Mode
                              <div className="card-body p-5 flex-row items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                  {/* Enhanced Icon Container */}
                                  <div className="relative">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                      <span className="material-icons text-primary text-xl group-hover:rotate-12 transition-transform duration-300">
                                        {field.iconClass || 'check'}
                                      </span>
                                    </div>
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                  </div>
                                  
                                  {/* Enhanced Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                      <h6 className="font-semibold text-base-content text-lg group-hover:text-primary transition-colors duration-300">
                                        {field.title}
                                      </h6>
                                      <div className="badge badge-primary badge-sm">
                                        Feature
                                      </div>
                                    </div>
                                    {field.description && (
                                      <p className="text-sm text-base-content/70 leading-relaxed group-hover:text-base-content/90 transition-colors duration-300 mb-2">
                                        {field.description}
                                      </p>
                                    )}
                                    
                                    {/* Feature metadata - Always visible */}
                                    <div className="flex items-center gap-4 mt-2">
                                      <div className="flex items-center gap-1 text-xs text-base-content/60">
                                        <span className="material-icons text-xs">schedule</span>
                                        <span>Added just now</span>
                                      </div>
                                      <div className="flex items-center gap-1 text-xs text-success">
                                        <span className="material-icons text-xs">check_circle</span>
                                        <span>Active</span>
                                      </div>
                                      <div className="flex items-center gap-1 text-xs text-info">
                                        <span className="material-icons text-xs">tag</span>
                                        <span>{index + 1}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Action Buttons - Always visible */}
                                <div className="flex items-center gap-2">
                                  <div className="tooltip tooltip-left" data-tip="Edit feature">
                                    <button
                                      type="button"
                                      onClick={() => startEditFeature(index, field)}
                                      className="btn btn-sm btn-circle btn-ghost text-warning hover:bg-warning/10 hover:scale-110 transition-all duration-300 shadow-sm"
                                    >
                                      <span className="material-icons text-lg">edit</span>
                                    </button>
                                  </div>
                                  
                                  <div className="tooltip tooltip-left" data-tip="Remove feature">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        console.log('🗑️ Removing feature at index:', index);
                                        console.log('🗑️ Feature being removed:', field);
                                        console.log('📊 Features array length before removal:', fields.length);
                                        remove(index);
                                        console.log('✅ Feature removed successfully!');
                                      }}
                                      className="btn btn-sm btn-circle btn-ghost text-error hover:bg-error/10 hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-sm"
                                    >
                                      <span className="material-icons text-lg">delete_outline</span>
                                    </button>
                                  </div>
                                  
                                  {/* Feature number indicator */}
                                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 border border-primary/20">
                                    <span className="text-xs font-bold text-primary">
                                      {index + 1}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Progress bar at bottom - Always visible with subtle opacity */}
                            <div className="h-1 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 group-hover:from-primary/20 group-hover:via-primary/40 group-hover:to-primary/20 transition-all duration-300"></div>
                          </div>
                        ))}
                        
                        {/* Features Summary */}
                        <div className="mt-6 p-4 bg-gradient-to-r from-success/5 to-primary/5 rounded-lg border border-success/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                                <span className="material-icons text-success text-lg">verified</span>
                              </div>
                              <div>
                                <p className="font-medium text-base-content">Features Summary</p>
                                <p className="text-sm text-base-content/70">
                                  {fields.length} feature{fields.length !== 1 ? 's' : ''} configured for this service
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-success">{fields.length}</div>
                              <div className="text-xs text-base-content/60 uppercase tracking-wide">Total</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Add New Feature */}
                    <div className="card bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/30 shadow-md rounded-lg">
                      <div className="card-body p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-8 h-8 bg-primary/30 rounded-lg flex items-center justify-center">
                            <span className="material-icons text-primary text-lg">
                              add_circle
                            </span>
                          </div>
                          <h5 className="font-semibold text-primary text-lg">
                            Add New Feature
                          </h5>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-medium text-base-content flex items-center gap-2">
                                <span className="material-icons text-xs text-primary">
                                  title
                                </span>
                                Title <span className="text-error">*</span>
                              </span>
                            </label>
                            <input
                              type="text"
                              name="title"
                              value={newFeature.title}
                              onChange={handleFeatureChange}
                              className="input input-bordered input-sm bg-base-100 focus:bg-base-100 focus:border-primary text-base-content transition-all duration-200"
                              placeholder="Feature title"
                            />
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-medium text-base-content flex items-center gap-2">
                                <span className="material-icons text-xs text-primary">
                                  category
                                </span>
                                Icon Class
                              </span>
                            </label>
                            <input
                              type="text"
                              name="iconClass"
                              value={newFeature.iconClass}
                              onChange={handleFeatureChange}
                              className="input input-bordered input-sm bg-base-100 focus:bg-base-100 focus:border-primary text-base-content transition-all duration-200"
                              placeholder="check"
                            />
                          </div>

                          <div className="form-control md:col-span-2">
                            <label className="label">
                              <span className="label-text font-medium text-base-content flex items-center gap-2">
                                <span className="material-icons text-xs text-primary">
                                  description
                                </span>
                                Description
                              </span>
                            </label>
                            <input
                              type="text"
                              name="description"
                              value={newFeature.description}
                              onChange={handleFeatureChange}
                              className="input input-bordered input-sm bg-base-100 focus:bg-base-100 focus:border-primary text-base-content transition-all duration-200"
                              placeholder="Feature description"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={addFeature}
                          disabled={!newFeature.title.trim()}
                          className="btn btn-primary btn-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="material-icons text-sm mr-2">
                            add
                          </span>
                          Add Feature
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SEO & Meta Section */}
                <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                  <div className="card-body p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                        <span className="material-icons text-secondary text-lg">
                          search
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-base-content">
                        SEO & Meta Information
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base-content flex items-center gap-2">
                            <span className="material-icons text-sm text-primary">
                              title
                            </span>
                            Meta Title
                          </span>
                        </label>
                        <input
                          type="text"
                          {...register("metaTitle", {
                            maxLength: {
                              value: 60,
                              message:
                                "Meta title should be less than 60 characters",
                            },
                          })}
                          className={`input input-bordered text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200 ${
                            errors.metaTitle ? "input-error" : ""
                          }`}
                          placeholder="SEO meta title"
                        />
                        {errors.metaTitle && (
                          <label className="label">
                            <span className="label-text-alt text-error flex items-center gap-1">
                              <span className="material-icons text-xs">
                                error
                              </span>
                              {errors.metaTitle.message}
                            </span>
                          </label>
                        )}
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base-content flex items-center gap-2">
                            <span className="material-icons text-sm text-primary">
                              label
                            </span>
                            Meta Keywords
                          </span>
                        </label>
                        <input
                          type="text"
                          {...register("metaKeywords")}
                          className="input input-bordered text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                          placeholder="web development, custom solutions"
                        />
                      </div>

                      <div className="form-control lg:col-span-2">
                        <label className="label">
                          <span className="label-text font-medium text-base-content flex items-center gap-2">
                            <span className="material-icons text-sm text-primary">
                              description
                            </span>
                            Meta Description
                          </span>
                        </label>
                        <textarea
                          {...register("metaDescription", {
                            maxLength: {
                              value: 160,
                              message:
                                "Meta description should be less than 160 characters",
                            },
                          })}
                          className={`textarea textarea-bordered h-20 resize-none text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200 ${
                            errors.metaDescription ? "textarea-error" : ""
                          }`}
                          placeholder="SEO meta description"
                        />
                        {errors.metaDescription && (
                          <label className="label">
                            <span className="label-text-alt text-error flex items-center gap-1">
                              <span className="material-icons text-xs">
                                error
                              </span>
                              {errors.metaDescription.message}
                            </span>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Settings Section */}
                <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                  <div className="card-body p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-neutral/20 rounded-lg flex items-center justify-center">
                        <span className="material-icons text-neutral text-lg">
                          settings
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-base-content">
                        Service Settings
                      </h4>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-8">
                      <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-4">
                          <input
                            type="checkbox"
                            {...register("isFeatured")}
                            className="checkbox checkbox-primary checkbox-lg"
                          />
                          <div className="flex items-center gap-2">
                            <span className="material-icons text-primary">
                              star
                            </span>
                            <span className="label-text font-medium text-base-content text-lg">
                              Featured Service
                            </span>
                          </div>
                        </label>
                        <p className="text-sm text-base-content/60 ml-12">
                          Display this service prominently
                        </p>
                      </div>

                      <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-4">
                          <input
                            type="checkbox"
                            {...register("isActive")}
                            className="checkbox checkbox-success checkbox-lg"
                          />
                          <div className="flex items-center gap-2">
                            <span className="material-icons text-success">
                              check_circle
                            </span>
                            <span className="label-text font-medium text-base-content text-lg">
                              Active Service
                            </span>
                          </div>
                        </label>
                        <p className="text-sm text-base-content/60 ml-12">
                          Make this service available to users
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Professional Footer with Gradient */}
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-gradient-to-r from-base-200/80 to-base-300/50 border-t border-base-300/50 flex flex-col sm:flex-row justify-between items-center gap-4 backdrop-blur-sm">
              <div className="text-xs sm:text-sm text-base-content/60 text-center sm:text-left">
                <span className="material-icons text-xs sm:text-sm mr-1">info</span>
                All fields marked with * are required
              </div>
              <div className="flex gap-3 sm:gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="btn btn-outline btn-neutral hover:btn-neutral transition-all duration-200 hover:scale-105 flex-1 sm:flex-none"
                >
                  <span className="material-icons text-sm mr-2">close</span>
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(onSubmitForm)}
                  disabled={isSubmitting || createServiceMutation.isPending}
                  className="btn btn-primary shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 flex-1 sm:flex-none"
                >
                  {(isSubmitting || createServiceMutation.isPending) && (
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                  )}
                  <span className="material-icons text-sm mr-2">
                    {(isSubmitting || createServiceMutation.isPending) ? "hourglass_empty" : "add_business"}
                  </span>
                  <span className="hidden sm:inline">
                    {(isSubmitting || createServiceMutation.isPending) ? "Creating..." : "Create Service"}
                  </span>
                  <span className="sm:hidden">
                    {(isSubmitting || createServiceMutation.isPending) ? "Creating..." : "Create"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Modal backdrop */}
        <form
          method="dialog"
          className="modal-backdrop bg-black/50 backdrop-blur-sm"
        >
          <button onClick={onClose}>close</button>
        </form>
      </div>
    </>
  );
};

export default AddServiceModal;
