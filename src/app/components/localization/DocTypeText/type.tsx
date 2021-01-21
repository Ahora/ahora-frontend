import { DocType } from "app/services/docTypes";

export interface DocTypeProps {
    docTypeId: number;
}

export interface InjecteableProps {
    docType?: DocType;
}


export interface DocTypeAllProps extends DocTypeProps, InjecteableProps {

}
