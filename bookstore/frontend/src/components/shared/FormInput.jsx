import React from 'react';

const FormInput = ({ label, id, ...props }) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
    </div>
  );
};

export default FormInput;