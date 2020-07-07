import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { getDocGroup } from 'app/services/docs';
import { XAxis, ResponsiveContainer, LineChart, Line, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { RouteComponentProps } from 'react-router';
import { Organization } from 'app/services/organizations';
import DocsDateTimeGraphData from './data';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import moment from "moment";
import { stringify } from "query-string";


interface DocsDateTimeGraphState {
    bars: string[],
    chartData?: any;
    loading: boolean;
    lines?: string[];
}

interface DocsDateTimeGraphProps {
}

interface InjectedProps {
    organization: Organization | undefined;
}


interface AllProps extends RouteComponentProps<DocsDateTimeGraphProps>, InjectedProps {
    data: DocsDateTimeGraphData;
}

function joinObjects(arrayone: any[], arrayTwo: any[]): any {
    const distinctLines: Map<string, any> = new Map<string, any>();
    const arrays = [arrayone, arrayTwo];
    var map: Map<any, any> = new Map();
    for (var i = 0; i < arrays.length; i++) {
        // Iterate over individual argument arrays (aka json1, json2)
        for (var j = 0; j < arrays[i].length; j++) {
            var currentTime = arrays[i][j]['values'][0];
            if (currentTime != null) {
                let mapVal = map.get(currentTime);
                if (!mapVal) {
                    mapVal = {};
                }

                const values = (arrays[i][j]['values'] as Array<any>).slice(1).join(" ");
                distinctLines.set(values, {});

                mapVal[`${i == 0 ? `${values}-closed` : `${values}-created`}`] = arrays[i][j].count;
                mapVal[`${i == 0 ? `${values}-closed-value` : `${values}-created-value`}`] = arrays[i][j].criteria;

                map.set(currentTime, mapVal);
            }
        }
    }

    var newArray = [] as any;
    const keys1 = [...map.keys()];
    const possibleGroups = [...distinctLines.keys()];

    const deaultValue: any = {};
    possibleGroups.forEach((line) => {
        deaultValue[`${line}-closed`] = 0;
        deaultValue[`${line}-created`] = 0;
    });


    for (const keyItem in keys1) {

        const item = {
            ...deaultValue,
            ...map.get(keys1[keyItem]),
            date: keys1[keyItem],
            name: keys1[keyItem]
        };

        newArray.push(item);
    }
    return { values: newArray, lines: [...distinctLines.keys()] };
}


class DocsDateTimeGraph extends React.Component<AllProps, DocsDateTimeGraphState> {
    constructor(props: AllProps) {
        super(props);

        this.state = {
            bars: [],
            loading: true
        };
    }

    componentDidUpdate(prevProps: AllProps) {
        //TODO: Compare arrays better!
        if (prevProps.data.searchCriterias !== this.props.data.searchCriterias
            || prevProps.data.closedAtTrend !== this.props.data.closedAtTrend
            || prevProps.data.primaryGroup !== this.props.data.primaryGroup
            || prevProps.data.createdAtTrend !== this.props.data.createdAtTrend) {
            this.updateGraph(this.props);
        }
    }

    async updateGraph(props: AllProps) {
        this.setState({
            loading: true
        });
        const [closedAtData, createdAtData] = await Promise.all([
            getDocGroup(["closedAt", this.props.data.primaryGroup!], props.data.searchCriterias, "closedAt"),
            getDocGroup(["createdAt", this.props.data.primaryGroup!], props.data.searchCriterias, "createdAt"),
        ]);

        const graphData = joinObjects(closedAtData, createdAtData);
        const chartData = graphData.values;
        const sortedActivities = chartData.sort((a: any, b: any) => { return a.date - b.date });
        this.setState({ chartData: sortedActivities, loading: false, lines: graphData.lines });
    }

    async componentDidMount() {
        this.updateGraph(this.props);
    }

    onClick(e: any) {
        const dataKey = e.dataKey;
        if (e.payload[dataKey] > 0) {
            this.props.history.push({
                pathname: `/organizations/${this.props.organization!.login}/docs/`,
                search: "?" + stringify({
                    ...this.props.data.searchCriterias as any,
                    ...e.payload[`${dataKey}-value`]
                })
            });
        }
    }

    render() {
        return (
            <div>
                {
                    this.state.loading ?
                        <AhoraSpinner />
                        : this.state.chartData &&
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart width={500} height={300} data={this.state.chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={['dataMin', 'dataMax']} dataKey="date" tickFormatter={(value: any) => { return moment(value).format("DD/MM/YY"); }} />
                                <YAxis />
                                <Tooltip labelFormatter={(value: any) => { return moment(value).format("DD/MM/YY"); }} />
                                <Legend />
                                {
                                    this.state.lines && this.state.lines.map((line) =>
                                        <Line activeDot={{ onClick: this.onClick.bind(this) }} dot={true} key={`${line}-created`} type="monotone" display={`${line} created`} dataKey={`${line}-created`} stroke="#00C49F" />
                                    )
                                }
                                {
                                    this.state.lines && this.state.lines.map((line) =>
                                        <Line activeDot={{ onClick: this.onClick.bind(this) }} dot={true} key={`${line}-closed`} type="monotone" display={`${line} closed`} dataKey={`${line}-closed`} stroke="#0088FE" />
                                    )
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


export default connect(mapStateToProps, null)(DocsDateTimeGraph as any)