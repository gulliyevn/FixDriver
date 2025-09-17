import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface GoogleIconProps {
  size?: number;
}

const GoogleIcon: React.FC<GoogleIconProps> = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21.805 10.023h-9.18v3.956h5.262c-.227 1.19-1.37 3.49-5.262 3.49-3.168 0-5.75-2.626-5.75-5.86s2.582-5.86 5.75-5.86c1.805 0 3.017.77 3.71 1.43l2.54-2.47C17.09 3.47 15.13 2.5 12.625 2.5c-5.02 0-9.125 4.06-9.125 9.06s4.105 9.06 9.125 9.06c5.25 0 8.75-3.68 8.75-8.88 0-.6-.07-1.06-.17-1.52z" fill="#DB4437"/>
  </Svg>
);

export default GoogleIcon; 