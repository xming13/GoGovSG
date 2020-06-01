import {
  CLOSE_CREATE_URL_MODAL,
  GET_URLS_FOR_USER_SUCCESS,
  IS_FETCHING_URLS,
  OPEN_CREATE_URL_MODAL,
  RESET_USER_STATE,
  SET_EDITED_LONG_URL,
  SET_LONG_URL,
  SET_RANDOM_SHORT_URL,
  SET_SHORT_URL,
  SET_URL_TABLE_CONFIG,
  TOGGLE_URL_STATE_SUCCESS,
  UPDATE_URL_COUNT,
  WIPE_USER_STATE,
} from '../actions/types'

const initialState = {
  initialised: false,
  urls: [],
  isFetchingUrls: false,
  shortUrl: '',
  longUrl: '',
  createUrlModal: false,
  tableConfig: {
    numberOfRows: 10,
    pageNumber: 0,
    sortDirection: 'desc',
    orderBy: 'updatedAt',
    searchText: '',
    filter: {},
  },
  urlCount: 0,
}

const user = (state = initialState, action) => {
  let nextState = {}
  const { payload } = action

  switch (action.type) {
    case IS_FETCHING_URLS:
      nextState = {
        isFetchingUrls: payload,
      }
      break
    case GET_URLS_FOR_USER_SUCCESS:
      nextState = {
        initialised: true,
        urls: payload,
      }
      break
    case SET_SHORT_URL:
      nextState = {
        shortUrl: payload,
      }
      break
    case SET_LONG_URL:
      nextState = {
        longUrl: payload,
      }
      break
    case SET_EDITED_LONG_URL: {
      const { editedLongUrl, shortUrl } = payload
      nextState = {
        urls: state.urls.map((url) => {
          if (shortUrl !== url.shortUrl) {
            return url
          }
          return {
            ...url,
            editedLongUrl,
          }
        }),
      }
      break
    }
    case SET_RANDOM_SHORT_URL:
      nextState = {
        shortUrl: payload,
      }
      break
    case RESET_USER_STATE:
      nextState = {
        shortUrl: '',
        longUrl: '',
      }
      break
    case WIPE_USER_STATE:
      nextState = {
        ...initialState,
      }
      break
    case TOGGLE_URL_STATE_SUCCESS: {
      const { shortUrl, toState } = payload

      nextState = {
        urls: state.urls.map((url) => {
          if (shortUrl !== url.shortUrl) {
            return url
          }
          return {
            ...url,
            state: toState,
          }
        }),
      }
      break
    }
    case OPEN_CREATE_URL_MODAL:
      nextState = {
        createUrlModal: true,
      }
      break
    case CLOSE_CREATE_URL_MODAL:
      nextState = {
        createUrlModal: false,
      }
      break
    case SET_URL_TABLE_CONFIG:
      nextState = {
        tableConfig: {
          ...state.tableConfig,
          ...payload,
        },
      }
      break
    case UPDATE_URL_COUNT:
      nextState = {
        urlCount: payload,
      }
      break
    default:
      return state
  }
  return { ...state, ...nextState }
}

export default user