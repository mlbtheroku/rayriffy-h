import { Fragment } from 'react'

import { Hentai } from '@rayriffy-h/helper'

import { GetServerSideProps, NextPage } from 'next'

import { Reader } from '../../core/components/reader'
import { HeadTitle } from '../../core/components/headTitle'

interface IProps {
  gallery: Hentai
  excludes: number[]
  error?: Error
}

const Page: NextPage<IProps> = props => {
  const { gallery, excludes } = props

  return (
    <Fragment>
      <HeadTitle
        title={gallery.title.pretty}
        description={`Read ${gallery.title.pretty} without ads or popups via Riffy H, an alternate client for nhentai`}
      >
        <meta
          property="og:image"
          content={`https://h.api.rayriffy.com/v1/og/${gallery.id}`}
        />
        <meta
          property="twitter:image"
          content={`https://h.api.rayriffy.com/v1/og/${gallery.id}`}
        />
      </HeadTitle>
      <Reader {...{ hentai: gallery, excludes }} />
    </Fragment>
  )
}

export const getServerSideProps: GetServerSideProps<IProps> = async context => {
  const { default: fs } = await import('fs')
  const { default: path } = await import('path')

  const { codes, ignoreList } = await import('@rayriffy-h/datasource')
  const { getHentai } = await import('@rayriffy-h/helper')

  try {
    // Find exclude properties
    const targetId = context.params.id as string
    const result = codes.find(o =>
      typeof o === 'number' ? false : o.code.toString() === targetId
    )

    if (ignoreList.map(o => o.toString()).includes(targetId)) {
      return {
        notFound: true,
      }
    }

    // if no hentai in cache, then fetch
    const hentaiFile = path.join(process.cwd(), '.next/cache', 'hentai', `${targetId}.json`)
    const hentai = !fs.existsSync(hentaiFile) ? await getHentai(targetId) : JSON.parse(fs.readFileSync(hentaiFile).toString())

    context.res.setHeader('Cache-Control', 's-maxage=604800')

    return {
      props: {
        gallery: hentai,
        excludes:
          result !== undefined
            ? typeof result === 'number'
              ? []
              : result.exclude
            : [],
      },
    }
  } catch (e) {
    return {
      notFound: true,
    }
  }
}

export default Page
