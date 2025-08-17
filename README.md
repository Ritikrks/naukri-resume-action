# Naukri Resume Uploader 📄

Simple Node.js script to automatically upload your resume to Naukri.com, keeping your profile fresh and active.

## Usage

1. **Install dependencies and build**
   ```bash
   npm install
   npm run build
   ```

2. **Run the script**
   Provide credentials and resume path through environment variables:
   ```bash
   NAUKRI_USERNAME="your-email@example.com" \
   NAUKRI_PASSWORD="your-password" \
   NAUKRI_PROFILE_ID="123456" \
   RESUME_PATH="./resume.pdf" \
   npm start
   ```

   Multiple resumes can be supplied by separating paths with newlines in `RESUME_PATH`.

## License

MIT
