import { Locales } from '@mono/assist-api/build/i18n/i18n-types'
import { useI18nContext } from '@mono/assist-api/i18n/react'
import { locales } from '@mono/assist-api/i18n/utils'
import { loadLocale } from '@mono/assist-api/i18n/utils/sync'
import * as Icon from 'lucide-react'
import { ChangeEvent, ReactNode } from 'react'
import { IndexedLocale } from '@mono/assist-api/i18n/indexed-locale'

export function LocalSwitcher(): ReactNode {
  const { locale, setLocale } = useI18nContext()

  const handleLocale = (x: ChangeEvent<HTMLSelectElement>): void => {
    loadLocale(x.target.value as Locales)
    setLocale(x.target.value as Locales)
  }

  return (
    <div className="join">
      <label htmlFor="switch" className="join-item input w-auto">
        <Icon.Languages />
      </label>
      <select
        id="switch"
        className="join-item select w-auto"
        value={locale}
        onChange={handleLocale}
      >
        {locales.map((x) => (
          <option key={x} value={x}>
            {IndexedLocale[x]}
          </option>
        ))}
      </select>
    </div>
  )
}
