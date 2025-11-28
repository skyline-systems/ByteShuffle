import dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });

import { exec } from "child_process";

exec(
  `npx supabase gen types typescript --project-id "${process.env
    .SUPABASE_PROJECT_ID!}" --schema public > database.types.ts`,
  (error, stdout, stderr) => {
    if (error) {
      console.error("Error:", error);
      return;
    }
    if (stderr) {
      console.error("stderr:", stderr);
    }
    console.log("stdout:", stdout);
  }
);
