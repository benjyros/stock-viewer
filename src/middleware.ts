// src/middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { updateSession } from '@/lib/supabase/middleware';

const locales = ['en', 'de'];

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'en',
});

export async function middleware(req: NextRequest) {
  // First, update the session
  await updateSession(req);

  // Proceed with the internationalization middleware
  const res = intlMiddleware(req) || NextResponse.next();

  const isAuthenticated = req.cookies.has(`sb-${process.env.NEXT_PUBLIC_SUPABASE_REFERENCE_ID}-auth-token`);

  // Determine if the user is authenticated
  // Handle redirection logic
  const locale = req.cookies.get("NEXT_LOCALE")?.value || 'en';

  const pathname = req.nextUrl.pathname;
  const pathWithoutLocale = pathname.replace(new RegExp(`^/(${locales.join('|')})`), '') || '/';
  const newPathname = `/${locale}${pathWithoutLocale}`;

  // Remove locale from pathname for matching
  const pathAfterLocale = newPathname.replace(new RegExp(`^/${locale}`), '') || '/';
  const protectedPaths = ['/protected', '/protected/reset-password'];
  const authPages = ['/sign-in', '/sign-up', '/forgot-password'];

  const isProtectedRoute = protectedPaths.some((path) =>
    pathAfterLocale.startsWith(path)
  );
  const isAuthPage = authPages.some((path) =>
    pathAfterLocale.startsWith(path)
  );

  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = `/${locale}/sign-in`;
    redirectUrl.searchParams.set('redirectedFrom', newPathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthPage && isAuthenticated) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = `/${locale}/`;
    return NextResponse.redirect(redirectUrl);
  }

  // Return the response
  return res;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
