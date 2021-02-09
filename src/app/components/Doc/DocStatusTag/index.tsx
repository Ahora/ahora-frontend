import * as React from 'react';
import DocStatusText from 'app/components/localization/DocStatusText';
import { Tag } from 'antd';

interface DocStatusProps {
    statusId: number;
}

export default function DocStatusTag(props: DocStatusProps) {
    return <Tag>
        <DocStatusText statusId={props.statusId}></DocStatusText>
    </Tag>;
}