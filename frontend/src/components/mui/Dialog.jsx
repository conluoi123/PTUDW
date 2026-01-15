import { 
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Slide
} from '@mui/material';
import { X } from 'lucide-react';
import { forwardRef } from 'react';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * Enhanced Dialog component với animation và custom styling
 */
export function Dialog({ 
  open, 
  onClose, 
  title, 
  children, 
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  className = ''
}) {
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      className={className}
      PaperProps={{
        className: 'rounded-2xl'
      }}
    >
      {title && (
        <DialogTitle className="flex items-center justify-between border-b dark:border-gray-700">
          <span className="font-semibold">{title}</span>
          <IconButton
            onClick={onClose}
            size="small"
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </IconButton>
        </DialogTitle>
      )}
      
      <DialogContent className="mt-4">
        {children}
      </DialogContent>
      
      {actions && (
        <DialogActions className="border-t dark:border-gray-700 p-4">
          {actions}
        </DialogActions>
      )}
    </MuiDialog>
  );
}

/**
 * Confirm Dialog - Dialog xác nhận với Yes/No
 */
export function ConfirmDialog({ 
  open, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'primary'
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="xs"
      actions={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 bg-${confirmColor}-600 hover:bg-${confirmColor}-700 text-white font-medium rounded-lg transition-colors`}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <p className="text-gray-700 dark:text-gray-300">{message}</p>
    </Dialog>
  );
}
