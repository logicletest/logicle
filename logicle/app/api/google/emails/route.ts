import { getUserById } from "../../../../models/user"
import ApiResponses from "../../utils/ApiResponses"
import { requireSession } from "../../utils/auth"
import { google } from 'googleapis';

export const GET = requireSession(async (session) => {
  const user = await getUserById(session.userId)
  if (!user) {
    return ApiResponses.noSuchEntity('Unknown session user')
  }

  const { access_token } = JSON.parse(user?.google || '{}')

  if (!access_token) {
    return ApiResponses.noSuchEntity('No google token')
  }
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  // 1️⃣ Prendi lista messaggi
  const listRes = await gmail.users.messages.list({
    userId: 'me',
    labelIds: ['INBOX'],
    maxResults: 5, 
  });

  console.log('listRes',listRes.data);
  

  const messages = listRes.data.messages || [];

  const details = await Promise.all(
    messages.map(async (msg) => {
      const msgRes = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id!,
        format: 'metadata',
        metadataHeaders: ['Subject', 'From', 'Date'],
      });

      const headers = msgRes.data.payload?.headers || [];

      const subject = headers.find((h) => h.name === 'Subject')?.value;
      const from = headers.find((h) => h.name === 'From')?.value;
      const date = headers.find((h) => h.name === 'Date')?.value;

      return { id: msg.id, subject, from, date };
    })
  );
  return ApiResponses.json(details)
})