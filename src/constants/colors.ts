// src/constants/colors.ts
export const Colors = {
  light: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#000000',
    textSecondary: '#666666',
    border: '#EEEEEE',
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    secondary: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
  },
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    primary: '#60A5FA',
    primaryHover: '#3B82F6',
    secondary: '#34D399',
    error: '#F87171',
    warning: '#FBBF24',
    success: '#6EE7B7',
  },
};

export const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    'React Native': '#61DAFB',
    'React': '#61DAFB',
    'TypeScript': '#3178C6',
    'JavaScript': '#F7DF1E',
  };
  return colors[category] || '#2563EB';
};