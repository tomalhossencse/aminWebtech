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

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">
            {isEditing ? "Edit Project" : "Add New Project"}
          </h3>
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
                <span className="label-text">Project Title *</span>
              </label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                className="input input-bordered"
                placeholder="E-Commerce Platform"
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
                placeholder="e-commerce-platform"
              />
              {errors.slug && (
                <span className="text-error text-sm">{errors.slug.message}</span>
              )}
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Client Name *</span>
            </label>
            <input
              type="text"
              {...register("clientName", { required: "Client name is required" })}
              className="input input-bordered"
              placeholder="Client Company"
            />
            {errors.clientName && (
              <span className="text-error text-sm">{errors.clientName.message}</span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Description *</span>
            </label>
            <textarea
              {...register("description", { required: "Description is required" })}
              className="textarea textarea-bordered h-24"
              placeholder="Project description..."
            />
            {errors.description && (
              <span className="text-error text-sm">{errors.description.message}</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Category *</span>
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="select select-bordered"
              >
                <option value="">Select Category</option>
                {projectCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="text-error text-sm">{errors.category.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Project URL</span>
              </label>
              <input
                type="url"
                {...register("projectUrl")}
                className="input input-bordered"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Cover Image URL</span>
            </label>
            <input
              type="url"
              {...register("coverImageUrl")}
              className="input input-bordered"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Technologies */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Technologies</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTechnology}
                onChange={(e) => setNewTechnology(e.target.value)}
                className="input input-bordered flex-1"
                placeholder="React, Node.js, MongoDB..."
              />
              <button
                type="button"
                onClick={addTechnology}
                className="btn btn-primary"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {techFields.map((field, index) => (
                <div key={field.id} className="badge badge-primary gap-2">
                  {field.name}
                  <button
                    type="button"
                    onClick={() => removeTech(index)}
                    className="btn btn-xs btn-circle btn-ghost"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Key Features</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="input input-bordered flex-1"
                placeholder="Responsive design, User authentication..."
              />
              <button
                type="button"
                onClick={addFeature}
                className="btn btn-primary"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {featureFields.map((field, index) => (
                <div key={field.id} className="badge badge-secondary gap-2">
                  {field.name}
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="btn btn-xs btn-circle btn-ghost"
                  >
                    ✕
                  </button>
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
              disabled={mutation.isPending}
              className="btn btn-primary"
            >
              {mutation.isPending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                isEditing ? "Update Project" : "Create Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;