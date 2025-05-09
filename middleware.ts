// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. If not signed in, let them through to auth pages
  if (!user) return res;

  const { pathname } = req.nextUrl;

  // 2. ONBOARDING GUARD: 
  //    skip if they're already on the setup or welcome routes
  if (
    pathname.startsWith('/onboarding/oracle-setup') ||
    pathname.startsWith('/onboarding/welcome')
  ) {
    return res;
  }

  // 3. Check if they've created their Oracle yet
  const { data: oracle } = await supabase
    .from('user_oracles')
    .select('oracle_name')
    .eq('user_id', user.id)
    .single();

  if (!oracle) {
    const url = req.nextUrl.clone();
    url.pathname = '/onboarding/oracle-setup';
    return NextResponse.redirect(url);
  }

  // 4. Check if they've seen the Welcome page yet
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('has_seen_welcome, user_tier')
    .eq('user_id', user.id)
    .single();

  if (profile && !profile.has_seen_welcome) {
    const url = req.nextUrl.clone();
    url.pathname = '/onboarding/welcome';
    return NextResponse.redirect(url);
  }

  // 5. TIER GATE: Restrict beta_mvp users to core MVP routes
  if (profile?.user_tier === 'beta_mvp') {
    const allowed = [
      '/dashboard',
      '/journal',
      '/oracle',
      '/onboarding/oracle-setup',
      '/onboarding/welcome',
      '/api/feedback',
    ];
    // if visiting anything else, bounce back to dashboard
    if (!allowed.some((p) => pathname.startsWith(p))) {
      const url = req.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/journal/:path*',
    '/oracle/:path*',
    '/onboarding/:path*',
    '/api/:path*',
  ],
};
