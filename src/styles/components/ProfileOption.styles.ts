import { StyleSheet } from 'react-native';

export const ProfileOptionStyles = StyleSheet.create({
  option: {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingVertical: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0',
    paddingHorizontal: 4,
  },
  iconWrap: { 
    width: 32, 
    alignItems: 'center' 
  },
  label: { 
    flex: 1, 
    fontSize: 16, 
    fontWeight: '500' 
  },
  value: { 
    fontSize: 16, 
    color: '#27ae60', 
    marginRight: 8 
  },
  arrow: { 
    marginLeft: 4 
  },
}); 