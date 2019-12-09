import React from 'react';
import styled from 'styled-components';

const StyledLogo = styled.span`
  text-transform: uppercase;
  font-size: 3rem;
  font-weight: 800;
`;

const Logo: React.FC = () => <StyledLogo>Daddel</StyledLogo>;

export default Logo;
