import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import {
  NeuPalette,
  insetShadow,
  pressedShadow,
  raisedDropFilter,
} from '../theme/neumorphism';

interface NeuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  neu: NeuPalette;
  active?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  size?: 'sm' | 'md';
}

export const NeuButton = ({
  neu,
  active = false,
  icon,
  children,
  size = 'md',
  disabled,
  ...rest
}: NeuButtonProps): JSX.Element => (
  <Box
    sx={{
      display: 'inline-flex',
      borderRadius: 999,
      filter: active || disabled ? 'none' : raisedDropFilter(neu),
      transition: 'filter 180ms ease',
      '&:has(button:active)': { filter: 'none' },
    }}
  >
    <Box
      component="button"
      disabled={disabled}
      {...rest}
      sx={{
        appearance: 'none',
        border: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: size === 'sm' ? 1.5 : 2,
        py: size === 'sm' ? 0.85 : 1.1,
        borderRadius: 999,
        overflow: 'hidden',
        backgroundColor: neu.bg,
        color: active ? neu.accent : neu.text,
        fontFamily: "'Manrope', sans-serif",
        fontWeight: 600,
        fontSize: size === 'sm' ? '0.8rem' : '0.875rem',
        boxShadow: active ? pressedShadow(neu) : 'none',
        transition: 'box-shadow 180ms ease, color 180ms ease',
        '&:hover:not(:disabled)': {
          color: neu.accent,
        },
        '&:active:not(:disabled)': {
          boxShadow: pressedShadow(neu),
        },
      }}
    >
      {icon}
      {children}
    </Box>
  </Box>
);

interface NeuIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  neu: NeuPalette;
  active?: boolean;
  label: string;
  children: ReactNode;
}

export const NeuIconButton = ({
  neu,
  active = false,
  label,
  children,
  ...rest
}: NeuIconButtonProps): JSX.Element => (
  <Box
    sx={{
      display: 'inline-flex',
      borderRadius: '50%',
      filter: active ? 'none' : raisedDropFilter(neu),
      transition: 'filter 180ms ease',
      '&:has(button:active)': { filter: 'none' },
    }}
  >
    <Box
      component="button"
      aria-label={label}
      {...rest}
      sx={{
        appearance: 'none',
        border: 0,
        cursor: 'pointer',
        width: 44,
        height: 44,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: neu.bg,
        color: active ? neu.accent : neu.text,
        boxShadow: active ? pressedShadow(neu) : 'none',
        transition: 'box-shadow 180ms ease, color 180ms ease',
        '&:hover': { color: neu.accent },
        '&:active': { boxShadow: pressedShadow(neu) },
      }}
    >
      {children}
    </Box>
  </Box>
);

interface NeuStatCardProps {
  neu: NeuPalette;
  label: string;
  value: string | number;
  icon: ReactNode;
}

export const NeuStatCard = ({ neu, label, value, icon }: NeuStatCardProps): JSX.Element => (
  <Box
    sx={{
      flex: '1 1 120px',
      minWidth: 120,
      px: 2,
      py: 2.25,
      borderRadius: '18px',
      overflow: 'hidden',
      backgroundColor: neu.bg,
      boxShadow: insetShadow(neu, 5),
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 0.85,
    }}
  >
    <Box sx={{ color: neu.accent, display: 'flex', justifyContent: 'center', lineHeight: 0 }}>
      {icon}
    </Box>
    <Typography
      sx={{
        fontWeight: 700,
        fontSize: '1.15rem',
        color: neu.text,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      }}
    >
      {value}
    </Typography>
    <Typography
      sx={{
        fontSize: '0.72rem',
        color: neu.textMuted,
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        lineHeight: 1.2,
      }}
    >
      {label}
    </Typography>
  </Box>
);

interface NeuPanelProps {
  neu: NeuPalette;
  children: ReactNode;
  title?: string;
  raised?: boolean;
}

export const NeuPanel = ({ neu, children, title, raised = true }: NeuPanelProps): JSX.Element => (
  <Box
    sx={{
      borderRadius: '22px',
      filter: raised ? raisedDropFilter(neu) : 'none',
    }}
  >
    <Box
      sx={{
        p: { xs: 2.25, sm: 3 },
        borderRadius: '22px',
        overflow: 'hidden',
        backgroundColor: neu.bg,
        boxShadow: raised ? 'none' : insetShadow(neu, 6),
        height: '100%',
      }}
    >
      {title && (
        <Typography
          sx={{
            fontSize: '0.7rem',
            letterSpacing: '0.14em',
            fontWeight: 700,
            color: neu.textMuted,
            mb: 2.25,
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>
      )}
      {children}
    </Box>
  </Box>
);
