import { z } from "zod";
import type { ActionsModule } from "./runtime";

const envelope = z.object({ action: z.string(), args: z.unknown() });

// Validates `{ action, args }`, runs the handler, and validates its result.
export async function runAction(actions: ActionsModule, rawBody: string): Promise<{ status: number; body: unknown }> {
  let parsed: z.infer<typeof envelope>;
  try {
    parsed = envelope.parse(JSON.parse(rawBody));
  } catch {
    return { status: 400, body: { error: "Expected a JSON body of { action, args }." } };
  }
  const definition = Object.hasOwn(actions, parsed.action) ? actions[parsed.action] : undefined;
  if (!definition) return { status: 404, body: { error: `Unknown action: ${parsed.action}` } };

  const args = definition.request.safeParse(parsed.args ?? {});
  if (!args.success) return { status: 400, body: { error: z.prettifyError(args.error) } };
  try {
    return { status: 200, body: definition.response.parse(await definition.handler({}, args.data)) };
  } catch (error) {
    console.error(`[actions] ${parsed.action} failed`, error);
    return { status: 500, body: { error: "The server could not complete that request." } };
  }
}
