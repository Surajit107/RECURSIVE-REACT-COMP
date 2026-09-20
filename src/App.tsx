import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  InputBase,
  Snackbar,
  Alert,
  CssBaseline,
  Stack,
  Divider,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Brightness4 from '@mui/icons-material/Brightness4';
import Brightness7 from '@mui/icons-material/Brightness7';
import UnfoldMore from '@mui/icons-material/UnfoldMore';
import UnfoldLess from '@mui/icons-material/UnfoldLess';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import SortByAlphaRoundedIcon from '@mui/icons-material/SortByAlphaRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import RecursiveList from './components/RecursiveList';
import { NeuButton, NeuIconButton, NeuPanel, NeuStatCard } from './components/NeuPrimitives';
import { ListItemType } from './types/types';
import {
  neuDark,
  neuLight,
  insetShadow,
  raisedShadow,
  softRaisedShadow,
} from './theme/neumorphism';
import {
  SortMode,
  TreeSelection,
  ViewFilter,
  collectOpenPathsForQuery,
  countNodes,
  filterTree,
  getExtension,
  maxDepth,
  sortTree,
} from './utils/treeUtils';
import data from './data2.json';

const typedData: ListItemType[] = data as ListItemType[];

const FAVORITES_KEY = 'recursive-neu-favorites';

