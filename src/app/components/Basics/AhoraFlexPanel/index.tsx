import * as React from 'react';

import './style.scss';

interface Props {
    bottom?: React.ReactNode;
    top?: React.ReactNode;
    left?: React.ReactNode;
    leftClassName?: string;
    scrollId?: string;
}

export default class AhoraFlexPanel extends React.Component<Props>{
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
                            <div id={this.props.scrollId} className="scrollable">
                                {this.props.children}
                            </div>
                            {this.props.bottom}
                        </div>}

                </div>
            </div>
        );
    }
}