import React from "react";

import classes from './input.module.css'

const Input = (props) => {
    let inputElement = null;
    const inputClasses = [classes.InputElement];

    if (props.invalid && props.shuldvalidte && props.touched) {
        inputClasses.push(classes.Invalid);
    };

    switch (props.elementtype) {
        case ('input'):
            inputElement = <input onChange={props.changed} className={inputClasses.join(' ')} {...props.elementConfig} value={props.value} />;
            break;
        case ('textarea'):
            inputElement = <textarea onChange={props.changed} className={inputClasses.join(' ')} {...props.elementConfig} value={props.value} />;
            break;
        case ('select'):
            inputElement = (
                <select onChange={props.changed} className={inputClasses.join(' ')} value={props.value}>
                    {props.elementConfig.options.map(option => (
                        <option key={option.value} value={option.value}> {option.displayValue}</option>
                    ))}
                </select >
            )
            break;

        default: inputElement = <input
            className={inputClasses.join(' ')}
            {...props.elementConfig}
            value={props.value}
            onChange={props.changed} />;
            break;
    }

    return (
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {inputElement}
        </div>
    )
};

export default Input;