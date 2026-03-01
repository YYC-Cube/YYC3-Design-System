/**
 * @file AnimatedEnhanced组件故事
 * @description 展示AnimatedEnhanced组件的预设动画
 * @component AnimatedEnhanced
 * @author YYC³
 * @version 2.0.0
 * @created 2026-02-25
 */

import type { Meta, StoryObj } from '@storybook/react';
import { AnimatedEnhanced, AnimationPreset } from './AnimatedEnhanced';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { Grid } from './Grid';

const meta: Meta<typeof AnimatedEnhanced> = {
  title: 'Components/AnimatedEnhanced',
  component: AnimatedEnhanced,
  tags: ['autodocs'],
  argTypes: {
    animation: {
      control: 'select',
      options: [
        'fadeIn',
        'fadeOut',
        'slideInUp',
        'slideInDown',
        'slideInLeft',
        'slideInRight',
        'scaleIn',
        'scaleOut',
        'rotateIn',
        'bounceIn',
        'elasticIn',
        'flipInX',
        'flipInY',
        'zoomIn',
        'rollIn',
        'lightSpeedIn',
        'pulse',
        'shake',
        'swing',
        'tada',
        'wobble',
        'jelly',
        'glitch',
        'heartbeat',
        'rubberBand',
      ] as AnimationPreset[],
    },
    trigger: {
      control: 'select',
      options: ['mount', 'hover', 'click', 'manual'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AnimatedEnhanced>;

export const Default: Story = {
  args: {
    animation: 'fadeIn',
    trigger: 'mount',
    disabled: false,
  },
  render: (args) => (
    <AnimatedEnhanced {...args}>
      <Card className="w-64">
        <CardHeader>
          <CardTitle>动画演示</CardTitle>
        </CardHeader>
        <CardContent>
          <p>这是一个动画演示卡片</p>
        </CardContent>
      </Card>
    </AnimatedEnhanced>
  ),
};

export const FadeAnimations: Story = {
  render: () => (
    <Grid cols={2} gap={4}>
      <AnimatedEnhanced animation="fadeIn">
        <Card className="w-64">
          <CardHeader>
            <CardTitle>淡入效果</CardTitle>
          </CardHeader>
          <CardContent>
            <p>FadeIn动画</p>
          </CardContent>
        </Card>
      </AnimatedEnhanced>
      <AnimatedEnhanced animation="fadeOut">
        <Card className="w-64">
          <CardHeader>
            <CardTitle>淡出效果</CardTitle>
          </CardHeader>
          <CardContent>
            <p>FadeOut动画</p>
          </CardContent>
        </Card>
      </AnimatedEnhanced>
    </Grid>
  ),
};

export const SlideAnimations: Story = {
  render: () => (
    <Grid cols={3} gap={4}>
      <AnimatedEnhanced animation="slideInUp">
        <Card className="w-48">
          <CardHeader>
            <CardTitle>向上滑入</CardTitle>
          </CardHeader>
          <CardContent>
            <p>SlideInUp</p>
          </CardContent>
        </Card>
      </AnimatedEnhanced>
      <AnimatedEnhanced animation="slideInDown">
        <Card className="w-48">
          <CardHeader>
            <CardTitle>向下滑入</CardTitle>
          </CardHeader>
          <CardContent>
            <p>SlideInDown</p>
          </CardContent>
        </Card>
      </AnimatedEnhanced>
      <AnimatedEnhanced animation="slideInLeft">
        <Card className="w-48">
          <CardHeader>
            <CardTitle>向左滑入</CardTitle>
          </CardHeader>
          <CardContent>
            <p>SlideInLeft</p>
          </CardContent>
        </Card>
      </AnimatedEnhanced>
    </Grid>
  ),
};

export const ScaleAnimations: Story = {
  render: () => (
    <Grid cols={2} gap={4}>
      <AnimatedEnhanced animation="scaleIn">
        <Card className="w-64">
          <CardHeader>
            <CardTitle>缩放进入</CardTitle>
          </CardHeader>
          <CardContent>
            <p>ScaleIn动画</p>
          </CardContent>
        </Card>
      </AnimatedEnhanced>
      <AnimatedEnhanced animation="zoomIn">
        <Card className="w-64">
          <CardHeader>
            <CardTitle>放大进入</CardTitle>
          </CardHeader>
          <CardContent>
            <p>ZoomIn动画</p>
          </CardContent>
        </Card>
      </AnimatedEnhanced>
    </Grid>
  ),
};

export const BounceAnimations: Story = {
  render: () => (
    <Grid cols={3} gap={4}>
      <AnimatedEnhanced animation="bounceIn">
        <Card className="w-48">
          <CardHeader>
            <CardTitle>弹跳进入</CardTitle>
          </CardHeader>
          <CardContent>
            <p>BounceIn</p>
          </CardContent>
        </Card>
      </AnimatedEnhanced>
      <AnimatedEnhanced animation="elasticIn">
        <Card className="w-48">
          <CardHeader>
            <CardTitle>弹性进入</CardTitle>
          </CardHeader>
          <CardContent>
            <p>ElasticIn</p>
          </CardContent>
        </Card>
      </AnimatedEnhanced>
      <AnimatedEnhanced animation="rubberBand">
        <Card className="w-48">
          <CardHeader>
            <CardTitle>橡皮筋</CardTitle>
          </CardHeader>
          <CardContent>
            <p>RubberBand</p>
          </CardContent>
        </Card>
      </AnimatedEnhanced>
    </Grid>
  ),
};

export const RotationAnimations: Story = {
  render: () => (
    <Grid cols={3} gap={4}>
      <AnimatedEnhanced animation="rotateIn">
        <Card className="w-48">
          <CardHeader>
            <CardTitle>旋转进入</CardTitle>
          </CardHeader>
          <CardContent>
            <p>RotateIn</p>
          </CardContent>
        </Card>
      </AnimatedEnhanced>
      <AnimatedEnhanced animation="flipInX">
        <Card className="w-48">
          <CardHeader>
            <CardTitle>X轴翻转</CardTitle>
          </CardHeader>
          <CardContent>
            <p>FlipInX</p>
          </CardContent>
        </Card>
      </AnimatedEnhanced>
      <AnimatedEnhanced animation="flipInY">
        <Card className="w-48">
          <CardHeader>
            <CardTitle>Y轴翻转</CardTitle>
          </CardHeader>
          <CardContent>
            <p>FlipInY</p>
          </CardContent>
        </Card>
      </AnimatedEnhanced>
    </Grid>
  ),
};

export const SpecialAnimations: Story = {
  render: () => (
    <Grid cols={4} gap={4}>
      <AnimatedEnhanced animation="rollIn">
        <Card className="w-40">
          <CardHeader>
            <CardTitle>滚动进入</CardTitle>
          </CardHeader>
          <CardContent>
            <p>RollIn</p>
          </CardContent>
        </Card>
      </AnimatedEnhanced>
      <AnimatedEnhanced animation="lightSpeedIn">
        <Card className="w-40">
          <CardHeader>
            <CardTitle>光速进入</CardTitle>
          </CardHeader>
          <CardContent>
            <p>LightSpeedIn</p>
          </CardContent>
        </Card>
      </AnimatedEnhanced>
      <AnimatedEnhanced animation="shake">
        <Card className="w-40">
          <CardHeader>
            <CardTitle>抖动</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Shake</p>
          </CardContent>
        </Card>
      </AnimatedEnhanced>
      <AnimatedEnhanced animation="glitch">
        <Card className="w-40">
          <CardHeader>
            <CardTitle>故障效果</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Glitch</p>
          </CardContent>
        </Card>
      </AnimatedEnhanced>
    </Grid>
  ),
};

export const AttentionAnimations: Story = {
  render: () => (
    <Grid cols={4} gap={4}>
      <AnimatedEnhanced animation="pulse">
        <Card className="w-40">
          <CardHeader>
            <CardTitle>脉冲</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Pulse</p>
          </CardContent>
        </Card>
      </AnimatedEnhanced>
      <AnimatedEnhanced animation="swing">
        <Card className="w-40">
          <CardHeader>
            <CardTitle>摆动</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Swing</p>
          </CardContent>
        </Card>
      </AnimatedEnhanced>
      <AnimatedEnhanced animation="tada">
        <Card className="w-40">
          <CardHeader>
            <CardTitle>弹跳</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Tada</p>
          </CardContent>
        </Card>
      </AnimatedEnhanced>
      <AnimatedEnhanced animation="heartbeat">
        <Card className="w-40">
          <CardHeader>
            <CardTitle>心跳</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Heartbeat</p>
          </CardContent>
        </Card>
      </AnimatedEnhanced>
    </Grid>
  ),
};

export const WobbleAnimations: Story = {
  render: () => (
    <Grid cols={3} gap={4}>
      <AnimatedEnhanced animation="wobble">
        <Card className="w-48">
          <CardHeader>
            <CardTitle>摇晃</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Wobble</p>
          </CardContent>
        </Card>
      </AnimatedEnhanced>
      <AnimatedEnhanced animation="jelly">
        <Card className="w-48">
          <CardHeader>
            <CardTitle>果冻</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Jelly</p>
          </CardContent>
        </Card>
      </AnimatedEnhanced>
      <AnimatedEnhanced animation="rubberBand">
        <Card className="w-48">
          <CardHeader>
            <CardTitle>橡皮筋</CardTitle>
          </CardHeader>
          <CardContent>
            <p>RubberBand</p>
          </CardContent>
        </Card>
      </AnimatedEnhanced>
    </Grid>
  ),
};

export const TriggerMount: Story = {
  args: {
    animation: 'bounceIn',
    trigger: 'mount',
  },
  render: (args) => (
    <AnimatedEnhanced {...args}>
      <Card className="w-64">
        <CardHeader>
          <CardTitle>挂载触发</CardTitle>
        </CardHeader>
        <CardContent>
          <p>组件挂载时自动触发动画</p>
        </CardContent>
      </Card>
    </AnimatedEnhanced>
  ),
};

export const TriggerClick: Story = {
  args: {
    animation: 'pulse',
    trigger: 'click',
  },
  render: (args) => (
    <AnimatedEnhanced {...args}>
      <Card className="w-64 cursor-pointer">
        <CardHeader>
          <CardTitle>点击触发</CardTitle>
        </CardHeader>
        <CardContent>
          <p>点击卡片触发动画</p>
        </CardContent>
      </Card>
    </AnimatedEnhanced>
  ),
};

export const WithCustomConfig: Story = {
  args: {
    animation: 'bounceIn',
    trigger: 'mount',
    config: {
      duration: 'slow',
      easing: 'bounce',
      repeat: 2,
      direction: 'alternate',
    },
  },
  render: (args) => (
    <AnimatedEnhanced {...args}>
      <Card className="w-64">
        <CardHeader>
          <CardTitle>自定义配置</CardTitle>
        </CardHeader>
        <CardContent>
          <p>慢速、弹跳、重复2次、交替</p>
        </CardContent>
      </Card>
    </AnimatedEnhanced>
  ),
};

export const AllAnimationsGrid: Story = {
  render: () => {
    const animations: AnimationPreset[] = [
      'fadeIn',
      'fadeOut',
      'slideInUp',
      'slideInDown',
      'slideInLeft',
      'slideInRight',
      'scaleIn',
      'scaleOut',
      'rotateIn',
      'bounceIn',
      'elasticIn',
      'flipInX',
      'flipInY',
      'zoomIn',
      'rollIn',
      'lightSpeedIn',
      'pulse',
      'shake',
      'swing',
      'tada',
      'wobble',
      'jelly',
      'glitch',
      'heartbeat',
      'rubberBand',
    ];

    return (
      <Grid cols={6} gap={4}>
        {animations.map((animation) => (
          <AnimatedEnhanced key={animation} animation={animation}>
            <Card className="w-32">
              <CardHeader>
                <CardTitle className="text-xs">{animation}</CardTitle>
              </CardHeader>
            </Card>
          </AnimatedEnhanced>
        ))}
      </Grid>
    );
  },
};
