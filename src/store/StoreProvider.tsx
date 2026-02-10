'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from './store'

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore>(null)
  if (!storeRef.current) {
    // Crea la instancia del store la primera vez que se renderiza
    storeRef.current = makeStore()
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}