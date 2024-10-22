import { usersTable } from '~/db/schema'
import { decodeToken } from './jwt'
import { db } from '~/db/client'
import { eq } from 'drizzle-orm'
import type { APIEvent } from '@solidjs/start/server'

export async function getUser({ request }: APIEvent) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')

  console.log({ token })

  if (!token) {
    return null
  }

  const decoded = await decodeToken(token)

  console.log({ decoded })

  const user = await db.query.users.findFirst({
    // @ts-ignore
    where: eq(usersTable.id, decoded?.sub?.userId),
  })

  return user
}
