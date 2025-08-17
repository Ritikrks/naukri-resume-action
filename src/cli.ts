import { run } from './main';

async function main() {
  const {
    NAUKRI_USERNAME,
    NAUKRI_PASSWORD,
    NAUKRI_PROFILE_ID,
    RESUME_PATH,
  } = process.env;

  if (!NAUKRI_USERNAME || !NAUKRI_PASSWORD || !NAUKRI_PROFILE_ID || !RESUME_PATH) {
    console.error('Missing required environment variables.');
    process.exit(1);
  }

  try {
    await run({
      username: NAUKRI_USERNAME,
      password: NAUKRI_PASSWORD,
      profileId: NAUKRI_PROFILE_ID,
      resumePath: RESUME_PATH,
    });
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

main();
