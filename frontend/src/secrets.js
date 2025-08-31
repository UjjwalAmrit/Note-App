// This file's only purpose is to log the environment variable during the build process.
const apiUrl = import.meta.env.VITE_API_URL;

console.log(`
  /=======================================================\\
  |                                                       |
  |  FRONTEND BUILD LOG: VITE_API_URL is ${apiUrl}          |
  |                                                       |
  \\=======================================================/
`);

export default apiUrl;
