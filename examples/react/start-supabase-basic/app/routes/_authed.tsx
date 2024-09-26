import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { Login } from '../components/Login'
import { getSupabaseServerClient } from '../utils/supabase'

export const loginFn = createServerFn()
  .input((d) => d as { email: string; password: string })
  .handler(async ({ input }) => {
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    })
    if (error) {
      return {
        error: true,
        message: error.message,
      }
    }
  })

export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw new Error('Not authenticated')
    }
  },
  errorComponent: ({ error }) => {
    if (error.message === 'Not authenticated') {
      return <Login />
    }

    throw error
  },
})
