import {
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useTranslate } from '@refinedev/core';
import { Tag } from 'antd';
import { BikeIcon, BikeWhiteIcon } from '../../icons';

type OrderStatusProps = {
  status:
    | 'DIRECT_B2C'
    | 'DIRECT_B2B'
    | 'MARKETING'
    | 'CONSIGNMENT'
    | 'WHOLESALER';
};

export const OrderStatus: React.FC<OrderStatusProps> = ({ status }) => {
  const t = useTranslate();
  let color;
  let icon;

  switch (status) {
    case 'CONSIGNMENT':
      color = 'orange';
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon = <ClockCircleOutlined />;
      break;
    case 'MARKETING':
      color = 'cyan';
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon = <BellOutlined />;
      break;
    case 'DIRECT_B2C':
      color = 'blue';
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon = <BikeWhiteIcon />;
      break;
    case 'DIRECT_B2B':
      color = 'green';
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon = <CheckCircleOutlined />;
      break;
    case 'WHOLESALER':
      color = 'pink';
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon = <CheckCircleOutlined />;
      break;
  }

  return (
    <Tag color={color} icon={icon}>
      {t(`enum.salesType.${status}`)}
    </Tag>
  );
};
