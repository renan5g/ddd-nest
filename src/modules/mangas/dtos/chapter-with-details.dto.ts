export type ChapterWithDetails = {
  id: string;
  title: string;
  slug: string;
  cover: string;
  number: string;
  dateTimePosted: Date;
  pagesCount: number;
  pages: ChapterPage[];
  scan: Scan;
  createdAt: Date;
  updatedAt: Date;
};

type Scan = {
  id: string;
  label: string;
  value: string;
  cover: string;
  link: string;
};

type ChapterPage = {
  id: string;
  pageUrl: string;
  pageNumber: number;
};
