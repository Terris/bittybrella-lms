import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Switch,
  Text,
} from "@/lib/ui";
import { FieldInputProps, Form, Formik, FormikValues, useField } from "formik";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

export interface AdminFormConfig<CustomFormValues> {
  validationSchema: any;
  fields: AdminFormField[];
  initialValues: CustomFormValues;
  onSubmit: (values: CustomFormValues) => Promise<void>;
  submitButtonLabel?: string;
}

export interface AdminFormProps<CustomFormValues> {
  formTitle: string;
  renderTrigger?: React.ReactNode;
  formDescription?: string;
  config: AdminFormConfig<CustomFormValues>;
}

export const AdminQuickForm = <CustomFormValues extends FormikValues>({
  formTitle,
  renderTrigger,
  formDescription,
  config,
}: AdminFormProps<CustomFormValues>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    validationSchema,
    initialValues,
    fields,
    onSubmit,
    submitButtonLabel,
  } = config;

  const handleSubmit = async (values: CustomFormValues) => {
    setServerError(null);
    try {
      await onSubmit(values);
      setIsOpen(false);
    } catch (error: any) {
      setServerError(error.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
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
          <Formik<CustomFormValues>
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid, touched }) => (
              <Form>
                {serverError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Oops, something went wrong...</AlertTitle>
                    <AlertDescription>{serverError}</AlertDescription>
                  </Alert>
                )}
                <div className="grid gap-4 py-4">
                  {fields.map((f) => (
                    <AdminFormField
                      key={`form-field-${f.name}`}
                      name={f.name}
                      label={f.label}
                      fieldtype={f.fieldtype}
                      options={f.options}
                    />
                  ))}
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {submitButtonLabel ?? "Save"}
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export type AdminFieldtype =
  | "text"
  | "textarea"
  | "switch"
  | "number"
  | "checkbox"
  | "radio"
  | "select"
  | "multiselect";

export interface AdminFormFieldOption {
  label: string;
  value: string;
}
export interface AdminFormField {
  name: string;
  label?: string;
  fieldtype?: AdminFieldtype;
  options?: AdminFormFieldOption[];
}

type AdminFormFieldProps = Pick<
  AdminFormField,
  "name" | "label" | "fieldtype" | "options"
>;

export const AdminFormField = ({
  name,
  label,
  fieldtype = "text",
  options,
}: AdminFormFieldProps) => {
  const [field, meta, helpers] = useField(name);

  function renderFieldType() {
    switch (fieldtype) {
      case "multiselect":
        return (
          <MultiSelectInput
            options={options}
            value={field.value}
            setValue={helpers.setValue}
          />
        );
      case "switch":
        return (
          <SwitchInput
            name={field.name}
            value={field.value}
            setValue={helpers.setValue}
            className="mt-2"
          />
        );
      case "textarea":
      case "number":
      case "checkbox":
      case "radio":
      case "select":
      default:
        return (
          <TextInput touched={meta.touched} error={meta.error} field={field} />
        );
    }
  }

  return (
    <FieldWrapper>
      <FieldLabel name={name} label={label} />
      <div className="col-span-3">
        {renderFieldType()}
        <FieldError touched={meta.touched} error={meta.error} />
      </div>
    </FieldWrapper>
  );
};

function FieldWrapper({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-4 items-start gap-4">{children}</div>;
}

function FieldLabel({ name, label }: { name: string; label?: string }) {
  return (
    <Label htmlFor={name} className="text-right pt-3">
      {label ?? name}
    </Label>
  );
}

function TextInput({
  touched,
  error,
  field,
}: {
  touched: boolean;
  error?: string;
  field: FieldInputProps<any>;
}) {
  return (
    <Input
      className={touched && error ? "border-destructive" : ""}
      {...field}
    />
  );
}

function SwitchInput({
  name,
  value,
  setValue,
  className,
}: {
  name: string;
  value: boolean;
  setValue: (v: boolean) => void;
  className?: string;
}) {
  return (
    <Switch
      id={name}
      checked={value}
      onCheckedChange={setValue}
      className={className}
    />
  );
}

function MultiSelectInput({
  options,
  value,
  setValue,
}: {
  options: AdminFormField["options"];
  value: string[];
  setValue: (v: string[]) => void;
}) {
  const handleSetValue = (selected: boolean, optionValue: string) => {
    if (selected) {
      setValue([...value, optionValue]);
    } else {
      setValue(value.filter((v) => v !== optionValue));
    }
  };

  return (
    <div className="rounded border px-4 max-h-52 overflow-hidden overflow-y-auto">
      {options?.map((option) => {
        return (
          <div
            className="grid grid-cols-4 py-2 items-center gap-4 border-b"
            key={option.value}
          >
            <div className="col-span-3">
              <Label htmlFor={option.value}>{option.label}</Label>
            </div>
            <div className="col-span-1 flex justify-end">
              <SwitchInput
                name={option.value}
                value={value.includes(option.value)}
                setValue={(v) => handleSetValue(v, option.value)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FieldError({ touched, error }: { touched: boolean; error?: string }) {
  return touched && error ? (
    <Text className="text-destructive" size="sm">
      {error}
    </Text>
  ) : null;
}
