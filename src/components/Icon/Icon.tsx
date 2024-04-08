import classNames from 'classnames';

import { EIconName, TIconProps } from '@/components/Icon';

import Cart from './Cart';

import './Icon.scss';

const Icon: React.FC<TIconProps> = ({ name, className, size = 16, onClick, ...colorProps }) => {
  const renderIcon = (): React.ReactElement => {
    switch (name) {
      case EIconName.CART:
        return <Cart {...colorProps} />;
      default:
        return <></>;
    }
  };

  return (
    <div className={classNames('Icon', className)} onClick={onClick} style={{ width: size, height: size }}>
      {renderIcon()}
    </div>
  );
};

export default Icon;
