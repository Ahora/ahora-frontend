import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { Label } from 'app/services/labels';
import { requestLabelsData } from 'app/store/labels/actions';
import { getDocGroup } from 'app/services/docs';
import { SearchCriterias } from '../SearchDocsInput';
import { PieChart, Pie, Tooltip, Cell, BarChart, XAxis, YAxis, Bar, CartesianGrid } from 'recharts';
import { RouteComponentProps } from 'react-router';
import { Organization } from 'app/services/organizations';
import { stringify } from "query-string";

interface LabelsSelectorState {
    labels?: any[];
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

        this.state = {};
    }

    async componentDidMount() {
        this.props.requestLabels();

        const rawData: any[] = await getDocGroup("label", this.props.searchCriterias);
        if (rawData && this.props.labelMap) {
            const chartData: any[] = [];
            rawData.forEach((LabelRow) => {
                const label: Label | undefined = this.props.labelMap.get(LabelRow["labels.labelId"]);
                if (label && (!this.props.labelStartWith || label.name.startsWith(this.props.labelStartWith))) {
                    chartData.push({
                        name: label.name,
                        id: LabelRow["labels.labelId"],
                        color: label.color,
                        value: parseInt(LabelRow.count)
                    });
                }
            });
            this.setState({ chartData });
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
                        <PieChart style={{ display: "none" }} width={400} height={400}>
                            <Pie dataKey="value" isAnimationActive={false} data={this.state.chartData} fill="#8884d8" label >
                                {
                                    this.state.chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                                }
                            </Pie>
                            <Tooltip />
                        </PieChart>
                        <BarChart onClick={this.onClick.bind(this)}
                            width={800}
                            height={500}
                            data={this.state.chartData}
                            margin={{
                                top: 5, right: 30, left: 20, bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8">
                                {
                                    this.state.chartData.map((entry, index) => (
                                        <Cell cursor="pointer" fill={`#${entry.color}`} key={`cell-${index}`} />
                                    ))
                                }
                            </Bar>
                        </BarChart>
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