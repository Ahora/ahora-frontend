import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Status } from 'app/services/statuses';
import { Dispatch } from 'redux';
import Nav from "react-bootstrap/Nav";
import { requestStatusesData } from 'app/store/statuses/actions';
import SearchDocsInput, { SearchCriterias } from 'app/components/SearchDocsInput';
import { Link } from 'react-router-dom';
import { DocType } from 'app/services/docTypes';
import { requestDocTypesData } from 'app/store/docTypes/actions';
import { setSearchCriteria } from 'app/store/organizations/actions';
import DocList from 'app/components/DocList';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';
import { getDocGroup } from 'app/services/docs';


interface DocsPageState {
    searchCriteria?: SearchCriterias;
    searchCriteriasText?: string;
    chart?: any[];
}

interface DocsPageParams {
    docTypeCode: string;
    login: string;
}


interface injectedParams {
    statuses: Map<number, Status>;
    docTypes: Map<number, DocType>;
    loading: boolean;
    searchCriteria?: string;
}

interface DocsPageProps extends RouteComponentProps<DocsPageParams>, injectedParams {

}


interface DispatchProps {
    requestStatusesData(): void;
    requestDocTypes(): void;
    setSearchCriterias(data?: string): void;
}

interface AllProps extends DocsPageProps, DispatchProps {

}

class DocsPage extends React.Component<AllProps, DocsPageState> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
        }
    }

    async componentDidMount() {
        this.props.requestStatusesData();
        this.props.requestDocTypes();
    }

    async searchSelected(searchCriterias: SearchCriterias, searchCriteriasText: string) {
        this.props.setSearchCriterias(searchCriteriasText);
        this.setState({
            searchCriteria: searchCriterias,
            chart: undefined,
            searchCriteriasText
        });

        const chart: any[] = await getDocGroup("docTypeId", searchCriterias);
        this.setState({
            chart
        });
    }

    onChartClick(data: any) {

        this.props.setSearchCriterias(this.state.searchCriteriasText + ` docType" ${data.name}`);
        this.setState({
            searchCriteria: { ...this.state.searchCriteria!, docType: data.name },
            chart: undefined
        });
    }

    render() {
        let chartData: any[] | undefined;
        if (this.state.chart && this.state.chart.length > 1) {
            chartData = this.state.chart.map((data) => {
                return {
                    name: data.docType.name,
                    value: parseInt(data.count),
                    color: data.docTypeId === 14 ? '#C13C37' : '#E38627'
                }
            });
        }
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
        return (
            <div>
                <SearchDocsInput searchCriteria={this.props.searchCriteria} searchSelected={this.searchSelected.bind(this)}></SearchDocsInput>
                <Nav className="mb-3">
                    <Nav.Item>
                        <Link to={`/organizations/${this.props.match.params.login}/docs/add`}>
                            <Button variant="primary" type="button">Add</Button>
                        </Link>
                    </Nav.Item>
                </Nav>
                {chartData &&
                    <PieChart width={400} height={400}>
                        <Pie onClick={this.onChartClick.bind(this)} dataKey="value" isAnimationActive={false} data={chartData} fill="#8884d8" label >
                            {
                                chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                            }
                        </Pie>
                        <Tooltip />
                        <Legend layout='horizontal' verticalAlign="bottom" align="center" />

                    </PieChart>
                }
                <DocList searchCriteria={this.state.searchCriteria}>No Results</DocList>
            </div>
        );
    };
}

const mapStateToProps = (state: ApplicationState): injectedParams => {
    return {
        statuses: state.statuses.map,
        docTypes: state.docTypes.mapById,
        loading: state.statuses.loading,
        searchCriteria: state.organizations.SearchCriterias
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        setSearchCriterias: (data: string) => dispatch(setSearchCriteria(data)),
        requestStatusesData: () => dispatch(requestStatusesData()),
        requestDocTypes: () => dispatch(requestDocTypesData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocsPage as any); 