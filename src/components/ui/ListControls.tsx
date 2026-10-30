import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from './Icons'

const PAGE_SIZE = 10

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  label: string
  placeholder: string
}

export function SearchInput({ value, onChange, label, placeholder }: SearchInputProps) {
  return (
    <label className="relative block w-full sm:max-w-xs">
      <span className="sr-only">{label}</span>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-3 pl-9 text-sm text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </label>
  )
}

type FilterTabsProps = {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}

export function FilterTabs({ options, value, onChange }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
            option.value === value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

type PaginationProps = {
  page: number
  count: number
  onChange: (page: number) => void
}

export function Pagination({ page, count, onChange }: PaginationProps) {
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE))
  const buttonClass = 'rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40'

  return (
    <div className="flex items-center justify-between gap-4 border-t border-slate-200 px-6 py-3 text-sm text-slate-500">
      <span>
        {count} {count === 1 ? 'resultado' : 'resultados'}
      </span>
      <span className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Página anterior"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className={buttonClass}
        >
          <ChevronLeftIcon />
        </button>
        <span className="whitespace-nowrap">
          {page} de {pages}
        </span>
        <button
          type="button"
          aria-label="Página siguiente"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
          className={buttonClass}
        >
          <ChevronRightIcon />
        </button>
      </span>
    </div>
  )
}
