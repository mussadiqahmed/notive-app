import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';

export const useAuthNavigation = () => {
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If user is not authenticated, navigate to login
    if (!isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    }
  }, [isAuthenticated, navigation]);

  return { navigation };
}; 