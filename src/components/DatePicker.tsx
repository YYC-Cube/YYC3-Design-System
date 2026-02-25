import * as React from 'react';
import { memo, useState, useRef, useEffect, useCallback, CSSProperties } from 'react';
import { useTheme } from '../theme/useTheme';
import { Button } from './Button';
import { Input } from './Input';

export interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  disabled?: boolean;
  placeholder?: string;
  format?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: (date: Date) => boolean;
  className?: string;
  'data-testid'?: string;
}

export const DatePicker = memo<DatePickerProps>(({
  value = null,
  onChange,
  disabled = false,
  placeholder = 'Select date',
  format = 'YYYY-MM-DD',
  minDate,
  maxDate,
  disabledDates,
  className = '',
  'data-testid': dataTestId,
}) => {
  const { tokens } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [internalCurrentDate, setInternalCurrentDate] = useState<Date>(value || new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  const currentDate = React.useMemo(() => value || internalCurrentDate, [value, internalCurrentDate]);

  const setCurrentDate = useCallback((date: Date) => {
    setInternalCurrentDate(date);
    onChange?.(date);
  }, [onChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatDate = useCallback((date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day);
  }, [format]);

  const parseDate = useCallback((dateString: string): Date | null => {
    const match = dateString.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, year, month, day] = match;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0);
    }
    return null;
  }, []);

  const isDateDisabled = useCallback((date: Date): boolean => {
    if (disabledDates && disabledDates(date)) {
      return true;
    }
    if (minDate && date < minDate) {
      return true;
    }
    if (maxDate && date > maxDate) {
      return true;
    }
    return false;
  }, [disabledDates, minDate, maxDate]);

  const handleInputChange = useCallback((value: string) => {
    const date = parseDate(value);
    if (date) {
      if (!isDateDisabled(date)) {
        setCurrentDate(date);
      }
    }
  }, [parseDate, isDateDisabled, setCurrentDate]);

  const handleDateClick = useCallback((date: Date) => {
    if (isDateDisabled(date)) {
      return;
    }
    setCurrentDate(date);
    setIsOpen(false);
  }, [isDateDisabled, setCurrentDate]);

  const handlePrevMonth = useCallback(() => {
    setSelectedMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setSelectedMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  }, []);

  const getDaysInMonth = useCallback((date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }, []);

  const getFirstDayOfMonth = useCallback((date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  }, []);

  const generateCalendarDays = useCallback(() => {
    const daysInMonth = getDaysInMonth(selectedMonth);
    const firstDay = getFirstDayOfMonth(selectedMonth);
    const days: Date[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null as unknown as Date);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), i));
    }

    return days;
  }, [selectedMonth, getDaysInMonth, getFirstDayOfMonth]);

  const isSameDay = useCallback((date1: Date, date2: Date): boolean => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }, []);

  const isSelected = useCallback((date: Date): boolean => {
    return currentDate && isSameDay(date, currentDate);
  }, [currentDate, isSameDay]);

  const isToday = useCallback((date: Date): boolean => {
    const today = new Date();
    return isSameDay(date, today);
  }, [isSameDay]);

  const calendarDays = generateCalendarDays();
  const weeks: Date[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const containerStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    width: '100%',
    maxWidth: '320px',
  };

  const inputContainerStyle: CSSProperties = {
    width: '100%',
  };

  const dropdownStyle: CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    zIndex: 1000,
    marginTop: '4px',
    backgroundColor: tokens['color.background'] as string || '#ffffff',
    border: `1px solid ${tokens['color.border'] as string || '#e0e0e0'}`,
    borderRadius: tokens['radius.md'] as string || '8px',
    boxShadow: tokens['shadow.lg'] as string || '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    padding: '16px',
    display: isOpen ? 'block' : 'none',
  };

  const headerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  };

  const navigationButtonStyle: CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    color: tokens['color.foreground'] as string || '#333333',
    fontSize: tokens['font-size.body'] as string || '14px',
  };

  const currentMonthStyle: CSSProperties = {
    fontWeight: 600,
    fontSize: tokens['font-size.body'] as string || '14px',
    color: tokens['color.foreground'] as string || '#333333',
  };

  const calendarStyle: CSSProperties = {
    width: '100%',
  };

  const weekDaysStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
    marginBottom: '8px',
  };

  const weekDayStyle: CSSProperties = {
    textAlign: 'center',
    fontSize: tokens['font-size.small'] as string || '12px',
    color: tokens['color.muted-foreground'] as string || '#666666',
    fontWeight: 500,
  };

  const weekStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
    marginBottom: '4px',
  };

  const dayStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '32px',
    width: '32px',
    cursor: 'pointer',
    borderRadius: tokens['radius.sm'] as string || '4px',
    fontSize: tokens['font-size.small'] as string || '13px',
    color: tokens['color.foreground'] as string || '#333333',
    transition: 'all 0.2s ease',
  };

  const dayHoverStyle: CSSProperties = {
    backgroundColor: tokens['color.primary'] as string + '20' || '#e6f7ff',
  };

  const daySelectedStyle: CSSProperties = {
    backgroundColor: tokens['color.primary'] as string || '#3b82f6',
    color: tokens['color.primary-foreground'] as string || '#ffffff',
    fontWeight: 600,
  };

  const dayTodayStyle: CSSProperties = {
    border: `1px solid ${tokens['color.primary'] as string || '#3b82f6'}`,
  };

  const dayDisabledStyle: CSSProperties = {
    color: tokens['color.muted-foreground'] as string || '#cccccc',
    cursor: 'not-allowed',
  };

  const handleInputClick = useCallback(() => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  }, [disabled, isOpen]);

  return (
    <div ref={containerRef} style={containerStyle} className={className} data-testid={dataTestId}>
      <div style={inputContainerStyle} onClick={handleInputClick}>
        <Input
          value={currentDate ? formatDate(currentDate) : ''}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder={placeholder}
        />
      </div>

      {isOpen && (
        <div style={dropdownStyle}>
          <div style={headerStyle}>
            <button
              type="button"
              onClick={handlePrevMonth}
              style={navigationButtonStyle}
              aria-label="Previous month"
            >
              {'<'}
            </button>
            <span style={currentMonthStyle}>
              {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              style={navigationButtonStyle}
              aria-label="Next month"
            >
              {'>'}
            </button>
          </div>

          <div style={calendarStyle}>
            <div style={weekDaysStyle}>
              {weekDays.map(day => (
                <div key={day} style={weekDayStyle}>
                  {day}
                </div>
              ))}
            </div>

            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} style={weekStyle}>
                {week.map((day, dayIndex) => {
                  if (!day) {
                    return <div key={dayIndex} style={dayStyle} />;
                  }

                  const disabled = isDateDisabled(day);
                  const selected = isSelected(day);
                  const today = isToday(day);

                  return (
                    <div
                      key={dayIndex}
                      style={{
                        ...dayStyle,
                        ...(selected ? daySelectedStyle : {}),
                        ...(today && !selected ? dayTodayStyle : {}),
                        ...(disabled ? dayDisabledStyle : {}),
                      }}
                      onClick={() => handleDateClick(day)}
                      onMouseEnter={(e) => {
                        if (!disabled) {
                          Object.assign((e.target as HTMLElement).style, dayHoverStyle);
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!disabled && !selected) {
                          (e.target as HTMLElement).style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {day.getDate()}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button
              onClick={() => {
                const today = new Date();
                if (!isDateDisabled(today)) {
                  handleDateClick(today);
                }
              }}
            >
              Today
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';
