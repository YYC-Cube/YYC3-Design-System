/**
 * @file 通用泛型组件测试
 * @description 测试 GenericComponent 组件的各项功能
 * @module __tests__/components/GenericComponent.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-21
 */

import * as React from 'react';

import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';

import '@testing-library/jest-dom';
import { ThemeProvider } from '../context/ThemeContext';
import {
  GenericComponent,
  genericComponentFactory,
  createGenericComponent,
  withGenericComponentEffect,
  withGenericComponentMemo,
  mergeGenericComponentProps,
  overrideGenericComponentProps,
} from './GenericComponent';

describe('GenericComponent', () => {
  it('应该渲染默认 div 元素', () => {
    render(<GenericComponent>Test Content</GenericComponent>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('应该支持自定义类名', () => {
    const { container } = render(
      <GenericComponent className="custom-class">Test Content</GenericComponent>
    );
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('应该支持自定义样式', () => {
    const { container } = render(
      <GenericComponent style={{ color: 'red' }}>Test Content</GenericComponent>
    );
    const element = container.querySelector('div');
    expect(element).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });

  it('应该支持自定义 ID', () => {
    render(<GenericComponent id="test-id">Test Content</GenericComponent>);
    const element = screen.getByText('Test Content');
    expect(element).toHaveAttribute('id', 'test-id');
  });

  it('应该支持多态组件', () => {
    render(<GenericComponent as="button">Button Content</GenericComponent>);
    const element = screen.getByText('Button Content');
    expect(element.tagName).toBe('BUTTON');
  });

  it('应该支持 onClick 事件', () => {
    const handleClick = jest.fn();
    render(<GenericComponent onClick={handleClick}>Click Me</GenericComponent>);
    const element = screen.getByText('Click Me');
    element.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('应该支持颜色属性', () => {
    const { container } = render(
      <GenericComponent color="blue" backgroundColor="yellow">
        Test Content
      </GenericComponent>
    );
    const element = container.querySelector('div');
    expect(element).toHaveStyle({
      color: 'rgb(0, 0, 255)',
      backgroundColor: 'rgb(255, 255, 0)',
    });
  });

  it('应该支持间距属性', () => {
    const { container } = render(
      <GenericComponent margin="10px" padding="20px" gap="5px">
        Test Content
      </GenericComponent>
    );
    const element = container.querySelector('div');
    expect(element).toHaveStyle({
      margin: '10px',
      padding: '20px',
      gap: '5px',
    });
  });

  it('应该支持布局属性', () => {
    const { container } = render(
      <GenericComponent
        width="100px"
        height="200px"
        display="flex"
        flex="1"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        Test Content
      </GenericComponent>
    );
    const element = container.querySelector('div');
    expect(element).toHaveStyle({
      width: '100px',
      height: '200px',
      display: 'flex',
      flex: '1',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    });
  });

  it('应该支持排版属性', () => {
    const { container } = render(
      <GenericComponent
        fontSize="16px"
        fontWeight="bold"
        lineHeight="1.5"
        letterSpacing="1px"
        textAlign="center"
      >
        Test Content
      </GenericComponent>
    );
    const element = container.querySelector('div');
    expect(element).toHaveStyle({
      fontSize: '16px',
      fontWeight: 'bold',
      lineHeight: '1.5',
      letterSpacing: '1px',
      textAlign: 'center',
    });
  });

  it('应该支持所有鼠标事件', () => {
    const handleMouseDown = jest.fn();
    const handleMouseUp = jest.fn();
    const { container } = render(
      <GenericComponent onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        Test Content
      </GenericComponent>
    );
    const element = container.querySelector('div');
    if (element) {
      fireEvent.mouseDown(element);
      fireEvent.mouseUp(element);
      expect(handleMouseDown).toHaveBeenCalledTimes(1);
      expect(handleMouseUp).toHaveBeenCalledTimes(1);
    }
  });

  it('应该支持焦点事件', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    const { container } = render(
      <GenericComponent onFocus={handleFocus} onBlur={handleBlur} tabIndex={0}>
        Test Content
      </GenericComponent>
    );
    const element = container.querySelector('div');
    if (element) {
      fireEvent.focus(element);
      fireEvent.blur(element);
      expect(handleFocus).toHaveBeenCalledTimes(1);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    }
  });

  it('应该支持键盘事件', () => {
    const handleKeyDown = jest.fn();
    const handleKeyUp = jest.fn();
    const { container } = render(
      <GenericComponent onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} tabIndex={0}>
        Test Content
      </GenericComponent>
    );
    const element = container.querySelector('div');
    if (element) {
      fireEvent.keyDown(element, { key: 'Enter' });
      fireEvent.keyUp(element, { key: 'Enter' });
      expect(handleKeyDown).toHaveBeenCalledTimes(1);
      expect(handleKeyUp).toHaveBeenCalledTimes(1);
    }
  });

  it('应该支持 onChange 事件', () => {
    const handleChange = jest.fn();
    const { container } = render(<GenericComponent as="input" onChange={handleChange} />);
    const element = container.querySelector('input');
    if (element) {
      fireEvent.change(element, { target: { value: 'test' } });
      expect(handleChange).toHaveBeenCalledTimes(1);
    }
  });

  it('应该支持 ARIA 属性', () => {
    const { container } = render(
      <GenericComponent
        aria-label="Test Label"
        aria-labelledby="test-labelledby"
        aria-describedby="test.describedby"
        aria-hidden={true}
        aria-disabled={true}
        aria-invalid={true}
        aria-required={true}
      >
        Test Content
      </GenericComponent>
    );
    const element = container.querySelector('div');
    expect(element).toHaveAttribute('aria-label', 'Test Label');
    expect(element).toHaveAttribute('aria-labelledby', 'test-labelledby');
    expect(element).toHaveAttribute('aria-describedby', 'test.describedby');
    expect(element).toHaveAttribute('aria-hidden', 'true');
    expect(element).toHaveAttribute('aria-disabled', 'true');
    expect(element).toHaveAttribute('aria-invalid', 'true');
    expect(element).toHaveAttribute('aria-required', 'true');
  });

  it('应该支持 data-testid 属性', () => {
    render(<GenericComponent data-testid="test-element">Test Content</GenericComponent>);
    expect(screen.getByTestId('test-element')).toBeInTheDocument();
  });

  it('应该支持 role 属性', () => {
    render(<GenericComponent role="button">Test Content</GenericComponent>);
    const element = screen.getByText('Test Content');
    expect(element).toHaveAttribute('role', 'button');
  });

  it('应该支持 disabled 属性', () => {
    render(
      <GenericComponent as="button" disabled>
        Test Content
      </GenericComponent>
    );
    const element = screen.getByText('Test Content');
    expect(element).toHaveAttribute('disabled');
  });

  it('应该支持 hidden 属性', () => {
    const { container } = render(<GenericComponent hidden>Test Content</GenericComponent>);
    const element = container.querySelector('div');
    expect(element).toHaveAttribute('hidden');
  });

  it('应该支持 ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<GenericComponent ref={ref as any}>Test Content</GenericComponent>);
    expect(ref.current).toBeInTheDocument();
  });

  it('应该支持样式合并', () => {
    const { container } = render(
      <GenericComponent style={{ color: 'red', fontSize: '16px' }} fontSize="20px">
        Test Content
      </GenericComponent>
    );
    const element = container.querySelector('div');
    expect(element).toHaveStyle({
      color: 'rgb(255, 0, 0)',
      fontSize: '20px',
    });
  });
});

describe('genericComponentFactory', () => {
  it('应该使用 create 方法创建组件', () => {
    const Button = genericComponentFactory.create('CustomButton', undefined);
    render(
      <ThemeProvider>
        <Button>Click Me</Button>
      </ThemeProvider>
    );
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('应该使用 withEffect 方法包装组件', () => {
    const SimpleComponent = () => <div>Simple</div>;
    const EnhancedComponent = genericComponentFactory.withEffect(SimpleComponent, 'Simple');
    render(<EnhancedComponent />);
    expect(screen.getByText('Simple')).toBeInTheDocument();
  });

  it('应该使用 withMemo 方法包装组件', () => {
    const SimpleComponent = () => <div>Simple</div>;
    const MemoizedComponent = genericComponentFactory.withMemo(SimpleComponent, 'Simple');
    render(<MemoizedComponent />);
    expect(screen.getByText('Simple')).toBeInTheDocument();
  });
});

describe('createGenericComponent', () => {
  it('应该创建带有默认属性的组件', () => {
    const CustomButton = createGenericComponent('CustomButton', {});
    const { container } = render(<CustomButton>Click Me</CustomButton>);
    const element = container.querySelector('div');
    expect(element).toBeInTheDocument();
  });

  it('应该支持渲染子元素', () => {
    const CustomButton = createGenericComponent('CustomButton', {});
    render(<CustomButton>Click Me</CustomButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });
});

describe('withGenericComponentEffect', () => {
  it('应该包装组件并添加效果', () => {
    const SimpleComponent = () => <div>Simple</div>;
    const EnhancedComponent = withGenericComponentEffect(SimpleComponent, 'Simple');
    render(<EnhancedComponent />);
    expect(screen.getByText('Simple')).toBeInTheDocument();
  });
});

describe('withGenericComponentMemo', () => {
  it('应该包装组件并使用 memo', () => {
    const SimpleComponent = () => <div>Simple</div>;
    const MemoizedComponent = withGenericComponentMemo(SimpleComponent, 'Simple');
    render(<MemoizedComponent />);
    expect(screen.getByText('Simple')).toBeInTheDocument();
  });
});

describe('mergeGenericComponentProps', () => {
  it('应该合并两个属性对象', () => {
    const props1 = { color: 'red', fontSize: '16px' };
    const props2 = { fontSize: '20px', fontWeight: 'bold' };
    const merged = mergeGenericComponentProps(props1, props2);
    expect(merged).toEqual({
      color: 'red',
      fontSize: '20px',
      fontWeight: 'bold',
    });
  });
});

describe('overrideGenericComponentProps', () => {
  it('应该用覆盖属性覆盖基础属性', () => {
    const base = { color: 'red', fontSize: '16px' };
    const overrides = { fontSize: '20px', fontWeight: 'bold' };
    const result = overrideGenericComponentProps(base, overrides);
    expect(result).toEqual({
      color: 'red',
      fontSize: '20px',
      fontWeight: 'bold',
    });
  });

  it('应该处理空覆盖对象', () => {
    const base = { color: 'red', fontSize: '16px' };
    const overrides = {};
    const result = overrideGenericComponentProps(base, overrides);
    expect(result).toEqual({
      color: 'red',
      fontSize: '16px',
    });
  });

  it('应该处理空基础对象', () => {
    const base = {};
    const overrides = { fontSize: '20px', fontWeight: 'bold' };
    const result = overrideGenericComponentProps(base, overrides);
    expect(result).toEqual({
      fontSize: '20px',
      fontWeight: 'bold',
    });
  });
});

describe('GenericComponent - 更多元素类型', () => {
  it('应该支持 a 元素', () => {
    render(<GenericComponent as="a">Link</GenericComponent>);
    const element = screen.getByText('Link');
    expect(element.tagName).toBe('A');
  });

  it('应该支持 span 元素', () => {
    render(<GenericComponent as="span">Span</GenericComponent>);
    const element = screen.getByText('Span');
    expect(element.tagName).toBe('SPAN');
  });

  it('应该支持 section 元素', () => {
    render(<GenericComponent as="section">Section</GenericComponent>);
    const element = screen.getByText('Section');
    expect(element.tagName).toBe('SECTION');
  });

  it('应该支持 article 元素', () => {
    render(<GenericComponent as="article">Article</GenericComponent>);
    const element = screen.getByText('Article');
    expect(element.tagName).toBe('ARTICLE');
  });

  it('应该支持 nav 元素', () => {
    render(<GenericComponent as="nav">Nav</GenericComponent>);
    const element = screen.getByText('Nav');
    expect(element.tagName).toBe('NAV');
  });

  it('应该支持 aside 元素', () => {
    render(<GenericComponent as="aside">Aside</GenericComponent>);
    const element = screen.getByText('Aside');
    expect(element.tagName).toBe('ASIDE');
  });

  it('应该支持 header 元素', () => {
    render(<GenericComponent as="header">Header</GenericComponent>);
    const element = screen.getByText('Header');
    expect(element.tagName).toBe('HEADER');
  });

  it('应该支持 footer 元素', () => {
    render(<GenericComponent as="footer">Footer</GenericComponent>);
    const element = screen.getByText('Footer');
    expect(element.tagName).toBe('FOOTER');
  });

  it('应该支持 main 元素', () => {
    render(<GenericComponent as="main">Main</GenericComponent>);
    const element = screen.getByText('Main');
    expect(element.tagName).toBe('MAIN');
  });

  it('应该支持 h1 元素', () => {
    render(<GenericComponent as="h1">Heading 1</GenericComponent>);
    const element = screen.getByText('Heading 1');
    expect(element.tagName).toBe('H1');
  });

  it('应该支持 h2 元素', () => {
    render(<GenericComponent as="h2">Heading 2</GenericComponent>);
    const element = screen.getByText('Heading 2');
    expect(element.tagName).toBe('H2');
  });

  it('应该支持 h3 元素', () => {
    render(<GenericComponent as="h3">Heading 3</GenericComponent>);
    const element = screen.getByText('Heading 3');
    expect(element.tagName).toBe('H3');
  });

  it('应该支持 ul 元素', () => {
    render(<GenericComponent as="ul">List</GenericComponent>);
    const element = screen.getByText('List');
    expect(element.tagName).toBe('UL');
  });

  it('应该支持 ol 元素', () => {
    render(<GenericComponent as="ol">Ordered List</GenericComponent>);
    const element = screen.getByText('Ordered List');
    expect(element.tagName).toBe('OL');
  });

  it('应该支持 li 元素', () => {
    render(<GenericComponent as="li">List Item</GenericComponent>);
    const element = screen.getByText('List Item');
    expect(element.tagName).toBe('LI');
  });

  it('应该支持 img 元素', () => {
    const { container } = render(<GenericComponent as="img" data-alt="Test" />);
    const element = container.querySelector('img');
    expect(element).toBeInTheDocument();
    expect(element?.tagName).toBe('IMG');
  });

  it('应该支持 label 元素', () => {
    render(<GenericComponent as="label">Label</GenericComponent>);
    const element = screen.getByText('Label');
    expect(element.tagName).toBe('LABEL');
  });

  it('应该支持 textarea 元素', () => {
    render(<GenericComponent as="textarea" defaultValue="Textarea" />);
    const element = screen.getByDisplayValue('Textarea');
    expect(element.tagName).toBe('TEXTAREA');
  });

  it('应该支持 select 元素', () => {
    render(<GenericComponent as="select">Select</GenericComponent>);
    const element = screen.getByText('Select');
    expect(element.tagName).toBe('SELECT');
  });

  it('应该支持 option 元素', () => {
    render(<GenericComponent as="option">Option</GenericComponent>);
    const element = screen.getByText('Option');
    expect(element.tagName).toBe('OPTION');
  });
});

describe('GenericComponent - 边框属性', () => {
  it('应该支持 borderColor 属性', () => {
    const { container } = render(
      <GenericComponent borderColor="blue">Test Content</GenericComponent>
    );
    const element = container.querySelector('div');
    expect(element).toBeInTheDocument();
  });

  it('应该支持完整的边框样式', () => {
    const { container } = render(
      <GenericComponent style={{ borderWidth: '1px', borderStyle: 'solid' }} borderColor="red">
        Test Content
      </GenericComponent>
    );
    const element = container.querySelector('div');
    expect(element).toBeInTheDocument();
  });
});

describe('GenericComponent - rest 属性传递', () => {
  it('应该传递自定义属性', () => {
    const { container } = render(
      <GenericComponent data-custom="custom-value">Test Content</GenericComponent>
    );
    const element = container.querySelector('div');
    expect(element).toHaveAttribute('data-custom', 'custom-value');
  });

  it('应该传递多个自定义属性', () => {
    const { container } = render(
      <GenericComponent data-custom-1="value-1" data-custom-2="value-2" data-custom-3="value-3">
        Test Content
      </GenericComponent>
    );
    const element = container.querySelector('div');
    expect(element).toHaveAttribute('data-custom-1', 'value-1');
    expect(element).toHaveAttribute('data-custom-2', 'value-2');
    expect(element).toHaveAttribute('data-custom-3', 'value-3');
  });

  it('应该传递 HTML 标准属性', () => {
    const { container } = render(<GenericComponent as="input" disabled />);
    const element = container.querySelector('input');
    expect(element).toHaveAttribute('disabled');
  });
});

describe('GenericComponent - 空值和 undefined 处理', () => {
  it('应该处理 undefined 的 style 属性', () => {
    const { container } = render(
      <GenericComponent style={undefined}>Test Content</GenericComponent>
    );
    const element = container.querySelector('div');
    expect(element).toBeInTheDocument();
  });

  it('应该处理 undefined 的 className 属性', () => {
    const { container } = render(
      <GenericComponent className={undefined}>Test Content</GenericComponent>
    );
    const element = container.querySelector('div');
    expect(element).toBeInTheDocument();
    expect(element).not.toHaveClass();
  });

  it('应该处理空字符串的 className 属性', () => {
    const { container } = render(<GenericComponent className="">Test Content</GenericComponent>);
    const element = container.querySelector('div');
    expect(element).toBeInTheDocument();
  });

  it('应该处理 undefined 的颜色属性', () => {
    const { container } = render(
      <GenericComponent color={undefined}>Test Content</GenericComponent>
    );
    const element = container.querySelector('div');
    expect(element).toBeInTheDocument();
    if (element) {
      expect(element.style.color).toBe('');
    }
  });

  it('应该处理 undefined 的间距属性', () => {
    const { container } = render(
      <GenericComponent margin={undefined} padding={undefined}>
        Test Content
      </GenericComponent>
    );
    const element = container.querySelector('div');
    expect(element).toBeInTheDocument();
    if (element) {
      expect(element.style.margin).toBe('');
      expect(element.style.padding).toBe('');
    }
  });

  it('应该处理 undefined 的布局属性', () => {
    const { container } = render(
      <GenericComponent width={undefined} height={undefined}>
        Test Content
      </GenericComponent>
    );
    const element = container.querySelector('div');
    expect(element).toBeInTheDocument();
    if (element) {
      expect(element.style.width).toBe('');
      expect(element.style.height).toBe('');
    }
  });

  it('应该处理 undefined 的排版属性', () => {
    const { container } = render(
      <GenericComponent fontSize={undefined} fontWeight={undefined}>
        Test Content
      </GenericComponent>
    );
    const element = container.querySelector('div');
    expect(element).toBeInTheDocument();
    if (element) {
      expect(element.style.fontSize).toBe('');
      expect(element.style.fontWeight).toBe('');
    }
  });
});

describe('GenericComponent - displayName', () => {
  it('应该有正确的 displayName', () => {
    expect(GenericComponent.displayName).toBe('GenericComponent');
  });

  it('createGenericComponent 应该设置正确的 displayName', () => {
    const CustomButton = createGenericComponent('CustomButton', {});
    expect(CustomButton.displayName).toBe('CustomButton');
  });

  it('withGenericComponentEffect 应该设置正确的 displayName', () => {
    const SimpleComponent = () => <div>Simple</div>;
    const EnhancedComponent = withGenericComponentEffect(SimpleComponent, 'Simple');
    expect(EnhancedComponent.displayName).toBe('withEffect(Simple)');
  });

  it('withGenericComponentMemo 应该设置正确的 displayName', () => {
    const SimpleComponent = () => <div>Simple</div>;
    const MemoizedComponent = withGenericComponentMemo(SimpleComponent, 'Simple');
    expect(MemoizedComponent.displayName).toBe('memo(Simple)');
  });
});

describe('GenericComponent - 更多元素类型', () => {
  it('应该支持 form 元素', () => {
    render(<GenericComponent as="form">Form</GenericComponent>);
    const element = screen.getByText('Form');
    expect(element.tagName).toBe('FORM');
  });

  it('应该支持 fieldset 元素', () => {
    render(<GenericComponent as="fieldset">Fieldset</GenericComponent>);
    const element = screen.getByText('Fieldset');
    expect(element.tagName).toBe('FIELDSET');
  });

  it('应该支持 legend 元素', () => {
    render(<GenericComponent as="legend">Legend</GenericComponent>);
    const element = screen.getByText('Legend');
    expect(element.tagName).toBe('LEGEND');
  });

  it('应该支持 details 元素', () => {
    render(<GenericComponent as="details">Details</GenericComponent>);
    const element = screen.getByText('Details');
    expect(element.tagName).toBe('DETAILS');
  });

  it('应该支持 summary 元素', () => {
    render(<GenericComponent as="summary">Summary</GenericComponent>);
    const element = screen.getByText('Summary');
    expect(element.tagName).toBe('SUMMARY');
  });

  it('应该支持 dialog 元素', () => {
    render(<GenericComponent as="dialog">Dialog</GenericComponent>);
    const element = screen.getByText('Dialog');
    expect(element.tagName).toBe('DIALOG');
  });

  it('应该支持 figure 元素', () => {
    render(<GenericComponent as="figure">Figure</GenericComponent>);
    const element = screen.getByText('Figure');
    expect(element.tagName).toBe('FIGURE');
  });

  it('应该支持 figcaption 元素', () => {
    render(<GenericComponent as="figcaption">Figcaption</GenericComponent>);
    const element = screen.getByText('Figcaption');
    expect(element.tagName).toBe('FIGCAPTION');
  });

  it('应该支持 time 元素', () => {
    render(<GenericComponent as="time">Time</GenericComponent>);
    const element = screen.getByText('Time');
    expect(element.tagName).toBe('TIME');
  });

  it('应该支持 mark 元素', () => {
    render(<GenericComponent as="mark">Mark</GenericComponent>);
    const element = screen.getByText('Mark');
    expect(element.tagName).toBe('MARK');
  });

  it('应该支持 code 元素', () => {
    render(<GenericComponent as="code">Code</GenericComponent>);
    const element = screen.getByText('Code');
    expect(element.tagName).toBe('CODE');
  });

  it('应该支持 pre 元素', () => {
    render(<GenericComponent as="pre">Pre</GenericComponent>);
    const element = screen.getByText('Pre');
    expect(element.tagName).toBe('PRE');
  });

  it('应该支持 blockquote 元素', () => {
    render(<GenericComponent as="blockquote">Blockquote</GenericComponent>);
    const element = screen.getByText('Blockquote');
    expect(element.tagName).toBe('BLOCKQUOTE');
  });

  it('应该支持 cite 元素', () => {
    render(<GenericComponent as="cite">Cite</GenericComponent>);
    const element = screen.getByText('Cite');
    expect(element.tagName).toBe('CITE');
  });

  it('应该支持 abbr 元素', () => {
    render(<GenericComponent as="abbr">Abbr</GenericComponent>);
    const element = screen.getByText('Abbr');
    expect(element.tagName).toBe('ABBR');
  });

  it('应该支持 address 元素', () => {
    render(<GenericComponent as="address">Address</GenericComponent>);
    const element = screen.getByText('Address');
    expect(element.tagName).toBe('ADDRESS');
  });
});

describe('GenericComponent - 属性组合测试', () => {
  it('应该支持所有颜色属性组合', () => {
    const { container } = render(
      <GenericComponent
        color="red"
        backgroundColor="blue"
        borderColor="green"
        style={{ borderWidth: '1px', borderStyle: 'solid' }}
      >
        Test Content
      </GenericComponent>
    );
    const element = container.querySelector('div');
    expect(element).toBeInTheDocument();
    expect(element?.style.color).toBe('red');
    expect(element?.style.backgroundColor).toBe('blue');
    expect(element?.style.borderColor).toBe('green');
  });

  it('应该支持所有间距属性组合', () => {
    const { container } = render(
      <GenericComponent margin="10px" padding="20px" gap="5px">
        Test Content
      </GenericComponent>
    );
    const element = container.querySelector('div');
    expect(element).toHaveStyle({
      margin: '10px',
      padding: '20px',
      gap: '5px',
    });
  });

  it('应该支持所有布局属性组合', () => {
    const { container } = render(
      <GenericComponent
        width="100%"
        height="100%"
        display="flex"
        flex="1"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="stretch"
      >
        Test Content
      </GenericComponent>
    );
    const element = container.querySelector('div');
    expect(element).toHaveStyle({
      width: '100%',
      height: '100%',
      display: 'flex',
      flex: '1',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'stretch',
    });
  });

  it('应该支持所有排版属性组合', () => {
    const { container } = render(
      <GenericComponent
        fontSize="18px"
        fontWeight="600"
        lineHeight="1.6"
        letterSpacing="0.5px"
        textAlign="justify"
      >
        Test Content
      </GenericComponent>
    );
    const element = container.querySelector('div');
    expect(element).toHaveStyle({
      fontSize: '18px',
      fontWeight: '600',
      lineHeight: '1.6',
      letterSpacing: '0.5px',
      textAlign: 'justify',
    });
  });

  it('应该支持所有事件处理器组合', () => {
    const handleClick = jest.fn();
    const handleMouseDown = jest.fn();
    const handleMouseUp = jest.fn();
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    const handleKeyDown = jest.fn();
    const handleKeyUp = jest.fn();
    const handleChange = jest.fn();

    const { container } = render(
      <GenericComponent
        as="input"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onChange={handleChange}
        tabIndex={0}
      />
    );

    const element = container.querySelector('input');
    if (element) {
      fireEvent.click(element);
      fireEvent.mouseDown(element);
      fireEvent.mouseUp(element);
      fireEvent.focus(element);
      fireEvent.blur(element);
      fireEvent.keyDown(element, { key: 'Enter' });
      fireEvent.keyUp(element, { key: 'Enter' });
      fireEvent.change(element, { target: { value: 'test' } });
    }

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleMouseDown).toHaveBeenCalledTimes(1);
    expect(handleMouseUp).toHaveBeenCalledTimes(1);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    expect(handleBlur).toHaveBeenCalledTimes(1);
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
    expect(handleKeyUp).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('应该支持所有 ARIA 属性组合', () => {
    const { container } = render(
      <GenericComponent
        aria-label="Test Label"
        aria-labelledby="test-labelledby"
        aria-describedby="test-describedby"
        aria-hidden={false}
        aria-disabled={false}
        aria-invalid={false}
        aria-required={true}
      >
        Test Content
      </GenericComponent>
    );
    const element = container.querySelector('div');
    expect(element).toHaveAttribute('aria-label', 'Test Label');
    expect(element).toHaveAttribute('aria-labelledby', 'test-labelledby');
    expect(element).toHaveAttribute('aria-describedby', 'test-describedby');
    expect(element).toHaveAttribute('aria-hidden', 'false');
    expect(element).toHaveAttribute('aria-disabled', 'false');
    expect(element).toHaveAttribute('aria-invalid', 'false');
    expect(element).toHaveAttribute('aria-required', 'true');
  });
});

describe('createGenericComponent - 更多测试', () => {
  it('应该支持自定义默认属性', () => {
    const CustomButton = createGenericComponent('CustomButton', undefined);
    const { container } = render(
      <CustomButton className="default-class" style={{ color: 'red' }}>
        Click Me
      </CustomButton>
    );
    const element = container.querySelector('div');
    expect(element).toHaveClass('default-class');
    expect(element).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });

  it('应该支持自定义元素类型', () => {
    const CustomButton = createGenericComponent('CustomButton', undefined);
    const { container } = render(<CustomButton>Click Me</CustomButton>);
    const element = container.querySelector('div');
    expect(element).toBeInTheDocument();
  });

  it('应该支持所有 GenericComponent 属性', () => {
    const CustomButton = createGenericComponent('CustomButton', undefined);
    const { container } = render(
      <CustomButton
        color="red"
        backgroundColor="blue"
        margin="10px"
        padding="20px"
        onClick={jest.fn()}
      >
        Click Me
      </CustomButton>
    );
    const element = container.querySelector('div');
    expect(element).toBeInTheDocument();
    expect(element).toHaveStyle({
      color: 'rgb(255, 0, 0)',
      backgroundColor: 'rgb(0, 0, 255)',
      margin: '10px',
      padding: '20px',
    });
  });
});

describe('withGenericComponentEffect - 更多测试', () => {
  it('应该在组件挂载时调用 useEffect', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const SimpleComponent = () => <div>Simple</div>;
    const EnhancedComponent = withGenericComponentEffect(SimpleComponent, 'Simple');
    render(<EnhancedComponent />);
    expect(consoleWarnSpy).toHaveBeenCalledWith('Simple mounted with props:', expect.any(Object));
    consoleWarnSpy.mockRestore();
  });

  it('应该在组件卸载时调用清理函数', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const SimpleComponent = () => <div>Simple</div>;
    const EnhancedComponent = withGenericComponentEffect(SimpleComponent, 'Simple');
    const { unmount } = render(<EnhancedComponent />);
    unmount();
    expect(consoleWarnSpy).toHaveBeenCalledWith('Simple unmounted');
    consoleWarnSpy.mockRestore();
  });

  it('应该支持属性传递', () => {
    const SimpleComponent = (props: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>Simple</div>
    );
    const EnhancedComponent = withGenericComponentEffect(SimpleComponent, 'Simple');
    const { container } = render(<EnhancedComponent className="test-class" data-test="test" />);
    expect(container.querySelector('.test-class')).toBeInTheDocument();
    expect(container.querySelector('[data-test="test"]')).toBeInTheDocument();
  });
});

describe('withGenericComponentMemo - 更多测试', () => {
  it('应该使用 React.memo 包装组件', () => {
    const SimpleComponent = (props: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>Simple</div>
    );
    const MemoizedComponent = withGenericComponentMemo(SimpleComponent, 'Simple');
    expect(MemoizedComponent.displayName).toBe('memo(Simple)');
  });

  it('应该支持属性传递', () => {
    const SimpleComponent = (props: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>Simple</div>
    );
    const MemoizedComponent = withGenericComponentMemo(SimpleComponent, 'Simple');
    const { container } = render(<MemoizedComponent className="test-class" data-test="test" />);
    expect(container.querySelector('.test-class')).toBeInTheDocument();
    expect(container.querySelector('[data-test="test"]')).toBeInTheDocument();
  });
});

describe('mergeGenericComponentProps - 更多测试', () => {
  it('应该处理嵌套对象', () => {
    const props1 = { style: { color: 'red' }, className: 'class1' } as any;
    const props2 = { style: { fontSize: '16px' }, className: 'class2' } as any;
    const merged = mergeGenericComponentProps(props1, props2);
    expect(merged).toEqual({
      style: { fontSize: '16px' },
      className: 'class2',
    });
  });

  it('应该处理函数属性', () => {
    const handleClick = jest.fn();
    const props1 = { onClick: handleClick } as any;
    const props2 = { onClick: jest.fn() } as any;
    const merged = mergeGenericComponentProps(props1, props2);
    expect(merged.onClick).toBeDefined();
  });

  it('应该处理空对象', () => {
    const merged = mergeGenericComponentProps({} as any, {} as any);
    expect(merged).toEqual({});
  });

  it('应该处理第一个对象为空', () => {
    const props2 = { color: 'red', fontSize: '16px' } as any;
    const merged = mergeGenericComponentProps({} as any, props2);
    expect(merged).toEqual(props2);
  });

  it('应该处理第二个对象为空', () => {
    const props1 = { color: 'red', fontSize: '16px' } as any;
    const merged = mergeGenericComponentProps(props1, {} as any);
    expect(merged).toEqual(props1);
  });
});

describe('overrideGenericComponentProps - 更多测试', () => {
  it('应该完全覆盖同名属性', () => {
    const base = { color: 'red', fontSize: '16px', fontWeight: 'bold' } as any;
    const overrides = { color: 'blue', fontSize: '20px' } as any;
    const result = overrideGenericComponentProps(base, overrides);
    expect(result).toEqual({
      color: 'blue',
      fontSize: '20px',
      fontWeight: 'bold',
    });
  });

  it('应该保留基础对象中的独有属性', () => {
    const base = { color: 'red', fontSize: '16px', fontWeight: 'bold' } as any;
    const overrides = { color: 'blue' } as any;
    const result = overrideGenericComponentProps(base, overrides);
    expect(result).toEqual({
      color: 'blue',
      fontSize: '16px',
      fontWeight: 'bold',
    });
  });

  it('应该添加覆盖对象中的独有属性', () => {
    const base = { color: 'red' } as any;
    const overrides = { fontSize: '16px', fontWeight: 'bold' } as any;
    const result = overrideGenericComponentProps(base, overrides);
    expect(result).toEqual({
      color: 'red',
      fontSize: '16px',
      fontWeight: 'bold',
    });
  });

  it('应该处理嵌套对象', () => {
    const base = { style: { color: 'red' }, className: 'class1' } as any;
    const overrides = { style: { fontSize: '16px' }, className: 'class2' } as any;
    const result = overrideGenericComponentProps(base, overrides);
    expect(result).toEqual({
      style: { fontSize: '16px' },
      className: 'class2',
    });
  });

  it('应该处理两个对象都为空', () => {
    const result = overrideGenericComponentProps({} as any, {} as any);
    expect(result).toEqual({});
  });
});

describe('GenericComponent - 边界情况', () => {
  it('应该处理空子元素', () => {
    const { container } = render(<GenericComponent></GenericComponent>);
    const element = container.querySelector('div');
    expect(element).toBeInTheDocument();
    expect(element).toBeEmptyDOMElement();
  });

  it('应该处理 null 子元素', () => {
    const { container } = render(<GenericComponent>{null}</GenericComponent>);
    const element = container.querySelector('div');
    expect(element).toBeInTheDocument();
    expect(element).toBeEmptyDOMElement();
  });

  it('应该处理多个子元素', () => {
    const { container } = render(
      <GenericComponent>
        <span>Child 1</span>
        <span>Child 2</span>
        <span>Child 3</span>
      </GenericComponent>
    );
    const element = container.querySelector('div');
    expect(element).toBeInTheDocument();
    expect(element?.children.length).toBe(3);
  });

  it('应该处理嵌套子元素', () => {
    const { container } = render(
      <GenericComponent>
        <div>
          <span>Nested Child</span>
        </div>
      </GenericComponent>
    );
    const element = container.querySelector('div');
    expect(element).toBeInTheDocument();
    expect(element?.querySelector('span')).toBeInTheDocument();
  });

  it('应该处理特殊字符在文本中', () => {
    const { container } = render(
      <GenericComponent>Test &lt;script&gt;alert(&apos;xss&apos;)&lt;/script&gt;</GenericComponent>
    );
    const element = container.querySelector('div');
    expect(element).toBeInTheDocument();
    expect(element?.innerHTML).toContain('&lt;script&gt;');
  });

  it('应该处理超长文本', () => {
    const longText = 'A'.repeat(10000);
    const { container } = render(<GenericComponent>{longText}</GenericComponent>);
    const element = container.querySelector('div');
    expect(element).toBeInTheDocument();
    expect(element?.textContent).toBe(longText);
  });

  it('应该处理特殊 HTML 实体', () => {
    render(<GenericComponent>Test &amp; Test</GenericComponent>);
    const element = screen.getByText('Test & Test');
    expect(element).toBeInTheDocument();
  });
});

describe('GenericComponent - 多个子元素', () => {
  it('应该支持多个子元素', () => {
    render(
      <GenericComponent>
        <span>Child 1</span>
        <span>Child 2</span>
        <span>Child 3</span>
      </GenericComponent>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Child 3')).toBeInTheDocument();
  });

  it('应该支持嵌套子元素', () => {
    render(
      <GenericComponent>
        <div>
          <span>Nested Child</span>
        </div>
      </GenericComponent>
    );
    expect(screen.getByText('Nested Child')).toBeInTheDocument();
  });

  it('应该支持空子元素', () => {
    render(<GenericComponent />);
    const { container } = render(<GenericComponent />);
    const element = container.querySelector('div');
    expect(element).toBeInTheDocument();
    expect(element).toBeEmptyDOMElement();
  });

  it('应该支持 null 子元素', () => {
    render(<GenericComponent>{null}</GenericComponent>);
    const { container } = render(<GenericComponent>{null}</GenericComponent>);
    const element = container.querySelector('div');
    expect(element).toBeInTheDocument();
    expect(element).toBeEmptyDOMElement();
  });
});

describe('GenericComponent - 事件参数', () => {
  it('应该传递正确的 onClick 事件参数', () => {
    const handleClick = jest.fn((e: React.MouseEvent) => {
      expect(e).toBeDefined();
      expect(e.type).toBe('click');
    });
    render(<GenericComponent onClick={handleClick}>Click Me</GenericComponent>);
    const element = screen.getByText('Click Me');
    element.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('应该传递正确的 onKeyDown 事件参数', () => {
    const handleKeyDown = jest.fn((e: React.KeyboardEvent) => {
      expect(e).toBeDefined();
      expect(e.type).toBe('keydown');
      expect(e.key).toBe('Enter');
    });
    const { container } = render(
      <GenericComponent onKeyDown={handleKeyDown} tabIndex={0}>
        Test
      </GenericComponent>
    );
    const element = container.querySelector('div');
    if (element) {
      fireEvent.keyDown(element, { key: 'Enter' });
      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    }
  });

  it('应该传递正确的 onChange 事件参数', () => {
    const handleChange = jest.fn((e: React.ChangeEvent) => {
      expect(e).toBeDefined();
      expect(e.type).toBe('change');
    });
    const { container } = render(<GenericComponent as="input" onChange={handleChange} />);
    const element = container.querySelector('input');
    if (element) {
      fireEvent.change(element, { target: { value: 'test' } });
      expect(handleChange).toHaveBeenCalledTimes(1);
    }
  });
});
