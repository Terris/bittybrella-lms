import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/lib/ui";
import { FormikValues } from "formik";
import { useState } from "react";
import { AdminForm, AdminFormProps } from "./AdminForm";

interface AdminDialogFormProps<CustomFormValues>
  extends AdminFormProps<CustomFormValues> {
  onCloseForm?: () => void;
}

export function AdminDialogForm<CustomFormValues extends FormikValues>({
  formTitle,
  renderTrigger,
  formDescription,
  config,
  onCloseForm,
}: AdminDialogFormProps<CustomFormValues>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function handleOnSetOpen(open: boolean) {
    setIsOpen(open);
    if (!open) onCloseForm?.();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOnSetOpen}>
      <DialogTrigger asChild>
        {renderTrigger ? (
          renderTrigger
        ) : (
          <Button variant="outline" size="sm">
            {formTitle}
          </Button>
        )}
      </DialogTrigger>
      <DialogPortal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formTitle}</DialogTitle>
            {formDescription && (
              <DialogDescription>{formDescription}</DialogDescription>
            )}
          </DialogHeader>
          <AdminForm<CustomFormValues>
            config={config}
            formTitle={formTitle}
            formDescription={formDescription}
            onSuccess={() => setIsOpen(false)}
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
