'use client'

import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useSession } from 'next-auth/react'
//import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslation } from 'react-i18next'
import { getUserById } from '../../models/user';
import { useCallback, useEffect, useState } from 'react';
import { User } from '../../db/schema';
import { useSWRJson } from '../../hooks/swr';


const Component = () => {
  const { t } = useTranslation()
  const { data: session } = useSession();
  console.log('session', session);
  // useEffect(() => {
  //   void checkUser()
  // }, [])

  
  
  const { data: emails } = useSWRJson<any[]>('/api/google/emails')
  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsContent value="overview" className="space-y-4">
              {emails && emails.map(email => <p key={email.id}>{JSON.stringify(email, null, 2)}</p>)
              }
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default Component