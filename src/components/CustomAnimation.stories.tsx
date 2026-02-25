/**
 * @file CustomAnimation组件故事
 * @description 展示自定义动画的使用方法
 * @component CustomAnimation
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-25
 */

import type { Meta, StoryObj } from '@storybook/react';
import { CustomAnimation, CustomKeyframeStep } from './CustomAnimation';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Grid } from './Grid';

const meta: Meta<typeof CustomAnimation> = {
  title: 'Components/CustomAnimation',
  component: CustomAnimation,
  tags: ['autodocs'],
  argTypes: {
    trigger: {
      control: 'select',
      options: ['mount', 'hover', 'click', 'manual'],
    },
    disabled: {
      control: 'boolean',
    },
    shouldRegister: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CustomAnimation>;

const rotateKeyframes: CustomKeyframeStep[] = [
  { percentage: 0, styles: { transform: 'rotate(0deg)', opacity: '0' } },
  { percentage: 50, styles: { transform: 'rotate(180deg)', opacity: '1' } },
  { percentage: 100, styles: { transform: 'rotate(360deg)', opacity: '0' } },
];

const scaleRotateKeyframes: CustomKeyframeStep[] = [
  { percentage: 0, styles: { transform: 'scale(0) rotate(0deg)', opacity: '0' } },
  { percentage: 50, styles: { transform: 'scale(1.2) rotate(180deg)', opacity: '1' } },
  { percentage: 100, styles: { transform: 'scale(1) rotate(360deg)', opacity: '1' } },
];

const colorShiftKeyframes: CustomKeyframeStep[] = [
  { percentage: 0, styles: { backgroundColor: '#ff0000', transform: 'translateX(0px)' } },
  { percentage: 25, styles: { backgroundColor: '#ff8000', transform: 'translateX(10px)' } },
  { percentage: 50, styles: { backgroundColor: '#ffff00', transform: 'translateX(20px)' } },
  { percentage: 75, styles: { backgroundColor: '#00ff00', transform: 'translateX(10px)' } },
  { percentage: 100, styles: { backgroundColor: '#0000ff', transform: 'translateX(0px)' } },
];

const bounceSlideKeyframes: CustomKeyframeStep[] = [
  { percentage: 0, styles: { transform: 'translateY(0) scale(1)' } },
  { percentage: 20, styles: { transform: 'translateY(-20px) scale(1.1)' } },
  { percentage: 40, styles: { transform: 'translateY(0) scale(0.9)' } },
  { percentage: 60, styles: { transform: 'translateY(-10px) scale(1.05)' } },
  { percentage: 80, styles: { transform: 'translateY(0) scale(0.95)' } },
  { percentage: 100, styles: { transform: 'translateY(0) scale(1)' } },
];

const waveKeyframes: CustomKeyframeStep[] = [
  { percentage: 0, styles: { transform: 'rotate(0deg) scale(1)' } },
  { percentage: 25, styles: { transform: 'rotate(5deg) scale(1.05)' } },
  { percentage: 50, styles: { transform: 'rotate(0deg) scale(1.1)' } },
  { percentage: 75, styles: { transform: 'rotate(-5deg) scale(1.05)' } },
  { percentage: 100, styles: { transform: 'rotate(0deg) scale(1)' } },
];

const flip3DKeyframes: CustomKeyframeStep[] = [
  { percentage: 0, styles: { transform: 'perspective(400px) rotateY(0deg)' } },
  { percentage: 50, styles: { transform: 'perspective(400px) rotateY(180deg)' } },
  { percentage: 100, styles: { transform: 'perspective(400px) rotateY(360deg)' } },
];

export const Default: Story = {
  args: {
    trigger: 'mount',
    disabled: false,
    shouldRegister: true,
  },
  render: (args) => (
    <CustomAnimation
      {...args}
      definition={{
        name: 'rotateAnimation',
        keyframes: rotateKeyframes,
        duration: 'normal',
        easing: 'ease-in-out',
      }}
    >
      <Card className="w-64">
        <CardHeader>
          <CardTitle>旋转动画</CardTitle>
        </CardHeader>
        <CardContent>
          <p>自定义旋转动画演示</p>
        </CardContent>
      </Card>
    </CustomAnimation>
  ),
};

export const ScaleRotate: Story = {
  render: () => (
    <CustomAnimation
      trigger="mount"
      definition={{
        name: 'scaleRotateAnimation',
        keyframes: scaleRotateKeyframes,
        duration: 'slow',
        easing: 'bounce',
      }}
    >
      <Card className="w-64">
        <CardHeader>
          <CardTitle>缩放旋转</CardTitle>
        </CardHeader>
        <CardContent>
          <p>缩放和旋转组合动画</p>
        </CardContent>
      </Card>
    </CustomAnimation>
  ),
};

export const ColorShift: Story = {
  render: () => (
    <CustomAnimation
      trigger="mount"
      definition={{
        name: 'colorShiftAnimation',
        keyframes: colorShiftKeyframes,
        duration: 'slow',
        easing: 'ease-in-out',
      }}
    >
      <div className="w-64 h-32 rounded-lg flex items-center justify-center text-white font-bold">
        颜色变化动画
      </div>
    </CustomAnimation>
  ),
};

export const BounceSlide: Story = {
  render: () => (
    <CustomAnimation
      trigger="mount"
      definition={{
        name: 'bounceSlideAnimation',
        keyframes: bounceSlideKeyframes,
        duration: 'normal',
        easing: 'ease-in-out',
      }}
    >
      <Card className="w-64">
        <CardHeader>
          <CardTitle>弹跳滑动</CardTitle>
        </CardHeader>
        <CardContent>
          <p>弹跳和滑动组合效果</p>
        </CardContent>
      </Card>
    </CustomAnimation>
  ),
};

export const Wave: Story = {
  render: () => (
    <CustomAnimation
      trigger="mount"
      definition={{
        name: 'waveAnimation',
        keyframes: waveKeyframes,
        duration: 'normal',
        easing: 'ease-in-out',
      }}
    >
      <Card className="w-64">
        <CardHeader>
          <CardTitle>波浪效果</CardTitle>
        </CardHeader>
        <CardContent>
          <p>摇摆波浪动画</p>
        </CardContent>
      </Card>
    </CustomAnimation>
  ),
};

export const Flip3D: Story = {
  render: () => (
    <CustomAnimation
      trigger="mount"
      definition={{
        name: 'flip3DAnimation',
        keyframes: flip3DKeyframes,
        duration: 'slow',
        easing: 'ease-in-out',
      }}
    >
      <Card className="w-64">
        <CardHeader>
          <CardTitle>3D翻转</CardTitle>
        </CardHeader>
        <CardContent>
          <p>3D透视翻转效果</p>
        </CardContent>
      </Card>
    </CustomAnimation>
  ),
};

export const ClickTrigger: Story = {
  render: () => (
    <CustomAnimation
      trigger="click"
      definition={{
        name: 'clickBounceAnimation',
        keyframes: bounceSlideKeyframes,
        duration: 'normal',
        easing: 'bounce',
      }}
    >
      <Card className="w-64 cursor-pointer">
        <CardHeader>
          <CardTitle>点击触发</CardTitle>
        </CardHeader>
        <CardContent>
          <p>点击卡片触发动画</p>
        </CardContent>
      </Card>
    </CustomAnimation>
  ),
};

export const WithRepeat: Story = {
  render: () => (
    <CustomAnimation
      trigger="mount"
      definition={{
        name: 'repeatRotateAnimation',
        keyframes: rotateKeyframes,
        duration: 'normal',
        easing: 'ease-in-out',
      }}
      config={{
        repeat: 3,
        direction: 'alternate',
      }}
    >
      <Card className="w-64">
        <CardHeader>
          <CardTitle>重复动画</CardTitle>
        </CardHeader>
        <CardContent>
          <p>重复3次，交替方向</p>
        </CardContent>
      </Card>
    </CustomAnimation>
  ),
};

export const MultipleAnimations: Story = {
  render: () => (
    <Grid cols={3} gap={4}>
      <CustomAnimation
        trigger="mount"
        definition={{
          name: 'anim1',
          keyframes: rotateKeyframes,
          duration: 'normal',
        }}
      >
        <Card className="w-40">
          <CardHeader>
            <CardTitle className="text-sm">动画1</CardTitle>
          </CardHeader>
        </Card>
      </CustomAnimation>
      <CustomAnimation
        trigger="mount"
        definition={{
          name: 'anim2',
          keyframes: bounceSlideKeyframes,
          duration: 'normal',
        }}
      >
        <Card className="w-40">
          <CardHeader>
            <CardTitle className="text-sm">动画2</CardTitle>
          </CardHeader>
        </Card>
      </CustomAnimation>
      <CustomAnimation
        trigger="mount"
        definition={{
          name: 'anim3',
          keyframes: waveKeyframes,
          duration: 'normal',
        }}
      >
        <Card className="w-40">
          <CardHeader>
            <CardTitle className="text-sm">动画3</CardTitle>
          </CardHeader>
        </Card>
      </CustomAnimation>
    </Grid>
  ),
};

export const AllCustomAnimations: Story = {
  render: () => {
    const customAnimations = [
      {
        name: 'rotate',
        keyframes: rotateKeyframes,
        title: '旋转',
      },
      {
        name: 'scaleRotate',
        keyframes: scaleRotateKeyframes,
        title: '缩放旋转',
      },
      {
        name: 'bounce',
        keyframes: bounceSlideKeyframes,
        title: '弹跳',
      },
      {
        name: 'wave',
        keyframes: waveKeyframes,
        title: '波浪',
      },
      {
        name: 'flip3D',
        keyframes: flip3DKeyframes,
        title: '3D翻转',
      },
    ];

    return (
      <Grid cols={5} gap={4}>
        {customAnimations.map((anim) => (
          <CustomAnimation
            key={anim.name}
            trigger="mount"
            definition={{
              name: `custom${anim.name}Animation`,
              keyframes: anim.keyframes,
              duration: 'normal',
              easing: 'ease-in-out',
            }}
          >
            <Card className="w-32">
              <CardHeader>
                <CardTitle className="text-xs">{anim.title}</CardTitle>
              </CardHeader>
            </Card>
          </CustomAnimation>
        ))}
      </Grid>
    );
  },
};
