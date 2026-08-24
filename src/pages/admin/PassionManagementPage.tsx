import { useState } from 'react'
import toast from 'react-hot-toast'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Button } from '@/components/common/Button'
import { DataTable, type DataTableColumn } from '@/components/admin/DataTable'
import { DeleteConfirmation } from '@/components/admin/DeleteConfirmation'
import { VisibilityPill } from '@/components/admin/VisibilityPill'
import { ImageWithFallback } from '@/components/admin/ImageWithFallback'
import { PageContentModal } from '@/components/admin/modals/PageContentModal'
import { LeadershipModal } from '@/components/admin/modals/LeadershipModal'
import { CreativeWorkModal } from '@/components/admin/modals/CreativeWorkModal'
import { CarouselPhotoModal } from '@/components/admin/modals/CarouselPhotoModal'
import { usePageContent } from '@/hooks/usePageContent'
import { useSupabaseTable } from '@/hooks/useSupabaseTable'
import type { CarouselPhoto, CreativeCategory, CreativeWork, Leadership } from '@/types'

type DeleteTarget =
  | { type: 'leadership'; id: string; label: string }
  | { type: 'creative'; id: string; label: string }
  | { type: 'photo'; id: string; label: string }

const CREATIVE_CATEGORIES: { value: CreativeCategory; label: string }[] = [
  { value: 'digital', label: 'Digital' },
  { value: 'traditional', label: 'Traditional' },
  { value: 'stickers', label: 'Stickers' },
]

