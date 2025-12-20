export interface FieldOption {
  label: string;
  value: string;
}

export interface InputField {
  inputName: string;
  dataType: string; // 'String', 'Date', 'Array', 'Object', etc.
  fieldType: string; // 'input', 'dropdown', 'textarea', etc.
  prompt?: string;
  options?: string[]; // For dropdowns usually just strings in the JSON example, but good to support objects
  helperText?: string[];
  inputValue?: any;
}

export interface Section {
  sectionName: string;
  inputFields: {
    fieldsHeading: string;
    fields: InputField[];
  }[];
}

export interface Template {
  id: string;
  title: string;
  templateName: string;
  sections: Section[];
}
