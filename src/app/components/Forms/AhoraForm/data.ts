export interface AhoraFormField {
    fieldName: string;
    displayName: string;
    fieldType: string;
    required?: boolean;
    settings?: any;
}


export interface AhoraFormStateField extends AhoraFormField {
    instance: any;
}