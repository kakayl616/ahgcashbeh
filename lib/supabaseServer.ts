import { createServerClient } from "@supabase/ssr";
import { GetServerSidePropsContext } from "next";

export function createSupabaseServer(ctx: GetServerSidePropsContext) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return ctx.req.cookies[name];
        },
        set(name: string, value: string, options: any) {
          ctx.res.setHeader("Set-Cookie", `${name}=${value}; Path=/; HttpOnly; SameSite=Lax`);
        },
        remove(name: string) {
          ctx.res.setHeader("Set-Cookie", `${name}=; Path=/; Max-Age=0`);
        }
      }
    }
  );
}
