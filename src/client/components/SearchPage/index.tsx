import React, { FunctionComponent, useEffect, useState } from 'react'
import {
  Hidden,
  Typography,
  createStyles,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import querystring from 'querystring'
import debounce from 'lodash/debounce'
import { History } from 'history'
import BaseLayout from '../BaseLayout'
import { ApplyAppMargins } from '../AppMargins'
import { GoGovReduxState } from '../../reducers/types'
import useAppMargins from '../AppMargins/appMargins'
import searchActions from '../../actions/search'
import { SEARCH_PAGE } from '../../util/types'
import { SearchResultsSortOrder } from '../../../shared/search'
import SearchHeader from './SearchHeader'
import SearchTable from './SearchTable'
import InfoDrawer from './InfoDrawer'

type GoSearchParams = {
  query: string
  sortOrder: SearchResultsSortOrder
  rowsPerPage: number
  currentPage: number
}

const useStyles = makeStyles((theme) =>
  createStyles({
    resultsHeaderText: {
      marginTop: theme.spacing(7.25),
      [theme.breakpoints.up('md')]: {
        marginTop: theme.spacing(11),
      },
    },
  }),
)

type SearchPageProps = {}

const defaultParams: GoSearchParams = {
  query: '',
  sortOrder: SearchResultsSortOrder.Relevance,
  rowsPerPage: 10,
  currentPage: 0,
}

const redirectWithParams = (newParams: GoSearchParams, history: History) => {
  const newPath = {
    pathname: SEARCH_PAGE,
    search: `${querystring.stringify(newParams)}`,
  }
  history.push(newPath)
}

const updateQueryDebounced = debounce(redirectWithParams, 500)

const SearchPage: FunctionComponent<SearchPageProps> = () => {
  const theme = useTheme()
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'))
  const appMargins = useAppMargins()
  const classes = useStyles({ appMargins })
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const [pendingQuery, setPendingQuery] = useState('')
  const [selectedShortUrl, setSelectedShortUrl] = useState<string>()
  const urlParams = querystring.parse(location.search.substring(1)) as Partial<
    GoSearchParams
  >
  const params: GoSearchParams = {
    ...defaultParams,
    ...urlParams,
  }
  const { query, sortOrder } = params
  const rowsPerPage = Number(params.rowsPerPage)
  const currentPage = Number(params.currentPage)
  const getResults = () =>
    dispatch(
      searchActions.getSearchResults(
        query,
        sortOrder,
        rowsPerPage,
        currentPage,
      ),
    )
  const resultsCount = useSelector(
    (state: GoGovReduxState) => state.search.resultsCount,
  )
  const queryForResult = useSelector(
    (state: GoGovReduxState) => state.search.queryForResult,
  )
  const searchResults = useSelector(
    (state: GoGovReduxState) => state.search.results,
  )

  const selectedUrl = searchResults.find(
    (url) => url.shortUrl === selectedShortUrl,
  )

  const onQueryChange = (newQuery: string) => {
    setPendingQuery(newQuery)
    updateQueryDebounced(
      {
        ...params,
        query: newQuery,
      },
      history,
    )
  }

  const onSortOrderChange = (newSortOrder: SearchResultsSortOrder) => {
    redirectWithParams(
      {
        ...params,
        sortOrder: newSortOrder,
      },
      history,
    )
  }

  const onClearQuery = () => {
    setPendingQuery('')
  }

  const pageCount = Math.ceil(resultsCount / rowsPerPage)

  const changePageHandler = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    pageNumber: number,
  ) => {
    redirectWithParams(
      {
        ...params,
        currentPage: pageNumber,
      },
      history,
    )
  }

  const changeRowsPerPageHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    redirectWithParams(
      {
        ...params,
        currentPage: 0,
        rowsPerPage: parseInt(event.target.value, 10),
      },
      history,
    )
  }

  const onClickUrl = (shortUrl: string) => {
    if (isMobileView) {
      setSelectedShortUrl(shortUrl)
    } else {
      window.location.assign(
        `${document.location.protocol}//${document.location.host}/${shortUrl}`,
      )
    }
  }

  useEffect(() => {
    if (!query) {
      return
    }
    setPendingQuery(query)
    getResults()
  }, [query, sortOrder, rowsPerPage, currentPage])

  return (
    <div style={{ height: '100vh', overflowY: 'auto', zIndex: 1 }}>
      <BaseLayout headerBackgroundType="darkest">
        <SearchHeader
          onQueryChange={onQueryChange}
          query={pendingQuery}
          onSortOrderChange={onSortOrderChange}
          sortOrder={sortOrder}
          onClearQuery={onClearQuery}
        />
        {(queryForResult || '').trim() && (
          <div style={{ minHeight: '300px' }}>
            <ApplyAppMargins>
              <Typography
                variant={isMobileView ? 'h5' : 'h3'}
                className={classes.resultsHeaderText}
              >
                {`Showing ${resultsCount} links for “${(
                  queryForResult || ''
                ).trim()}”`}
              </Typography>
            </ApplyAppMargins>
            {!!resultsCount && (
              <SearchTable
                searchResults={searchResults}
                pageCount={pageCount}
                rowsPerPage={rowsPerPage}
                currentPage={currentPage}
                changePageHandler={changePageHandler}
                changeRowsPerPageHandler={changeRowsPerPageHandler}
                resultsCount={resultsCount}
                onClickUrl={onClickUrl}
              />
            )}
          </div>
        )}
        <Hidden mdUp>
          <InfoDrawer
            selectedUrl={selectedUrl}
            onClose={() => setSelectedShortUrl(undefined)}
          />
        </Hidden>
      </BaseLayout>
    </div>
  )
}

export default SearchPage
