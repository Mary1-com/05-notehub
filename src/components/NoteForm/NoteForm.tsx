import {Formik, Form,  Field,  ErrorMessage} from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import { useMutation, useQueryClient, } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";

interface NoteFormProps { onClose: () => void; }
interface FormValues {
    title: string;
    content: string;
    tag: | "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}
const initialValues: FormValues = { title: "", content: "", tag: "Todo", };

const validationSchema = Yup.object({
    title: Yup.string().min(3, "Title must be at least 3 characters").max(50, "Title must be at most 50 haracters").required("Title is required"),
    content: Yup.string().max(500, "Content must be at most 500 characters"),
    tag: Yup.string().oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping",], "Invalid tag").required("Tag is required")
});

export default function NoteForm({ onClose, }: NoteFormProps) {
    const handleSubmit = (values: FormValues) => {
        // console.log(values);
        // onClose();
        mutation.mutate(values);
    };
const queryClient = useQueryClient();    
const mutation = useMutation({
    mutationFn: createNote, onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notes"], });
        onClose();
    }
});
    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            <Form className={css.form}>
                <div className={css.formGroup}>
                    <label htmlFor="title">Title</label>
                    <Field id="title" name="title" type="text" className={css.input} />
                    <ErrorMessage name="title" component="span" className={css.error} />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="content"> Content </label>
                    <Field as="textarea" id="content" name="content" rows={8} className={css.textarea} />
                    <ErrorMessage name="content" component="span" className={css.error} />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="tag">Tag</label>
                    <Field as="select" id="tag" name="tag" className={css.select}>
                        <option value="Todo">Todo</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Shopping">Shopping</option>
                    </Field>
                    <ErrorMessage name="tag" component="span" className={css.error} />
                </div>

                <div className={css.actions}>
                    <button type="button" onClick={onClose} className={css.cancelButton}>Cancel</button>
                    <button type="submit" className={css.submitButton} disabled={mutation.isPending}>Create note</button>
                </div>
            </Form>
        </Formik>);
}
    