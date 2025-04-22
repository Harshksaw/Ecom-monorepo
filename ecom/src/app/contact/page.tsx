'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  FaPhone, 
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaTwitter
} from 'react-icons/fa';
import Wrapper from '../components/Wrapper';
import axios from 'axios';
import { API_URL } from '../lib/api';

// Centralized variables for easy maintenance
const CONTACT_INFO = {
  title: 'Get in Touch',
  subtitle: "We'd love to hear from you",
  description: 'Have questions about our products, services, or any other inquiries? Fill out the form below and our team will get back to you as soon as possible.',
  phones: [
    '+91 98765 43210',
    '+91 9782441137',
    '+91 7615952290',
    '+91 9461137445',
  ],
  email: 'support@yourjewelrystore.com',
  address: {
    line1: '123 Jewelry Avenue',
    line2: 'Gemstone District',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    country: 'India',
  },
  hours: {
    weekdays: 'Monday - Friday: 10:00 AM - 8:00 PM',
    weekends: 'Saturday - Sunday: 11:00 AM - 6:00 PM',
  },
  socialMedia: {
    whatsapp: 'https://wa.me/919876543210',
    instagram: 'https://www.instagram.com/shrinanugems?igsh=MW8wZ3JtMnc2c2F6Yw==',
    facebook: 'https://www.facebook.com/share/1BYZVxzmBg',
    twitter: 'https://x.com/shrinanu',
  },
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.949139008728!2d72.82766641489448!3d19.01699988712555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce40ffad7c8b%3A0x51d3a45f69913f5c!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1627894265658!5m2!1sen!2sin',
  formPlaceholders: {
    name: 'Your Name',
    email: 'Your Email',
    phone: 'Your Phone Number (Optional)',
    subject: 'Subject',
    message: 'Your Message',
    submitButton: 'Send Message',
  },
};

// Form field type for validation
interface FormField {
  value: string;
  error: string;
}

export default function ContactPage() {
  // Form state
  const [name, setName] = useState<FormField>({ value: '', error: '' });
  const [email, setEmail] = useState<FormField>({ value: '', error: '' });
  const [phone, setPhone] = useState<FormField>({ value: '', error: '' });
  const [subject, setSubject] = useState<FormField>({ value: '', error: '' });
  const [message, setMessage] = useState<FormField>({ value: '', error: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const [submitMessage, setSubmitMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setName({ ...name, error: '' });
    setEmail({ ...email, error: '' });
    setSubject({ ...subject, error: '' });
    setMessage({ ...message, error: '' });
    
    // Validate form
    let isValid = true;
    
    if (!name.value.trim()) {
      setName({ ...name, error: 'Name is required' });
      isValid = false;
    }
    
    if (!email.value.trim()) {
      setEmail({ ...email, error: 'Email is required' });
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
      setEmail({ ...email, error: 'Please enter a valid email address' });
      isValid = false;
    }
    
    if (!subject.value.trim()) {
      setSubject({ ...subject, error: 'Subject is required' });
      isValid = false;
    }
    
    if (!message.value.trim()) {
      setMessage({ ...message, error: 'Message is required' });
      isValid = false;
    }
    
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    try {
      await axios.post(`${API_URL}/api/contact`, { name: name.value, email: email.value, phone: phone.value, subject: subject.value, message: message.value });
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form on success
      setName({ value: '', error: '' });
      setEmail({ value: '', error: '' });
      setPhone({ value: '', error: '' });
      setSubject({ value: '', error: '' });
      setMessage({ value: '', error: '' });
      
      setSubmitSuccess(true);
      setSubmitMessage('Thank you for your message. We will get back to you soon!');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(null);
        setSubmitMessage('');
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitSuccess(false);
      setSubmitMessage('An error occurred while sending your message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <div className="py-12 bg-white">
        <div className="max-w-96 mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {CONTACT_INFO.title}
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              {CONTACT_INFO.subtitle}
            </p>
          </div>
          
          <div className="flex justify-center items-center space-x-4">
            {/* Contact Form */}
         
            {/* Contact Information */}
            <div>
              <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Contact Information
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Phone */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <FaPhone className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-3 text-base text-gray-700">
                        <p>Phone</p>
                        <ul className="mt-1 font-medium space-y-1">
                          {CONTACT_INFO.phones.map((phone, index) => (
                            <li key={index}>
                              <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-indigo-600">
                                {phone}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {/* Email */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <FaEnvelope className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-3 text-base text-gray-700">
                        <p>Email</p>
                        <p className="mt-1 font-medium">
                          <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-indigo-600">
                            {CONTACT_INFO.email}
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    {/* Address */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <FaMapMarkerAlt className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-3 text-base text-gray-700">
                        <p>Address</p>
                        <address className="mt-1 font-medium not-italic">
                          {CONTACT_INFO.address.line1}<br />
                          {CONTACT_INFO.address.line2}<br />
                          {CONTACT_INFO.address.city}, {CONTACT_INFO.address.state} {CONTACT_INFO.address.postalCode}<br />
                          {CONTACT_INFO.address.country}
                        </address>
                      </div>
                    </div>
                    
                    {/* Hours */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900">
                        Working Hours
                      </h3>
                      <p className="mt-2 text-gray-700">
                        {CONTACT_INFO.hours.weekdays}<br />
                        {CONTACT_INFO.hours.weekends}
                      </p>
                    </div>
                    
                    {/* Social Media */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900">
                        Connect With Us
                      </h3>
                      <div className="flex space-x-4 mt-3">
                        <a href={CONTACT_INFO.socialMedia.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600">
                          <FaWhatsapp className="h-6 w-6" />
                        </a>
                        <a href={CONTACT_INFO.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600">
                          <FaInstagram className="h-6 w-6" />
                        </a>
                        <a href={CONTACT_INFO.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600">
                          <FaFacebook className="h-6 w-6" />
                        </a>
                        <a href={CONTACT_INFO.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600">
                          <FaTwitter className="h-6 w-6" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Map */}
              {/* <div className="bg-white rounded-lg shadow-lg overflow-hidden h-80">
                <iframe
                  src={CONTACT_INFO.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  title="Store Location"
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}