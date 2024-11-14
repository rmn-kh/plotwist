'use server'

import type { PostUsersCreateBody } from '@/api/endpoints.schemas'
import { postUsersCreate } from '@/api/users'
import { signIn } from './sign-in'
import { Language } from '@plotwist_app/tmdb'
import { api } from '@/services/api'
import { redirect } from 'next/navigation'

type SignUpParams = PostUsersCreateBody & {
  redirectToCheckout?: boolean
  language: Language
}

export async function signUp({
  email,
  password,
  username,
  language,
  redirectToCheckout,
}: SignUpParams) {
  const { user } = await postUsersCreate({ email, password, username })
  if (!user) return

  await signIn({
    email,
    password,
    redirectTo: redirectToCheckout ? undefined : `/${language}/${username}`,
  })

  if (redirectToCheckout) {
    const { data } = await api.post(
      `/checkout_sessions?locale=${language.split('-')[0]}&email=${email}&username=${username}`,
    )

    if (data.url) {
      redirect(data.url)
    }
  }
}