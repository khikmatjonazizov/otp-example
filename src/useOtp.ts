import React, {useRef, useState} from "react";

export const useOtp = () => {
    const [isDisabled, setIsDisabled] = useState(true);
    const [otp, setOtp] =
        useState<(number | undefined)[]>(new Array(6).fill(undefined))
    const inputsRefs = useRef<(HTMLInputElement | null)[]>(new Array(6).fill(null));

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(otp)
    }

    const focusAndSelectInputByIndex = (dir: 'next' | 'prev', inputIndex: number) => {
        if(dir === 'next' && inputIndex <= 5) {
            inputsRefs.current[inputIndex + 1]?.focus()
            inputsRefs.current[inputIndex + 1]?.select()
        } else if(dir === 'prev' && inputIndex >= 0) {
            inputsRefs.current[inputIndex - 1]?.focus()
            inputsRefs.current[inputIndex - 1]?.select()
        }
    }

    const changeOtpStateAndChangeIsDisabled = (value: number | undefined, inputIndex: number) => {
        setOtp(prevState => {
            const newOtp = prevState.map((oneOtp, idx) => {
                return inputIndex === idx ? value : oneOtp
            })

            setIsDisabled(!newOtp.every(oneOtp => typeof oneOtp === 'number'))
            return newOtp;
        })
    }

    const onChange = (inputIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.trim();
        const parsedValue = parseInt(value);

        // paste
        if(String(parsedValue).length === 6) {
            setOtp(() => {
                return String(parsedValue).split('').map(code => +code)
            })
            setIsDisabled(false)
            focusAndSelectInputByIndex('next', 4)
        }
        else if (value.length === 0) {
            changeOtpStateAndChangeIsDisabled(undefined, inputIndex)
            focusAndSelectInputByIndex('prev', inputIndex)
        } else if (!isNaN(parsedValue) && value.length === 1) {
            changeOtpStateAndChangeIsDisabled(parsedValue, inputIndex)
            focusAndSelectInputByIndex('next', inputIndex)
        }
    }

    const onKeyDown = (inputIndex: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
        const value = otp[inputIndex];

        if(value === undefined && event.code === 'Backspace') {
            event.preventDefault()
            focusAndSelectInputByIndex('prev', inputIndex)
        } else if(value !== undefined && event.key === String(value)) {
            event.preventDefault()
            focusAndSelectInputByIndex('next', inputIndex)
        }
        // navigation
        else if(event.code === 'ArrowLeft') {
            event.preventDefault()
            focusAndSelectInputByIndex('prev', inputIndex)
        } else if(event.code === 'ArrowRight') {
            event.preventDefault()
            focusAndSelectInputByIndex('next', inputIndex)
        } else if(event.code === 'Tab' && event.shiftKey && inputIndex !== 0) {
            event.preventDefault()
            focusAndSelectInputByIndex('prev', 1)
        }
    }

    return {
        isDisabled,
        otp,
        inputsRefs,
        onKeyDown,
        onChange,
        onSubmit,
    }
}
