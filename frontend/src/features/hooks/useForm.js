import { useState } from "react";

export default function useForm(initialValues, validateFn) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitIntentado, setSubmitIntentado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (callback) => (e) => {
    e.preventDefault();
    setSubmitIntentado(true);

    const validationErrors = validateFn(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      callback(values);
    }
  };

  return {
    values,
    errors,
    submitIntentado,
    handleChange,
    handleSubmit,
  };
}