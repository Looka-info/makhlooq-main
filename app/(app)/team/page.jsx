import { getPayloadInstance } from '../../../lib/payload'
import TeamPageClient from './TeamPageClient'

export const dynamic = 'force-dynamic';

async function getTeamPageData() {
  try {
    const payload = await getPayloadInstance();
    const [pageData, siteSettings] = await Promise.all([
      payload.findGlobal({ slug: 'team-page' }),
      payload.findGlobal({ slug: 'site-settings' }),
    ]);
    return { ...pageData, siteSettings };
  } catch {
    return null;
  }
}

export async function generateMetadata() {
  const data = await getTeamPageData()
  
  if (!data?.seo) {
    return {
      title: 'Team | Khalai Makhlooq',
      description: 'Meet the KMHQ team.',
    }
  }

  return {
    title: data.seo.title,
    description: data.seo.description,
    openGraph: {
      title: data.seo.title,
      description: data.seo.description,
      images: data.seo.imageUrl ? [{ url: data.seo.imageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.seo.title,
      description: data.seo.description,
      images: data.seo.imageUrl ? [data.seo.imageUrl] : [],
    },
  }
}

export default async function Page() {
  const data = await getTeamPageData()
  
  return <TeamPageClient data={data} />
}
