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

interface LabelsSelectorState {
    labels?: any[];
    bars: string[],
    chartData?: any[];
}

interface LabelsSelectorProps {
}

interface InjectedProps {
    labelMap: Map<number, Label>;
    organization: Organization | undefined;
}

interface DispatchProps {
    requestLabels(): void;
}

interface AllProps extends RouteComponentProps<LabelsSelectorProps>, DispatchProps, InjectedProps {
    labelStartWith?: string;
    searchCriterias: SearchCriterias
}

class LabelsGraph extends React.Component<AllProps, LabelsSelectorState> {
    constructor(props: AllProps) {
        super(props);

        this.state = {
            bars: []
        };
    }

    async componentDidMount() {
        this.props.requestLabels();

        const rawData: any[] = await getDocGroup("label", this.props.searchCriterias);
        if (rawData && this.props.labelMap) {
            const chartData: any[] = [];
            const bars: string[] = [];
            if (rawData.length > 0) {
                const firstItem: any = rawData[0];

                for (const key in firstItem) {
                    if (key !== "count") {
                        bars.push(key);
                    }
                }
            }

            rawData.forEach((LabelRow) => {
                const label: Label | undefined = this.props.labelMap.get(LabelRow["labels.labelId"]);
                if (label && (!this.props.labelStartWith || label.name.startsWith(this.props.labelStartWith))) {
                    chartData.push({
                        ...LabelRow,
                        name: label.name,
                        color: label.color,
                        value: parseInt(LabelRow.count)
                    });
                }
            });
            this.setState({ chartData, bars });
        }
    }

    onClick(e: any) {
        this.props.history.push({
            pathname: `/organizations/${this.props.organization!.login}/docs/`,
            search: "?" + stringify({
                ...this.props.searchCriterias as any,
                label: (this.props.searchCriterias.label) ? [...this.props.searchCriterias.label, this.props, e.activePayload[0].payload.name] : [e.activePayload[0].payload.name]
            })
        });
    }

    render() {
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

        return (
            <div>
                {this.state.chartData &&
                    <>
                        <h2>{this.props.labelStartWith}</h2>
                        <PieChart style={{ display: "none" }} width={400} height={400}>
                            <Pie dataKey="value" isAnimationActive={false} data={this.state.chartData} fill="#8884d8" label >
                                {
                                    this.state.chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                                }
                            </Pie>
                            <Tooltip />
                        </PieChart>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart onClick={this.onClick.bind(this)} data={this.state.chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                {
                                    this.state.bars.map((bar) => <Bar dataKey="value" fill="#8884d8">
                                        {
                                            this.state.chartData!.map((entry, index) => (
                                                <Cell cursor="pointer" fill={`#${entry.color}`} key={`cell-${index}`} />
                                            ))
                                        }
                                    </Bar>)
                                }

                            </BarChart>
                        </ResponsiveContainer>
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

export default connect(mapStateToProps, mapDispatchToProps)(LabelsGraph as any); 