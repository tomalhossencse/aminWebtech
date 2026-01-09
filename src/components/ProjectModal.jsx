import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";

const ProjectModal = ({ isOpen, onClose, onSubmit, project = null }) => {
  // Mock implementation without backend
  const createProjectMutation = {
    mutateAsync: async (data) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Project created:", data);
      return data;
    },
    isPending: false
  };

  const updateProjectMutation = {
    mutateAsync: async (data) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Project updated:", data);
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
      clientName: "",
      description: "",
      category: "",
      projectUrl: "",
      coverImageUrl: "",
      startDate: "",
      endDate: "",
      technologies: [],
      keyFeatures: [],
      galleryImages: [],
      displayOrder: 0,
      isFeatured: false,
      isActive: true,
      challenge: "",
      solution: "",
      result: ""
    },
  });

  const { fields: techFields, append: appendTech, remove: removeTech } = useFieldArray({
    control,
    name: "technologies",
  });

  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control,
    name: "keyFeatures",
  });

  const { fields: galleryFields, append: appendGallery, remove: removeGallery } = useFieldArray({
    control,
    name: "galleryImages",
  });

  const [newTechnology, setNewTechnology] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [newGalleryImage, setNewGalleryImage] = useState("");

  // Watch title field for auto-slug generation
  const watchTitle = watch("title");
  const watchSlug = watch("slug");

  const projectCategories = [
    { value: "E-Commerce", label: "E-Commerce", icon: "shopping_cart" },
    { value: "Mobile App", label: "Mobile App", icon: "smartphone" },
    { value: "Web Development", label: "Web Development", icon: "language" },
    { value: "UI/UX Design", label: "UI/UX Design", icon: "brush" },
    { value: "SaaS", label: "SaaS", icon: "cloud" },
    { value: "Portfolio", label: "Portfolio", icon: "person" },
  ];

  const addTechnology = () => {
    if (newTechnology.trim()) {
      appendTech({ name: newTechnology.trim() });
      setNewTechnology("");
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      appendFeature({ name: newFeature.trim() });
      setNewFeature("");
    }
  };

  const addGalleryImage = () => {
    if (newGalleryImage.trim()) {
      appendGallery(newGalleryImage.trim());
      setNewGalleryImage("");
    }
  };

  const onSubmitForm = async (data) => {
    try {
      console.log("Project Data:", data);

      // Use the appropriate mutation based on whether we're editing or creating
      if (project) {
        await updateProjectMutation.mutateAsync({ ...data, id: project._id });
      } else {
        await createProjectMutation.mutateAsync(data);
      }

      // Call the onSubmit prop if provided
      if (onSubmit) {
        onSubmit(data);
      }

      // Reset form and close modal on success
      reset();
      onClose();
    } catch (error) {
      console.error("Error saving project:", error);
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

  // Populate form when editing
  useEffect(() => {
    if (project && isOpen) {
      reset({
        title: project.title || "",
        slug: project.slug || "",
        clientName: project.clientName || "",
        description: project.description || "",
        category: project.category || "",
        projectUrl: project.projectUrl || "",
        coverImageUrl: project.coverImageUrl || "",
        startDate: project.startDate ? project.startDate.split('T')[0] : "",
        endDate: project.endDate ? project.endDate.split('T')[0] : "",
        technologies: project.technologies || [],
        keyFeatures: project.keyFeatures || [],
        galleryImages: project.galleryImages || [],
        displayOrder: project.displayOrder || 0,
        isFeatured: project.isFeatured || false,
        isActive: project.isActive !== undefined ? project.isActive : true,
        challenge: project.challenge || "",
        solution: project.solution || "",
        result: project.result || ""
      });
    }
  }, [project, isOpen, reset]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setNewTechnology("");
      setNewFeature("");
      setNewGalleryImage("");
    }
  }, [isOpen, reset]);

  const isEditing = !!project;
  const mutation = isEditing ? updateProjectMutation : createProjectMutation;

  return (
    <>
      {/* Professional Modal with Backdrop Blur */}
      <div
        className={`modal ${isOpen ? "modal-open" : ""}`}
        style={{ zIndex: 1000 }}
      >
        <div className="modal-box w-full sm:w-11/12 md:w-10/12 lg:w-8/12 max-w-4xl h-[95vh] max-h-[95vh] p-0 overflow-hidden rounded-lg shadow-2xl border border-base-300/50 backdrop-blur-sm mx-2 sm:mx-4">
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
                    {isEditing ? "edit" : "work"}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-base-content">
                    {isEditing ? "Edit Project" : "Add New Project"}
                  </h3>
                  <p className="text-xs sm:text-sm text-base-content/60 mt-1">
                    {isEditing ? "Update project information and settings" : "Create a new portfolio project showcase"}
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
                            Project Title <span className="text-error">*</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          {...register("title", {
                            required: "Project title is required",
                            minLength: {
                              value: 2,
                              message: "Title must be at least 2 characters",
                            },
                          })}
                          className={`input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200 ${
                            errors.title ? "input-error" : ""
                          }`}
                          placeholder="E-Commerce Platform"
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
                          placeholder="e-commerce-platform"
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

                    <div className="form-control mt-4 sm:mt-6">
                      <label className="label">
                        <span className="label-text font-medium text-base-content flex items-center gap-2">
                          <span className="material-icons text-sm text-primary">
                            business
                          </span>
                          Client Name <span className="text-error">*</span>
                        </span>
                      </label>
                      <input
                        type="text"
                        {...register("clientName", {
                          required: "Client name is required",
                          minLength: {
                            value: 2,
                            message: "Client name must be at least 2 characters",
                          },
                        })}
                        className={`input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200 ${
                          errors.clientName ? "input-error" : ""
                        }`}
                        placeholder="Client Company"
                      />
                      {errors.clientName && (
                        <label className="label">
                          <span className="label-text-alt text-error flex items-center gap-1">
                            <span className="material-icons text-xs">
                              error
                            </span>
                            {errors.clientName.message}
                          </span>
                        </label>
                      )}
                    </div>

                    <div className="form-control mt-4 sm:mt-6">
                      <label className="label">
                        <span className="label-text font-medium text-base-content flex items-center gap-2">
                          <span className="material-icons text-sm text-primary">
                            description
                          </span>
                          Description <span className="text-error">*</span>
                        </span>
                      </label>
                      <textarea
                        {...register("description", {
                          required: "Description is required",
                          minLength: {
                            value: 10,
                            message: "Description must be at least 10 characters",
                          },
                        })}
                        className={`textarea textarea-bordered h-24 resize-none text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200 ${
                          errors.description ? "textarea-error" : ""
                        }`}
                        placeholder="Project description..."
                      />
                      {errors.description && (
                        <label className="label">
                          <span className="label-text-alt text-error flex items-center gap-1">
                            <span className="material-icons text-xs">
                              error
                            </span>
                            {errors.description.message}
                          </span>
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Category & Links Section */}
                <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                  <div className="card-body p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                        <span className="material-icons text-warning text-sm sm:text-lg">
                          category
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold text-base-content">
                        Category & Links
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base-content flex items-center gap-2">
                            <span className="material-icons text-sm text-primary">
                              folder
                            </span>
                            Category <span className="text-error">*</span>
                          </span>
                        </label>
                        <select
                          {...register("category", {
                            required: "Category is required",
                          })}
                          className={`select select-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200 ${
                            errors.category ? "select-error" : ""
                          }`}
                        >
                          <option value="">Select Category</option>
                          {projectCategories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                        {errors.category && (
                          <label className="label">
                            <span className="label-text-alt text-error flex items-center gap-1">
                              <span className="material-icons text-xs">
                                error
                              </span>
                              {errors.category.message}
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
                            Project URL
                          </span>
                        </label>
                        <input
                          type="url"
                          {...register("projectUrl", {
                            pattern: {
                              value: /^https?:\/\/.+/,
                              message: "Please enter a valid URL",
                            },
                          })}
                          className={`input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200 ${
                            errors.projectUrl ? "input-error" : ""
                          }`}
                          placeholder="https://example.com"
                        />
                        {errors.projectUrl && (
                          <label className="label">
                            <span className="label-text-alt text-error flex items-center gap-1">
                              <span className="material-icons text-xs">
                                error
                              </span>
                              {errors.projectUrl.message}
                            </span>
                          </label>
                        )}
                      </div>
                    </div>

                    <div className="form-control mt-4 sm:mt-6">
                      <label className="label">
                        <span className="label-text font-medium text-base-content flex items-center gap-2">
                          <span className="material-icons text-sm text-primary">
                            image
                          </span>
                          Cover Image URL
                        </span>
                      </label>
                      <input
                        type="url"
                        {...register("coverImageUrl", {
                          pattern: {
                            value: /^https?:\/\/.+/,
                            message: "Please enter a valid URL",
                          },
                        })}
                        className={`input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200 ${
                          errors.coverImageUrl ? "input-error" : ""
                        }`}
                        placeholder="https://example.com/cover-image.jpg"
                      />
                      {errors.coverImageUrl && (
                        <label className="label">
                          <span className="label-text-alt text-error flex items-center gap-1">
                            <span className="material-icons text-xs">
                              error
                            </span>
                            {errors.coverImageUrl.message}
                          </span>
                        </label>
                      )}
                      <label className="label">
                        <span className="label-text-alt text-base-content/60">
                          This image will be used as project thumbnail
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
                {/* Project Timeline Section */}
                <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                  <div className="card-body p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-success/20 rounded-lg flex items-center justify-center">
                        <span className="material-icons text-success text-sm sm:text-lg">
                          schedule
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold text-base-content">
                        Project Timeline
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base-content flex items-center gap-2">
                            <span className="material-icons text-sm text-primary">
                              event
                            </span>
                            Start Date
                          </span>
                        </label>
                        <input
                          type="date"
                          {...register("startDate")}
                          className="input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base-content flex items-center gap-2">
                            <span className="material-icons text-sm text-primary">
                              event_available
                            </span>
                            End Date
                          </span>
                        </label>
                        <input
                          type="date"
                          {...register("endDate")}
                          className="input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technologies Section */}
                <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                  <div className="card-body p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                          <span className="material-icons text-accent text-sm sm:text-lg">
                            code
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-semibold text-base-content">
                          Technologies Used
                        </h4>
                      </div>
                      <div className="badge badge-primary badge-lg">
                        {techFields.length} technologies
                      </div>
                    </div>

                    {/* Existing Technologies */}
                    {techFields.length > 0 && (
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="text-sm font-medium text-base-content/70 uppercase tracking-wide">Added Technologies</h5>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                            <span className="text-xs text-success font-medium">{techFields.length} Active</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {techFields.map((field, index) => (
                            <span
                              key={field.id}
                              className="badge badge-primary badge-lg gap-2 shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in-up"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              {field.name}
                              <button
                                type="button"
                                onClick={() => removeTech(index)}
                                className="btn btn-xs btn-circle btn-ghost hover:btn-error hover:scale-110 transition-all duration-200"
                              >
                                <span className="material-icons text-xs">close</span>
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add New Technology */}
                    <div className="card bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/30 shadow-md rounded-lg">
                      <div className="card-body p-4 sm:p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/30 rounded-lg flex items-center justify-center">
                            <span className="material-icons text-primary text-sm sm:text-lg">
                              add_circle
                            </span>
                          </div>
                          <h5 className="font-semibold text-primary text-sm sm:text-lg">
                            Add Technology
                          </h5>
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newTechnology}
                            onChange={(e) => setNewTechnology(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                            className="input input-bordered input-sm flex-1 bg-base-100 focus:bg-base-100 focus:border-primary text-base-content transition-all duration-200"
                            placeholder="React, Node.js, MongoDB..."
                          />
                          <button
                            type="button"
                            onClick={addTechnology}
                            disabled={!newTechnology.trim()}
                            className="btn btn-primary btn-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="material-icons text-sm mr-1">
                              add
                            </span>
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Features Section */}
                <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                  <div className="card-body p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                          <span className="material-icons text-secondary text-sm sm:text-lg">
                            star
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-semibold text-base-content">
                          Key Features
                        </h4>
                      </div>
                      <div className="badge badge-secondary badge-lg">
                        {featureFields.length} features
                      </div>
                    </div>

                    {/* Existing Features */}
                    {featureFields.length > 0 && (
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="text-sm font-medium text-base-content/70 uppercase tracking-wide">Added Features</h5>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                            <span className="text-xs text-success font-medium">{featureFields.length} Active</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {featureFields.map((field, index) => (
                            <div
                              key={field.id}
                              className="flex items-center justify-between p-3 bg-base-200/50 rounded-lg border border-base-300/30 hover:shadow-md transition-all duration-200 animate-fade-in-up"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <span className="text-sm text-base-content flex-1">{field.name}</span>
                              <button
                                type="button"
                                onClick={() => removeFeature(index)}
                                className="btn btn-xs btn-circle btn-ghost hover:btn-error hover:scale-110 transition-all duration-200"
                              >
                                <span className="material-icons text-xs">close</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add New Feature */}
                    <div className="card bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/30 shadow-md rounded-lg">
                      <div className="card-body p-4 sm:p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-secondary/30 rounded-lg flex items-center justify-center">
                            <span className="material-icons text-secondary text-sm sm:text-lg">
                              add_circle
                            </span>
                          </div>
                          <h5 className="font-semibold text-secondary text-sm sm:text-lg">
                            Add Feature
                          </h5>
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                            className="input input-bordered input-sm flex-1 bg-base-100 focus:bg-base-100 focus:border-secondary text-base-content transition-all duration-200"
                            placeholder="User authentication, Real-time chat..."
                          />
                          <button
                            type="button"
                            onClick={addFeature}
                            disabled={!newFeature.trim()}
                            className="btn btn-secondary btn-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="material-icons text-sm mr-1">
                              add
                            </span>
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gallery Images Section */}
                <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                  <div className="card-body p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-neutral/20 rounded-lg flex items-center justify-center">
                          <span className="material-icons text-neutral text-sm sm:text-lg">
                            photo_library
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-semibold text-base-content">
                          Gallery Images
                        </h4>
                      </div>
                      <div className="badge badge-neutral badge-lg">
                        {galleryFields.length} images
                      </div>
                    </div>

                    {/* Existing Gallery Images */}
                    {galleryFields.length > 0 && (
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="text-sm font-medium text-base-content/70 uppercase tracking-wide">Added Images</h5>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                            <span className="text-xs text-success font-medium">{galleryFields.length} Active</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {galleryFields.map((field, index) => (
                            <div
                              key={field.id}
                              className="flex items-center justify-between p-3 bg-base-200/50 rounded-lg border border-base-300/30 hover:shadow-md transition-all duration-200 animate-fade-in-up"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <span className="text-sm text-base-content truncate flex-1 mr-2">{field}</span>
                              <button
                                type="button"
                                onClick={() => removeGallery(index)}
                                className="btn btn-xs btn-circle btn-ghost hover:btn-error hover:scale-110 transition-all duration-200"
                              >
                                <span className="material-icons text-xs">close</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add New Gallery Image */}
                    <div className="card bg-gradient-to-br from-neutral/5 to-neutral/10 border border-neutral/30 shadow-md rounded-lg">
                      <div className="card-body p-4 sm:p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-neutral/30 rounded-lg flex items-center justify-center">
                            <span className="material-icons text-neutral text-sm sm:text-lg">
                              add_circle
                            </span>
                          </div>
                          <h5 className="font-semibold text-neutral text-sm sm:text-lg">
                            Add Gallery Image
                          </h5>
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={newGalleryImage}
                            onChange={(e) => setNewGalleryImage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryImage())}
                            className="input input-bordered input-sm flex-1 bg-base-100 focus:bg-base-100 focus:border-neutral text-base-content transition-all duration-200"
                            placeholder="https://example.com/image.jpg"
                          />
                          <button
                            type="button"
                            onClick={addGalleryImage}
                            disabled={!newGalleryImage.trim()}
                            className="btn btn-neutral btn-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="material-icons text-sm mr-1">
                              add
                            </span>
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Details Section */}
                <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                  <div className="card-body p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                        <span className="material-icons text-warning text-sm sm:text-lg">
                          article
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold text-base-content">
                        Project Details
                      </h4>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base-content flex items-center gap-2">
                            <span className="material-icons text-sm text-primary">
                              help
                            </span>
                            The Challenge
                          </span>
                        </label>
                        <textarea
                          {...register("challenge")}
                          className="textarea textarea-bordered h-24 resize-none text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                          placeholder="What challenges did the client face?"
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base-content flex items-center gap-2">
                            <span className="material-icons text-sm text-primary">
                              lightbulb
                            </span>
                            Our Solution
                          </span>
                        </label>
                        <textarea
                          {...register("solution")}
                          className="textarea textarea-bordered h-24 resize-none text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                          placeholder="How did we solve the challenges?"
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base-content flex items-center gap-2">
                            <span className="material-icons text-sm text-primary">
                              trending_up
                            </span>
                            The Result
                          </span>
                        </label>
                        <textarea
                          {...register("result")}
                          className="textarea textarea-bordered h-24 resize-none text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200"
                          placeholder="What were the outcomes and results?"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Settings Section */}
                <div className="card bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-lg rounded-lg">
                  <div className="card-body p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-info/20 rounded-lg flex items-center justify-center">
                        <span className="material-icons text-info text-sm sm:text-lg">
                          settings
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold text-base-content">
                        Project Settings
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                          className={`input input-bordered w-full text-base-content bg-base-100 focus:bg-base-100 focus:border-primary transition-all duration-200 ${
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
                            <span className="label-text font-medium text-base-content text-sm sm:text-base">
                              Featured Project
                            </span>
                          </div>
                        </label>
                        <p className="text-xs sm:text-sm text-base-content/60 ml-12">
                          Display this project prominently
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
                            <span className="label-text font-medium text-base-content text-sm sm:text-base">
                              Active Project
                            </span>
                          </div>
                        </label>
                        <p className="text-xs sm:text-sm text-base-content/60 ml-12">
                          Make this project visible to users
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
                  disabled={isSubmitting || mutation.isPending}
                  className="btn btn-primary shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 flex-1 sm:flex-none"
                >
                  {(isSubmitting || mutation.isPending) && (
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                  )}
                  <span className="material-icons text-sm mr-2">
                    {(isSubmitting || mutation.isPending) ? "hourglass_empty" : (isEditing ? "update" : "work")}
                  </span>
                  <span className="hidden sm:inline">
                    {(isSubmitting || mutation.isPending) ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Project" : "Create Project")}
                  </span>
                  <span className="sm:hidden">
                    {(isSubmitting || mutation.isPending) ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update" : "Create")}
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

export default ProjectModal;