import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { getDocGroup } from 'app/services/docs';
import { XAxis, ResponsiveContainer, LineChart, Line, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { RouteComponentProps } from 'react-router';
import { Organization } from 'app/services/organizations';
import { stringify } from "query-string";
import DocsDateTimeGraphData from './data';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import moment from "moment";

interface DocsDateTimeGraphState {
    bars: string[],
    chartData?: any;
    loading: boolean;
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
    const arrays = [arrayone, arrayTwo];
    var map: Map<any, any> = new Map();
    for (var i = 0; i < arrays.length; i++) {
        // Iterate over individual argument arrays (aka json1, json2)
        for (var j = 0; j < arrays[i].length; j++) {
            var currentTime = arrays[i][j]['values'][0];
            if (currentTime != null) {
                let mapVal = map.get(currentTime);
                if (!mapVal) {
                    mapVal = { closed: 0, created: 0 };
                }

                mapVal[`${i == 0 ? "closed" : "created"}`] = arrays[i][j].count;
                map.set(currentTime, mapVal);
            }
        }
    }

    var newArray = [] as any;
    const keys1 = [...map.keys()];
    for (const keyItem in keys1) {

        const item = {
            ...map.get(keys1[keyItem]),
            name: keys1[keyItem]
        };

        newArray.push(item);
    }
    return newArray;
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
            || nextProps.data.closedAtTrend !== this.props.data.closedAtTrend
            || nextProps.data.createdAtTrend !== this.props.data.createdAtTrend) {
            this.updateGraph(nextProps);
        }
    }



    async updateGraph(props: AllProps) {
        this.setState({
            loading: true
        });
        const [closedAtData, createdAtData] = await Promise.all([
            getDocGroup(["closedAt"], props.data.searchCriterias, "closedAt"),
            getDocGroup(["createdAt"], props.data.searchCriterias, "createdAt"),
        ]);

        const chartData = joinObjects(closedAtData, createdAtData);
        const sortedActivities = chartData.sort((a: any, b: any) => { return a.name - b.name });
        this.setState({ chartData: sortedActivities, loading: false });
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
        return (
            <div>
                {
                    this.state.loading ?
                        <AhoraSpinner />
                        : this.state.chartData &&
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart width={500} height={300} data={this.state.chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={['dataMin', 'dataMax']} dataKey="name" tickFormatter={(value: any) => { return moment(value).format("DD/MM/YY"); }} />
                                <YAxis />
                                <Tooltip labelFormatter={(value: any) => { return moment(value).format("DD/MM/YY"); }} />
                                <Legend />
                                <Line type="monotone" dataKey="closed" connectNulls={true} stroke="#0088FE" activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="created" stroke="#00C49F" activeDot={{ r: 8 }} />

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