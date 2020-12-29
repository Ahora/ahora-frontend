export interface AhoraFormField {
    fieldName: string;
    displayName: string;
    fieldType: string;
    required?: boolean;
    autoFocus?: boolean;
    settings?: any;
}


export interface AhoraFormStateField extends AhoraFormField {
    instance: any;
}