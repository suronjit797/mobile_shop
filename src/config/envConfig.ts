// eslint-disable-next-line @typescript-eslint/no-explicit-any
const envConfig: Record<string, any> = {
  BASED_API_URL: import.meta.env.VITE_BASED_API_URL || "http://localhost:5000",
  VITE_REDUX_STORAGE_SECRET_KEY: import.meta.env.VITE_REDUX_STORAGE_SECRET_KEY || "default_secret",
};

export default envConfig;
