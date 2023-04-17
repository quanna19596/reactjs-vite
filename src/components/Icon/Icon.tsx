import classNames from 'classnames';

import Cart from './Cart';
import { EIconName } from './Icon.enums';
import { TIconProps } from './Icon.types';

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
