import { Action, AnyAction, Store, Unsubscribe } from 'redux';

declare namespace ngRedux {

  export type Reducer<S = any, A extends Action = AnyAction> = (state: S | undefined, action: A) => S;

  export interface Dispatch<A extends Action = AnyAction> {
    <T extends A>(action: T): T;
  }

  export interface MiddlewareArg<D extends Dispatch = Dispatch, S = any> {
    dispatch: D;
    getState(): S;
  }

  export interface Middleware<DispatchExt = {}, S = any, D extends Dispatch = Dispatch> {
    (api: MiddlewareArg<D, S>): (next: Dispatch<AnyAction>) => (action: any) => any;
  }

  /* config */

  export interface Config {
    debounce: DebounceConfig;
  }

  export interface DebounceConfig {
    wait?: number;
    maxWait?: number;
  }

  /* API */

  export interface INgRedux {
    /**
     * Replaces the reducer currently used by the store to calculate the state.
     *
     * You might need this if your app implements code splitting and you want to
     * load some of the reducers dynamically. You might also need this if you
     * implement a hot reloading mechanism for Redux.
     *
     * @param nextReducer The reducer for the store to use instead.
     */
    replaceReducer(nextReducer: Reducer): void;
    /**
     * A *dispatching function* (or simply *dispatch function*) is a function that
     * accepts an action or an async action; it then may or may not dispatch one
     * or more actions to the store.
     *
     * We must distinguish between dispatching functions in general and the base
     * `dispatch` function provided by the store instance without any middleware.
     *
     * The base dispatch function *always* synchronously sends an action to the
     * store's reducer, along with the previous state returned by the store, to
     * calculate a new state. It expects actions to be plain objects ready to be
     * consumed by the reducer.
     *
     * Middleware wraps the base dispatch function. It allows the dispatch
     * function to handle async actions in addition to actions. Middleware may
     * transform, delay, ignore, or otherwise interpret actions or async actions
     * before passing them to the next middleware.
     *
     * @template A The type of things (actions or otherwise) which may be
     *   dispatched.
     */
    dispatch<A extends Action>(action: A): A;
    /**
     * Reads the state tree managed by the store.
     *
     * @returns The current state tree of your application.
     */
    getState<S = any>(): S;
    /**
     * Adds a change listener. It will be called any time an action is
     * dispatched, and some part of the state tree may potentially have changed.
     * You may then call `getState()` to read the current state tree inside the
     * callback.
     *
     * You may call `dispatch()` from a change listener, with the following
     * caveats:
     *
     * 1. The subscriptions are snapshotted just before every `dispatch()` call.
     * If you subscribe or unsubscribe while the listeners are being invoked,
     * this will not have any effect on the `dispatch()` that is currently in
     * progress. However, the next `dispatch()` call, whether nested or not,
     * will use a more recent snapshot of the subscription list.
     *
     * 2. The listener should not expect to see all states changes, as the state
     * might have been updated multiple times during a nested `dispatch()` before
     * the listener is called. It is, however, guaranteed that all subscribers
     * registered before the `dispatch()` started will be called with the latest
     * state by the time it exits.
     *
     * @param listener A callback to be invoked on every dispatch.
     * @returns A function to remove this change listener.
     */
    subscribe(listener: () => void): Unsubscribe;
    /**
     * Connects a component to a Redux store.
     *
     * @param mapStateToTarget
     * @param mapDispatchToTarget
     */
    connect(
      mapStateToTarget: null | ((state: any) => { [key: string]: any; }),
      mapDispatchToTarget?: object | ((dispatch: Function) => object)
    ): (target: Function | object) => Unsubscribe;
  }

  /* provider */

  export interface INgReduxProvider {
    /**
     * Creates Redux store.
     *
     * @param reducer
     * @param middlewares
     * @param storeEnhancers
     * @param initialState
     */
    createStoreWith<S = any, I = any>(reducer: Reducer<S>, middlewares?: (Middleware | string)[], storeEnhancers?: Function[], initialState?: I): void;
    /**
     * Initializes ngRedux with an existing Redux store.
     *
     * @param store
     * @param middlewares
     * @param storeEnhancers
     */
    provideStore<S = any>(store: Store<S>, middlewares?: (Middleware | string)[], storeEnhancers?: Function[]): void;
    /**
     * ngRedux config object
     */
    config: Config;
  }
}

declare var ngRedux: string;
export as namespace ngRedux;
export default ngRedux;
