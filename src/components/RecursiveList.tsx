import { useEffect, useState } from 'react';
import { Box, List, Collapse, Typography, IconButton, Tooltip } from '@mui/material';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import { ListItemType } from '../types/types';
import { NeuPalette, pressedShadow } from '../theme/neumorphism';
import { TreeSelection, getExtension } from '../utils/treeUtils';

export interface ExpandSignal {
  mode: 'expand' | 'collapse';
  nonce: number;
}

interface RecursiveListProps {
  items: ListItemType[];
  neu: NeuPalette;
  level?: number;
  parentPath?: string;
  expandSignal?: ExpandSignal;
  forceOpenPaths?: Set<string>;
  selectedPath?: string | null;
  favorites: Set<string>;
  onSelect: (selection: TreeSelection) => void;
  onToggleFavorite: (path: string) => void;
  searchQuery?: string;
}

const FileIcon = ({ name, color }: { name: string; color: string }): JSX.Element => {
  const ext = getExtension(name);
  const sx = { color, fontSize: 20 };

  switch (ext) {
    case 'pdf':
      return <PictureAsPdfOutlinedIcon sx={{ ...sx, color: '#e57373' }} />;
    case 'tsx':
    case 'ts':
    case 'jsx':
    case 'js':
      return <CodeOutlinedIcon sx={{ ...sx, color: '#64b5f6' }} />;
    case 'psd':
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'svg':
      return <ImageOutlinedIcon sx={{ ...sx, color: '#ba68c8' }} />;
    case 'csv':
    case 'xlsx':
      return <TableChartOutlinedIcon sx={{ ...sx, color: '#81c784' }} />;
    case 'docx':
    case 'doc':
    case 'pptx':
      return <DescriptionOutlinedIcon sx={{ ...sx, color: '#7986cb' }} />;
    default:
      return <InsertDriveFileOutlinedIcon sx={sx} />;
  }
};

const makeItemKey = (level: number, index: number, text: string): string =>
  `${level}-${index}-${text}`;

const highlightMatch = (text: string, query: string, accent: string) => {
  if (!query.trim()) {
    return text;
  }
  const idx = text.toLowerCase().indexOf(query.trim().toLowerCase());
  if (idx === -1) {
    return text;
  }
  const end = idx + query.trim().length;
  return (
    <>
      {text.slice(0, idx)}
      <Box component="span" sx={{ color: accent, fontWeight: 800 }}>
        {text.slice(idx, end)}
      </Box>
      {text.slice(end)}
    </>
  );
};

