import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { requestLabelsData } from 'app/store/labels/actions';
import { getDocGroup } from 'app/services/docs';
import { Cell, XAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, YAxis } from 'recharts';
import { RouteComponentProps } from 'react-router';
import { Organization } from 'app/services/organizations';
import { stringify } from "query-string";
import Spinner from 'react-bootstrap/Spinner';
import DocsDateTimeGraphData from './data';

interface DocsDateTimeGraphState {
    bars: string[],
    chartData?: any[];
    loading: boolean;
}

interface DocsDateTimeGraphProps {
}

interface InjectedProps {
    organization: Organization | undefined;
}

interface DispatchProps {
    requestLabels(): void;
}

interface AllProps extends RouteComponentProps<DocsDateTimeGraphProps>, DispatchProps, InjectedProps {
    data: DocsDateTimeGraphData;
}

class DocsDateTimeGraph extends React.Component<AllProps, DocsDateTimeGraphState> {
    constructor(props: AllProps) {
        super(props);

        this.state = {
            bars: [],
            loading: true
        };
    }

    componentWillReceiveProps(nextProps: AllProps) {
        //TODO: Compare arrays better!
        if (nextProps.data.searchCriterias !== this.props.data.searchCriterias
            || nextProps.data.primaryGroup !== this.props.data.primaryGroup
            || nextProps.data.secondaryGroup !== this.props.data.secondaryGroup) {
            this.updateGraph(nextProps);
        }
    }

    async updateGraph(props: AllProps) {
        this.setState({
            loading: true
        });
        const rawData: any[] = await getDocGroup([props.data.primaryGroup!, props.data.secondaryGroup!], props.data.searchCriterias);
        this.setState({
            loading: false
        });
        const chartData: any[] = [];
        const bars: string[] = [];
        if (rawData.length > 0) {
            const firstItem: any = rawData[0].criteria;

            let barTitle = "";
            for (const key in firstItem) {
                barTitle += `${key} `;
            }
            //remove last space!
            barTitle = barTitle.substr(0, barTitle.length - 1)
            bars.push(barTitle);

        }

        rawData.forEach((LabelRow) => {
            chartData.push({
                ...LabelRow,
                name: LabelRow.values.join("-")
            });
        });
        this.setState({ chartData, bars, loading: false });
    }

    async componentDidMount() {
        this.updateGraph(this.props);
    }

    onClick(e: any) {
        this.props.history.push({
            pathname: `/organizations/${this.props.organization!.login}/docs/`,
            search: "?" + stringify({
                ...this.props.data.searchCriterias as any,
                ...e.activePayload[0].payload.criteria
            })
        });
    }

    render() {
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
        return (
            <div>
                {
                    this.state.loading ?
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                        </div>
                        : this.state.chartData &&
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart width={500} height={300} data={this.state.chartData}>
                                <XAxis
                                    scale='time'
                                    type="number"
                                    dataKey="name" />
                                <YAxis />
                                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                                {
                                    this.state.bars.map((bar) => <Line key={bar} type="monotone" dataKey="count" stroke="#8884d8">
                                        {
                                            this.state.chartData!.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                                        }
                                    </Line>)
                                }
                            </LineChart>
                        </ResponsiveContainer>

                }

            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState): InjectedProps => {
    return {
        organization: state.organizations.currentOrganization,
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        requestLabels: () => dispatch(requestLabelsData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocsDateTimeGraph as any)