export type TIconProps = TColor & {
  name: string;
  className?: string;
  onClick?: () => void;
  size?: number;
};

export type TSvgProps = TColor;

export type TColor = {
  primaryColor?: string;
  secondaryColor?: string;
};
