import { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  upload: true,
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Alt Text",
    },
  ],
};
