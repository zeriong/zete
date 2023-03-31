import {useState} from "react";

export const useInput = (initialValue) => {
    const [value, setValue] = useState(initialValue);

    const inputOnChange = ({ target: {value} }) => setValue(value);

    const valueReset = () => setValue('');
    return {value, valueReset, inputOnChange};
}