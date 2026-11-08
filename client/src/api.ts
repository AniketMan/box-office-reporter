// Typed RPC client. Types come straight from `server/src/actions.ts`, with no
// codegen: each call POSTs `{action, args}` to `./actions` and returns the
// typed response.
//
// `import type { Actions }` is type-only by design: the client bundle never
// pulls in any server runtime (file APIs, scraping). With
// `verbatimModuleSyntax: true`, dropping `type` is a compile error.

import type { z } from "zod";
import type { Actions } from "../../server/src/actions";
import type { ActionsModule } from "../../server/src/runtime";

type ActionClient<A extends ActionsModule> = {
  [K in keyof A]: (args: z.input<A[K]["request"]>) => Promise<z.output<A[K]["response"]>>;
};

function createActionClient<A extends ActionsModule>(): ActionClient<A> {
  return new Proxy({} as ActionClient<A>, {
    get: (_target, action) => async (args: unknown) => {
      const response = await fetch("./actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, args }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error ?? `${String(action)} failed (${response.status})`);
      return body;
    },
  });
}

export const api = createActionClient<typeof Actions>();

// So client code can do
//
//     import { api, type ApiResponse } from "./api";
//     type Catalog = ApiResponse<typeof api, "getCatalog">["catalog"];
export type ApiRequest<C, K extends keyof C> = C[K] extends (args: infer A) => unknown ? A : never;
export type ApiResponse<C, K extends keyof C> = C[K] extends (...args: never[]) => Promise<infer R> ? R : never;
