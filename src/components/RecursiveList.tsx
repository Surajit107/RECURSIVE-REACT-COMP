import { useState } from 'react';
import { List, ListItemIcon, ListItemText, Collapse, ListItemButton } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { ListItemType } from '../types/types';

interface RecursiveListProps {
    items: ListItemType[];
    level?: number;
}

const RecursiveList = ({ items, level = 0 }: RecursiveListProps): JSX.Element => {
    const [openItems, setOpenItems] = useState<{ [key: number]: boolean }>({});

    const handleClick = (index: number) => {
        setOpenItems((prev) => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <>
            <List>
                {items.map((item, index) => (
                    <div key={index}>
                        <ListItemButton
                            onClick={() => item.type === 'folder' && handleClick(index)}
                            sx={{ pl: level * 2 }}
                        >
                            {item.type === 'folder' ? (
                                <ListItemIcon sx={{ minWidth: 30 }}>
                                    {openItems[index] ? <ExpandLess /> : <ExpandMore />}
                                </ListItemIcon>
                            ) : (
                                <ListItemIcon sx={{ minWidth: 30 }} />
                            )}
                            <ListItemIcon sx={{ minWidth: 30 }}>
                                {item.type === 'folder' ? <FolderIcon /> : <InsertDriveFileIcon />}
                            </ListItemIcon>
                            <ListItemText primary={item.text} primaryTypographyProps={{ color: 'text.primary' }} />
                        </ListItemButton>
                        {item.children && (
                            <Collapse in={openItems[index]} timeout="auto" unmountOnExit>
                                <RecursiveList items={item.children} level={level + 1} />
                            </Collapse>
                        )}
                    </div>
                ))}
            </List>
        </>
    );
};

export default RecursiveList;