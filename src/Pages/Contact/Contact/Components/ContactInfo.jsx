const ContactInfo = () => {
  const contactItems = [
    {
      id: 1,
      icon: 'call',
      title: 'Phone',
      details: ['+880 1886-928948', '+880 1719-928948'],
      bgColor: 'bg-blue-500',
      hasArrow: true
    },
    {
      id: 2,
      icon: 'whatsapp',
      title: 'WhatsApp',
      details: ['+880 1719-928948'],
      bgColor: 'bg-green-500',
      hasArrow: true,
      isCustomIcon: true
    },
    {
      id: 3,
      icon: 'email',
      title: 'Email',
      details: ['aminwebtech@gmail.com'],
      bgColor: 'bg-red-500',
      hasArrow: true
    },
    {
      id: 4,
      icon: 'location_on',
      title: 'Address',
      details: ['Dhaka, Bangladesh'],
      bgColor: 'bg-purple-500',
      hasArrow: true
    },
    {
      id: 5,
      icon: 'schedule',
      title: 'Working Hours',
      details: ['Sun-Thu: 9:00 AM - 6:00 PM'],
      bgColor: 'bg-yellow-500',
      hasArrow: false
    }
  ];

  const WhatsAppIcon = () => (
    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );

  return (
    <div className="space-y-4">
      {contactItems.map((item) => (
        <div
          key={item.id}
          className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center group cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700"
        >
          {/* Icon */}
          <div className={`${item.bgColor} rounded-lg p-3 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
            {item.isCustomIcon ? (
              <WhatsAppIcon />
            ) : (
              <span className="material-icons-round text-2xl">{item.icon}</span>
            )}
          </div>

          {/* Content */}
          <div className="ml-4 flex-grow">
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {item.title}
            </h3>
            {item.details.map((detail, index) => (
              <p key={index} className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {detail}
              </p>
            ))}
          </div>

          {/* Arrow Icon */}
          {item.hasArrow && (
            <span className="material-icons-round text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300">
              arrow_forward
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContactInfo;