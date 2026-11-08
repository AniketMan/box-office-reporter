// Typed server actions. Each action declares zod request/response schemas and
// a handler; the client derives its types from `typeof Actions`.
import { z } from "zod";

export { z };

export type ActionContext = Record<string, never>;

export type ActionDefinition<Req extends z.ZodType = z.ZodType, Res extends z.ZodType = z.ZodType> = {
  request: Req;
  response: Res;
  handler: (ctx: ActionContext, args: z.output<Req>) => Promise<z.input<Res>>;
};

export type ActionsModule = Record<string, ActionDefinition>;

export function defineAction<Req extends z.ZodType, Res extends z.ZodType>(definition: ActionDefinition<Req, Res>) {
  return definition;
}
