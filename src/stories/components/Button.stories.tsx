import { Story, Meta } from '@storybook/react';

import { Button, TButtonProps } from '@/components';

type TButtonStoryProps = Omit<TButtonProps, ''>;

export default {
  title: 'Components/Button',
  component: Button,
  args: {},
  argTypes: {}
} as Meta;
const Template: Story<TButtonStoryProps> = ({ ...rest }) => {
  return <Button {...rest} />;
};
export const Primary = Template.bind({});
