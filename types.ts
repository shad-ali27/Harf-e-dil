
export type Category = 'Ishq' | 'Dard' | 'Unsiyat' | 'Tanhai' | 'Roohani' | 'Naseehat' | 'Zamana' | 'All';

export interface Shayari {
  id: string;
  title?: string;
  content: string;
  category: Category;
  author: string;
  tags: string[];
  isFeatured?: boolean;
}

export interface UserActions {
  likes: string[];
  bookmarks: string[];
}
