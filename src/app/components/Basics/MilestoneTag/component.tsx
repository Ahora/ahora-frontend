import { Tag } from 'antd';
import * as React from 'react';
import { MilestoneAllProps } from './type';

const MilestoneTagComponent: React.FC<MilestoneAllProps> = (props: MilestoneAllProps) => (
    <>
        {(props.milestone) && <Tag>{props.milestone.title}</Tag>}
    </>)

export default MilestoneTagComponent;