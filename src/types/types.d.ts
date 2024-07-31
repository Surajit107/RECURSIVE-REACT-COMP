export interface ListItemType {
    text: string;
    type: 'folder' | 'file';
    children?: ListItemType[];
}
