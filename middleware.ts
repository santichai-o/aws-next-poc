import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/members/login',
  },
})

export const config = { 
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|members/login|members/register|members/confirm|api|assets).*)",
  ] 
}
