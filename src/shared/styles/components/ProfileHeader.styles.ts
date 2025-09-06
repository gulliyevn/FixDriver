import { StyleSheet } from 'react-native';

export const ProfileHeaderStyles = StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 24 
  },
  avatar: {
    width: 64, 
    height: 64, 
    borderRadius: 32,
    alignItems: 'center', 
    justifyContent: 'center',
    marginRight: 16,
  },
  info: { 
    flex: 1 
  },
  name: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#222' 
  },
  phone: { 
    fontSize: 15, 
    color: '#888', 
    marginTop: 2 
  },
}); 