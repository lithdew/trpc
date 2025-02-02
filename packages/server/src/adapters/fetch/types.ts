/**
 * If you're making an adapter for tRPC and looking at this file for reference, you should import types and functions from `@trpc/server` and `@trpc/server/http`
 *
 * Do **not** import from `@trpc/core`
 * @example
 * ```ts
 * import type { AnyTRPCRouter } from '@trpc/server'
 * import type { HTTPBaseHandlerOptions } from '@trpc/server/http'
 * ```
 */
// @trpc/server
import type { AnyRouter, inferRouterContext } from '../../@trpc-server';
// @trpc/server/http
import type {
  HTTPBaseHandlerOptions,
  TRPCRequestInfo,
} from '../../@trpc-server/http';

export type FetchCreateContextFnOptions = {
  req: Request;
  resHeaders: Headers;
  info: TRPCRequestInfo;
};

export type FetchCreateContextFn<TRouter extends AnyRouter> = (
  opts: FetchCreateContextFnOptions,
) => inferRouterContext<TRouter> | Promise<inferRouterContext<TRouter>>;

export type FetchCreateContextOption<TRouter extends AnyRouter> =
  unknown extends inferRouterContext<TRouter>
    ? {
        /**
         * @link https://trpc.io/docs/v11/context
         **/
        createContext?: FetchCreateContextFn<TRouter>;
      }
    : {
        /**
         * @link https://trpc.io/docs/v11/context
         **/
        createContext: FetchCreateContextFn<TRouter>;
      };

export type FetchHandlerOptions<TRouter extends AnyRouter> =
  FetchCreateContextOption<TRouter> & HTTPBaseHandlerOptions<TRouter, Request>;
