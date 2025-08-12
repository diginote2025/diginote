"use client";

import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, Loader } from "lucide-react";

const FormField = ({
  id,
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  rows = 4,
  placeholder = "",
}) => {
  const InputComponent = type === "textarea" ? "textarea" : "input";
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-600"
      >
        {label}
      </label>
      <InputComponent
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        placeholder={placeholder}
        className="block w-full rounded-md border-0 px-3.5 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-shadow duration-200"
      />
    </div>
  );
};

const ContactInfoItem = ({ icon, title, children }) => {
  const Icon = icon;
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 rounded-full p-3">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="text-gray-600">{children}</div>
      </div>
    </div>
  );
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => setStatus("idle"), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY, // Replace with your key
          ...formData,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        console.error("Error:", data);
        setStatus("error");
      }
    } catch (err) {
      console.error("Network error:", err);
      setStatus("error");
    }
  };

  return (
    <section className="min-h-screen w-full bg-gray-50 font-sans">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Get in <span className="text-indigo-600">Touch</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have a question, feedback,
            or just want to say hello, feel free to reach out.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-5 bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Contact Information
            </h2>
            <div className="space-y-6">
              <ContactInfoItem icon={Mail} title="Email Us">
                <a
                  href="mailto:diginote2025@gmail.com"
                  className="hover:text-indigo-600 transition-colors duration-200"
                >
                  diginote2025@gmail.com
                </a>
              </ContactInfoItem>
              <ContactInfoItem icon={Phone} title="Call Us">
                <a
                  href="tel:917470578448"
                  className="hover:text-indigo-600 transition-colors duration-200"
                >
                  +91 7470578448
                </a>
              </ContactInfoItem>
              <ContactInfoItem icon={MapPin} title="Visit Us">
                <p>Telibandha, Raipur, Chhattisgarh, India</p>
              </ContactInfoItem>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  id="name"
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <FormField
                  id="email"
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <FormField
                id="subject"
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
              <FormField
                id="message"
                label="Message"
                type="textarea"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                 placeholder="Share your questions, feedback, or ideas.."
              />

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {status === "sending" ? (
                    <>
                      <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 -mr-1 h-5 w-5" />
                    </>
                  )}
                </button>

                {status === "success" && (
                  <div className="flex items-center space-x-2 text-green-600 transition-opacity duration-300">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">
                      Message sent successfully!
                    </span>
                  </div>
                )}

                {status === "error" && (
                  <div className="flex items-center space-x-2 text-red-600 transition-opacity duration-300">
                    <span className="font-medium">
                      Something went wrong. Try again.
                    </span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
