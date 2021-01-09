import * as React from 'react';

import './style.scss';

interface Props {
    bottom?: React.ReactNode;
    top?: React.ReactNode;
    left?: React.ReactNode;
    leftClassName?: string;
    scrollId?: string;
    onScrollToBottom?: () => void;
    onScrollToTop?: () => void;
}

export default class AhoraFlexPanel extends React.Component<Props>{

    onScroll(event: React.UIEvent<HTMLDivElement>) {
        const node = event.currentTarget;
        if (this.props.onScrollToTop && node.scrollTop === 0) {
            this.props.onScrollToTop();
        }

        if (this.props.onScrollToBottom && node.scrollHeight - node.scrollTop === node.clientHeight) {
            this.props.onScrollToBottom();
        }
    }
    render() {
        return (
            <div className="ahora-flex-panel-wrapper">
                <div className="content">
                    {
                        this.props.left &&
                        <div className={this.props.leftClassName || "left-side"}>
                            {this.props.left}
                        </div>
                    }
                    {this.props.children &&
                        <div className="main-content">
                            {this.props.top}
                            <div id={this.props.scrollId} onScroll={this.props.onScrollToBottom && this.onScroll.bind(this)} className="scrollable">
                                {this.props.children}
                            </div>
                            {this.props.bottom}
                        </div>}

                </div>
            </div>
        );
    }
}