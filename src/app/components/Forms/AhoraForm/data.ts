export interface AhoraFormField {
    fieldName: string;
    displayName: string;
    fieldType: string;
    required?: boolean
}


export interface AhoraFormStateField extends AhoraFormField {
    instance: any;
}