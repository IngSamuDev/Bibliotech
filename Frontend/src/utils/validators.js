export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password || '');
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateName = (value) => {
  return validateRequired(value) && value.trim().length >= 3;
};

export const validateYear = (year) => {
  const currentYear = new Date().getFullYear();
  const numYear = parseInt(year);
  return numYear >= 1000 && numYear <= currentYear + 10;
};

export const validateUrl = (url) => {
  if (!url || url.trim() === '') return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
