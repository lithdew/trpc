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
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
// @trpc/server
import type { AnyRouter } from '../@trpc-server';
// @trpc/server
import { getErrorShape, TRPCError } from '../@trpc-server';
import type {
  NodeHTTPCreateContextFnOptions,
  NodeHTTPHandlerOptions,
} from './node-http';
import { nodeHTTPRequestHandler } from './node-http';

export type CreateNextContextOptions = NodeHTTPCreateContextFnOptions<
  NextApiRequest,
  NextApiResponse
>;
export type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export function createNextApiHandler<TRouter extends AnyRouter>(
  opts: NodeHTTPHandlerOptions<TRouter, NextApiRequest, NextApiResponse>,
): NextApiHandler {
  return async (req, res) => {
    function getPath(): string | null {
      if (typeof req.query['trpc'] === 'string') {
        return req.query['trpc'];
      }
      if (Array.isArray(req.query['trpc'])) {
        return req.query['trpc'].join('/');
      }
      return null;
    }
    const path = getPath();

    if (path === null) {
      const error = getErrorShape({
        config: opts.router._def._config,
        error: new TRPCError({
          message:
            'Query "trpc" not found - is the file named `[trpc]`.ts or `[...trpc].ts`?',
          code: 'INTERNAL_SERVER_ERROR',
        }),
        type: 'unknown',
        ctx: undefined,
        path: undefined,
        input: undefined,
      });
      res.statusCode = 500;
      res.json({
        id: -1,
        error,
      });
      return;
    }

    await nodeHTTPRequestHandler({
      // FIXME: no typecasting should be needed here
      ...(opts as NodeHTTPHandlerOptions<
        AnyRouter,
        NextApiRequest,
        NextApiResponse
      >),
      req,
      res,
      path,
    });
  };
}
