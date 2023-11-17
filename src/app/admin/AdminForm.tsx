import {
  Button,
  Input,
  Label,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Switch,
  Text,
} from "@/lib/ui";
import { Form, Formik, FormikValues, useField } from "formik";

export interface AdminFormConfig<CustomFormValues> {
  schema: any;
  fields: AdminFormField[];
  initialValues: CustomFormValues;
  onSubmit: (values: CustomFormValues) => Promise<void>;
  submitButtonLabel?: string;
}

export interface AdminFormProps<CustomFormValues> {
  formTitle: string;
  formDescription?: string;
  triggerLabel: string;
  config: AdminFormConfig<CustomFormValues>;
}

export const AdminForm = <CustomFormValues extends FormikValues>({
  formTitle,
  formDescription,
  triggerLabel,
  config,
}: AdminFormProps<CustomFormValues>) => {
  const { schema, initialValues, fields, onSubmit, submitButtonLabel } = config;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">{triggerLabel}</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{formTitle}</SheetTitle>
          {formDescription && (
            <SheetDescription>{formDescription}</SheetDescription>
          )}
        </SheetHeader>
        <Formik<CustomFormValues>
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="grid gap-4 py-4">
                {fields.map((f) => (
                  <AdminFormField
                    key={`form-field-${f.name}`}
                    name={f.name}
                    label={f.label}
                    fieldtype={f.fieldtype}
                  />
                ))}
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit" disabled={isSubmitting}>
                    {submitButtonLabel ?? "Save"}
                  </Button>
                </SheetClose>
              </SheetFooter>
            </Form>
          )}
        </Formik>
      </SheetContent>
    </Sheet>
  );
};

export type AdminFieldtype =
  | "text"
  | "textarea"
  | "switch"
  | "number"
  | "checkbox";

export interface AdminFormField {
  name: string;
  label?: string;
  fieldtype?: AdminFieldtype;
  initialValue: any;
}

type AdminFormFieldProps = Pick<AdminFormField, "name" | "label" | "fieldtype">;

export const AdminFormField = ({
  name,
  label,
  fieldtype = "text",
}: AdminFormFieldProps) => {
  const [field, meta, helpers] = useField(name);

  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label htmlFor={name} className="text-right pt-3">
        {label ?? name}
      </Label>
      <div className="col-span-3">
        {fieldtype === "switch" ? (
          <Switch
            checked={field.value}
            onCheckedChange={(v) => helpers.setValue(v)}
            className="mt-2"
          />
        ) : (
          <Input
            className={meta.touched && meta.error ? "border-destructive" : ""}
            {...field}
          />
        )}
        {meta.touched && meta.error ? (
          <Text className="text-destructive">{meta.error}</Text>
        ) : null}
      </div>
    </div>
  );
};
