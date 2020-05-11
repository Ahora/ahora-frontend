import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { requestLabelsData } from 'app/store/labels/actions';
import { getDocGroup } from 'app/services/docs';
import { SearchCriterias } from '../SearchDocsInput';
import { PieChart, Pie, Tooltip, Cell, BarChart, XAxis, YAxis, Bar, CartesianGrid, ResponsiveContainer } from 'recharts';
import { RouteComponentProps } from 'react-router';
import { Organization } from 'app/services/organizations';
import { stringify } from "query-string";
import Spinner from 'react-bootstrap/Spinner';

export enum DocsGraphDisplayType {
    bars = "bars",
    pie = "pie"
}

interface DocsGraphState {
    bars: string[],
    chartData?: any[];
    loading: boolean;
}

interface DocsGraphProps {
}

interface InjectedProps {
    organization: Organization | undefined;
}

interface DispatchProps {
    requestLabels(): void;
}

interface AllProps extends RouteComponentProps<DocsGraphProps>, DispatchProps, InjectedProps {
    labelStartWith?: string;
    searchCriterias: SearchCriterias;
    group: string[];
    displayType: DocsGraphDisplayType
}

class DocsGraph extends React.Component<AllProps, DocsGraphState> {
    constructor(props: AllProps) {
        super(props);

        this.state = {
            bars: [],
            loading: true
        };
    }

    componentWillReceiveProps(nextProps: AllProps) {
        //TODO: Compare arrays better!
        if (nextProps.displayType !== this.props.displayType
            || nextProps.searchCriterias !== this.props.searchCriterias
            || nextProps.group[0] !== this.props.group[0]
            || nextProps.group[1] !== this.props.group[1]) {
            this.updateGraph(nextProps);
        }
    }

    async updateGraph(props: AllProps) {
        this.setState({
            loading: true
        });
        const rawData: any[] = await getDocGroup(props.group, props.searchCriterias);
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
                ...this.props.searchCriterias as any,
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
                        <>
                            <h2>{this.props.labelStartWith}</h2>
                            {this.props.displayType === DocsGraphDisplayType.pie &&
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie dataKey="count" isAnimationActive={false} data={this.state.chartData} fill="#8884d8" label >
                                            {
                                                this.state.chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                                            }
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            }
                            {this.props.displayType === DocsGraphDisplayType.bars &&

                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart onClick={this.onClick.bind(this)} data={this.state.chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        {
                                            this.state.bars.map((bar) => <Bar dataKey="count" fill="#8884d8">
                                                {
                                                    this.state.chartData!.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                                                }
                                            </Bar>)
                                        }

                                    </BarChart>
                                </ResponsiveContainer>
                            }
                        </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DocsGraph as any)