import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Mail,
  Phone,
  Users
} from 'lucide-react';

const TeamManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const teamMembers = [
    {
      id: 1,
      name: 'Aminul Islam',
      position: 'Chief Technology Officer',
      description: '10+ years experience in software architecture and team leadership',
      avatar: null,
      initials: 'A',
      email: null,
      phone: null,
      expertise: ['Backend Development', 'System Architecture', 'DevOps'],
      socialLinks: {
        linkedin: null,
        github: null,
        twitter: null,
        website: null
      }
    },
    {
      id: 2,
      name: 'Fatima Rahman',
      position: 'Lead UI/UX Designer',
      description: 'Specialized in user-centered design and design systems',
      avatar: null,
      initials: 'F',
      email: null,
      phone: null,
      expertise: ['UI Design', 'UX Research', 'Prototyping'],
      socialLinks: {
        linkedin: null,
        github: null,
        twitter: null,
        website: null
      }
    },
    {
      id: 3,
      name: 'Rahim Ahmed',
      position: 'Senior Full Stack Developer',
      description: 'Expert in React, Node.js, and cloud technologies',
      avatar: null,
      initials: 'R',
      email: null,
      phone: null,
      expertise: ['React', 'Node.js', 'AWS', 'Docker'],
      socialLinks: {
        linkedin: null,
        github: null,
        twitter: null,
        website: null
      }
    },
    {
      id: 4,
      name: 'Akkas Uddin',
      position: 'Dev',
      description: 'sdfsdf',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjfchLnGrrrwY7SgbVItQchu_vH63rznwR_Wkc5IImkHpCvXg7sq_e9vf0FjM3Da6Ka3oQaqgtNwrMqDzwavYOGVRtQyIYzLPtVlkxEn0QIvFb546kQdcSNJ4FnGslwdxC-nVXVqZ3FsNwjIdTYSwuYlC_tUh3-npXzNio7QL2Ug4zHj1uUZfDY5X_fE0k0DNzOrKBVzBcrjjVTARTvRb_geJD3CcqoTW_Gml28amEFAPvd2vFRpK6o7BYFgJspT_f80iFf4O5ZAo',
      initials: 'A',
      email: 'akash7766322@gmail.com',
      phone: '765756',
      expertise: [],
      socialLinks: {
        linkedin: '#',
        github: '#',
        twitter: '#',
        website: '#'
      }
    }
  ];

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAction = (action, memberId) => {
    console.log(`${action} team member with ID: ${memberId}`);
    // Implement actual actions here
  };

  const SocialIcon = ({ type, url }) => {
    if (!url) return null;

    const iconProps = {
      className: "w-5 h-5 fill-current",
      viewBox: "0 0 24 24"
    };

    const icons = {
      linkedin: (
        <svg {...iconProps}>
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      github: (
        <svg {...iconProps}>
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
      twitter: (
        <svg {...iconProps}>
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
        </svg>
      ),
      website: (
        <svg {...iconProps}>
          <path d="M12 0c-6.628 0-12 5.372-12 12s5.372 12 12 12 12-5.372 12-12-5.372-12-12-12zm9.896 9.385c.162.836.25 1.7.25 2.583 0 .151-.004.301-.01.45-1.589-.526-3.149-.785-4.66-.785-.436 0-.872.022-1.306.062.863-2.031 1.579-3.834 1.986-4.885 1.516.666 2.825 1.637 3.74 2.575zm-15.013-3.669c.875-.688 1.879-1.218 2.97-1.545.922 2.211 1.594 4.152 1.922 5.617-2.583.565-5.32.73-7.581.428.461-1.848 1.41-3.5 2.689-4.5zm-4.745 7.026c2.404.288 5.253.076 7.957-.557.065.234.125.471.181.711.026.113.053.226.077.34-2.858 1.405-5.337 3.655-6.845 6.273-1.877-1.742-3.051-4.217-3.051-6.958 0-.616.071-1.216.204-1.793c.435.698.966 1.328 1.477 1.984zm9.47 5.763c1.391-2.426 3.734-4.524 6.372-5.753.483 1.831.74 3.766.74 5.767 0 .178-.006.355-.018.531-1.077.382-2.617.747-4.373.747-1.037 0-1.954-.124-2.721-.292zm-.513 1.258c.846.185 1.802.321 2.868.321 1.636 0 3.091-.32 4.129-.652-1.229 2.193-3.551 3.69-6.205 3.69-1.383 0-2.684-.407-3.801-1.111 1.059-1.041 2.062-1.488 3.009-2.248z" />
        </svg>
      )
    };

    return (
      <a 
        href={url} 
        className="text-gray-400 hover:text-blue-500 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        {icons[type]}
      </a>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Members</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your team members and their profiles</p>
        </div>
        <button
          onClick={() => handleAction('add', null)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow-sm flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Team Member
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Search team members..."
          />
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-full hover:shadow-md transition-shadow"
          >
            {/* Header with Avatar and Actions */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4">
                {member.avatar ? (
                  <img
                    alt={`${member.name} Profile`}
                    className="h-12 w-12 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                    src={member.avatar}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className={`h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 font-bold text-xl flex-shrink-0 ${
                    member.avatar ? 'hidden' : 'flex'
                  }`}
                >
                  {member.initials}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-blue-500 font-medium text-sm">{member.position}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction('edit', member.id)}
                  className="text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleAction('delete', member.id)}
                  className="text-red-500 hover:text-red-600 dark:text-red-400 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">
              {member.description}
            </p>

            {/* Contact Information */}
            {(member.email || member.phone) && (
              <div className="space-y-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
                {member.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{member.email}</span>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{member.phone}</span>
                  </div>
                )}
              </div>
            )}

            {/* Social Links */}
            {Object.values(member.socialLinks).some(link => link) && (
              <div className="flex gap-3 mb-6">
                <SocialIcon type="linkedin" url={member.socialLinks.linkedin} />
                <SocialIcon type="github" url={member.socialLinks.github} />
                <SocialIcon type="twitter" url={member.socialLinks.twitter} />
                <SocialIcon type="website" url={member.socialLinks.website} />
              </div>
            )}

            {/* Expertise */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-400 mb-2">Expertise:</p>
              {member.expertise.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {member.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2.5 py-1 rounded font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-500 italic">None listed</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Users className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No team members found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first team member.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;