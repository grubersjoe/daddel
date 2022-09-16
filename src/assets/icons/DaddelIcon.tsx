import React, { FunctionComponent } from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

// See daddel-cropped.svg
const DaddelIcon: FunctionComponent<SvgIconProps> = props => (
  <SvgIcon {...props}>
    <g fill="#fbc02d">
      <path d="M21.112 20a2.873 2.873 0 01-2.681-1.835l-1.238-2.794c-.056-.135-.154-.205-.263-.205H7.07a.27.27 0 00-.251.179l-1.263 2.85A2.864 2.864 0 012.886 20c-.868 0-1.681-.39-2.231-1.068a2.921 2.921 0 01-.59-2.456l1.992-9.425A3.847 3.847 0 015.791 4H18.21c1.789 0 3.357 1.283 3.731 3.052l1.994 9.424a2.921 2.921 0 01-.59 2.455 2.867 2.867 0 01-2.233 1.068zM5.435 14.765c-7-13.22-3.5-6.609 0 0z" />
      <path
        d="M9.25 10.251h-3.5a.75.75 0 010-1.5h3.5a.75.75 0 010 1.5zm-1.75 1.75a.75.75 0 01-.75-.75v-3.5a.75.75 0 011.5 0v3.5c0 .413-.337.75-.75.75zm9 0a2.501 2.501 0 010-5C17.878 7 19 8.123 19 9.5S17.878 12 16.498 12zm0-3.5a1.002 1.002 0 000 1.999 1.002 1.002 0 000-2z"
        fill="#303030"
      />
    </g>
  </SvgIcon>
);

export default DaddelIcon;