const App = (): JSX.Element => {
  const [darkMode, setDarkMode] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [query, setQuery] = useState('');
  const [viewFilter, setViewFilter] = useState<ViewFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('name');
  const [selection, setSelection] = useState<TreeSelection | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      return raw ? new Set<string>(JSON.parse(raw) as string[]) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });
  const [copyToast, setCopyToast] = useState(false);
  const [expandSignal, setExpandSignal] = useState<{ mode: 'expand' | 'collapse'; nonce: number }>({
    mode: 'collapse',
    nonce: 0,
  });

  const neu = darkMode ? neuDark : neuLight;

  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: "'Manrope', sans-serif",
          button: { textTransform: 'none', fontWeight: 600 },
        },
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: { main: neu.accent },
          background: { default: neu.bg, paper: neu.bg },
          text: { primary: neu.text, secondary: neu.textMuted },
        },
      }),
    [darkMode, neu]
  );

  const stats = useMemo(() => countNodes(typedData), []);
  const depth = useMemo(() => maxDepth(typedData), []);

  const visibleTree = useMemo(() => {
    const filtered = filterTree(typedData, query, viewFilter);
    return sortTree(filtered, sortMode);
  }, [query, viewFilter, sortMode]);

  const forceOpenPaths = useMemo(
    () => collectOpenPathsForQuery(typedData, query),
    [query]
  );

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  useEffect(() => {
    if (query.trim()) {
      setExpandSignal((prev) => ({ mode: 'expand', nonce: prev.nonce + 1 }));
    }
  }, [query]);

  const handleToggleFavorite = (path: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleCopyPath = async () => {
    if (!selection) {
      return;
    }
    try {
      await navigator.clipboard.writeText(selection.path);
      setCopyToast(true);
    } catch {
      setCopyToast(true);
    }
  };

  const breadcrumb = selection?.path.split('/') ?? [];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: neu.bg,
          color: neu.text,
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 3, md: 5 },
        }}
      >
        <Box
          className="fade-rise"
          sx={{
            maxWidth: 1100,
            mx: 'auto',
            p: { xs: 2.5, sm: 3.5, md: 4 },
            borderRadius: 6,
            backgroundColor: neu.bg,
            boxShadow: raisedShadow(neu, 14),
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 2,
              mb: 3,
              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: { xs: '2rem', sm: '2.5rem' },
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  color: neu.text,
                }}
              >
                Recursive
              </Typography>
              <Typography sx={{ mt: 1.25, color: neu.textMuted, fontWeight: 500, maxWidth: 400, lineHeight: 1.55, fontSize: '0.95rem' }}>
                Soft UI file explorer — search, filter, favorite, and inspect nested structure.
              </Typography>
            </Box>

            <NeuIconButton
              neu={neu}
              label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={() => setDarkMode((prev) => !prev)}
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </NeuIconButton>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2.25,
              py: 1.5,
              mb: 3,
              borderRadius: 999,
              backgroundColor: neu.bg,
              boxShadow: insetShadow(neu, 6),
            }}
          >
            <SearchRoundedIcon sx={{ color: neu.textMuted }} />
            <InputBase
              fullWidth
              placeholder="Search files and folders…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              sx={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 500,
                color: neu.text,
                '& input::placeholder': { color: neu.textMuted, opacity: 1 },
              }}
            />
            {query && (
              <NeuButton neu={neu} size="sm" onClick={() => setQuery('')}>
                Clear
              </NeuButton>
            )}
          </Box>

          <Stack
            direction="row"
            spacing={1.25}
            useFlexGap
            flexWrap="wrap"
            sx={{ mb: 3.5 }}
            alignItems="center"
          >
            {([
              ['all', 'All'],
              ['folder', 'Folders'],
              ['file', 'Files'],
            ] as const).map(([value, label]) => (
              <NeuButton
                key={value}
                neu={neu}
                size="sm"
                active={viewFilter === value}
                onClick={() => setViewFilter(value)}
              >
                {label}
              </NeuButton>
            ))}

            <Box sx={{ width: 8 }} />

            <NeuButton
              neu={neu}
              size="sm"
              active={sortMode === 'name'}
              icon={<SortByAlphaRoundedIcon sx={{ fontSize: 18 }} />}
              onClick={() => setSortMode('name')}
            >
              Name
            </NeuButton>
            <NeuButton
              neu={neu}
              size="sm"
              active={sortMode === 'type'}
              icon={<CategoryRoundedIcon sx={{ fontSize: 18 }} />}
              onClick={() => setSortMode('type')}
            >
              Type
            </NeuButton>

            <Box sx={{ flexGrow: 1 }} />

            <NeuButton
              neu={neu}
              size="sm"
              icon={<UnfoldMore sx={{ fontSize: 18 }} />}
              onClick={() => setExpandSignal((prev) => ({ mode: 'expand', nonce: prev.nonce + 1 }))}
            >
              Expand
            </NeuButton>
            <NeuButton
              neu={neu}
              size="sm"
              icon={<UnfoldLess sx={{ fontSize: 18 }} />}
              onClick={() =>
                setExpandSignal((prev) => ({ mode: 'collapse', nonce: prev.nonce + 1 }))
              }
            >
              Collapse
            </NeuButton>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} useFlexGap sx={{ mb: 3 }}>
            <NeuStatCard
              neu={neu}
              label="Folders"
              value={stats.folders}
              icon={<FolderRoundedIcon />}
            />
            <NeuStatCard
              neu={neu}
              label="Files"
              value={stats.files}
              icon={<InsertDriveFileOutlinedIcon />}
            />
            <NeuStatCard
              neu={neu}
              label="Max depth"
              value={depth}
              icon={<LayersRoundedIcon />}
            />
            <NeuStatCard
              neu={neu}
              label="Favorites"
              value={favorites.size}
              icon={<StarRoundedIcon />}
            />
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.4fr 0.9fr' },
              gap: 2.5,
            }}
          >
            <NeuPanel neu={neu} title="FILE SYSTEM">
              {visibleTree.length === 0 ? (
                <Box
                  sx={{
                    py: 6,
                    textAlign: 'center',
                    color: neu.textMuted,
                    borderRadius: 4,
                    boxShadow: insetShadow(neu, 5),
                  }}
                >
                  <Typography sx={{ fontWeight: 600 }}>No matches</Typography>
                  <Typography sx={{ fontSize: '0.85rem', mt: 0.5 }}>
                    Try another search or filter.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ maxHeight: { xs: 420, md: 520 }, overflowY: 'auto', px: 0.75, py: 0.75 }}>
                  <RecursiveList
                    items={visibleTree}
                    neu={neu}
                    expandSignal={expandSignal}
                    forceOpenPaths={forceOpenPaths}
                    selectedPath={selection?.path ?? null}
                    favorites={favorites}
                    onSelect={setSelection}
                    onToggleFavorite={handleToggleFavorite}
                    searchQuery={query}
                  />
                </Box>
              )}
            </NeuPanel>

            <Stack spacing={2.5}>
              <NeuPanel neu={neu} title="SELECTION">
                {selection ? (
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 700,
                        fontSize: '1.3rem',
                        letterSpacing: '-0.02em',
                        color: neu.text,
                        mb: 0.75,
                        lineHeight: 1.25,
                        wordBreak: 'break-word',
                      }}
                    >
                      {selection.text}
                    </Typography>
                    <Typography
                      sx={{
                        color: neu.accent,
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        mb: 2.25,
                        lineHeight: 1.2,
                      }}
                    >
                      {selection.type}
                      {selection.type === 'file' && getExtension(selection.text)
                        ? ` · ${getExtension(selection.text)}`
                        : ''}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: 1,
                        rowGap: 1,
                        mb: 2.5,
                      }}
                    >
                      {breadcrumb.map((segment, index) => (
                        <Box
                          key={`${segment}-${index}`}
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              px: 1.35,
                              py: 0.65,
                              borderRadius: 999,
                              fontSize: '0.74rem',
                              fontWeight: 600,
                              lineHeight: 1.2,
                              color: index === breadcrumb.length - 1 ? neu.accent : neu.textMuted,
                              backgroundColor: neu.bg,
                              boxShadow: softRaisedShadow(neu),
                              maxWidth: 160,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {segment}
                          </Box>
                          {index < breadcrumb.length - 1 ? (
                            <Typography
                              component="span"
                              sx={{ color: neu.textMuted, fontSize: '0.75rem', fontWeight: 700 }}
                            >
                              /
                            </Typography>
                          ) : null}
                        </Box>
                      ))}
                    </Box>

                    <Divider sx={{ borderColor: neu.shadowDark, mb: 2.25 }} />

                    <Stack spacing={1.5} sx={{ mb: 2.75 }}>
                      <DetailRow neu={neu} label="Path" value={selection.path} stacked />
                      <DetailRow neu={neu} label="Depth" value={String(selection.depth)} />
                      {selection.type === 'folder' && (
                        <DetailRow
                          neu={neu}
                          label="Children"
                          value={String(selection.childCount)}
                        />
                      )}
                      <DetailRow
                        neu={neu}
                        label="Favorite"
                        value={favorites.has(selection.path) ? 'Yes' : 'No'}
                      />
                    </Stack>

                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      <NeuButton
                        neu={neu}
                        size="sm"
                        icon={<ContentCopyRoundedIcon sx={{ fontSize: 16 }} />}
                        onClick={handleCopyPath}
                      >
                        Copy path
                      </NeuButton>
                      <NeuButton
                        neu={neu}
                        size="sm"
                        active={favorites.has(selection.path)}
                        icon={<StarRoundedIcon sx={{ fontSize: 16 }} />}
                        onClick={() => handleToggleFavorite(selection.path)}
                      >
                        {favorites.has(selection.path) ? 'Unstar' : 'Star'}
                      </NeuButton>
                    </Stack>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      py: 4,
                      textAlign: 'center',
                      color: neu.textMuted,
                      borderRadius: 3,
                      boxShadow: insetShadow(neu, 5),
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>Nothing selected</Typography>
                    <Typography sx={{ fontSize: '0.85rem', mt: 0.75, px: 2 }}>
                      Click a file or folder to inspect path, depth, and actions.
                    </Typography>
                  </Box>
                )}
              </NeuPanel>

              <NeuPanel neu={neu} title="FAVORITES">
                {favorites.size === 0 ? (
                  <Typography sx={{ color: neu.textMuted, fontSize: '0.85rem', fontWeight: 500 }}>
                    Star items in the tree to pin them here.
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {Array.from(favorites).map((path) => {
                      const name = path.split('/').pop() ?? path;
                      return (
                        <Box
                          key={path}
                          component="button"
                          onClick={() =>
                            setSelection({
                              path,
                              text: name,
                              type: name.includes('.') ? 'file' : 'folder',
                              childCount: 0,
                              depth: path.split('/').length - 1,
                            })
                          }
                          sx={{
                            appearance: 'none',
                            border: 0,
                            textAlign: 'left',
                            cursor: 'pointer',
                            px: 1.5,
                            py: 1.1,
                            borderRadius: 3,
                            backgroundColor: neu.bg,
                            boxShadow: softRaisedShadow(neu),
                            color: neu.text,
                            fontFamily: "'Manrope', sans-serif",
                            transition: 'box-shadow 180ms ease',
                            '&:active': { boxShadow: insetShadow(neu, 4) },
                          }}
                        >
                          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            {name}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '0.72rem',
                              color: neu.textMuted,
                              mt: 0.25,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {path}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                )}
              </NeuPanel>
            </Stack>
          </Box>
        </Box>

        <Snackbar
          open={copyToast}
          autoHideDuration={1800}
          onClose={() => setCopyToast(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            severity="success"
            variant="filled"
            onClose={() => setCopyToast(false)}
            sx={{ borderRadius: 3, fontWeight: 600 }}
          >
            Path copied
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

interface DetailRowProps {
  neu: typeof neuLight;
  label: string;
  value: string;
  stacked?: boolean;
}

const DetailRow = ({ neu, label, value, stacked = false }: DetailRowProps): JSX.Element => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: stacked ? 'column' : 'row',
      alignItems: stacked ? 'stretch' : 'flex-start',
      justifyContent: stacked ? 'flex-start' : 'space-between',
      gap: stacked ? 0.6 : 2,
    }}
  >
    <Typography
      sx={{
        color: neu.textMuted,
        fontWeight: 600,
        fontSize: '0.75rem',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        lineHeight: 1.3,
        flexShrink: 0,
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        color: neu.text,
        fontWeight: 600,
        fontSize: '0.82rem',
        textAlign: stacked ? 'left' : 'right',
        lineHeight: 1.45,
        wordBreak: 'break-word',
        overflowWrap: 'anywhere',
      }}
    >
      {value}
    </Typography>
  </Box>
);

export default App;
