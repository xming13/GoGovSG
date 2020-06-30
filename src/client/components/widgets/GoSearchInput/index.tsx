import React, { FunctionComponent, useState } from 'react'
import {
  ClickAwayListener,
  Hidden,
  IconButton,
  TextField,
  createStyles,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import CloseIcon from '../CloseIcon'
import CollapsingPanel from '../CollapsingPanel'
import { SearchResultsSortOrder } from '../../../../shared/search'
import SortPanel from '../SortPanel'
import SearchSortIcon from '../SearchSortIcon'
import SearchIcon from '../SearchIcon'
import { sortOptions } from '../../../constants/search'
import SortDrawer from './SortDrawer'

type GoSearchInputProps = {
  showAdornments?: boolean
  onQueryChange?: (query: string) => void
  onSortOrderChange?: (order: SearchResultsSortOrder) => void
  onClearQuery?: () => void
  onKeyPress?: (e: React.KeyboardEvent<HTMLDivElement>) => void
  sortOrder?: SearchResultsSortOrder
  query: string
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '44px',
      [theme.breakpoints.up('md')]: {
        height: '70px',
      },
    },
    searchTextField: {
      width: '100%',
      height: '100%',
    },
    searchInput: {
      height: '100%',
      background: 'white',
      boxShadow: '0px 0px 30px rgba(0, 0, 0, 0.25)',
      borderRadius: '5px',
      border: 0,
    },
    searchInputNested: {
      [theme.breakpoints.up('md')]: {
        fontSize: '1rem',
      },
    },
    searchInputIcon: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(1),
      [theme.breakpoints.up('md')]: {
        marginLeft: theme.spacing(4),
        marginRight: theme.spacing(2.5),
      },
    },
    searchOptionsButton: {
      padding: theme.spacing(0.75),
      marginRight: theme.spacing(1.5),
      [theme.breakpoints.up('md')]: {
        marginRight: theme.spacing(2.5),
        padding: theme.spacing(1.5),
      },
    },
    closeButton: {
      padding: theme.spacing(0.75),
      [theme.breakpoints.up('md')]: {
        padding: theme.spacing(1.5),
      },
    },
    sortPanel: {
      width: theme.spacing(50),
      right: 0,
      left: 'auto',
    },
    sortPanelContent: {
      marginTop: theme.spacing(3.5),
    },
  }),
)

const GoSearchInput: FunctionComponent<GoSearchInputProps> = ({
  showAdornments,
  sortOrder,
  query,
  onQueryChange = () => {},
  onSortOrderChange = () => {},
  onClearQuery = () => {},
  onKeyPress = () => {},
}: GoSearchInputProps) => {
  const [isSortPanelOpen, setIsSortPanelOpen] = useState(false)
  const classes = useStyles()
  const theme = useTheme()
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <ClickAwayListener
      onClickAway={() => {
        if (!isMobileView) {
          setIsSortPanelOpen(false)
        }
      }}
    >
      <div className={classes.root}>
        <TextField
          autoFocus
          className={classes.searchTextField}
          placeholder="Search all go.gov.sg links"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyPress={onKeyPress}
          InputProps={{
            className: classes.searchInput,
            disableUnderline: true,
            startAdornment: (
              <div className={classes.searchInputIcon}>
                <SearchIcon size={isMobileView ? 16 : 24} />
              </div>
            ),
            endAdornment: (
              <>
                {showAdornments && (
                  <>
                    {query && (
                      <IconButton
                        onClick={onClearQuery}
                        className={classes.closeButton}
                      >
                        <CloseIcon
                          size={isMobileView ? 20 : 24}
                          color="#BBBBBB"
                        />
                      </IconButton>
                    )}
                    <IconButton
                      className={classes.searchOptionsButton}
                      onClick={() => setIsSortPanelOpen(true)}
                    >
                      <SearchSortIcon size={isMobileView ? 20 : 30} />
                    </IconButton>
                  </>
                )}
              </>
            ),
          }}
          // TextField takes in two separate inputProps and InputProps,
          // each having its own purpose.
          // eslint-disable-next-line react/jsx-no-duplicate-props
          inputProps={{
            className: classes.searchInputNested,
            onClick: () => setIsSortPanelOpen(false),
          }}
        />
        <Hidden smDown>
          <CollapsingPanel
            isOpen={isSortPanelOpen}
            className={classes.sortPanel}
          >
            <div className={classes.sortPanelContent}>
              <SortPanel
                onChoose={(newSortOrder) =>
                  onSortOrderChange(newSortOrder as SearchResultsSortOrder)
                }
                currentlyChosen={sortOrder || ''}
                options={sortOptions}
              />
            </div>
          </CollapsingPanel>
        </Hidden>
        <Hidden mdUp>
          <SortDrawer
            open={isSortPanelOpen}
            onClose={() => setIsSortPanelOpen(false)}
            selectedOrder={sortOrder || ''}
            onChoose={(newSortOrder) => {
              onSortOrderChange(newSortOrder as SearchResultsSortOrder)
              setIsSortPanelOpen(false)
            }}
            options={sortOptions}
          />
        </Hidden>
      </div>
    </ClickAwayListener>
  )
}

export default GoSearchInput
