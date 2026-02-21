import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, useTheme } from './ThemeProvider';

describe('ThemeProvider', () => {
  it('provides theme context to children', () => {
    const TestComponent = () => {
      const { tokens } = useTheme();
      return <div data-testid="primary-color">{String(tokens['color.primary'] || '')}</div>;
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('primary-color')).toHaveTextContent('#e06a70');
  });

  it('allows updating tokens', () => {
    const TestComponent = () => {
      const { tokens, setTokens } = useTheme();
      return (
        <div>
          <div data-testid="primary-color">{String(tokens['color.primary'] || '')}</div>
          <button onClick={() => setTokens({ 'color.primary': '#ff0000' })}>
            Update
          </button>
        </div>
      );
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const button = screen.getByText('Update');
    fireEvent.click(button);

    expect(screen.getByTestId('primary-color')).toHaveTextContent('#ff0000');
  });

  it('throws error when useTheme is used outside ThemeProvider', () => {
    const TestComponent = () => {
      try {
        useTheme();
        return <div>No error</div>;
      } catch (error) {
        return <div>Error: {(error as Error).message}</div>;
      }
    };

    render(<TestComponent />);

    expect(screen.getByText(/useTheme must be used within a ThemeProvider/)).toBeInTheDocument();
  });
});
