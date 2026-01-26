import { useState } from "react";
import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";

const ContactSection = () => {
  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen relative overflow-x-hidden transition-colors duration-300">
      {/* Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/5"></div>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-12 lg:py-20 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-16 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            Let's Start <span className="text-blue-600">Something Great</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Ready to bring your ideas to life? Get in touch with our team of
            experts.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Information */}
          <div className="lg:col-span-4">
            <ContactInfo />
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8">
            <ContactForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactSection;
