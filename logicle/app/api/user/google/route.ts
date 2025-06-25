import { getUserById } from "../../../../models/user"
import ApiResponses from "../../utils/ApiResponses"
import { requireSession } from "../../utils/auth"

export const GET = requireSession(async (session) => {
  const user = await getUserById(session.userId)

  return ApiResponses.json(JSON.parse(user?.google || '{}'))
})