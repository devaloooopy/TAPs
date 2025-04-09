import React, { useState, useEffect } from 'react';
// Import react-icons instead of @expo/vector-icons
import {
    FiPhone, FiMail, FiGlobe, FiMapPin, FiBriefcase, FiShare2, FiUserPlus, FiUserCheck, FiShare, FiChevronLeft // Example icons from Feather
} from 'react-icons/fi';
import {
    FaFacebookF, FaInstagram, FaYoutube, FaTwitter, FaTiktok, FaLinkedinIn, FaTelegramPlane, FaGithub, FaPinterestP, FaPaypal, FaSnapchatGhost, FaWhatsapp, FaViber, FaSkype, FaDiscord, FaRedditAlien, FaBehance, FaEtsy, FaWeixin, FaMediumM, FaLink, FaTimes // Example icons from FontAwesome
} from 'react-icons/fa';
// If using MaterialCommunityIcons mapping, import appropriate icons from 'react-icons/md' or 'react-icons/io5', etc.

// --- Helper Function (Example Map URL - Adjust as needed) ---
const formatMapAddress = (addr) => addr || '';
const createMapUrl = (addr) => addr ? `https://maps.google.com/?q=${encodeURIComponent(addr)}` : null;

// --- Default Template Data (Same as before) ---
const defaultTemplate = {
    primary_color: '#6a11cb',
    secondary_color: '#2575fc',
    background_color: '#ffffff',
    text_color: '#333333',
    show_profile_image: true,
    icon_style: 'circle', // 'circle', 'square', 'rounded'
    layout_type: 'modern', // Example layout type
    font_family: 'inherit', // Use CSS inheritance or specific web font
    separator_color: '#e0e0e0',
};

