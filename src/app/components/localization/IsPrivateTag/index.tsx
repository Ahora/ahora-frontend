import { Tag } from 'antd';
import * as React from 'react';
import { DOMAttributes } from 'react';
import { FormattedMessage } from 'react-intl';

export interface isPrivateTagProps extends DOMAttributes<HTMLElement> {
    isPrivate: boolean;
}

const IsPrivateTag: React.FC<isPrivateTagProps> = (props: isPrivateTagProps) => (
    <Tag onClick={props.onClick} color="#108ee9">
        <FormattedMessage id={props.isPrivate ? "private" : "public"} />
    </Tag>
)

export default IsPrivateTag;