const RecursiveList = ({
  items,
  neu,
  level = 0,
  parentPath = '',
  expandSignal,
  forceOpenPaths,
  selectedPath,
  favorites,
  onSelect,
  onToggleFavorite,
  searchQuery = '',
}: RecursiveListProps): JSX.Element => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!expandSignal || expandSignal.nonce === 0) {
      return;
    }

    const next: Record<string, boolean> = {};
    items.forEach((item, index) => {
      if (item.type === 'folder') {
        next[makeItemKey(level, index, item.text)] = expandSignal.mode === 'expand';
      }
    });
    setOpenItems(next);
  }, [expandSignal, items, level]);

  useEffect(() => {
    if (!forceOpenPaths || forceOpenPaths.size === 0) {
      return;
    }

    setOpenItems((prev) => {
      const next = { ...prev };
      items.forEach((item, index) => {
        if (item.type !== 'folder') {
          return;
        }
        const path = parentPath ? `${parentPath}/${item.text}` : item.text;
        if (forceOpenPaths.has(path)) {
          next[makeItemKey(level, index, item.text)] = true;
        }
      });
      return next;
    });
  }, [forceOpenPaths, items, level, parentPath]);

  const handleToggle = (key: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      {items.map((item, index) => {
        const itemKey = makeItemKey(level, index, item.text);
        const path = parentPath ? `${parentPath}/${item.text}` : item.text;
        const isFolder = item.type === 'folder';
        const isOpen = Boolean(openItems[itemKey]);
        const hasChildren = Boolean(item.children?.length);
        const isSelected = selectedPath === path;
        const isFavorite = favorites.has(path);
        const extension = !isFolder ? getExtension(item.text) : '';
        const childCount = item.children?.length ?? 0;

        return (
          <Box
            key={itemKey}
            className="tree-row-enter"
            sx={{ animationDelay: `${Math.min(index, 8) * 20}ms` }}
          >
            <Box
              component="button"
              type="button"
              onClick={() => {
                onSelect({
                  path,
                  text: item.text,
                  type: item.type,
                  childCount,
                  depth: level,
                });
                if (isFolder) {
                  handleToggle(itemKey);
                }
              }}
              onDoubleClick={() => {
                if (isFolder && !isOpen) {
                  handleToggle(itemKey);
                }
              }}
              sx={{
                appearance: 'none',
                border: 0,
                width: '100%',
                textAlign: 'left',
                font: 'inherit',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                borderRadius: '14px',
                py: 1.15,
                px: 1.35,
                pl: 1.5,
                backgroundColor: 'transparent',
                boxShadow: isSelected ? pressedShadow(neu) : 'none',
                transition: 'background-color 160ms ease, box-shadow 160ms ease',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '22%',
                  bottom: '22%',
                  width: 3,
                  borderRadius: 999,
                  backgroundColor: neu.accent,
                  opacity: isSelected ? 1 : 0,
                  transition: 'opacity 160ms ease',
                },
                '&:hover': {
                  backgroundColor: isSelected ? 'transparent' : neu.accentSoft,
                  boxShadow: isSelected ? pressedShadow(neu) : 'none',
                },
                '&:active': {
                  boxShadow: pressedShadow(neu),
                },
                '&:focus-visible': {
                  outline: `2px solid ${neu.accent}`,
                  outlineOffset: 2,
                },
              }}
            >
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {isFolder ? (
                  isOpen ? (
                    <ExpandMoreRoundedIcon sx={{ fontSize: 22, color: neu.accent }} />
                  ) : (
                    <ChevronRightRoundedIcon sx={{ fontSize: 22, color: neu.textMuted }} />
                  )
                ) : null}
              </Box>

              <Box
                sx={{
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {isFolder ? (
                  isOpen ? (
                    <FolderOpenRoundedIcon sx={{ color: neu.accent, fontSize: 22 }} />
                  ) : (
                    <FolderRoundedIcon sx={{ color: neu.accent, fontSize: 22 }} />
                  )
                ) : (
                  <FileIcon name={item.text} color={neu.textMuted} />
                )}
              </Box>

              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.3,
                }}
              >
                <Typography
                  component="div"
                  sx={{
                    fontWeight: isFolder ? 700 : 600,
                    fontSize: '0.92rem',
                    lineHeight: 1.35,
                    color: neu.text,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {highlightMatch(item.text, searchQuery, neu.accent)}
                </Typography>

                {isFolder && hasChildren ? (
                  <Typography
                    component="div"
                    sx={{
                      color: neu.textMuted,
                      fontWeight: 600,
                      fontSize: '0.72rem',
                      lineHeight: 1.3,
                    }}
                  >
                    {childCount} {childCount === 1 ? 'item' : 'items'}
                  </Typography>
                ) : null}
              </Box>

              {extension ? (
                <Box
                  component="span"
                  sx={{
                    flexShrink: 0,
                    px: 1,
                    py: 0.35,
                    borderRadius: 999,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: neu.textMuted,
                    lineHeight: 1.2,
                    border: `1px solid ${neu.shadowDark}`,
                  }}
                >
                  {extension}
                </Box>
              ) : null}

              <Tooltip title={isFavorite ? 'Remove favorite' : 'Add favorite'}>
                <IconButton
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleFavorite(path);
                  }}
                  sx={{
                    color: isFavorite ? '#f0b429' : neu.textMuted,
                    flexShrink: 0,
                    p: 0.5,
                  }}
                >
                  {isFavorite ? (
                    <StarRoundedIcon fontSize="small" />
                  ) : (
                    <StarBorderRoundedIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </Box>

            {hasChildren && (
              <Collapse in={isOpen} timeout={240} unmountOnExit>
                <Box
                  sx={{
                    mt: 0.35,
                    ml: 1.5,
                    pl: 1.5,
                    borderLeft: `2px solid ${neu.shadowDark}`,
                  }}
                >
                  <RecursiveList
                    items={item.children!}
                    neu={neu}
                    level={level + 1}
                    parentPath={path}
                    expandSignal={expandSignal}
                    forceOpenPaths={forceOpenPaths}
                    selectedPath={selectedPath}
                    favorites={favorites}
                    onSelect={onSelect}
                    onToggleFavorite={onToggleFavorite}
                    searchQuery={searchQuery}
                  />
                </Box>
              </Collapse>
            )}
          </Box>
        );
      })}
    </List>
  );
};

export default RecursiveList;
