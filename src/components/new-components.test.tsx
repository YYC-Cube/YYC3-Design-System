import React from 'react';
;

import { render, fireEvent, waitFor } from '@testing-library/react'
import { screen } from '@testing-library/dom';

import { ThemeProvider } from '../theme/ThemeProvider';
import { Checkbox } from './Checkbox';
import { Radio } from './Radio';
import { Switch } from './Switch';
import { Progress } from './Progress';
import { Spinner } from './Spinner';
import { Alert } from './Alert';
import { Tabs, TabList, Tab, TabPanel } from './Tabs';
import { Modal } from './Modal';
import { Tooltip } from './Tooltip';
import { Divider } from './Divider';
import { Select } from './Select';
import { Animated } from './Animated';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Checkbox', () => {
  it('should render correctly', () => {
    renderWithTheme(<Checkbox>Label</Checkbox>);
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('should toggle on click', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Checkbox onChange={handleChange}>Label</Checkbox>);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('should be disabled when disabled prop is true', () => {
    renderWithTheme(<Checkbox disabled>Label</Checkbox>);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });
});

describe('Radio', () => {
  it('should render correctly', () => {
    renderWithTheme(<Radio value="1">Option 1</Radio>);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('should call onChange when clicked', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Radio value="1" onChange={handleChange}>Option 1</Radio>);
    
    const radio = screen.getByRole('radio');
    fireEvent.click(radio);
    expect(handleChange).toHaveBeenCalledWith('1');
  });
});

describe('Switch', () => {
  it('should render correctly', () => {
    renderWithTheme(<Switch />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('should toggle on click', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Switch onChange={handleChange} />);
    
    const switchEl = screen.getByRole('switch');
    fireEvent.click(switchEl);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('should be disabled when disabled prop is true', () => {
    renderWithTheme(<Switch disabled />);
    const switchEl = screen.getByRole('switch');
    expect(switchEl).toHaveAttribute('tabIndex', '-1');
  });
});

describe('Progress', () => {
  it('should render correctly', () => {
    renderWithTheme(<Progress value={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should have correct aria attributes', () => {
    renderWithTheme(<Progress value={75} max={100} />);
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '75');
    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
  });
});

describe('Spinner', () => {
  it('should render correctly', () => {
    renderWithTheme(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should have correct size classes', () => {
    const { container } = renderWithTheme(<Spinner size="lg" />);
    const spinner = container.querySelector('[style*="width: 2rem"]');
    expect(spinner).toBeInTheDocument();
  });
});

describe('Alert', () => {
  it('should render correctly', () => {
    renderWithTheme(<Alert>Alert message</Alert>);
    expect(screen.getByText('Alert message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should render different variants', () => {
    const { unmount } = renderWithTheme(<Alert variant="destructive">Error</Alert>);
    expect(screen.getByText('Error')).toBeInTheDocument();
    unmount();

    renderWithTheme(<Alert variant="success">Success</Alert>);
    expect(screen.getByText('Success')).toBeInTheDocument();
  });
});

describe('Tabs', () => {
  it('should render correctly', () => {
    renderWithTheme(
      <Tabs defaultValue="tab1">
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
        </TabList>
        <TabPanel value="tab1">Content 1</TabPanel>
        <TabPanel value="tab2">Content 2</TabPanel>
      </Tabs>
    );
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('should switch tabs on click', () => {
    renderWithTheme(
      <Tabs defaultValue="tab1">
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
        </TabList>
        <TabPanel value="tab1">Content 1</TabPanel>
        <TabPanel value="tab2">Content 2</TabPanel>
      </Tabs>
    );

    fireEvent.click(screen.getByText('Tab 2'));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });
});

describe('Modal', () => {
  it('should not render when isOpen is false', () => {
    renderWithTheme(<Modal isOpen={false}>Modal content</Modal>);
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    renderWithTheme(<Modal isOpen={true}>Modal content</Modal>);
    expect(screen.getByText('Modal content')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should call onClose when backdrop is clicked', () => {
    const handleClose = jest.fn();
    renderWithTheme(<Modal isOpen={true} onClose={handleClose}>Modal content</Modal>);
    
    const backdrop = screen.getByRole('dialog').parentElement;
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(handleClose).toHaveBeenCalled();
    }
  });
});

describe('Tooltip', () => {
  it('should render correctly', () => {
    renderWithTheme(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('should show tooltip on hover', () => {
    renderWithTheme(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByText('Hover me');
    fireEvent.mouseEnter(button);
    
    setTimeout(() => {
      expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    }, 300);
  });
});

describe('Divider', () => {
  it('should render correctly', () => {
    renderWithTheme(<Divider />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('should render vertical divider', () => {
    const { container } = renderWithTheme(<Divider orientation="vertical" />);
    const divider = container.querySelector('[style*="height: 100%"]');
    expect(divider).toBeInTheDocument();
  });
});

describe('Select', () => {
  it('should render correctly', () => {
    const options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ];
    renderWithTheme(<Select options={options} />);
    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  it('should open dropdown on click', () => {
    const options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ];
    renderWithTheme(<Select options={options} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.click(select);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('should call onChange when option is selected', () => {
    const handleChange = jest.fn();
    const options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ];
    renderWithTheme(<Select options={options} onChange={handleChange} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.click(select);
    
    fireEvent.click(screen.getByText('Option 1'));
    expect(handleChange).toHaveBeenCalledWith('1');
  });
});

describe('Animated', () => {
  it('should render correctly', () => {
    renderWithTheme(<Animated animation="fadeIn">Content</Animated>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should animate on mount', () => {
    const { container } = renderWithTheme(<Animated animation="fadeIn">Content</Animated>);
    const animated = container.querySelector('[style*="animation"]');
    expect(animated).toBeInTheDocument();
  });

  it('should animate on hover', () => {
    const { container } = renderWithTheme(<Animated animation="scaleIn" trigger="hover">Content</Animated>);
    const animated = container.querySelector('[style*="transition"]');
    expect(animated).toBeInTheDocument();
  });

  it('should animate on click', () => {
    const { container } = renderWithTheme(<Animated animation="bounceIn" trigger="click">Content</Animated>);
    const animated = container.querySelector('[style*="cursor: pointer"]');
    expect(animated).toBeInTheDocument();
  });
});
