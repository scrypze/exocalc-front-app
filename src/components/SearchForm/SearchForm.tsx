import './SearchForm.css';

interface SearchFormProps {
  searchQuery: string;
  massMin: string;
  massMax: string;
  onSearchChange: (query: string) => void;
  onMassMinChange: (value: string) => void;
  onMassMaxChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export const SearchForm = ({
  searchQuery,
  massMin,
  massMax,
  onSearchChange,
  onMassMinChange,
  onMassMaxChange,
  onSearchSubmit,
}: SearchFormProps) => {
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
      <div className="mass-range">
        <input
          className="mass-input"
          type="number"
          step="0.01"
          placeholder="Масса от"
          value={massMin}
          onChange={(e) => onMassMinChange(e.target.value)}
          aria-label="Минимальная масса"
        />
        <span className="range-separator">–</span>
        <input
          className="mass-input"
          type="number"
          step="0.01"
          placeholder="Масса до"
          value={massMax}
          onChange={(e) => onMassMaxChange(e.target.value)}
          aria-label="Максимальная масса"
        />
      </div>
      <button className="search-button" type="submit">
        Поиск
      </button>
    </form>
  );
};
