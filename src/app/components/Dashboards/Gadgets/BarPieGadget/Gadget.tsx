import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { getDocGroup } from 'app/services/docs';
import { PieChart, Pie, Tooltip, Cell, BarChart, XAxis, YAxis, Bar, CartesianGrid, ResponsiveContainer } from 'recharts';
import { RouteComponentProps } from 'react-router';
import { Organization } from 'app/services/organizations';
import { stringify } from "query-string";
import BarPieGadgetData, { BarPieGadgetDisplayType } from './data';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';

interface BarPieGadgetState {
    bars: string[],
    chartData?: any[];
    loading: boolean;
}

interface BarPieGadgetProps {
}

interface InjectedProps {
    organization: Organization | undefined;
}

interface AllProps extends RouteComponentProps<BarPieGadgetProps>, InjectedProps {
    data: BarPieGadgetData;
}

class BarPieGadget extends React.Component<AllProps, BarPieGadgetState> {
    constructor(props: AllProps) {
        super(props);

        this.state = {
            bars: [],
            loading: false
        };
    }

    componentDidUpdate(prevPropse: AllProps) {
        if (prevPropse.data.displayType !== this.props.data.displayType
            || prevPropse.data.searchCriterias !== this.props.data.searchCriterias
            || prevPropse.data.primaryGroup !== this.props.data.primaryGroup
            || prevPropse.data.secondaryGroup !== this.props.data.secondaryGroup) {
            this.updateGraph(this.props);
        }
    }


    async updateGraph(props: AllProps) {
        if (props.data.primaryGroup || props.data.secondaryGroup) {
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
                        <AhoraSpinner />
                        : this.state.chartData &&
                        <ResponsiveContainer width="100%" height={300}>
                            {this.props.data.displayType === BarPieGadgetDisplayType.pie ?
                                <PieChart onClick={this.onClick.bind(this)}>
                                    <Pie dataKey="count" isAnimationActive={false} data={this.state.chartData} fill="#8884d8" label >
                                        {
                                            this.state.chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                                        }
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                                :
                                <BarChart onClick={this.onClick.bind(this)} data={this.state.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    {
                                        this.state.bars.map((bar) => <Bar key={bar} dataKey="count" fill="#8884d8">
                                            {
                                                this.state.chartData!.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                                            }
                                        </Bar>)
                                    }

                                </BarChart>
                            }
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

export default connect(mapStateToProps)(BarPieGadget as any)