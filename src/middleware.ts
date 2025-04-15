"user server";
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import createIntlMiddleware from 'next-intl/middleware';
import { auth } from './lib/auth';

const locales = ['en', 'de'];
const authRoutes = ["/sign-in", "/sign-up", "/forgot-password"]
const protectedRoutes = ["/protected"]

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'en',
});

export default async function authMiddleware(req: NextRequest) {
  let session = null;

  try {
    const response = await auth.api.getSession({
        headers: await headers()
    }) 
    session = response?.session;
  } catch (err) {
    // do nothing
  }
  const res = intlMiddleware(req) || NextResponse.next();

  // Handle redirection logic
  const locale = req.cookies.get("NEXT_LOCALE")?.value || 'en';

  const pathname = req.nextUrl.pathname;
  const pathWithoutLocale = pathname.replace(new RegExp(`^/(${locales.join('|')})`), '') || '/';
  const newPathname = `/${locale}${pathWithoutLocale}`;

  // Remove locale from pathname for matching
  const pathAfterLocale = newPathname.replace(new RegExp(`^/${locale}`), '') || '/';

  const isProtectedRoute = protectedRoutes.some((path) =>
    pathAfterLocale.startsWith(path)
  );
  const isAuthRoute = authRoutes.some((path) =>
    pathAfterLocale.startsWith(path)
  );
  
  if (!session) {
    if (isAuthRoute || !isProtectedRoute) {
      return res;
    }
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = `/${locale}/sign-in`;
    redirectUrl.searchParams.set('redirectedFrom', newPathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthRoute) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = `/${locale}/`;
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
