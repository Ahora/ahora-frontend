import { Tag } from 'antd';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

export interface isPrivateTagProps {
    isPrivate: boolean;
}

const IsPrivateTag: React.FC<isPrivateTagProps> = (props: isPrivateTagProps & React.RefAttributes<HTMLElement>) => (
    <Tag {...props} color="#108ee9">
        <FormattedMessage id={props.isPrivate ? "private" : "public"} />
    </Tag>
)

export default IsPrivateTag;