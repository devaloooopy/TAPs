'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiPhone, FiMail, FiGlobe, FiMapPin, FiBriefcase, FiShare2, FiChevronLeft, FiUserPlus, FiExternalLink, FiSend, FiLink, FiChevronRight } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub, FaYoutube, FaTiktok, FaTelegramPlane, FaWhatsapp, FaSnapchatGhost, FaRedditAlien, FaDiscord, FaPinterestP, FaEtsy, FaBehance, FaWeixin, FaMediumM, FaPaypal, FaViber, FaSkype } from 'react-icons/fa';
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
  enable_animations: true,
};

// Helper functions - Updated to handle Google Maps shortened URLs
const formatMapAddress = (addr) => addr || '';
const createMapUrl = (addr) => {
  if (!addr) return null;
  
  // Check if the address is already a Google Maps URL (including shortened URLs)
  if (addr.startsWith('http://') || addr.startsWith('https://')) {
    if (addr.includes('maps.google.com') || addr.includes('maps.app.goo.gl') || addr.includes('goo.gl/maps')) {
      return addr; // Return the URL as is
    }
  }
  
  // Otherwise, create a new Google Maps URL from the address
  return `https://maps.google.com/?q=${encodeURIComponent(addr)}`;
};

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

  // State and refs
  const [isLoading, setIsLoading] = useState(false);
  const [shareOptionsVisible, setShareOptionsVisible] = useState(false);
  const shareSheetRef = useRef(null);
  
  // Enhanced helper function to determine contrasting text color for backgrounds
  // More robust implementation similar to VCardTemplate.js
  const getContrastingTextColor = (bgColor) => {
    if (!bgColor) return '#FFFFFF';
    try {
      // Handle colors with or without # prefix
      let color = bgColor;
      if (color.startsWith('#')) {
        color = color.substring(1);
      }
      
      // Handle shorthand hex (e.g., #FFF)
      if (color.length === 3) {
        color = color.split('').map(c => c + c).join('');
      }
      
      // Parse RGB components
      const r = parseInt(color.substring(0, 2), 16);
      const g = parseInt(color.substring(2, 4), 16);
      const b = parseInt(color.substring(4, 6), 16);
      
      // Check if parsing was successful
      if (isNaN(r) || isNaN(g) || isNaN(b)) {
        return '#FFFFFF';
      }
      
      // Formula for perceived brightness (Luma)
      // Using the same formula as in VCardTemplate.js for consistency
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      
      // Use black text on light backgrounds, white text on dark backgrounds
      return luma > 128 ? '#000000' : '#FFFFFF';
    } catch (e) {
      console.error('Error calculating contrast:', e);
      return '#FFFFFF'; // Fallback to white on error
    }
  };

  // Effects
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Effect for share sheet animation - enhanced with spring animation similar to VCardTemplate.js
  useEffect(() => {
    if (shareSheetRef.current) {
      if (shareOptionsVisible) {
        // Apply spring-like animation for a more natural feel
        shareSheetRef.current.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease';
        shareSheetRef.current.style.transform = 'translateY(0)';
        shareSheetRef.current.style.opacity = '1';
      } else {
        shareSheetRef.current.style.transition = 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.2s ease';
        shareSheetRef.current.style.transform = 'translateY(100%)';
        shareSheetRef.current.style.opacity = '0';
      }
    }
  }, [shareOptionsVisible]);

  // Handlers
  const handleCall = (number) => number && window.open(`tel:${number}`, '_blank');
  const handleEmail = (email) => email && window.open(`mailto:${email}`, '_blank');
  const handleWebsite = (url) => {
    if (!url) return;
    const safeUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    window.open(safeUrl, '_blank');
  };
  
  // Updated handleMapAddress function to work with shortened URLs
  const handleMapAddress = (address) => {
    if (!address) return;
    try {
      const mapUrl = createMapUrl(address);
      if (mapUrl) window.open(mapUrl, '_blank');
    } catch (error) {
      console.error('Map Error:', error);
    }
  };
  
  const handleCopyText = async (text, label = 'Text') => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${label} copied to clipboard!`);
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
  const importToContacts = async () => {
    setIsLoading(true);
    try {
      // Simulate a delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      // The actual download happens through the href attribute of the save button
      alert(`${profile.name}'s contact has been saved to your device.`);
    } catch (error) {
      console.error('Error saving contact:', error);
      alert('There was an error saving the contact.');
    } finally {
      setIsLoading(false);
    }
  };

  // Icon mapping - expanded to match VCardTemplate.js
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
      case 'whatsapp': return <FaWhatsapp />;
      case 'snapchat': return <FaSnapchatGhost />;
      case 'reddit': return <FaRedditAlien />;
      case 'discord': return <FaDiscord />;
      case 'pinterest': return <FaPinterestP />;
      case 'etsy': return <FaEtsy />;
      case 'behance': return <FaBehance />;
      case 'wechat': return <FaWeixin />;
      case 'medium': return <FaMediumM />;
      case 'paypal': return <FaPaypal />;
      case 'viber': return <FaViber />;
      case 'skype': return <FaSkype />;
      default: return <FiLink />;
    }
  };
  
  // Get icon action based on type
  const getIconAction = (icon) => {
    switch (icon) {
      case 'phone': return <FiPhone />;
      case 'mail': return <FiSend />;
      case 'globe': return <FiExternalLink />;
      default: return <FiChevronLeft />;
    }
  };

  // Render card header - enhanced to match VCardTemplate.js
  const renderCardHeader = (title) => (
    <div 
      className="py-3.5 px-5 rounded-t-lg shadow-sm" 
      style={{ 
        backgroundColor: template.primary_color,
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px'
      }}
    >
      <h3 
        className="text-base font-bold text-center uppercase tracking-wider" 
        style={{ 
          fontFamily: template.font_family,
          color: template.background_color,
          letterSpacing: '0.08em'
        }}
      >
        {title}
      </h3>
    </div>
  );

  // Render info item with enhanced functionality - matching VCardTemplate.js
  const renderInfoItem = (icon, label, value, action, copyValue) => (
    <div 
      className="flex items-center p-4 mb-2 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
      style={{ 
        backgroundColor: template.background_color === '#ffffff' ? '#f8f9fc' : 'rgba(255,255,255,0.08)' 
      }}
      onClick={action}
      onDoubleClick={() => handleCopyText(copyValue || value, label)}
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
      {action && (
        <div className="flex items-center justify-center">
          {icon.type === FiPhone || icon.type.name === 'MdPhone' ? 
            <FiPhone size={20} color={template.primary_color} /> : 
           icon.type === FiMail || icon.type.name === 'MdEmail' ? 
            <FiSend size={20} color={template.primary_color} /> : 
           icon.type === FiGlobe ? 
            <FiExternalLink size={20} color={template.primary_color} /> : 
           icon.type === FiMapPin || icon.type.name === 'MdLocationOn' ? 
            <FiChevronRight size={20} color={template.primary_color} /> : 
            <FiChevronRight size={20} color={template.primary_color} />}
        </div>
      )}
    </div>
  );

  // Render details section - enhanced to match VCardTemplate.js
  const renderDetailsSection = () => (
    <div className="mb-6 rounded-lg overflow-hidden shadow-md" style={{ 
      backgroundColor: template.background_color,
      borderRadius: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)'
    }}>
      {renderCardHeader("Details")}
      <div className="p-4">
        {profile.phone && renderInfoItem(<FiPhone />, "Mobile", profile.phone, () => handleCall(profile.phone), profile.phone)}
        {profile.email && renderInfoItem(<FiMail />, "Email", profile.email, () => handleEmail(profile.email), profile.email)}
        {profile.website && renderInfoItem(<FiGlobe />, "Website", profile.website, () => handleWebsite(profile.website), profile.website)}
        {profile.map_address && renderInfoItem(<FiMapPin />, "ADDRESS", profile.location_name || "Location", () => handleMapAddress(profile.map_address), profile.map_address)}
        
        {profile.company && (
          <div 
            className="flex items-center p-4 mb-2 rounded-lg"
            style={{ 
              backgroundColor: template.background_color === '#ffffff' ? '#f8f9fc' : 'rgba(255,255,255,0.08)' 
            }}
          >
            <div 
              className="flex items-center justify-center w-10 h-10 rounded-full mr-4"
              style={{ backgroundColor: `${template.primary_color}20` }}
            >
              <FiBriefcase size={20} color={template.primary_color} />
            </div>
            <div className="flex-1">
              <div 
                className="text-lg font-medium"
                style={{ 
                  color: template.primary_color, 
                  fontFamily: template.font_family 
                }}
              >
                {profile.company}
              </div>
              <div 
                className="text-sm"
                style={{ 
                  fontFamily: template.font_family, 
                  color: template.primary_color, 
                  opacity: 0.7 
                }}
              >
                Company
              </div>
            </div>
          </div>
        )}
        
        {profile.bio && (
          <div 
            className="p-4 rounded-lg mt-3"
            style={{ 
              backgroundColor: template.background_color === '#ffffff' ? '#f8f9fc' : 'rgba(255,255,255,0.08)' 
            }}
          >
            <p 
              className="text-sm leading-relaxed"
              style={{ 
                color: template.primary_color, 
                fontFamily: template.font_family,
                lineHeight: '1.6'
              }}
            >
              {profile.bio}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // Render social section with enhanced styling - more similar to VCardTemplate.js
  const renderSocialSection = () => {
    const socialLinks = profile?.social_links || [];
    if (!socialLinks || socialLinks.length === 0) return null;

    const iconStyle = template.icon_style || 'circle';
    const iconContainerSize = 70; // Matching VCardTemplate.js size
    const iconBorderSize = 1.5;
    
    // Get border radius based on icon style - similar to VCardTemplate.js
    const getBorderRadius = (style) => {
      return style === 'square' ? '12px' : 
             style === 'rounded' ? '20px' : 
             '50%';
    };
    
    // Animation classes based on template settings
    const animationClass = template.enable_animations ? 'transition-transform hover:scale-105' : '';

    return (
      <div 
        className="mb-6 rounded-lg overflow-hidden shadow-md" 
        style={{ 
          backgroundColor: template.background_color,
          borderRadius: '20px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)'
        }}
      >
        {renderCardHeader("Connect")}
        <div className="p-5 pt-6 pb-2"> {/* Adjusted padding to match VCardTemplate.js */}
          <div className="flex flex-wrap justify-around"> {/* Using flex instead of grid for better matching */}
            {socialLinks.map((link, index) => {
              const icon = getSocialIcon(link.platform);
              
              return (
                <div 
                  key={index}
                  className={`w-1/3 flex flex-col items-center mb-5 px-1.5 ${animationClass}`}
                  style={{ maxWidth: '33%' }}
                >
                  <button
                    className="flex items-center justify-center mb-2 hover:opacity-80 transition-all cursor-pointer focus:outline-none"
                    onClick={() => handleWebsite(link.url)}
                    style={{
                      width: `${iconContainerSize}px`,
                      height: `${iconContainerSize}px`,
                      backgroundColor: 'transparent',
                      borderWidth: `${iconBorderSize}px`,
                      borderColor: template.primary_color,
                      borderRadius: getBorderRadius(iconStyle),
                      borderStyle: 'solid'
                    }}
                  >
                    <div 
                      style={{ 
                        color: template.primary_color,
                        fontSize: `${iconContainerSize * 0.45}px` 
                      }}
                    >
                      {icon}
                    </div>
                  </button>
                  <span 
                    className="text-xs text-center truncate w-full font-medium"
                    style={{ 
                      color: template.primary_color, 
                      fontFamily: template.font_family,
                      marginTop: '2px'
                    }}
                  >
                    {link.platform}
                  </span>
                </div>
              );
            })}
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

        {/* Profile Image - enhanced to match VCardTemplate.js */}
        <div className="flex justify-center -mt-16 relative z-10">
          {template.show_profile_image && profile.profile_photo_url ? (
            <div className="rounded-full shadow-lg" style={{ 
              width: '120px', 
              height: '120px',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)'
            }}>
              <img 
                src={profile.profile_photo_url} 
                alt={profile.name} 
                className="w-full h-full rounded-full object-cover border-4"
                style={{ borderColor: template.background_color }}
              />
            </div>
          ) : template.show_profile_image ? (
            <div 
              className="rounded-full flex items-center justify-center text-5xl font-bold border-4 shadow-lg"
              style={{ 
                width: '120px', 
                height: '120px',
                background: `linear-gradient(to right, ${template.primary_color}, ${template.secondary_color || template.primary_color})`,
                borderColor: template.background_color,
                fontFamily: template.font_family,
                color: '#ffffff',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)'
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

          {/* Main Action Button - enhanced to match VCardTemplate.js */}
          <div className="mb-8 flex justify-center w-full px-5">
            <a 
              href={`data:text/vcard;charset=UTF-8,BEGIN:VCARD%0AVERSION:3.0%0AFN:${encodeURIComponent(profile.name || '')}%0ATEL:${encodeURIComponent(profile.phone || '')}%0AEMAIL:${encodeURIComponent(profile.email || '')}%0AORG:${encodeURIComponent(profile.company || '')}%0ATITLE:${encodeURIComponent(profile.job_title || '')}%0AURL:${encodeURIComponent(profile.website || '')}%0AEND:VCARD`} 
              download={`${profile.name.replace(/\s+/g, '_')}.vcf`}
              onClick={importToContacts}
              className="flex items-center justify-center py-4 px-8 rounded-full w-full max-w-[90%] transition-transform hover:shadow-lg active:scale-95"
              style={{ 
                backgroundColor: template.primary_color,
                color: template.background_color,
                fontFamily: template.font_family,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                minHeight: '50px',
                fontWeight: '600',
                fontSize: '16px'
              }}
            >
              {isLoading ? (
                <div className="mr-2 w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: template.background_color }} />
              ) : (
                <FiUserPlus className="w-5 h-5 mr-2" color={template.background_color} />
              )}
              <span>Save Contact</span>
            </a>
          </div>

          {/* Render Sections */}
          {renderDetailsSection()}
          {renderSocialSection()}
          
          {/* Footer */}
          <div className="footer" style={{
              textAlign: 'center',
              padding: '20px',
              fontSize: '12px',
              color: template.primary_color,
              opacity: 0.7,
              borderTop: `1px solid ${template.separator_color}`,
              marginTop: '10px'
            }}>
            Created with <a href="https://tapconnect.com" target="_blank" style={{ color: template.primary_color, textDecoration: 'none' }}><strong>TapConnect</strong></a>
          </div>
        </div>
      </div>

      {/* Share Options Sheet with animation - styled similar to VCardTemplate.js */}
      {shareOptionsVisible && (
        <div className="fixed inset-0 bg-black/55 z-50" onClick={() => setShareOptionsVisible(false)}>
          <div 
            ref={shareSheetRef}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl w-full max-w-md mx-auto p-6 transform translate-y-full opacity-0 shadow-lg"
            onClick={e => e.stopPropagation()}
            style={{ 
              transitionProperty: 'transform, opacity',
              zIndex: 100,
              paddingBottom: '30px'
            }}
          >
            {/* Handle bar similar to VCardTemplate */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-2.5"></div>
            
            <h3 
              className="text-lg font-semibold text-center mb-6"
              style={{ 
                fontFamily: template.font_family,
                color: template.primary_color 
              }}
            >
              Share Options
            </h3>
            
            {/* Share options container - simplified to match VCardTemplate.js */}
            <div className="flex justify-evenly px-5 mb-6">
              {/* Save as vCard option */}
              <button 
                className="flex flex-col items-center max-w-[40%]"
                onClick={() => {
                  setShareOptionsVisible(false);
                  importToContacts();
                }}
              >
                <div 
                  className="w-15 h-15 rounded-full flex items-center justify-center mb-2.5"
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    backgroundColor: '#4CAF50' 
                  }}
                >
                  <FiUserPlus size={26} color="white" />
                </div>
                <span 
                  className="text-sm text-center"
                  style={{ 
                    fontFamily: template.font_family,
                    color: template.primary_color 
                  }}
                >
                  Save as vCard
                </span>
              </button>
              
              {/* Share Link option */}
              <button 
                className="flex flex-col items-center max-w-[40%]"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                  setShareOptionsVisible(false);
                }}
              >
                <div 
                  className="w-15 h-15 rounded-full flex items-center justify-center mb-2.5"
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    backgroundColor: '#2196F3' 
                  }}
                >
                  <FiShare2 size={26} color="white" />
                </div>
                <span 
                  className="text-sm text-center"
                  style={{ 
                    fontFamily: template.font_family,
                    color: template.primary_color 
                  }}
                >
                  Share Link
                </span>
              </button>
            </div>
            
            {/* Cancel button - styled to match VCardTemplate.js */}
            <button 
              className="w-full py-4 text-center font-medium text-red-600 border-t"
              style={{ 
                borderTopColor: template.separator_color,
                fontFamily: template.font_family 
              }}
              onClick={() => setShareOptionsVisible(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Loading Overlay - added to match VCardTemplate.js */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-[200]">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${template.primary_color}40`, borderTopColor: 'transparent' }}></div>
        </div>
      )}
    </div>
  );
};

export default VCardComponent;
