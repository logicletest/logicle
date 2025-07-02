import axios from "axios";
import { requireAdmin } from "../../utils/auth";
import { NextRequest, NextResponse } from "next/server";
import { setGoogleTokenByEmail } from "../../../../models/user";

export const GET = requireAdmin(async (req: NextRequest) => {
  console.log('aaa');

  const code = req.nextUrl.searchParams.get('code');

  if (!code) {
    throw new Error("Missing code");
  }

  try {
    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code: code as string,
        client_id: '1070536102274-je6v4rbf8sc1o7qeph5pk25hrp9agk0b.apps.googleusercontent.com',//process.env.GOOGLE_CLIENT_ID!,
        client_secret: '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', //process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `http://localhost:3000/api/google/oauth-callback`,
        grant_type: "authorization_code",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token, expires_in, id_token } = response.data;

    // Qui puoi salvarli nel DB associandoli al tuo utente autenticato
    console.log({
      access_token,
      refresh_token,
      expires_in,
      id_token,
    });

    if (!access_token) {
      throw new Error('Invalid token');
    }
    // Usa token per ottenere info profilo
    const userRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    console.log('User info:', userRes.data);

    await setGoogleTokenByEmail(userRes.data.email, JSON.stringify(response.data));

    // Puoi fare redirect o mostrare info

    // Chiamata API Gmail
    // const emails = await axios.get('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
    //   headers: {
    //     Authorization: `Bearer ${access_token}`,
    //   },
    // });

    return NextResponse.json({ data: response.data, user: userRes.data })
  } catch (err: any) {
    console.error("OAuth callback error:", err.response?.data || err.message);
    throw new Error("Errore nell'autenticazione Google");
  }
})
