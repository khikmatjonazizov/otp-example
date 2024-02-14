import React from 'react';

import './App.css'
import {useOtp} from "./useOtp.ts";

const App: React.FC = () => {
    const {
        isDisabled,
        inputsRefs,
        otp,
        onChange,
        onKeyDown,
        onSubmit,
    } = useOtp();

    return (
        <div className="wrapper">
            <div className="heading">
                <h2>OTP Verification</h2>
                <p>Please enter the code we have sent you.</p>
            </div>
            <form onSubmit={onSubmit}>
                <div id="otp-container">
                    {
                        otp.map((oneOtp, idx) => (
                            <input
                                type="text"
                                placeholder={String(idx + 1)}
                                className="otp-number"
                                onChange={onChange(idx)}
                                onKeyDown={onKeyDown(idx)}
                                value={oneOtp ?? ''}
                                pattern="[0-9]*"
                                inputMode="numeric"
                                key={idx}
                                ref={(reference) => inputsRefs.current[idx] = reference}
                                onFocus={event => event.target.select()}
                            />
                        ))
                    }
                </div>
                <input disabled={isDisabled} type="submit" value="Submit"/>
            </form>
        </div>
    );
};

export default App;
