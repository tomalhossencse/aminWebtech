import { useState } from 'react';
import { 
  Settings, 
  Globe, 
  Mail, 
  Users, 
  Search, 
  Image, 
  Save,
  Trash2,
  RefreshCw
} from 'lucide-react';

const SettingsManagement = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [siteTitle, setSiteTitle] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [aboutCompany, setAboutCompany] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [socialMedia, setSocialMedia] = useState({
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    youtube: '',
    github: ''
  });
  const [metaKeywords, setMetaKeywords] = useState('');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'siteinfo', label: 'Site Info', icon: Globe },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'social', label: 'Social Media', icon: Users },
    { id: 'seo', label: 'SEO', icon: Search }
  ];

  const handleSave = (field) => {
    const fieldMap = {
      'title': siteTitle,
      'description': siteDescription,
      'company': companyName,
      'about': aboutCompany,
      'email': contactEmail,
      'phone': contactPhone,
      'address': contactAddress,
      'facebook': socialMedia.facebook,
      'twitter': socialMedia.twitter,
      'linkedin': socialMedia.linkedin,
      'instagram': socialMedia.instagram,
      'youtube': socialMedia.youtube,
      'github': socialMedia.github,
      'keywords': metaKeywords,
      'analytics': googleAnalyticsId
    };
    console.log(`Saving ${field}:`, fieldMap[field]);
    // Implement save logic here
  };

  const handleSocialMediaChange = (platform, value) => {
    setSocialMedia(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const handleFileUpload = (type) => {
    console.log(`Upload ${type}`);
    // Implement file upload logic here
  };

  const handleDangerAction = (action) => {
    const confirmed = window.confirm(`Are you sure you want to ${action}? This action cannot be undone.`);
    if (confirmed) {
      console.log(`Performing ${action}`);
      // Implement danger actions here
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <>
            {/* Site Information Section */}
            <section className="mb-12">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Site Information</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-8">
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="site-title">
                    Site Title
                  </label>
                  <input
                    className="block w-full rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 text-sm px-4 py-3 mb-4 transition-colors duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                    id="site-title"
                    name="site-title"
                    placeholder="My Awesome Website"
                    type="text"
                    value={siteTitle}
                    onChange={(e) => setSiteTitle(e.target.value)}
                  />
                  <div>
                    <button
                      onClick={() => handleSave('title')}
                      className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                      type="button"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="site-description">
                    Site Description
                  </label>
                  <textarea
                    className="block w-full rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 text-sm px-4 py-3 mb-4 transition-colors duration-200 hover:border-gray-400 dark:hover:border-gray-500 resize-none"
                    id="site-description"
                    name="site-description"
                    placeholder="Brief description of your site..."
                    rows="3"
                    value={siteDescription}
                    onChange={(e) => setSiteDescription(e.target.value)}
                  />
                  <div>
                    <button
                      onClick={() => handleSave('description')}
                      className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                      type="button"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Logo & Favicon Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Logo & Favicon</h2>
              <div className="flex flex-col sm:flex-row gap-8">
                <div>
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Logo</span>
                  <div
                    onClick={() => handleFileUpload('logo')}
                    className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md w-48 h-32 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
                  >
                    <div className="space-y-1 text-center">
                      <Image className="mx-auto h-8 w-8 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400" />
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Click to upload logo
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Favicon</span>
                  <div
                    onClick={() => handleFileUpload('favicon')}
                    className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md w-24 h-24 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
                  >
                    <div className="space-y-1 text-center">
                      <Image className="mx-auto h-6 w-6 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400" />
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        Upload favicon
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        );
      
      case 'siteinfo':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Company Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="company_name">
                        Company Name
                      </label>
                      <div className="mt-1">
                        <input
                          className="block w-full rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 text-sm px-4 py-3 transition-colors duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                          id="company_name"
                          name="company_name"
                          placeholder="Acme Inc."
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => handleSave('company')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:ring-offset-gray-800 transition-colors"
                        type="button"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="about">
                        About Company
                      </label>
                      <div className="mt-1">
                        <textarea
                          className="block w-full rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 text-sm px-4 py-3 transition-colors duration-200 hover:border-gray-400 dark:hover:border-gray-500 resize-none"
                          id="about"
                          name="about"
                          placeholder="Brief description..."
                          rows="4"
                          value={aboutCompany}
                          onChange={(e) => setAboutCompany(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <button
                        onClick={() => handleSave('about')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:ring-offset-gray-800 transition-colors"
                        type="button"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'contact':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 gap-y-6 gap-x-8 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="contact-email">
                      Contact Email
                    </label>
                    <div className="flex rounded-md shadow-sm">
                      <div className="relative flex-grow focus-within:z-10">
                        <input
                          className="block w-full rounded-none rounded-l-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 text-sm px-4 py-3 transition-colors duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                          id="contact-email"
                          name="contact-email"
                          placeholder="info@example.com"
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                        />
                      </div>
                      <button
                        onClick={() => handleSave('email')}
                        className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                        type="button"
                      >
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="contact-phone">
                      Contact Phone
                    </label>
                    <div className="flex rounded-md shadow-sm">
                      <div className="relative flex-grow focus-within:z-10">
                        <input
                          className="block w-full rounded-none rounded-l-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 text-sm px-4 py-3 transition-colors duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                          id="contact-phone"
                          name="contact-phone"
                          placeholder="+1 (555) 123-4567"
                          type="text"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                        />
                      </div>
                      <button
                        onClick={() => handleSave('phone')}
                        className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                        type="button"
                      >
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="contact-address">
                      Contact Address
                    </label>
                    <div className="flex rounded-md shadow-sm h-16">
                      <div className="relative flex-grow focus-within:z-10 h-full">
                        <textarea
                          className="block w-full h-full rounded-none rounded-l-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 text-sm px-4 py-3 transition-colors duration-200 hover:border-gray-400 dark:hover:border-gray-500 resize-none"
                          id="contact-address"
                          name="contact-address"
                          placeholder="Enter your business address..."
                          rows="2"
                          value={contactAddress}
                          onChange={(e) => setContactAddress(e.target.value)}
                        />
                      </div>
                      <button
                        onClick={() => handleSave('address')}
                        className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                        type="button"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'social':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Social Media Links</h2>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <label className="w-full md:w-40 text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="facebook">
                  Facebook URL
                </label>
                <div className="flex-1 flex gap-3">
                  <input
                    className="flex-1 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 text-sm px-4 py-3 transition-colors duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                    id="facebook"
                    placeholder="https://facebook.com/yourpage"
                    type="text"
                    value={socialMedia.facebook}
                    onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                  />
                  <button
                    onClick={() => handleSave('facebook')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Save className="w-4 h-4 mr-1 inline" />
                    Save
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <label className="w-full md:w-40 text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="twitter">
                  Twitter URL
                </label>
                <div className="flex-1 flex gap-3">
                  <input
                    className="flex-1 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 text-sm px-4 py-3 transition-colors duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                    id="twitter"
                    placeholder="https://twitter.com/yourprofile"
                    type="text"
                    value={socialMedia.twitter}
                    onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                  />
                  <button
                    onClick={() => handleSave('twitter')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Save className="w-4 h-4 mr-1 inline" />
                    Save
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <label className="w-full md:w-40 text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="linkedin">
                  LinkedIn URL
                </label>
                <div className="flex-1 flex gap-3">
                  <input
                    className="flex-1 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 text-sm px-4 py-3 transition-colors duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                    id="linkedin"
                    placeholder="https://linkedin.com/company/yourcompany"
                    type="text"
                    value={socialMedia.linkedin}
                    onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                  />
                  <button
                    onClick={() => handleSave('linkedin')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Save className="w-4 h-4 mr-1 inline" />
                    Save
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <label className="w-full md:w-40 text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="instagram">
                  Instagram URL
                </label>
                <div className="flex-1 flex gap-3">
                  <input
                    className="flex-1 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 text-sm px-4 py-3 transition-colors duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                    id="instagram"
                    placeholder="https://instagram.com/yourprofile"
                    type="text"
                    value={socialMedia.instagram}
                    onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                  />
                  <button
                    onClick={() => handleSave('instagram')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Save className="w-4 h-4 mr-1 inline" />
                    Save
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <label className="w-full md:w-40 text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="youtube">
                  YouTube URL
                </label>
                <div className="flex-1 flex gap-3">
                  <input
                    className="flex-1 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 text-sm px-4 py-3 transition-colors duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                    id="youtube"
                    placeholder="https://youtube.com/yourchannel"
                    type="text"
                    value={socialMedia.youtube}
                    onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                  />
                  <button
                    onClick={() => handleSave('youtube')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Save className="w-4 h-4 mr-1 inline" />
                    Save
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <label className="w-full md:w-40 text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="github">
                  GitHub URL
                </label>
                <div className="flex-1 flex gap-3">
                  <input
                    className="flex-1 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 text-sm px-4 py-3 transition-colors duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                    id="github"
                    placeholder="https://github.com/yourprofile"
                    type="text"
                    value={socialMedia.github}
                    onChange={(e) => handleSocialMediaChange('github', e.target.value)}
                  />
                  <button
                    onClick={() => handleSave('github')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Save className="w-4 h-4 mr-1 inline" />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'seo':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">SEO Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2" htmlFor="meta_keywords">
                  Meta Keywords
                </label>
                <input
                  className="w-full rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 text-sm px-4 py-3 transition-colors duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                  id="meta_keywords"
                  placeholder="web development, software company, digital solutions"
                  type="text"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                />
                <div className="mt-3">
                  <button
                    onClick={() => handleSave('keywords')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Save className="w-4 h-4 mr-2 inline" />
                    Save
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2" htmlFor="ga_id">
                  Google Analytics ID
                </label>
                <input
                  className="w-full rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 text-sm px-4 py-3 transition-colors duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                  id="ga_id"
                  placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
                  type="text"
                  value={googleAnalyticsId}
                  onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Enter your Google Analytics tracking ID (Universal Analytics or GA4)
                </p>
                <div className="mt-3">
                  <button
                    onClick={() => handleSave('analytics')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Save className="w-4 h-4 mr-2 inline" />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your website settings and configurations
        </p>
      </header>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                }`}
              >
                <IconComponent className="mr-2 h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`${(activeTab === 'siteinfo' || activeTab === 'contact') ? 'space-y-6' : activeTab === 'social' || activeTab === 'seo' ? '' : 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8'} mb-6`}>
        {renderTabContent()}
      </div>

      {/* Danger Zone - Show for all tabs */}
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-lg p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">Danger Zone</h2>
        <p className="text-sm text-red-600 dark:text-red-300 mb-6">
          These actions are irreversible. Please proceed with caution.
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => handleDangerAction('clear cache')}
            className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
            type="button"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Clear Cache
          </button>
          <button
            onClick={() => handleDangerAction('reset all settings')}
            className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
            type="button"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Reset All Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;