export function PassionManagementPage() {
  const pageContent = usePageContent('passion')
  const leadership = useSupabaseTable<Leadership>('leadership', { column: 'position_order' })
  const creativeWorks = useSupabaseTable<CreativeWork>('creative_works')
  const carouselPhotos = useSupabaseTable<CarouselPhoto>('carousel_photos')

  const [pageContentModalOpen, setPageContentModalOpen] = useState(false)
  const [leadershipModal, setLeadershipModal] = useState<{ open: boolean; data: Leadership | null }>({
    open: false,
    data: null,
  })
  const [creativeModal, setCreativeModal] = useState<{
    open: boolean
    data: CreativeWork | null
    defaultCategory?: CreativeCategory
  }>({ open: false, data: null })
  const [photoModal, setPhotoModal] = useState<{ open: boolean; data: CarouselPhoto | null }>({
    open: false,
    data: null,
  })
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      if (deleteTarget.type === 'leadership') await leadership.remove(deleteTarget.id)
      if (deleteTarget.type === 'creative') await creativeWorks.remove(deleteTarget.id)
      if (deleteTarget.type === 'photo') await carouselPhotos.remove(deleteTarget.id)
      toast.success('Deleted.')
      setDeleteTarget(null)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not delete. Try again.')
    } finally {
      setDeleting(false)
    }
  }

  const leadershipColumns: DataTableColumn<Leadership>[] = [
    { key: 'organization', label: 'Organization' },
    { key: 'position', label: 'Role' },
    { key: 'period', label: 'Period', render: (v) => (v ? String(v) : '—') },
    { key: 'is_visible', label: 'Status', render: (v) => <VisibilityPill visible={v as boolean} /> },
  ]

  const creativeColumns: DataTableColumn<CreativeWork>[] = [
    {
      key: 'image_url',
      label: 'Photo',
      render: (v) => <ImageWithFallback src={v as string} section="passion" alt="" className="table-thumb" />,
    },
    { key: 'title', label: 'Title' },
    { key: 'year', label: 'Year', render: (v) => (v ? String(v) : '—') },
    { key: 'is_visible', label: 'Status', render: (v) => <VisibilityPill visible={v as boolean} /> },
  ]

  const photoColumns: DataTableColumn<CarouselPhoto>[] = [
    {
      key: 'image_url',
      label: 'Preview',
      render: (v) => <ImageWithFallback src={v as string} section="passion" alt="" className="table-thumb" />,
    },
    { key: 'caption', label: 'Caption', render: (v) => (v ? String(v) : '—') },
    { key: 'event_or_context', label: 'Context', render: (v) => (v ? String(v) : '—') },
    { key: 'is_visible', label: 'Status', render: (v) => <VisibilityPill visible={v as boolean} /> },
  ]

  return (
    <AdminLayout title="Passion Management" backTo="/admin/management" section="passion">
      {/* Page content */}
      <div className="section-block">
        <div className="section-block__header">
          <h2 className="section-block__title">Quote & Subtitle</h2>
          <div className="section-block__actions">
            <Button size="sm" onClick={() => setPageContentModalOpen(true)}>
              Edit
            </Button>
          </div>
        </div>
        <div className="admin-card" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <ImageWithFallback
            src={pageContent.data?.image_url}
            section="passion"
            alt=""
            style={{ width: 56, height: 56, objectFit: 'cover', border: '2px solid var(--border)', flexShrink: 0 }}
          />
          <div>
            <div style={{ fontSize: 13 }}>
              <strong>Quote:</strong> {pageContent.data?.quote_text || '—'}
            </div>
            <div style={{ fontSize: 13, marginTop: 6 }}>
              <strong>Subtitle:</strong> {pageContent.data?.subtitle_text || '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Leadership */}
      <div className="section-block">
        <div className="section-block__header">
          <h2 className="section-block__title">Leadership & Committees</h2>
          <div className="section-block__actions">
            <Button size="sm" onClick={() => setLeadershipModal({ open: true, data: null })}>
              Add role
            </Button>
          </div>
        </div>
        <DataTable
          columns={leadershipColumns}
          data={leadership.data}
          loading={leadership.loading}
          emptyMessage="No leadership roles yet."
          onEdit={(row) => setLeadershipModal({ open: true, data: row })}
          onDelete={(row) => setDeleteTarget({ type: 'leadership', id: row.id, label: row.organization })}
        />
      </div>

      {/* Creative works, grouped by category */}
      <div className="section-block">
        <div className="section-block__header">
          <h2 className="section-block__title">Creative Works</h2>
        </div>
        {CREATIVE_CATEGORIES.map(({ value, label }) => (
          <div key={value} style={{ marginBottom: 14 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
              <Button size="sm" onClick={() => setCreativeModal({ open: true, data: null, defaultCategory: value })}>
                Add {label.toLowerCase()} work
              </Button>
            </div>
            <DataTable
              columns={creativeColumns}
              data={creativeWorks.data.filter((c) => c.category === value)}
              loading={creativeWorks.loading}
              emptyMessage={`No ${label.toLowerCase()} works yet.`}
              onEdit={(row) => setCreativeModal({ open: true, data: row })}
              onDelete={(row) => setDeleteTarget({ type: 'creative', id: row.id, label: row.title })}
            />
          </div>
        ))}
      </div>

      {/* Carousel photos */}
      <div className="section-block">
        <div className="section-block__header">
          <h2 className="section-block__title">Carousel Photos</h2>
          <div className="section-block__actions">
            <Button size="sm" onClick={() => setPhotoModal({ open: true, data: null })}>
              Add photo
            </Button>
          </div>
        </div>
        <DataTable
          columns={photoColumns}
          data={carouselPhotos.data}
          loading={carouselPhotos.loading}
          emptyMessage="No carousel photos yet."
          onEdit={(row) => setPhotoModal({ open: true, data: row })}
          onDelete={(row) => setDeleteTarget({ type: 'photo', id: row.id, label: row.caption || 'this photo' })}
        />
      </div>

      <PageContentModal
        isOpen={pageContentModalOpen}
        onClose={() => setPageContentModalOpen(false)}
        initialData={pageContent.data}
        section="passion"
        onSave={pageContent.save}
      />
      <LeadershipModal
        isOpen={leadershipModal.open}
        onClose={() => setLeadershipModal({ open: false, data: null })}
        initialData={leadershipModal.data}
        onCreate={leadership.create}
        onUpdate={leadership.update}
      />
      <CreativeWorkModal
        isOpen={creativeModal.open}
        onClose={() => setCreativeModal({ open: false, data: null })}
        initialData={creativeModal.data}
        defaultCategory={creativeModal.defaultCategory}
        onCreate={creativeWorks.create}
        onUpdate={creativeWorks.update}
      />
      <CarouselPhotoModal
        isOpen={photoModal.open}
        onClose={() => setPhotoModal({ open: false, data: null })}
        initialData={photoModal.data}
        onCreate={carouselPhotos.create}
        onUpdate={carouselPhotos.update}
      />
      <DeleteConfirmation
        isOpen={!!deleteTarget}
        itemLabel={deleteTarget?.label || ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={deleting}
      />
    </AdminLayout>
  )
}
