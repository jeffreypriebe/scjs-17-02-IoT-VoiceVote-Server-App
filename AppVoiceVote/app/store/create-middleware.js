import { applyMiddleware } from 'redux';

function createThunkMiddleware (extraArgument) {
	return ({ dispatch, getState }) => next => action => {
		while (typeof action === 'function') action = action(dispatch, getState, extraArgument);

		if (!action) return;

		return next(action);
	}
};

function createPromiseMiddleware () {
	const isPromise = val => val && typeof val.then === 'function';

	return ({ dispatch, getState }) => next => action => {
		if (!isPromise(action) && !isPromise(action.payload)) return next(action);
		else if (isPromise) return action;
		else if (isPromise(action.payload))
			return action.payload.then(
				result => dispatch({ ...action, payload: result }),
				error => {
					dispatch({ ...action, payload: error, error: true });
					return Promise.reject(error);
				});
	};
};

export default function createMiddleware () {
	return applyMiddleware(
		createThunkMiddleware(),
		createPromiseMiddleware()
	);
};