import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export interface DataTableColumn<T> {
  key: string
  label: string
  render?: (value: unknown, row: T) => React.ReactNode
}

interface DataTableProps<T extends { id: string }> {
  columns: DataTableColumn<T>[]
  data: T[]
  onEdit: (row: T) => void
  onDelete: (row: T) => void
  loading?: boolean
  emptyMessage?: string
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  onEdit,
  onDelete,
  loading = false,
  emptyMessage = 'Nothing here yet.',
}: DataTableProps<T>) {
  return (
    <div className="table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th style={{ width: 1 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={columns.length + 1} className="table-loading">
                <LoadingSpinner label="Loading…" />
              </td>
            </tr>
          )}
          {!loading && data.length === 0 && (
            <tr>
              <td colSpan={columns.length + 1} className="table-empty">
                {emptyMessage}
              </td>
            </tr>
          )}
          {!loading &&
            data.map((row) => (
              <tr key={row.id}>
                {columns.map((col) => {
                  const value = (row as Record<string, unknown>)[col.key]
                  return <td key={col.key}>{col.render ? col.render(value, row) : (value as React.ReactNode) ?? '—'}</td>
                })}
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => onEdit(row)}>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => onDelete(row)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
