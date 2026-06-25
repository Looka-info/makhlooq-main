import { getPayload } from "payload";
import config from "../../payload.config";

// Cache the payload instance
let cached: ReturnType<typeof getPayload> | null = null;

export async function getPayloadInstance() {
  if (!cached) {
    cached = getPayload({ config });
  }
  return cached;
}