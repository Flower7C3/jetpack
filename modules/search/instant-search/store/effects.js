/**
 * Internal dependencies
 */
import { search } from '../lib/api';
import { SORT_DIRECTION_ASC, VALID_SORT_KEYS } from '../lib/constants';
import { getQuery, setQuery } from '../lib/query-string';
import {
	recordFailedSearchRequest,
	recordSuccessfulSearchRequest,
	setSearchQuery,
	setSort,
} from './actions';

/**
 * Effect handler which will fetch search results from the API.
 *
 * @param {object} action - Action which had initiated the effect handler.
 * @param {object} store -  Store instance.
 */
function makeSearchAPIRequest( action, store ) {
	search( action.options )
		.then( response => {
			if ( response === null ) {
				// Request has been cancelled by a more recent request.
				return;
			}

			store.dispatch( recordSuccessfulSearchRequest( { options: action.options, response } ) );
		} )
		.catch( error => {
			// eslint-disable-next-line no-console
			console.error( 'Jetpack Search encountered an error:', error );
			store.dispatch( recordFailedSearchRequest( error ) );
		} );
}

function initializeQueryValues( action, store ) {
	const queryObject = getQuery();

	// Initialize search query value for the reducer.
	store.dispatch( setSearchQuery( queryObject.s, false ) );

	// Initialize sort value for the reducer.
	let sort = 'revelance';
	if ( VALID_SORT_KEYS.includes( queryObject.sort ) ) {
		// Set sort value from `sort` query value.
		sort = queryObject.sort;
	} else if ( 'date' === queryObject.orderby ) {
		// Set sort value from legacy `orderby` query value.
		sort =
			typeof queryObject.order === 'string' &&
			queryObject.order.toUpperCase() === SORT_DIRECTION_ASC
				? 'oldest'
				: 'newest';
	} else if ( 'relevance' === queryObject.orderby ) {
		// Set sort value from legacy `orderby` query value.
		sort = 'relevance';
	} else if ( VALID_SORT_KEYS.includes( action.defaultSort ) ) {
		// Set sort value from customizer configured default sort value.
		sort = action.defaultSort;
	}
	store.dispatch( setSort( sort, false ) );
}

/**
 * Effect handler which will update the location bar's search query string
 *
 * @param {object} action - Action which had initiated the effect handler.
 */
function updateSearchQueryString( action ) {
	if ( action.propagateToWindow === false ) {
		return;
	}

	const queryObject = getQuery();
	if ( action.query === '' ) {
		delete queryObject.s;
	} else {
		queryObject.s = action.query;
	}
	setQuery( queryObject );
}

/**
 * Effect handler which will update the location bar's sort query string
 *
 * @param {object} action - Action which had initiated the effect handler.
 */
function updateSortQueryString( action ) {
	if ( action.propagateToWindow === false ) {
		return;
	}
	if ( ! VALID_SORT_KEYS.includes( action.sort ) ) {
		return;
	}

	const queryObject = getQuery();
	queryObject.sort = action.sort;

	// Removes legacy sort query values, just in case.
	delete queryObject.order;
	delete queryObject.orderby;

	setQuery( queryObject );
}

export default {
	INITIALIZE_QUERY_VALUES: initializeQueryValues,
	MAKE_SEARCH_REQUEST: makeSearchAPIRequest,
	SET_SEARCH_QUERY: updateSearchQueryString,
	SET_SORT: updateSortQueryString,
};