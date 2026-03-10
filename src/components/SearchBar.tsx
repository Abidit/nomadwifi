'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export default function SearchBar({ onSearch, placeholder = 'Search city...' }: SearchBarProps) {
  const [value, setValue] = useState('')

  const handleChange = (val: string) => {
    setValue(val)
    onSearch(val)
  }

  return (
    <div className="flex items-center gap-2 bg-white rounded-full shadow-md border border-[#ebebeb] px-3 py-2 w-64">
      <Search size={15} className="text-[#717171] flex-shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-[#222222] placeholder:text-[#717171] focus:outline-none min-w-0"
      />
      {value && (
        <button onClick={() => handleChange('')} className="flex-shrink-0 text-[#717171] hover:text-[#222222]">
          <X size={14} />
        </button>
      )}
    </div>
  )
}
