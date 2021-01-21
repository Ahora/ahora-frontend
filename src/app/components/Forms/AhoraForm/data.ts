export interface AhoraFormField {
    fieldName: string;
    displayName: React.ReactNode;
    fieldType: string;
    required?: boolean;
    autoFocus?: boolean;
    settings?: any;
}


export interface AhoraFormStateField extends AhoraFormField {
    instance: any;
}