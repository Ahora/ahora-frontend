import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { Label } from 'app/services/labels';
import { requestLabelsData } from 'app/store/labels/actions';
import { getDocGroup } from 'app/services/docs';
import { SearchCriterias } from '../SearchDocsInput';
import { PieChart, Pie, Tooltip, Cell, BarChart, XAxis, YAxis, Bar, CartesianGrid, ResponsiveContainer } from 'recharts';
import { RouteComponentProps } from 'react-router';
import { Organization } from 'app/services/organizations';
import { stringify } from "query-string";

export enum DocsGraphDisplayType {
    bars = "bars",
    pie = "pie"
}

interface DocsGraphState {
    bars: string[],
    chartData?: any[];
}

interface DocsGraphProps {
}

interface InjectedProps {
    labelMap: Map<number, Label>;
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
            bars: []
        };
    }

    async componentDidMount() {
        this.props.requestLabels();

        const rawData: any[] = await getDocGroup(this.props.group, this.props.searchCriterias);
        if (rawData && this.props.labelMap) {
            const chartData: any[] = [];
            const bars: string[] = [];
            if (rawData.length > 0) {
                const firstItem: any = rawData[0].criteria;

                let barTitle = "";
                for (const key in firstItem) {
                    if (key !== "count") {
                        barTitle += `${key} `;
                    }
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
            this.setState({ chartData, bars });
        }
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
        console.log(this.props.displayType);
        return (
            <div>
                {this.state.chartData &&
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
        labelMap: state.labels.mapById,
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        requestLabels: () => dispatch(requestLabelsData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocsGraph as any)