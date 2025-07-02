'use client'

import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useSession } from 'next-auth/react'
//import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslation } from 'react-i18next'
import { getUserById } from '../../models/user';
import { useCallback, useEffect, useState } from 'react';
import { User } from '../../db/schema';
import { useSWRJson } from '../../hooks/swr';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Card, CardContent } from '../../components/ui/card';


const Component = () => {
  const { t } = useTranslation()
  const { data: session } = useSession();
  console.log('session', session);
  const [selected, setSelected] = useState<any | null>(null);

  const { data: emails } = useSWRJson<any[]>('/api/google/emails')
  if(!emails) return <></>
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Lista fissa a sinistra */}
      <div className="flex-shrink-0 w-2/5 border-r h-full">
        <ScrollArea className="h-full">
          {emails.map((email) => (
            <Card
              key={email.id}
              onClick={() => setSelected(email)}
              className={`m-2 cursor-pointer hover:bg-gray-100 ${
                selected?.id === email.id ? 'bg-gray-100' : ''
              }`}
            >
              <CardContent className="p-3">
                <div className="text-sm font-semibold truncate">{email.subject}</div>
                <div className="text-xs text-gray-500 truncate">{email.from}</div>
                <div className="text-xs text-gray-400">{email.date}</div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </div>

      {/* Dettaglio fisso a destra */}
      <div className="flex-grow w-3/5 p-4 h-full overflow-auto">
        {selected ? (
          <Card className="h-full">
            <CardContent className="p-4">
              <div className="text-lg font-bold mb-2">{selected.subject}</div>
              <div className="text-sm text-gray-500 mb-2">{selected.from}</div>
              <div className="text-xs text-gray-400 mb-4">{selected.date}</div>
              <p className="text-sm">Qui potresti caricare e mostrare il contenuto del messaggio...</p>
            </CardContent>
          </Card>
        ) : (
          // eslint-disable-next-line i18next/no-literal-string
          <div className="flex items-center justify-center h-full text-gray-400">
            Seleziona un messaggio per visualizzarlo
          </div>
        )}
      </div>
    </div>
  );
}

export default Component