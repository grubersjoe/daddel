import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import React, { FunctionComponent } from 'react';

const GoogleIcon: FunctionComponent<SvgIconProps> = props => (
  <SvgIcon {...props}>
    <path
      d="M23.763 12.276c0-.816-.067-1.636-.208-2.438H12.237v4.62h6.481a5.554 5.554 0 01-2.398 3.647v2.998h3.867c2.27-2.09 3.576-5.176 3.576-8.827z"
      fill="#4285f4"
    />
    <path
      d="M12.237 24c3.236 0 5.966-1.063 7.954-2.897l-3.867-2.998c-1.076.732-2.464 1.146-4.083 1.146-3.13 0-5.784-2.112-6.737-4.951h-3.99v3.09A12.001 12.001 0 0012.237 24z"
      fill="#34a853"
    />
    <path
      d="M5.5 14.3a7.188 7.188 0 010-4.595v-3.09H1.514a12.01 12.01 0 000 10.776z"
      fill="#fbbc04"
    />
    <path
      d="M12.237 4.75a6.52 6.52 0 014.603 1.798l3.426-3.425A11.533 11.533 0 0012.237 0 11.997 11.997 0 001.514 6.615L5.5 9.705c.948-2.844 3.606-4.956 6.737-4.956z"
      fill="#ea4335"
    />
  </SvgIcon>
);

export default GoogleIcon;
