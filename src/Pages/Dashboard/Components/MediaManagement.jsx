import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Upload, 
  Trash2, 
  ChevronDown,
  Image as ImageIcon,
  FileText,
  Video,
  Music
} from 'lucide-react';

const MediaManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Sample media files data
  const mediaFiles = [
    {
      id: 1,
      name: 'WhatsApp Image 2026-01-04 at 5.45.01 PM',
      type: 'Image',
      size: '0.1 MB',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCW9tsizm1WJNY4dIShZRcauThCvfor9cD_oBasenVnrsutpWfccL_d6tVxKF-MUkXcIAI6Gz-pandOvSrJJayMeZjB-_6DoTocXNtRIv7EIBNR4P-pj_umlOYv_Uq7xJQNf-MStZF06rFHkp_eCFbgqkrejeudmh2AtzMXE8crYywGei5rkXUZGATI9vxvjnjDPhW761ATER25HiRGe6EZXSbn2n80DHex6T2h7IVNJsxFvqHuJ77JPqTgMdMRa3HDtvO_eIsDMBM',
      alt: 'Abstract blue purple wave background'
    },
    {
      id: 2,
      name: 'WhatsApp Image 2026-01-04 at 5.45.02 PM',
      type: 'Image',
      size: '0.1 MB',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEl2hZbGarZrondXL7JrQMBs3DNXSsuVaqvetOvYIQ6EEaIezsZyucGdj5c6mhAgV64z0qO2uzH50Po4Of6Iu-t0865yQFIBjWXkz1Hxi9B0UX1HyZae5-2AcFVW0kXq2YEyKSp1-mDr1Dj6bD8PGHSUzLcnm2VTuqOiq0SAOAKYpxwmXR0PGbKDrNKl9-s9WikdqKt7UYh19gZ7rsm-iLYv8UArvBT1ghXssdBeLj35s76K5G0pFBs85jIvEZb6x01YqRw3-LgQM',
      alt: 'Office desk with computer showing development'
    },
    {
      id: 3,
      name: 'WhatsApp Image 2026-01-04 at 5.45.03 PM',
      type: 'Image',
      size: '0.1 MB',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOVyCn3d7BOiUyVECiZlUoGGeY_DF92x87ZSqcmTVp7Wk-JvcifeRdvhHpMOwZSX-qVYInKZ1sYQfsiWh3pF8fzcwDyKzgBvz6mkbpfE98_PEtat9IK_iLwoqoVmx3yqZCkYUswJJWTEwlOc_MffEh05Fqg5noeHDH0eV6TBMAZABytVxUSCifs360MLwTKXJKhjgL-UEu8Z29JB_rXWJw-cyJGkEKk_Bat22N_mv6EONxkYorX8S8z0nNkwZ0Zo5sqI7ZqebRvxU',
      alt: 'Yellow web hosting promotional graphic'
    },
    {
      id: 4,
      name: 'WhatsApp Image 2026-01-04 at 5.45.04 PM',
      type: 'Image',
      size: '0.1 MB',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRLyaiZ3fmRH4w8RsEmz674SWMemNTt4FQtcNAl7tlok-IbMnkPOs7IFvc2uLYjCaItJOxqHDmMehHUEBToM4Yc0_dEPlVq1f7m9f7drhHyN0qhmnlAz2iHFhn-WTRJyCJ7l6Ev95sKsERe6axVQZrUZEMJ-YWWW2niXgJWzJCykfThovW_vLQ_4LUcFxo_T41UKIPQUXriiAj17ndDWHRZrfUyHjizXjDS-fpd4Oo_f-FySrgsWN7qQazf9o2is9qjbsjIw8k9PI',
      alt: 'Abstract colorful swirl graphic'
    },
    {
      id: 5,
      name: 'Project Documentation.pdf',
      type: 'Document',
      size: '2.3 MB',
      url: null,
      alt: 'PDF Document'
    },
    {
      id: 6,
      name: 'Demo Video.mp4',
      type: 'Video',
      size: '15.7 MB',
      url: null,
      alt: 'Video File'
    }
  ];

  const uploadGuidelines = [
    {
      number: 1,
      text: 'Maximum file size:',
      highlight: '10MB'
    },
    {
      number: 2,
      text: 'Supported image formats:',
      highlight: 'JPG, PNG, GIF, WebP'
    },
    {
      number: 3,
      text: 'Supported document formats:',
      highlight: 'PDF, DOC, DOCX'
    },
    {
      number: 4,
      text: 'Recommended image dimensions:',
      highlight: '1920×1080 pixels'
    }
  ];

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All Types' || file.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleFileSelect = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(file => file.id));
    }
  };

  const handleDeleteSelected = () => {
    console.log('Delete selected files:', selectedFiles);
    setSelectedFiles([]);
    // Implement delete logic here
  };

  const handleUpload = () => {
    console.log('Upload files');
    // Implement upload logic here
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'Image':
        return ImageIcon;
      case 'Document':
        return FileText;
      case 'Video':
        return Video;
      case 'Audio':
        return Music;
      default:
        return FileText;
    }
  };

  const renderFilePreview = (file) => {
    if (file.type === 'Image' && file.url) {
      return (
        <img
          src={file.url}
          alt={file.alt}
          className="h-full w-full object-cover object-center group-hover:opacity-90 transition-opacity"
        />
      );
    } else {
      const IconComponent = getFileIcon(file.type);
      return (
        <div className="h-full w-full flex items-center justify-center">
          <IconComponent className="w-12 h-12 text-gray-400" />
        </div>
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Media Library</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage all your uploaded media files
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDeleteSelected}
            disabled={selectedFiles.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected ({selectedFiles.length})
          </button>
          <button
            onClick={handleUpload}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Files
          </button>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 text-sm text-gray-900 bg-transparent border-none rounded-md focus:ring-0 placeholder-gray-400 dark:text-white dark:placeholder-gray-500"
              placeholder="Search media files..."
            />
          </div>
          
          <div className="border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 mx-2"></div>
          
          <div className="relative min-w-[160px]">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors bg-transparent border-none cursor-pointer appearance-none"
            >
              <option>All Types</option>
              <option>Image</option>
              <option>Document</option>
              <option>Video</option>
              <option>Audio</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm mb-6">
        {/* Select All Checkbox */}
        {filteredFiles.length > 0 && (
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <input
              type="checkbox"
              checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
              onChange={handleSelectAll}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Select All ({filteredFiles.length} files)
            </label>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredFiles.map((file) => (
            <div key={file.id} className="group relative flex flex-col">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                {renderFilePreview(file)}
                
                <div className="absolute top-3 right-3">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => handleFileSelect(file.id)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                </div>
              </div>
              
              <div className="mt-3">
                <h3 
                  className="text-sm font-medium text-gray-900 dark:text-white truncate"
                  title={file.name}
                >
                  {file.name.length > 30 ? `${file.name.substring(0, 30)}...` : file.name}
                </h3>
                <div className="flex justify-between items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>{file.type}</span>
                  <span>{file.size}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No media files found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {searchTerm || filterType !== 'All Types' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Upload your first media file to get started.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Upload Guidelines */}
      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
          Upload Guidelines
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {uploadGuidelines.map((guideline) => (
            <div key={guideline.number} className="flex items-start gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 text-xs font-bold">
                {guideline.number}
              </span>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {guideline.text} <span className="font-bold">{guideline.highlight}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaManagement;