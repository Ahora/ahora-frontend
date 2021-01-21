import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { DocTypeAllProps } from './type';

const DocTypeTextComponent: React.FC<DocTypeAllProps> = (props: DocTypeAllProps) => (
    <>
        {(props.docType) &&
            <FormattedMessage id={`docType${props.docType.id}`} defaultMessage={props.docType.name} />
        }
    </>)

export default DocTypeTextComponent;