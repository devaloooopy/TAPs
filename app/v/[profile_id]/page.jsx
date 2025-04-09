import { notFound } from 'next/navigation';
import VCardComponent from '../../../components/VCardComponent.jsx';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://twevckswrtmufxxbhega.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3ZXZja3N3cnRtdWZ4eGJoZWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NDY3NTksImV4cCI6MjA1ODUyMjc1OX0.cvFyK2Ev_YjfvqYz1yFM3U8Is5Ee2ONLqqLqlOesgII';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Enable dynamic rendering for this route
export const dynamic = 'force-dynamic';

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const { profile_id } = params;
  
  // Fetch profile data
  const { data: profile, error } = await getProfileById(profile_id);
  
  if (error || !profile) {
    return {
      title: 'Profile Not Found',
      description: 'The requested profile could not be found.',
    };
  }
  
  return {
    title: `${profile.name || 'Contact'} | Digital Business Card`,
    description: profile.bio || `Connect with ${profile.name}`,
    openGraph: {
      title: `${profile.name || 'Contact'} | Digital Business Card`,
      description: profile.bio || `Connect with ${profile.name}`,
      images: profile.profile_photo_url ? [{ url: profile.profile_photo_url }] : [],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${profile.name || 'Contact'} | Digital Business Card`,
      description: profile.bio || `Connect with ${profile.name}`,
      images: profile.profile_photo_url ? [profile.profile_photo_url] : [],
    },
  };
}

// Fetch profile by ID
async function getProfileById(profileId) {
  if (!profileId) return { data: null, error: new Error('Profile ID is required') };
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single();
  
  return { data, error };
}

// Fetch social links by profile ID
async function getSocialLinksById(profileId) {
  if (!profileId) return { data: [], error: null };
  
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .eq('profile_id', profileId)
    .order('display_order', { ascending: true });
  
  return { data: data || [], error };
}

// Fetch template by ID
async function getTemplateById(templateId) {
  if (!templateId) return { data: null, error: null };
  
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('id', templateId)
    .single();
  
  return { data, error };
}

// Track profile view
async function trackProfileView(profileId, source = 'webpage') {
  try {
    if (!profileId) return;
    const timestamp = new Date().toISOString();
    
    // First check if a record exists for this profile
    const { data: existingRecord } = await supabase
      .from('vcard_analytics')
      .select('id, views')
      .eq('profile_id', profileId)
      .maybeSingle();
    
    let error;
    
    if (existingRecord) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('vcard_analytics')
        .update({
          views: (existingRecord.views || 0) + 1,
          updated_at: timestamp
        })
        .eq('id', existingRecord.id);
      
      error = updateError;
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('vcard_analytics')
        .insert({
          profile_id: profileId,
          views: 1,
          updated_at: timestamp
        });
      
      error = insertError;
    }
    
    if (error) {
      console.error('Error updating vcard_analytics:', error.message);
    }
    
    // Also log individual view event for detailed analytics
    try {
      const { error: insertError } = await supabase
        .from('analytics_events')
        .insert({
          profile_id: profileId,
          event_type: 'view',
          event_data: {
            source
          },
          created_at: timestamp
        });
      
      if (insertError) {
        console.error('Error logging analytics event:', insertError.message);
      }
    } catch (insertError) {
      console.error('Error logging analytics event:', insertError);
    }
  } catch (error) {
    console.error('Error tracking analytics:', error);
    // Non-blocking - continue even if analytics fails
  }
}

// Main page component
export default async function ProfilePage({ params, searchParams }) {
  const { profile_id } = params;
  const format = searchParams?.format || 'html';
  const source = searchParams?.source || 'direct';
  
  // Fetch profile data
  const { data: profile, error: profileError } = await getProfileById(profile_id);
  
  // If profile not found, show 404 page
  if (profileError || !profile) {
    notFound();
  }
  
  // Fetch social links
  const { data: socialLinks } = await getSocialLinksById(profile_id);
  
  // Fetch template if profile has a template_id
  let template = null;
  if (profile.template_id) {
    const { data: templateData } = await getTemplateById(profile.template_id);
    template = templateData;
  }
  
  // Track this access for analytics (non-blocking)
  trackProfileView(profile_id, source).catch(console.error);
  
  // Handle vCard format request
  if (format === 'vcard') {
    // This would need to be handled by the API or a special route
    // For client-side, we'd typically redirect to an API endpoint that handles this
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Redirecting to download vCard...</p>
          <script dangerouslySetInnerHTML={{ 
            __html: `window.location.href = "/api/vcard/${profile_id}";` 
          }} />
        </div>
      </div>
    );
  }
  
  // For JSON format, you'd typically handle this via an API endpoint
  // Here we'll just render the normal view
  
  // Combine profile with social links and customization options
  const completeProfile = {
    ...profile,
    social_links: socialLinks || [],
  };
  
  // Extract customization options
  const customOptions = {
    primaryColor: profile.custom_primary_color || '#6a11cb',
    secondaryColor: profile.custom_secondary_color || '#2575fc',
    backgroundColor: profile.custom_background_color || '#ffffff',
    textColor: profile.custom_text_color || '#333333',
    showProfileImage: profile.custom_show_profile_image !== undefined ? profile.custom_show_profile_image : true,
    iconStyle: profile.custom_icon_style || 'circle', // circle, square, rounded
    layoutType: profile.custom_layout_type || 'modern',
    fontFamily: profile.custom_font_family || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    separatorColor: profile.custom_separator_color || '#e0e0e0',
  };
  
  return (
    <div className="min-h-screen">
      <VCardComponent
        profile={completeProfile}
        template={template}
        customOptions={customOptions}
        shareUrl={`${supabaseUrl}/functions/v1/vcard/p/${profile_id}`}
      />
      
      {/* Download vCard button */}
      <div className="fixed bottom-4 right-4 z-50">
        <a 
          href={`/api/vcard/${profile_id}?format=vcard`}
          download={`${profile.name || 'contact'}.vcf`}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m-9 0H3.375c-.621 0-1.125.504-1.125 1.125v9.75c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5" />
          </svg>
          Save Contact
        </a>
      </div>
    </div>
  );
}

// Create a custom not-found page component - renamed to avoid conflict
export function CustomNotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h1>
        <p className="text-gray-600 mb-6">The digital business card you're looking for doesn't exist or has been removed.</p>
        <a href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Go Home
        </a>
      </div>
    </div>
  );
}
