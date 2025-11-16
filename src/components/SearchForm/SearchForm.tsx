import './SearchForm.css';

interface SearchFormProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export const SearchForm = ({ searchQuery, onSearchChange, onSearchSubmit }: SearchFormProps) => {
  return (
    <form className="search-form" onSubmit={onSearchSubmit}>
      <input
        className="search-input"
        type="text"
        placeholder="Поиск по названию звезды"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Поиск по названию звезды"
      />
      <button className="search-button" type="submit">
        Поиск
      </button>
    </form>
  );
};
