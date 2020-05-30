import * as React from 'react';
import { createUltimatePagination, ITEM_TYPES } from 'react-ultimate-pagination';

const WrapperComponent = (props: any) => (
    <ul className="pagination">{props.children}</ul>
);

const withPreventDefault = (fn: any) => (event: any) => {
    event.preventDefault();
    fn();
}

const Page = (props: any) => (
    <li className={props.isActive ? 'page-item active' : 'page-item'}>
        <a className="page-link" href="#" onClick={withPreventDefault(props.onClick)}>{props.value}</a>
    </li>
);

const Ellipsis = (props: any) => (
    <li className="page-item">
        <a className="page-link" href="#" onClick={withPreventDefault(props.onClick)}>...</a>
    </li>
);

const FirstPageLink = (props: any) => (
    <li className="page-item">
        <a className="page-link" href="#" onClick={withPreventDefault(props.onClick)}>&laquo;</a>
    </li>
);

const PreviousPageLink = (props: any) => (
    <li className="page-item">
        <a className="page-link" href="#" onClick={withPreventDefault(props.onClick)}>&lsaquo;</a>
    </li>
);

const NextPageLink = (props: any) => (
    <li className="page-item">
        <a className="page-link" href="#" onClick={withPreventDefault(props.onClick)}>&rsaquo;</a>
    </li>
);

const LastPageLink = (props: any) => (
    <li className="page-item">
        <a className="page-link" href="#" onClick={withPreventDefault(props.onClick)}>&raquo;</a>
    </li>
);

const itemTypeToComponent = {
    [ITEM_TYPES.PAGE]: Page,
    [ITEM_TYPES.ELLIPSIS]: Ellipsis,
    [ITEM_TYPES.FIRST_PAGE_LINK]: FirstPageLink,
    [ITEM_TYPES.PREVIOUS_PAGE_LINK]: PreviousPageLink,
    [ITEM_TYPES.NEXT_PAGE_LINK]: NextPageLink,
    [ITEM_TYPES.LAST_PAGE_LINK]: LastPageLink
};

const UltimatePaginationBootstrap4 = createUltimatePagination({ itemTypeToComponent, WrapperComponent });

export default UltimatePaginationBootstrap4;