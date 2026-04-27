import { BookContent } from './types';
import book1 from './book-1';
import book2 from './book-2';
import book3 from './book-3';
import book4 from './book-4';
import book5 from './book-5';

const ALL_CONTENT: Record<number, BookContent> = {
  1: book1,
  2: book2,
  3: book3,
  4: book4,
  5: book5,
};

export function getBookContent(bookId: number): BookContent | null {
  return ALL_CONTENT[bookId] ?? null;
}

export type { BookContent, BulletPoint, ContentSection, Source } from './types';
