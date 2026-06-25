import { getPayloadInstance } from '../../../lib/payload'
import FleetPageClient from './FleetPageClient'

async function getFleetPageData() {
  try {
    const payload = await getPayloadInstance();
    const [pageData, siteSettings] = await Promise.all([
      payload.findGlobal({ slug: 'fleet-page' }),
      payload.findGlobal({ slug: 'site-settings' }),
    ]);
    return { ...pageData, siteSettings };
  } catch {
    return null;
  }
}

export async function generateMetadata() {
  const data = await getFleetPageData()
  
  if (!data?.seo) {
    return {
      title: 'Fleet | Khalai Makhlooq',
      description: 'Explore the KMHQ fleet.',
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
  const data = await getFleetPageData()
  
  return <FleetPageClient data={data} />
}
