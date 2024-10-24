export const getEnv = (key: keyof ImportMetaEnv) => {
  if (!import.meta.env[key]) {
    throw new Error(`Environmental variable '${key}' undefined`);
  }

  return import.meta.env[key] as string;
};
