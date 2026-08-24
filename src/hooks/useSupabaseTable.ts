import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface OrderBy {
  column: string
  ascending?: boolean
}

interface WithId {
  id: string
}

/**
 * Generic CRUD hook for a single Supabase table.
 * Works for any table shaped like the ones in sql/schema.sql (id: uuid PK).
 * Pass `orderBy` for tables that don't use a plain "position" column
 * (e.g. experience uses position_order, page_content isn't ordered).
 */
export function useSupabaseTable<T extends WithId>(
  table: string,
  orderBy: OrderBy | null = { column: 'position', ascending: true }
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase.from(table).select('*')
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true })
      }
      const { data: result, error: err } = await query
      if (err) throw err
      setData((result as T[]) || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data.')
    } finally {
      setLoading(false)
    }
  }, [table, orderBy?.column, orderBy?.ascending])

  const create = useCallback(
    async (payload: Partial<T>) => {
      // The untyped `supabase.from(table)` client can't narrow to a specific
      // row shape without generated Database types, so we cast at the edge
      // here — everywhere else in the app still works with typed T values.
      const { data: result, error: err } = await supabase.from(table).insert([payload as never]).select()
      if (err) throw err
      const row = result?.[0] as T
      setData((prev) => [...prev, row])
      return row
    },
    [table]
  )

  const update = useCallback(
    async (id: string, payload: Partial<T>) => {
      const { data: result, error: err } = await supabase
        .from(table)
        .update(payload as never)
        .eq('id', id)
        .select()
      if (err) throw err
      const row = result?.[0] as T
      setData((prev) => prev.map((item) => (item.id === id ? row : item)))
      return row
    },
    [table]
  )

  const remove = useCallback(
    async (id: string) => {
      const { error: err } = await supabase.from(table).delete().eq('id', id)
      if (err) throw err
      setData((prev) => prev.filter((item) => item.id !== id))
    },
    [table]
  )

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, fetchData, create, update, remove }
}
