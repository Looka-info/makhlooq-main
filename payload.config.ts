import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { fileURLToPath } from "url";

// Collections
import { Users } from "./src/payload/collections/Users";
import { Media } from "./src/payload/collections/Media";
import { NewsPosts } from "./src/payload/collections/NewsPosts";
import { Announcements } from "./src/payload/collections/Announcements";
import { FleetConfigs } from "./src/payload/collections/FleetConfigs";

// Globals
import { HomePage } from "./src/payload/globals/HomePage";
import { SiteSettings } from "./src/payload/globals/SiteSettings";
import { AboutPage, FleetPage, TeamPage } from "./src/payload/globals/OtherPages";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: "— KMHQ CMS",
      favicon: "/favicon.ico",
    },
    livePreview: {
      url: process.env.NEXT_PUBLIC_SERVER_URL || 'https://kmhq.org',
      collections: ['news-posts'],
      globals: ['home-page', 'site-settings', 'about-page', 'fleet-page', 'team-page'],
    },
  },
  collections: [Users, Media, NewsPosts, Announcements, FleetConfigs],
  globals: [HomePage, SiteSettings, AboutPage, FleetPage, TeamPage],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || "KMHQ_DEFAULT_SECRET_CHANGE_ME",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },
});