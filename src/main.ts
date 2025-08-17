import * as fs from 'fs';
import { login } from './api/login';
import { uploadResume } from './api/uploadResume';

interface RunConfig {
  username: string;
  password: string;
  profileId: string;
  /**
   * One or more resume paths. Multiple paths can be separated by newlines.
   */
  resumePath: string;
}

/**
 * Execute the resume upload workflow.
 */
export async function run({
  username,
  password,
  profileId,
  resumePath,
}: RunConfig): Promise<void> {
  try {
    // Parse resume paths (could be a single path or multiple paths in newline format)
    let resumePaths: string[] = [];

    if (resumePath.includes('\n')) {
      resumePaths = resumePath
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#'));
    } else {
      resumePaths = [resumePath];
    }

    if (resumePaths.length === 0) {
      throw new Error('🚫 No valid resume paths provided');
    }

    // Verify all paths exist
    const validResumePaths = resumePaths.filter((path) => {
      const exists = fs.existsSync(path);
      if (!exists) {
        console.warn(`⚠️ Resume file not found: ${path}`);
      }
      return exists;
    });

    if (validResumePaths.length === 0) {
      throw new Error('🚫 No valid resume files found at the specified paths');
    }

    // Select resume based on date for deterministic selection
    const today = new Date();
    const dayOfMonth = today.getDate();
    const dayOfWeek = today.getDay();
    const month = today.getMonth();

    const selectionFactor =
      (dayOfMonth + dayOfWeek * 5 + month * 31) % validResumePaths.length;

    const selectedResume = validResumePaths[selectionFactor];

    console.log(`📄 Selected resume for upload: ${selectedResume}`);
    console.log(
      `📅 Selection based on date: Day ${dayOfMonth}, Weekday ${dayOfWeek}, Month ${month + 1}`
    );

    // Login to Naukri
    console.log('🔐 Logging in to Naukri.com...');
    const cookies = await login(username, password);

    if (!cookies) {
      throw new Error('❌ Login failed');
    }

    // Upload the resume
    console.log('⬆️ Uploading resume...');
    const success = await uploadResume(cookies, selectedResume, profileId);

    console.log(`upload_status 🚀: ${success ? 'success ✅' : 'failure ❌'}`);
    console.log(`upload_time 🕒: ${new Date().toISOString()}`);

    if (success) {
      console.log('✅ Resume uploaded successfully!');
    } else {
      throw new Error('❌ Resume upload failed');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❗ ${error.message}`);
      throw error;
    }
    console.error(error);
    throw error;
  }
}
