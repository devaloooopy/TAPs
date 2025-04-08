import { notFound } from 'next/navigation';
import VCardComponent from '@/components/VCardComponent';
import { getProfileById, getSocialLinksById, getTemplateById } from '@/lib/supabase';

// Enable dynamic rendering for this route
export const dynamic = 'force-dynamic';

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const { profile_id } = params;
  
  // Fetch profile data
  const { data: profile } = await getProfileById(profile_id);
  
  if (!profile) {
    return {
      title: 'Profile Not Found',
      description: 'The requested profile could not be found.',
    };
  }
  
  return {
    title: `${profile.name} - Digital Business Card`,
    description: profile.bio || `Connect with ${profile.name}`,
    openGraph: {
      title: `${profile.name} - Digital Business Card`,
      description: profile.bio || `Connect with ${profile.name}`,
      images: profile.profile_photo_url ? [{ url: profile.profile_photo_url }] : [],
    },
  };
}

// Main page component
export default async function ProfilePage({ params }) {
  const { profile_id } = params;
  
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
  
  // Combine profile with social links
  const completeProfile = {
    ...profile,
    social_links: socialLinks || [],
  };
  
  // Track view (optional - could be implemented with Supabase Edge Functions)
  // This would be a good place to increment a view counter
  
  return (
    <div className="min-h-screen">
      <VCardComponent 
        profile={completeProfile} 
        template={template} 
      />
    </div>
  );
}

// Create a not-found page
export function notFound() {
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