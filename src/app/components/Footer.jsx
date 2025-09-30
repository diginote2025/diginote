import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      href: "https://www.facebook.com/profile.php?id=61578936504467",
      icon: FaFacebookF,
      label: "Facebook",
    },
    {
      href: "https://www.instagram.com/ai_diginote?igsh=MTR4MWl4M3ZvMXowdA==",
      icon: FaInstagram,
      label: "Instagram",
    },
  ];

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/features", label: "Features" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact Us" },
  ];

  const contactInfo = [
    { icon: FiMail, text: "diginote2025@gmail.com" },
    { icon: FiPhone, text: "+91 7470578448" },
    { icon: FiMapPin, text: "Telibandha, Raipur, Chhattisgarh, India" },
  ];

  const serviceLinks = [
    { href: "/features/ai-notebook-maker", label: "Ai Notebook Maker" },
    { href: "/features/ai-mcq-practice", label: "Ai MCQ Practice" },
    { href: "/features/ai-unit-test", label: "Ai Unit Test" },
    {
      href: "/features/topic-wise-youtube-video",
      label: "Topic Wise Youtube Video",
    },
  ];

  return (
    <footer className="bg-white text-gray-700 font-sans">
      {/* Main Footer Section */}
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Logo, Description & Socials */}
          <div className="space-y-4">
            {/* Brand */}
            <div className="flex gap-5">
              <Link href="/" className="text-2xl">
                <Image
                  src={"/images/homepage/navbar/logo.png"}
                  alt="diginote logo"
                  width={1000}
                  height={1000}
                  className="w-36"
                />
              </Link>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">
              DigiNote is Best AI Tool for Students: Generate free notes, MCQs, YouTube summaries, and practice mock tests online.
            </p>
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 bg-gray-200 hover:bg-indigo-600 text-gray-700 hover:text-white rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="md:mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Navigation
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Features
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div className="md:mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <item.icon className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl text-center mx-auto flex flex-col sm:flex-row justify-center items-center text-sm space-y-2 sm:space-y-0">
          <p>&copy; {currentYear} <a href="/">DigiNote</a>. All Rights Reserved.</p>
          {/* <div className="flex space-x-6">
            <Link href="/terms" className="hover:text-white transition-colors duration-300">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors duration-300">
              Privacy Policy
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
