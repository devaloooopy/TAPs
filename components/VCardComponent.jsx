'use client';

import React, { useState, useEffect } from 'react';
import { FiPhone, FiMail, FiGlobe, FiMapPin, FiBriefcase, FiShare2, FiChevronLeft } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub, FaYoutube, FaTiktok, FaTelegramPlane } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

// Default template settings
const defaultTemplate = {
  primary_color: '#6a11cb',
  secondary_color: '#2575fc',
  background_color: '#ffffff',
  text_color: '#333333',
  show_profile_image: true,
  icon_style: 'circle',
  layout_type: 'modern',
  font_family: 'system-ui, sans-serif',
  separator_color: '#e0e0e0',
};

// Helper functions
const formatMapAddress = (addr) => addr || '';
const createMapUrl = (addr) => addr ? `https://maps.google.com/?q=${encodeURIComponent(addr)}` : null;

const VCardComponent = ({ profile: rawProfile, template: rawTemplate, onBack }) => {
  // Default profile data if none is provided
  const profile = rawProfile || {
    name: "Alex Johnson",
    job_title: "Lead UX Designer | Innovator",
    profile_photo_url: `https://i.pravatar.cc/150?u=${Math.random()}`,
    cover_photo_url: `https://picsum.photos/seed/${Math.random()}/800/400`,
    phone: '555-123-4567',
    email: 'alex.johnson@example.com',
    website: 'alexjdesigns.com',
    map_address: '1 Infinite Loop, Cupertino, CA 95014',
    bio: 'Passionate designer creating intuitive and beautiful user experiences. Always exploring new tech and design trends. Let\'s connect!',
    company: 'Tech Solutions Inc.',
    social_links: [
      { platform: 'Facebook', url: 'https://facebook.com/alexjdesigns' },
      { platform: 'Instagram', url: 'https://instagram.com/alexjdesigns' },
      { platform: 'Youtube', url: 'https://youtube.com/alexjdesigns' },
      { platform: 'Twitter', url: 'https://twitter.com/alexjdesigns' },
      { platform: 'TikTok', url: 'https://tiktok.com/@alexjdesigns' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/alexjdesigns' },
      { platform: 'Telegram', url: 'https://t.me/alexjdesigns' },
      { platform: 'GitHub', url: 'https://github.com/alexjdesigns' },
      { platform: 'Website', url: 'https://alexjdesigns.com' },
    ]
  };

  // Merge template settings
  const template = {
    ...defaultTemplate,
    ...rawTemplate,
    primary_color: rawProfile?.custom_primary_color || rawTemplate?.primary_color || defaultTemplate.primary_color,
    background_color: rawProfile?.custom_background_color || rawTemplate?.background_color || defaultTemplate.background_color,
    text_color: rawProfile?.custom_text_color || rawTemplate?.text_color || defaultTemplate.text_color,
    show_profile_image: rawProfile?.custom_show_profile_image !== undefined ? rawProfile.custom_show_profile_image : (rawTemplate?.show_profile_image !== undefined ? rawTemplate.show_profile_image : defaultTemplate.show_profile_image),
    icon_style: rawProfile?.custom_icon_style || rawTemplate?.icon_style || defaultTemplate.icon_style,
    layout_type: rawProfile?.custom_layout_type || rawTemplate?.layout_type || defaultTemplate.layout_type,
    font_family: rawProfile?.custom_font_family || rawTemplate?.font_family || defaultTemplate.font_family,
    secondary_color: rawProfile?.custom_secondary_color || rawTemplate?.secondary_color || defaultTemplate.secondary_color,
    separator_color: rawProfile?.custom_separator_color || rawTemplate?.separator_color || defaultTemplate.separator_color,
  };

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [shareOptionsVisible, setShareOptionsVisible] = useState(false);

  // Effects
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Handlers
  const handleCall = (number) => number && window.open(`tel:${number}`, '_blank');
  const handleEmail = (email) => email && window.open(`mailto:${email}`, '_blank');
  const handleWebsite = (url) => {
    if (!url) return;
    const safeUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    window.open(safeUrl, '_blank');
  };
  const handleMapAddress = (address) => {
    if (!address) return;
    try {
      const mapUrl = createMapUrl(address);
      if (mapUrl) window.open(mapUrl, '_blank');
    } catch (error) {
      console.error('Map Error:', error);
    }
  };
  const handleCopyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  const shareContact = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profile.name}'s Contact Card`,
        text: `Check out ${profile.name}'s digital business card!`,
        url: window.location.href,
      }).catch(err => console.error('Error sharing:', err));
    } else {
      setShareOptionsVisible(!shareOptionsVisible);
    }
  };

  // Icon mapping
  const getSocialIcon = (platform) => {
    const p = platform.toLowerCase();
    switch (p) {
      case 'facebook': return <FaFacebookF />;
      case 'twitter': return <FaTwitter />;
      case 'x': return <FaTwitter />; // Using Twitter icon for X
      case 'instagram': return <FaInstagram />;
      case 'linkedin': return <FaLinkedinIn />;
      case 'github': return <FaGithub />;
      case 'youtube': return <FaYoutube />;
      case 'tiktok': return <FaTiktok />;
      case 'telegram': return <FaTelegramPlane />;
      case 'website': return <FiGlobe />;
      case 'phone': return <MdPhone />;
      case 'email': return <MdEmail />;
      case 'map': return <MdLocationOn />;
      default: return <FiGlobe />;
    }
  };

  // Render card header
  const renderCardHeader = (title) => (
    <div 
      className="p-3 rounded-t-lg" 
      style={{ backgroundColor: template.primary_color }}
    >
      <h3 
        className="text-lg font-semibold" 
        style={{ 
          fontFamily: template.font_family,
          color: template.background_color 
        }}
      >
        {title}
      </h3>
    </div>
  );

  // Render info item
  const renderInfoItem = (icon, label, value, action, copyValue) => (
    <div 
      className="flex items-center p-4 mb-2 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
      style={{ 
        backgroundColor: template.background_color === '#ffffff' ? '#f8f9fc' : 'rgba(255,255,255,0.08)' 
      }}
      onClick={action}
      onDoubleClick={() => handleCopyText(copyValue || value)}
    >
      <div 
        className="flex items-center justify-center w-10 h-10 rounded-full mr-4"
        style={{ backgroundColor: `${template.primary_color}20` }}
      >
        {React.cloneElement(icon, { size: 20, color: template.primary_color })}
      </div>
      <div className="flex-1">
        <div 
          className="text-lg font-medium truncate"
          style={{ color: template.primary_color, fontFamily: template.font_family }}
        >
          {value}
        </div>
        <div 
          className="text-sm"
          style={{ 
            fontFamily: template.font_family, 
            color: template.primary_color, 
            opacity: 0.7 
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );

  // Render details section
  const renderDetailsSection = () => (
    <div className="mb-6 rounded-lg overflow-hidden shadow-md" style={{ backgroundColor: template.background_color }}>
      {renderCardHeader("Details")}
      <div className="p-4">
        {profile.phone && renderInfoItem(<FiPhone />, "Mobile", profile.phone, () => handleCall(profile.phone), profile.phone)}
        {profile.email && renderInfoItem(<FiMail />, "Email", profile.email, () => handleEmail(profile.email), profile.email)}
        {profile.website && renderInfoItem(<FiGlobe />, "Website", profile.website, () => handleWebsite(profile.website), profile.website)}
        {profile.map_address && renderInfoItem(<FiMapPin />, "Address", formatMapAddress(profile.map_address), () => handleMapAddress(profile.map_address), formatMapAddress(profile.map_address))}
        
        {profile.company && (
          <div 
            className="flex items-center p-4 mb-2 rounded-lg"
            style={{ 
              backgroundColor: template.background_color === '#ffffff' ? '#f8f9fc' : 'rgba(255,255,255,0.08)' 
            }}
          >
            <FiBriefcase size={18} color={template.primary_color} className="mr-3" />
            <span 
              style={{ 
                color: template.primary_color, 
                fontFamily: template.font_family 
              }}
            >
              {profile.company}
            </span>
          </div>
        )}
        
        {profile.bio && (
          <div 
            className="p-4 rounded-lg"
            style={{ 
              backgroundColor: template.background_color === '#ffffff' ? '#f8f9fc' : 'rgba(255,255,255,0.08)' 
            }}
          >
            <p 
              className="text-sm leading-relaxed"
              style={{ 
                color: template.primary_color, 
                fontFamily: template.font_family 
              }}
            >
              {profile.bio}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // Render social section
  const renderSocialSection = () => {
    const socialLinks = profile?.social_links || [];
    if (!socialLinks || socialLinks.length === 0) return null;

    const iconStyle = template.icon_style || 'circle';
    const getBorderRadius = (style) => {
      return style === 'square' ? '0.75rem' : 
             style === 'rounded' ? '1.25rem' : 
             '50%';
    };

    return (
      <div className="mb-6 rounded-lg overflow-hidden shadow-md" style={{ backgroundColor: template.background_color }}>
        {renderCardHeader("Connect")}
        <div className="p-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {socialLinks.map((link, index) => (
              <div 
                key={index}
                className="flex flex-col items-center justify-center p-2 hover:opacity-80 transition-opacity cursor-pointer"
                onClick={() => handleWebsite(link.url)}
              >
                <div 
                  className="flex items-center justify-center w-14 h-14 mb-2"
                  style={{
                    backgroundColor: 'transparent',
                    borderWidth: '1.5px',
                    borderColor: template.primary_color,
                    borderRadius: getBorderRadius(iconStyle),
                  }}
                >
                  <div style={{ color: template.primary_color }}>
                    {getSocialIcon(link.platform)}
                  </div>
                </div>
                <span 
                  className="text-xs text-center truncate w-full"
                  style={{ 
                    color: template.primary_color, 
                    fontFamily: template.font_family 
                  }}
                >
                  {link.platform}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: template.background_color }}>
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-white/30 backdrop-blur-sm"
          aria-label="Go back"
        >
          <FiChevronLeft size={24} color={template.background_color === '#ffffff' ? 'rgba(0,0,0,0.7)' : '#fff'} />
        </button>
      )}

      <div className="max-w-md mx-auto pb-20">
        {/* Header */}
        <div className="relative h-48 w-full">
          {profile.cover_photo_url ? (
            <img 
              src={profile.cover_photo_url} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div 
              className="w-full h-full" 
              style={{ 
                background: `linear-gradient(to right, ${template.primary_color}, ${template.secondary_color || template.primary_color})` 
              }}
            />
          )}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Profile Image */}
        <div className="flex justify-center -mt-16 relative z-10">
          {template.show_profile_image && profile.profile_photo_url ? (
            <img 
              src={profile.profile_photo_url} 
              alt={profile.name} 
              className="w-32 h-32 rounded-full object-cover border-4"
              style={{ borderColor: template.background_color }}
            />
          ) : template.show_profile_image ? (
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center text-3xl font-bold border-4"
              style={{ 
                background: `linear-gradient(to right, ${template.primary_color}, ${template.secondary_color || template.primary_color})`,
                borderColor: template.background_color,
                fontFamily: template.font_family,
                color: '#ffffff'
              }}
            >
              {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
            </div>
          ) : null}
        </div>

        {/* Main Content */}
        <div className="px-4 pt-4">
          <h1 
            className="text-2xl font-bold text-center"
            style={{ 
              color: template.primary_color, 
              fontFamily: template.font_family 
            }}
          >
            {profile.name}
          </h1>
          
          <h2 
            className="text-lg text-center mb-6"
            style={{ 
              color: template.primary_color, 
              fontFamily: template.font_family, 
              opacity: 0.9 
            }}
          >
            {profile.job_title}
          </h2>

          {/* Quick Actions */}
          <div className="flex justify-center space-x-3 mb-6">
            {profile.phone && (
              <button 
                className="p-3 rounded-full"
                style={{ backgroundColor: `${template.primary_color}20` }}
                onClick={() => handleCall(profile.phone)}
                aria-label="Call"
              >
                <FiPhone size={20} color={template.primary_color} />
              </button>
            )}
            
            {profile.email && (
              <button 
                className="p-3 rounded-full"
                style={{ backgroundColor: `${template.primary_color}20` }}
                onClick={() => handleEmail(profile.email)}
                aria-label="Email"
              >
                <FiMail size={20} color={template.primary_color} />
              </button>
            )}
            
            {profile.website && (
              <button 
                className="p-3 rounded-full"
                style={{ backgroundColor: `${template.primary_color}20` }}
                onClick={() => handleWebsite(profile.website)}
                aria-label="Website"
              >
                <FiGlobe size={20} color={template.primary_color} />
              </button>
            )}
            
            <button 
              className="p-3 rounded-full"
              style={{ backgroundColor: `${template.primary_color}20` }}
              onClick={shareContact}
              aria-label="Share"
            >
              <FiShare2 size={20} color={template.primary_color} />
            </button>
          </div>

          {/* Main Action Button */}
          <div className="mb-8">
            <a 
              href={`data:text/vcard;charset=UTF-8,BEGIN:VCARD%0AVERSION:3.0%0AFN:${encodeURIComponent(profile.name || '')}%0ATEL:${encodeURIComponent(profile.phone || '')}%0AEMAIL:${encodeURIComponent(profile.email || '')}%0AORG:${encodeURIComponent(profile.company || '')}%0ATITLE:${encodeURIComponent(profile.job_title || '')}%0AURL:${encodeURIComponent(profile.website || '')}%0AEND:VCARD`} 
              download={`${profile.name.replace(/\s+/g, '_')}.vcf`}
              className="flex items-center justify-center py-3 px-6 rounded-lg w-full"
              style={{ 
                backgroundColor: template.primary_color,
                color: template.background_color,
                fontFamily: template.font_family
              }}
            >
              {isLoading ? (
                <div className="mr-2 w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              )}
              <span>Save Contact</span>
            </a>
          </div>

          {/* Render Sections */}
          {renderDetailsSection()}
          {renderSocialSection()}
        </div>
      </div>

      {/* Share Options Sheet */}
      {shareOptionsVisible && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={() => setShareOptionsVisible(false)}>
          <div 
            className="bg-white rounded-t-xl w-full max-w-md p-6"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Share Contact</h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <button 
                className="flex flex-col items-center justify-center p-2"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                  setShareOptionsVisible(false);
                }}
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs">Copy Link</span>
              </button>
              
              <button 
                className="flex flex-col items-center justify-center p-2"
                onClick={() => {
                  window.open(`https://wa.me/?text=${encodeURIComponent(`Check out ${profile.name}'s digital business card! ${window.location.href}`)}`, '_blank');
                  setShareOptionsVisible(false);
                }}
              >
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-1">
                  <FaFacebookF className="text-green-600" />
                </div>
                <span className="text-xs">WhatsApp</span>
              </button>
              
              <button 
                className="flex flex-col items-center justify-center p-2"
                onClick={() => {
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                  setShareOptionsVisible(false);
                }}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                  <FaFacebookF className="text-blue-600" />
                </div>
                <span className="text-xs">Facebook</span>
              </button>
              
              <button 
                className="flex flex-col items-center justify-center p-2"
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${profile.name}'s digital business card!`)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
                  setShareOptionsVisible(false);
                }}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                  <FaTwitter className="text-blue-400" />
                </div>
                <span className="text-xs">Twitter</span>
              </button>
            </div>
            <button 
              className="w-full py-3 text-center text-gray-600 border-t border-gray-200"
              onClick={() => setShareOptionsVisible(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VCardComponent;