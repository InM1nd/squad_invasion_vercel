import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createBucket() {
  console.log("Creating storage bucket 'event-assets'...");

  // Check if bucket already exists
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error("Error listing buckets:", listError);
    process.exit(1);
  }

  const existingBucket = buckets?.find((b) => b.name === "event-assets");
  
  if (existingBucket) {
    console.log("✓ Bucket 'event-assets' already exists");
    return;
  }

  // Create bucket
  const { data, error } = await supabase.storage.createBucket("event-assets", {
    public: true, // Make bucket public so images can be accessed without auth
    fileSizeLimit: 5 * 1024 * 1024, // 5MB max file size
    allowedMimeTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"],
  });

  if (error) {
    console.error("Error creating bucket:", error);
    process.exit(1);
  }

  console.log("✅ Bucket 'event-assets' created successfully!");
  console.log("   - Public: true");
  console.log("   - Max file size: 5MB");
  console.log("   - Allowed types: jpeg, jpg, png, webp, gif");
}

createBucket();

