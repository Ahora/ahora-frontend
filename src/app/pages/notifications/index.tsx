import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { OrganizationNotification, getNotifications, addNotification, NotificationTrigger, deleteNotification } from 'app/services/OrganizationNotification';
import Table from 'react-bootstrap/Table';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import CanAddNotification from 'app/components/Authentication/CanAddDashboard';
import AhoraForm from 'app/components/Forms/AhoraForm/AhoraForm';
import { AhoraFormField } from 'app/components/Forms/AhoraForm/data';
import Button from 'react-bootstrap/Button';
import { SearchCriteriasToText } from 'app/components/SearchDocsInput';


interface NotificationsPageState {
    notifications?: OrganizationNotification[];
    form?: any;
    fields: AhoraFormField[];
}

interface NotificationsPageParams {
    login: string;
}

interface NotificationsPageProps extends RouteComponentProps<NotificationsPageParams> {

}

interface AllProps extends NotificationsPageProps {

}

class NotificationsPage extends React.Component<AllProps, NotificationsPageState> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            fields: [{
                displayName: "Title",
                fieldName: "title",
                fieldType: "text",
                required: true
            },
            {
                displayName: "Description",
                fieldName: "description",
                fieldType: "text"
            },
            {
                displayName: "Search criteria",
                fieldName: "searchCriteria",
                fieldType: "searchcriteria"
            },
            {
                displayName: "Trigger",
                fieldName: "notificationTrigger",
                fieldType: "enum",
                settings: {
                    enum: NotificationTrigger, keys:
                        [
                            "OnCreate",
                            "OnEdit",
                            "onStatusChanged",
                            "OnUpdate",
                            "OnComment",
                            "OnClose"
                        ]
                }
            }]
        }
    }

    async onSubmit(data: any) {
        const addedNotification = await addNotification(data);

        this.setState({
            notifications: [addedNotification, ...this.state.notifications],
            form: undefined
        });
    }

    async componentDidMount() {
        const notifications = await getNotifications();
        this.setState({ notifications });
    }

    public openAddForm() {
        this.setState({
            form: {
                searchCriteria: {}
            }
        });
    }

    cancelAdd() {
        this.setState({
            form: undefined
        });
    }


    async deleteOrganization(notification: OrganizationNotification) {
        await deleteNotification(notification.id!);
        if (this.state.notifications) {
            this.setState({
                notifications: this.state.notifications.filter((currentNotification) => currentNotification.id !== notification.id)
            });
        }
    }

    render() {
        return (
            <div>
                <CanAddNotification>
                    {this.state.form ?
                        <AhoraForm fields={this.state.fields} data={this.state.form} onCancel={this.cancelAdd.bind(this)} onSumbit={this.onSubmit.bind(this)} />
                        :
                        <Button onClick={this.openAddForm.bind(this)}>Add notification</Button>
                    }
                </CanAddNotification>

                {this.state.notifications ?
                    <Table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Search criteria</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.notifications && (this.state.notifications.map((notification: OrganizationNotification) => {
                                return (
                                    <tr className="pt-3" key={notification.id}>
                                        <td>{notification.title}</td>
                                        <td>{notification.description}</td>
                                        <td>{SearchCriteriasToText(notification.searchCriteria)}</td>
                                        <td><Button variant="danger" onClick={() => { this.deleteOrganization(notification) }}>Delete</Button></td>
                                    </tr>);
                            }))}
                        </tbody>
                    </Table>
                    :
                    <AhoraSpinner />
                }
            </div>
        );
    };
}

export default NotificationsPage; 