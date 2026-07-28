import SearchClient from './SearchClient';

export const metadata = {
  title: 'Explore | NotesHub',
  description: 'Search and discover notes, topics, and people on NotesHub. Explore the community content.',
  keywords: 'search, explore, discover, notes, topics, people',
};

export default function SearchPage() {
  return <SearchClient />;
}