// --- VCardTemplate React Component for Web ---
const VCardTemplate = ({ profile: rawProfile, template: rawTemplate, profileUrl /* Pass the public URL */ }) => {

    // --- Default Profile Data (For fallback/example) ---
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
             // ... same social links array
            { platform: 'Facebook', url: 'https://facebook.com/alexjdesigns' },
            { platform: 'Instagram', url: 'https://instagram.com/alexjdesigns' },
            { platform: 'Youtube', url: 'https://youtube.com/alexjdesigns' },
            { platform: 'X', url: 'https://twitter.com/alexjdesigns' },
            { platform: 'TikTok', url: 'https://tiktok.com/@alexjdesigns' },
            { platform: 'LinkedIn', url: 'https://linkedin.com/in/alexjdesigns' },
            { platform: 'Telegram', url: 'https://t.me/alexjdesigns' },
            { platform: 'GitHub', url: 'https://github.com/alexjdesigns' },
            { platform: 'Website', url: 'https://alexjdesigns.com' },
        ]
    };

    // --- Template Merging (Mostly same, adjust font_family) ---
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

    // --- States ---
    const [isLoading, setIsLoading] = useState(false); // For simulating actions
    const [copySuccess, setCopySuccess] = useState(''); // Feedback for copy action

    // --- Effects ---
    useEffect(() => {
        // Apply dynamic styles to the body or root element if needed
        document.documentElement.style.setProperty('--vcard-primary-color', template.primary_color);
        document.documentElement.style.setProperty('--vcard-secondary-color', template.secondary_color || template.primary_color);
        document.documentElement.style.setProperty('--vcard-background-color', template.background_color);
        document.documentElement.style.setProperty('--vcard-text-color', template.text_color);
        document.documentElement.style.setProperty('--vcard-font-family', template.font_family);
        document.documentElement.style.setProperty('--vcard-separator-color', template.separator_color);

        // Optional: Simulate initial load like in RN
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 500); // Shorter for web
        return () => {
            clearTimeout(timer);
            // Optional: Clean up CSS variables if component unmounts
        }
    }, [template]); // Re-run if template changes

    // --- Handlers ---
    const generateVCardFile = () => {
        // **Placeholder:** This requires generating a .vcf file string
        // based on profile data and triggering a download.
        // This can be done client-side or ideally via a serverless function.
        setIsLoading(true);
        console.log("Simulating generating vCard file...");
        alert('vCard generation/download not implemented yet.');
        setTimeout(() => setIsLoading(false), 1000);
    };

    const handleCopyText = async (textToCopy, label) => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopySuccess(`${label} Copied!`);
            setTimeout(() => setCopySuccess(''), 2000); // Clear feedback after 2s
        } catch (err) {
            console.error('Failed to copy: ', err);
            setCopySuccess(`Failed to copy ${label}`);
            setTimeout(() => setCopySuccess(''), 2000);
        }
    };

    const handleShareLink = async () => {
        const shareData = {
            title: `Connect with ${profile.name}`,
            text: `Check out ${profile.name}'s digital business card!`,
            url: profileUrl || window.location.href, // Use passed prop or current URL
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
                console.log('Link shared successfully');
            } else {
                // Fallback for browsers that don't support Web Share API
                handleCopyText(shareData.url, 'Profile Link');
                alert('Share API not supported. Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
            // Handle errors, e.g., user cancelled share
            if (err.name !== 'AbortError') {
                 alert('Could not share the link.');
            }
        }
    };

    const handleWebsiteLink = (url) => {
        if (!url) return;
        const safeUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
        window.open(safeUrl, '_blank', 'noopener,noreferrer');
    };

     // --- Icon Mapping (Using react-icons) ---
     const getSocialIconComponent = (platform) => {
        const p = platform?.toLowerCase();
        switch (p) {
            case 'facebook': return FaFacebookF;
            case 'instagram': return FaInstagram;
            case 'youtube': return FaYoutube;
            case 'x': case 'twitter': return FaTwitter; // Handle both 'X' and 'Twitter'
            case 'tiktok': return FaTiktok;
            case 'linkedin': return FaLinkedinIn;
            case 'telegram': return FaTelegramPlane;
            case 'github': return FaGithub;
            case 'website': return FiGlobe; // Using Feather icon for generic website
            case 'phone': return FiPhone;
            case 'email': return FiMail;
            case 'map': return FiMapPin;
            case 'pinterest': return FaPinterestP;
            case 'paypal': return FaPaypal;
            case 'snapchat': return FaSnapchatGhost;
            case 'whatsapp': return FaWhatsapp;
            case 'viber': return FaViber;
            case 'skype': return FaSkype;
            case 'discord': return FaDiscord;
            case 'reddit': return FaRedditAlien;
            case 'behance': return FaBehance;
            case 'etsy': return FaEtsy;
            case 'wechat': return FaWeixin;
            case 'medium': return FaMediumM;
            default: return FaLink; // Default link icon
        }
    };


    // --- Render Functions ---
    // Note: CSS classes used below are placeholders. You need to define them.
    const renderCardHeader = (title) => (
        <div className="vcard-card-header" style={{ backgroundColor: template.primary_color }}>
            <h3 className="vcard-card-header-text" style={{ color: template.background_color, fontFamily: template.font_family }}>
                {title}
            </h3>
        </div>
    );

    const renderInfoItem = (IconComponent, label, value, actionUrl, actionType = 'link', copyValue) => {
        const commonProps = {
             className: "vcard-info-item", // Add CSS Modules hash if used
             style: { backgroundColor: template.background_color === '#ffffff' ? '#f8f9fc' : 'rgba(255,255,255,0.08)' },
             // onClick: actionType !== 'link' ? () => {} : undefined, // Handle non-link actions if needed
             onDoubleClick: () => handleCopyText(copyValue || value, label), // Use double-click for copy on web? Or add button.
        };

        const content = (
            <>
                <div className="vcard-info-icon-container" style={{ backgroundColor: `${template.primary_color}20` }}>
                   {IconComponent && <IconComponent size={20} color={template.primary_color} aria-hidden="true" />}
                </div>
                <div className="vcard-info-text-container">
                    <span className="vcard-info-value" style={{ color: template.primary_color, fontFamily: template.font_family }}>{value}</span>
                    <span className="vcard-info-label" style={{ fontFamily: template.font_family, color: template.primary_color, opacity: 0.7 }}>{label}</span>
                </div>
                {actionUrl && (
                    <span className="vcard-info-action-icon" aria-label={`Open ${label}`}>
                        {actionType === 'tel' && <FiPhone size={20} color={template.primary_color} />}
                        {actionType === 'mailto' && <FiMail size={20} color={template.primary_color} />}
                        {actionType === 'map' && <FiMapPin size={20} color={template.primary_color} />}
                        {actionType === 'link' && <FiGlobe size={20} color={template.primary_color} />}
                         {/* Add copy button? */}
                        {/* <button onClick={() => handleCopyText(copyValue || value, label)}>Copy</button> */}
                    </span>
                )}
            </>
        );

        if (actionUrl && actionType !== 'copy') {
            const href = actionType === 'tel' ? `tel:${actionUrl}`
                       : actionType === 'mailto' ? `mailto:${actionUrl}`
                       : actionType === 'map' ? createMapUrl(actionUrl) // Use map URL generator
                       : (actionUrl.startsWith('http') ? actionUrl : `https://${actionUrl}`); // Default to external link
            return (
                <a href={href} target="_blank" rel="noopener noreferrer" {...commonProps} title={`Open ${label}`}>
                    {content}
                </a>
            );
        } else {
            // Render as div if no action or just copy
            return (
                <div {...commonProps} title={`Double-click to copy ${label}`}>
                    {content}
                </div>
            );
        }
    };


    const renderDetailsSection = () => (
        <section className="vcard-section-card" style={{ backgroundColor: template.background_color }}>
            {renderCardHeader("Details")}
            <div className="vcard-card-content">
                {profile.phone && renderInfoItem(FiPhone, 'Mobile', profile.phone, profile.phone, 'tel')}
                {profile.email && renderInfoItem(FiMail, 'Email', profile.email, profile.email, 'mailto')}
                {profile.website && renderInfoItem(FiGlobe, 'Website', profile.website, profile.website, 'link')}
                {profile.map_address && renderInfoItem(FiMapPin, 'Address', formatMapAddress(profile.map_address), profile.map_address, 'map')}

                {profile.company && (
                    <div className="vcard-company-container" style={{ backgroundColor: template.background_color === '#ffffff' ? '#f8f9fc' : 'rgba(255,255,255,0.08)' }}>
                        <FiBriefcase size={18} color={template.primary_color} style={{ marginRight: 12 }} aria-hidden="true" />
                        <span className="vcard-company-text" style={{ color: template.primary_color, fontFamily: template.font_family }}>{profile.company}</span>
                    </div>
                )}
                {profile.bio && (
                    <div className="vcard-bio-container" style={{ backgroundColor: template.background_color === '#ffffff' ? '#f8f9fc' : 'rgba(255,255,255,0.08)' }}>
                        <p className="vcard-bio-text" style={{ color: template.primary_color, fontFamily: template.font_family }}>{profile.bio}</p>
                    </div>
                )}
            </div>
        </section>
    );

    const renderSocialSection = () => {
        const socialLinks = profile?.social_links || [];
        if (!socialLinks || socialLinks.length === 0) return null;

        const iconStyle = template.icon_style || 'circle'; // 'circle', 'square', 'rounded'
        const iconSize = 28; // Adjust size for web

        const getIconWrapperStyle = (style) => ({
            border: `1.5px solid ${template.primary_color}`,
            borderRadius: style === 'square' ? '8px' : style === 'rounded' ? '15px' : '50%',
            // Add other styles common to the wrapper
        });

        return (
            <section className="vcard-section-card" style={{ backgroundColor: template.background_color }}>
                {renderCardHeader("Connect")}
                <div className="vcard-card-content vcard-social-card-content">
                    <div className="vcard-social-grid">
                        {socialLinks.map((link, index) => {
                            const IconComponent = getSocialIconComponent(link.platform);
                            const url = link.url?.startsWith('http') ? link.url : `https://${link.url}`;

                            if (!IconComponent || !link.url) return null; // Skip if no icon or URL

                            return (
                                <a
                                    key={index}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="vcard-social-item"
                                    title={`Visit ${profile.name} on ${link.platform}`}
                                >
                                    <div
                                        className="vcard-social-icon-container"
                                        style={getIconWrapperStyle(iconStyle)}
                                    >
                                        <IconComponent
                                            size={iconSize}
                                            color={template.primary_color}
                                            aria-label={link.platform}
                                        />
                                    </div>
                                    <span className="vcard-social-label" style={{ color: template.primary_color, fontFamily: template.font_family }}>
                                        {link.platform}
                                    </span>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    };

    // --- Main Render ---
    // Uses CSS variables set in useEffect for theming
    return (
        <div className="vcard-safe-area" style={{ backgroundColor: 'var(--vcard-background-color)' }}>
            {/* No StatusBar equivalent needed for web */}
            {/* No Back button logic from RN needed here unless part of a larger web app flow */}

            <div className="vcard-scroll-container"> {/* Simulate ScrollView with CSS overflow if needed */}
                {/* --- Header --- */}
                <header className="vcard-header-container">
                    {profile.cover_photo_url ? (
                        <img src={profile.cover_photo_url} alt="" className="vcard-cover-photo" /> // Added alt=""
                    ) : (
                        <div
                            className="vcard-cover-photo vcard-cover-gradient"
                            style={{ background: `linear-gradient(to right, var(--vcard-primary-color), var(--vcard-secondary-color))` }}
                        />
                    )}
                    <div className="vcard-header-overlay" />
                </header>

                {/* --- Profile Image --- */}
                 <div className="vcard-profile-image-wrapper"> {/* Wrapper for positioning */}
                    <div className="vcard-profile-image-container">
                        {template.show_profile_image && profile.profile_photo_url ? (
                            <img src={profile.profile_photo_url} alt={`${profile.name} profile`} className="vcard-profile-image" style={{ borderColor: 'var(--vcard-background-color)' }} />
                        ) : template.show_profile_image ? (
                             <div className="vcard-profile-image vcard-profile-placeholder" style={{ background: `linear-gradient(to bottom right, var(--vcard-primary-color), var(--vcard-secondary-color))`, borderColor: 'var(--vcard-background-color)' }}>
                                <span className="vcard-profile-placeholder-text" style={{ fontFamily: 'var(--vcard-font-family)' }}>
                                    {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
                                </span>
                            </div>
                        ) : null}
                    </div>
                 </div>


                {/* --- Main Content --- */}
                <main className="vcard-content-container">
                    <h1 className="vcard-name" style={{ color: 'var(--vcard-text-color)', fontFamily: 'var(--vcard-font-family)' }}>{profile.name}</h1>
                    <h2 className="vcard-title" style={{ color: 'var(--vcard-text-color)', fontFamily: 'var(--vcard-font-family)' }}>{profile.job_title}</h2>

                    {/* Quick Actions */}
                    <div className="vcard-quick-actions-container">
                         {profile.phone && <a href={`tel:${profile.phone}`} className="vcard-quick-action-btn" style={{ backgroundColor: `${template.primary_color}20`}} title="Call"><FiPhone size={20} color={template.primary_color} /></a>}
                         {profile.email && <a href={`mailto:${profile.email}`} className="vcard-quick-action-btn" style={{ backgroundColor: `${template.primary_color}20`}} title="Email"><FiMail size={20} color={template.primary_color} /></a>}
                         {profile.website && <button onClick={() => handleWebsiteLink(profile.website)} className="vcard-quick-action-btn" style={{ backgroundColor: `${template.primary_color}20`}} title="Website"><FiGlobe size={20} color={template.primary_color} /></button>}
                         <button onClick={handleShareLink} className="vcard-quick-action-btn" style={{ backgroundColor: `${template.primary_color}20`}} title="Share Profile"><FiShare2 size={20} color={template.primary_color} /></button>
                         {/* Add Copy Link button */}
                         <button onClick={() => handleCopyText(profileUrl || window.location.href, 'Profile Link')} className="vcard-quick-action-btn" style={{ backgroundColor: `${template.primary_color}20`}} title="Copy Link"><FaLink size={20} color={template.primary_color} /></button>
                    </div>

                    {/* Main Action Button - Placeholder for vCard Download */}
                    <div className="vcard-main-actions-container">
                        <button
                            className="vcard-main-action-button"
                            style={{ backgroundColor: template.primary_color, color: template.background_color }}
                            onClick={generateVCardFile}
                            disabled={isLoading}
                        >
                            {isLoading ?
                                <span className="vcard-spinner" /> // Use a CSS spinner
                                :
                                <FiUserPlus size={18} style={{ marginRight: 8 }} aria-hidden="true" />
                            }
                            <span style={{ fontFamily: 'var(--vcard-font-family)' }}>Save Contact (.vcf)</span>
                        </button>
                    </div>

                     {/* Copy feedback */}
                     {copySuccess && <div className="vcard-copy-feedback">{copySuccess}</div>}


                    {/* --- Render Sections --- */}
                    {renderDetailsSection()}
                    {renderSocialSection()}

                </main>

            </div> {/* End vcard-scroll-container */}

            {/* No Share Sheet needed, actions are inline */}

            {/* Loading Overlay - Simple version */}
            {isLoading && (
                <div className="vcard-loading-overlay">
                    <div className="vcard-spinner large" /> {/* Use a CSS spinner */}
                </div>
            )}
        </div> // End vcard-safe-area
    );
};

export default VCardTemplate;
