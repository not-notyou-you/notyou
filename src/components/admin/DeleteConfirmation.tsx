import { Modal } from './Modal'
import { Button } from '@/components/common/Button'

interface DeleteConfirmationProps {
  isOpen: boolean
  itemLabel: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export function DeleteConfirmation({
  isOpen,
  itemLabel,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteConfirmationProps) {
  return (
    <Modal
      isOpen={isOpen}
      title="Delete this?"
      onClose={onCancel}
      footer={
        <>
          <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={isLoading}>
            Delete
          </Button>
        </>
      }
    >
      <p className="confirm-body">
        This removes <strong>{itemLabel}</strong> permanently. This can't be undone.
      </p>
    </Modal>
  )
}
