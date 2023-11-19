type StoryRaw = Omit<StorySummary, 'slug' | 'author' | 'category'> & {
  readonly authorId: number;
  readonly categoryId: number;
  readonly slug?: string;
};

type UserSummary = {
  readonly id: number;
  readonly username: string;
};

type StoryTag = 'wip' | 'section';

type StorySummary = {
  readonly id: number;
  readonly thumbnail: string;
  readonly title: string;
  readonly excerpt: string;
  readonly timestamp: number;
  readonly tags?: StoryTag[];
  readonly category: Category;
  readonly author: UserSummary;
  readonly slug: string;
};

type Story = StorySummary & {
  readonly body: string;
};

type Category = {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly icon: string;
};
