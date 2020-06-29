import React from "react";

function Toggle({ checked, onCheck, checkedTitle, unCheckedTitle }) {
  const styles = {
    toggle: `absolute block
           w-4 h-4 mt-1 ml-1
           bg-white rounded-full shadow
           inset-y-0 left-0
           focus-within:shadow-outline
           transition-transform duration-200 ease-in-out`,
    checked: `transform translate-x-full`,
  };

  return (
    <label
      htmlFor={checked ? "checked" : "unchecked"}
      className="mt-3 inline-flex items-center cursor-pointer"
      onClick={onCheck}
    >
      <span className="relative">
        <span className={`block w-10 h-6 ${checked ? "bg-blue-600" : "bg-gray-400"} rounded-full shadow-inner`}></span>
        <span className={`${styles.toggle} ${checked && styles.checked}`}>
          <input type="checkbox" className="absolute opacity-0 w-0 h-0" />
        </span>
      </span>
      <span className="ml-3 text-md text-gray-700">{checked ? checkedTitle : unCheckedTitle}</span>
    </label>
  );
}

export default Toggle;
