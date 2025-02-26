import type { Hentai } from '$core/@types/Hentai'
import { itemsPerPage } from '$core/constants/itemsPerPage'

export const searchHentai = (
  query: string,
  page: number,
  hentais: readonly Hentai[]
) => {
  const splittedQueries = query
    .split(' ')
    .filter(o => o !== '')
    .map(o => o.toLowerCase())

  const filteredHentais = hentais.filter(hentai => {
    return splittedQueries.every(query => {
      return [
        hentai.id,
        hentai.title.english,
        hentai.title.japanese,
        hentai.title.pretty,
        ...hentai.tags.map(o => o.name),
      ]
        .map(o => String(o ?? '').toLowerCase())
        .some(o => o.includes(query))
    })
  })

  return {
    totalPages: Math.ceil(filteredHentais.length / itemsPerPage),
    hentais: filteredHentais.slice(
      (page - 1) * itemsPerPage,
      itemsPerPage * page
    ),
  }
}
