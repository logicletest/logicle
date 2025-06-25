'use client'

import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useSession } from 'next-auth/react'
//import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslation } from 'react-i18next'
import { getUserById } from '../../models/user';
import { useCallback, useEffect, useState } from 'react';
import { User } from '../../db/schema';
import { useSWRJson } from '../../hooks/swr';
import EmailList from './EmailList';

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "openid",
  "email",
  "profile",
].join(" ");

export function GoogleConnectButton() {
  const handleConnect = () => {
    const params = new URLSearchParams({
      client_id: '509521064815-951kvb5nrh6n05iv35mtldvinhsqhm2v.apps.googleusercontent.com',
      redirect_uri: `http://localhost:3000/api/google/oauth-callback`,
      response_type: "code",
      scope: SCOPES,
      access_type: "offline",
      prompt: "consent",
    });

    window.open(
      `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
      "_blank",
      "width=500,height=600"
    );
  };

  return (
    // eslint-disable-next-line i18next/no-literal-string
    <button onClick={handleConnect}>
      Connetti Google per Gmail
    </button>
  );
}

const AnalyticsPage = () => {
  const { t } = useTranslation()
  const { data: session } = useSession();
  console.log('session', session);
  // useEffect(() => {
  //   void checkUser()
  // }, [])

  
  
  const { data: google } = useSWRJson<any>('/api/user/google')
  console.log('user', google);
  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">{t('Email')}</h2>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsContent value="overview" className="space-y-4">
              {google?.access_token 
               ?<EmailList />
               :<GoogleConnectButton />
              }
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default AnalyticsPage