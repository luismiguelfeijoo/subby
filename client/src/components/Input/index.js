import React from 'react';
import { useFormContext } from 'react-hook-form';
import { InputBase, Error, SelectBase } from './utils/styles.js';

export const Input = React.forwardRef(
  ({ placeholder, name, type, defaultValue = '', min = '' }, ref) => {
    const { errors } = useFormContext();
    const errorHandler = () => {
      if (errors[name]?.message) {
        return errors[name].type == 'pattern' ? true : false;
      } else {
        return false;
      }
    };
    return (
      <>
        {errorHandler() && <Error>{errors[name].message}</Error>}
        <InputBase
          type={type}
          name={name}
          placeholder={
            errors[name]?.message ? errors[name].message : placeholder
          }
          ref={ref}
          errors={errors}
          defaultValue={defaultValue}
          min={min}
        />
      </>
    );
  }
);

export const Select = React.forwardRef(
  (
    {
      placeholder,
      name,
      options,
      selection,
      onChange = e => console.log(e.target.value),
      def = 'Please select an option'
    },
    ref
  ) => {
    const { errors } = useFormContext();
    const errorHandler = () => {
      if (errors[name]?.message) {
        return errors[name].type == 'pattern' ? true : false;
      } else {
        return false;
      }
    };
    return (
      <>
        {errorHandler() && <Error>{errors[name].message}</Error>}
        <SelectBase
          name={name}
          placeholder={
            errors[name]?.message ? errors[name].message : placeholder
          }
          ref={ref}
          errors={errors}
          onChange={onChange}
        >
          <option value={null} key='999'>
            {def}
          </option>
          {options.map((option, i) => {
            return selection === option ? (
              <option value={option.toLowerCase()} key={i} selected>
                {option}
              </option>
            ) : (
              <option value={option.toLowerCase()} key={i}>
                {option}
              </option>
            );
          })}
        </SelectBase>
      </>
    );
  }
);

export const SimpleSelect = React.forwardRef(
  (
    {
      placeholder,
      name,
      options,
      selection,
      onChange = '',
      def = 'Please select an option'
    },
    ref
  ) => {
    return (
      <SelectBase name={name} ref={ref} onChange={onChange}>
        <option value={null} key='999'>
          {def}
        </option>
        {options.map((option, i) => {
          return selection === option ? (
            <option value={option.toLowerCase()} key={i} selected>
              {option}
            </option>
          ) : (
            <option value={option.toLowerCase()} key={i}>
              {option}
            </option>
          );
        })}
      </SelectBase>
    );
  }
);
