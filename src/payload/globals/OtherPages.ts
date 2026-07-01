import { GlobalConfig } from "payload";
import { revalidatePathHook } from "../hooks/revalidate";

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  label: "About Page",
  admin: { group: "Pages" },
  hooks: {
    afterChange: [revalidatePathHook("/about")],
  },
  fields: [
    {
      name: "seo",
      type: "group",
      label: "SEO",
      fields: [
        { name: "title", type: "text", label: "SEO Title", defaultValue: "About | Khalai Makhlooq" },
        { name: "description", type: "textarea", label: "SEO Description", defaultValue: "Learn about KMHQ, our mission, and our divisions." },
        { name: "imageUrl", type: "text", label: "SEO Image URL" },
      ],
    },
    {
      name: "hero",
      type: "group",
      label: "Hero Section",
      fields: [
        { name: "kicker", type: "text", label: "Kicker", defaultValue: "KMHQ Organization" },
        { name: "heading", type: "text", label: "Heading", defaultValue: "We Are Makhlooq" },
        { name: "description", type: "textarea", label: "Description", defaultValue: "A premier Star Citizen organization dedicated to excellence across all sectors. We operate with precision, coordination, and overwhelming force." },
        { name: "backgroundImage", type: "text", label: "Background Image", defaultValue: "/backgrounds/9a5b333b-3981-4d6a-a235-7e91fc1c6ff8.jpg" },
      ]
    },
    {
      name: "divisions",
      type: "group",
      label: "Divisions Section",
      fields: [
        { name: "heading", type: "text", label: "Heading", defaultValue: "Our Divisions" },
        {
          name: "cards",
          type: "array",
          label: "Division Cards",
          defaultValue: [
            { title: "Security & Combat", desc: "Elite combat wings specialized in escort, defense, and aggressive negotiations. We ensure the safety of our operations across the verse." },
            { title: "Logistics & Trade", desc: "The backbone of our operations, moving high-value assets securely across systems. Our trade networks are unmatched." },
            { title: "Deep Exploration", desc: "Charting unknown territories and securing valuable intelligence and resources before they hit the open market." }
          ],
          fields: [
            { name: "title", type: "text", label: "Card Title" },
            { name: "desc", type: "textarea", label: "Card Description" }
          ]
        }
      ]
    },
    {
      name: "fleet",
      type: "group",
      label: "Fleet Section",
      fields: [
        { name: "heading", type: "text", label: "Heading", defaultValue: "Unmatched Firepower" },
        { name: "description", type: "textarea", label: "Description", defaultValue: "Our fleet is a testament to our ambition. From agile light fighters to capital-class dreadnoughts, KMHQ possesses the logistical and combative capabilities to tackle any objective, anywhere in the galaxy." },
        { name: "backgroundImage", type: "text", label: "Background Image", defaultValue: "/backgrounds/SC-4.5.0_20251229_131102_Hathor-orbital-laser_f.png" },
        { name: "imageLabel", type: "text", label: "Image Label", defaultValue: "Operation: Zenith" },
        { name: "imageHeading", type: "text", label: "Image Heading", defaultValue: "Deep Space Deployment" },
        { name: "imageSrc", type: "text", label: "Image Source", defaultValue: "/backgrounds/SC-4.4.0_20251214_152954_Wolf-Yela-rings_f.png" }
      ]
    },
    {
      name: "legacy",
      type: "group",
      label: "Legacy Section",
      fields: [
        { name: "heading", type: "text", label: "Heading", defaultValue: "A Legacy of Supremacy" },
        { name: "description", type: "textarea", label: "Description", defaultValue: "Founded by a core group of veteran pilots, Makhlooq has grown from a specialized strike team into a multi-system powerhouse. We believe in quality over quantity, ensuring every member of our organization represents the pinnacle of skill and dedication." }
      ]
    }
  ],
};

