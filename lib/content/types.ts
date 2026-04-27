export interface BulletPoint {
  text: string;
  pages?: number[];
  chapters?: number[];
}

export interface Source {
  id: number;
  text: string;
}

export interface ContentSection {
  title: string;
  bullets: BulletPoint[];
}

export interface BookContent {
  bookId: number;
  keyPoints: BulletPoint[];
  sections: ContentSection[];
  sources: Source[];
}
