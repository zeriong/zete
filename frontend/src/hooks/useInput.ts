import {useState} from "react";

export const useInput = (initialValue) => {
    const [useInputValue, setUseInputValue] = useState(initialValue);

    const inputOnChange = ({ target: {value} }) => setUseInputValue(value);

    const valueReset = () => setUseInputValue('');
    return {useInputValue, valueReset, inputOnChange};
}