export const FleetPage: GlobalConfig = {
  slug: "fleet-page",
  label: "Fleet Page",
  admin: { group: "Pages" },
  hooks: {
    afterChange: [revalidatePathHook("/fleet")],
  },
  fields: [
    {
      name: "seo",
      type: "group",
      label: "SEO",
      fields: [
        { name: "title", type: "text", label: "SEO Title", defaultValue: "Fleet | Khalai Makhlooq" },
        { name: "description", type: "textarea", label: "SEO Description", defaultValue: "Explore the KMHQ fleet." },
        { name: "imageUrl", type: "text", label: "SEO Image URL" },
      ],
    },
    { name: "kicker", type: "text", label: "Kicker", defaultValue: "KMHQ · Capital Assets" },
    { name: "headingLine1", type: "text", label: "Heading Line 1", defaultValue: "Fleet" },
    { name: "headingLine2", type: "text", label: "Heading Line 2", defaultValue: "Command" },
    { name: "badgeText", type: "text", label: "Badge Text", defaultValue: "Live" },
    { name: "shipsReadyLabel", type: "text", label: "Ships Ready Label", defaultValue: "Ships Ready" },
    { name: "totalValueLabel", type: "text", label: "Total Value Label", defaultValue: "Total Flex" },
    { name: "crewSeatsLabel", type: "text", label: "Crew Seats Label", defaultValue: "Crew Seats" },
    { name: "standardKicker", type: "text", label: "Standard Fleets Kicker", defaultValue: "Admin Managed" },
    { name: "standardHeading", type: "text", label: "Standard Fleets Heading", defaultValue: "Standard Fleets" },
    { name: "searchPlaceholder", type: "text", label: "Search Placeholder", defaultValue: "Search fleets..." },
  ],
};

export const TeamPage: GlobalConfig = {
  slug: "team-page",
  label: "Team Page",
  admin: { group: "Pages" },
  hooks: {
    afterChange: [revalidatePathHook("/team")],
  },
  fields: [
    {
      name: "seo",
      type: "group",
      label: "SEO",
      fields: [
        { name: "title", type: "text", label: "SEO Title", defaultValue: "Team | Khalai Makhlooq" },
        { name: "description", type: "textarea", label: "SEO Description", defaultValue: "Meet the KMHQ team." },
        { name: "imageUrl", type: "text", label: "SEO Image URL" },
      ],
    },
    { name: "kicker", type: "text", label: "Page Kicker", defaultValue: "Crew Network" },
    { name: "headingLine1", type: "text", label: "Heading Line 1", defaultValue: "Team" },
    { name: "headingLine2", type: "text", label: "Heading Line 2", defaultValue: "Scene" },
    { name: "description", type: "textarea", label: "Page Description", defaultValue: "The roster wall, but not the boring kind. Pilots, officers, and crew — all here in clean cards with full style." },
    {
      name: "accessCard",
      type: "group",
      label: "Crew Access Card",
      fields: [
        { name: "kicker", type: "text", label: "Kicker", defaultValue: "Crew Access" },
        { name: "heading", type: "text", label: "Heading", defaultValue: "Scene Live" },
        { name: "badge", type: "text", label: "Badge", defaultValue: "Live" },
        { name: "description", type: "textarea", label: "Description", defaultValue: "Entry is through Discord, then you set up your profile. Admins get extra tools; otherwise, chill mode." },
      ]
    },
    {
      name: "briefing",
      type: "group",
      label: "Command Briefing",
      fields: [
        { name: "kicker", type: "text", label: "Kicker", defaultValue: "Crew Matrix" },
        { name: "headingLine1", type: "text", label: "Heading Line 1", defaultValue: "Crew" },
        { name: "headingLine2", type: "text", label: "Heading Line 2", defaultValue: "Scene" },
        { name: "description", type: "textarea", label: "Description", defaultValue: "Simple vibe on the team page: find someone, check their role, feel the crew energy." }
      ]
    },
    {
      name: "joinCTA",
      type: "group",
      label: "Join Community CTA",
      fields: [
        { name: "badge", type: "text", label: "Badge", defaultValue: "Recruitment Open" },
        { name: "heading", type: "text", label: "Heading", defaultValue: "Join Khalai Makhlooq's space crew" },
        { name: "description", type: "textarea", label: "Description", defaultValue: "Join the crew, see the ships, and grow your rank through organized action." },
        { name: "discordLink", type: "text", label: "Discord Link", defaultValue: "https://discord.gg/K7SfxPSwXk" },
        { name: "discordLinkText", type: "text", label: "Discord Button Text", defaultValue: "Join on Discord" },
        { name: "learnMoreText", type: "text", label: "Learn More Button Text", defaultValue: "Learn More" }
      ]
    }
  ],
};
