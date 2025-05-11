import { useTranslation } from 'react-i18next'
import * as Icon from 'lucide-react'
import { ChangeEvent, ReactNode } from 'react'
import { IndexedLocale } from '@mono/assist-api/i18n/next'

export function LocalSwitcher(): ReactNode {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, i18n] = useTranslation()

  const handleLocale = (x: ChangeEvent<HTMLSelectElement>): void => {
    i18n.changeLanguage(x.target.value)
  }

  return (
    <div className="join">
      <label htmlFor="switch" className="join-item input w-auto">
        <Icon.Languages />
      </label>
      <select
        id="switch"
        className="join-item select w-auto"
        value={i18n.language}
        onChange={handleLocale}
      >
        {i18n.languages.map((x) => (
          <option key={x} value={x}>
            {IndexedLocale[x]}
          </option>
        ))}
      </select>
    </div>
  )
}
