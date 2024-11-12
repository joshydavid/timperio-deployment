import { useLink } from '@refinedev/core';
import { Space, theme } from 'antd';

import { FinefoodsLogoIcon, FinefoodsLogoText } from '../../components';
import { Logo } from './styled';

type TitleProps = {
  collapsed: boolean;
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  const { token } = theme.useToken();
  const Link = useLink();

  return (
    <Logo>
      <Link to="/">
        {collapsed ? (
          <img
            src="/images/timperioLogo.png" // Adjust path if necessary
            alt="Finefoods Logo"
            style={{
              width: 64,
            }}
          />
        ) : (
          <Space size={12}>
            <img
              src="/images/timperioLogo.png" // Adjust path if necessary
              alt="Finefoods Logo"
              style={{
                width: 84,
              }}
            />
          </Space>
        )}
      </Link>
    </Logo>
  );
};
