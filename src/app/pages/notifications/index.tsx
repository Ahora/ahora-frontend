import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { OrganizationNotification, getNotifications, addNotification, NotificationTrigger, deleteNotification, updateNotification } from 'app/services/OrganizationNotification';
import Table from 'react-bootstrap/Table';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import CanAddNotification from 'app/components/Authentication/CanAddDashboard';
import AhoraForm from 'app/components/Forms/AhoraForm/AhoraForm';
import { AhoraFormField } from 'app/components/Forms/AhoraForm/data';
import Button from 'react-bootstrap/Button';
import { SearchCriteriasToText } from 'app/components/SearchDocsInput';
//import TriggerNotification from 'app/components/Notifications/TriggerNotification';
import ViewEdit from 'app/components/ViewEdit';
import TriggerNotification from 'app/components/Notifications/TriggerNotification';
import AhoraTriggerNotificationField from 'app/components/Notifications/AhoraTriggerNotificationField';

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
                fieldType: "enumbitwise",
                settings: {
                    enum: NotificationTrigger,
                    keys: [
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
            notifications: [addedNotification, ...this.state.notifications || []],
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

    async onTriggerUpdate(notificationIndex: number, notificationTrigger: number): Promise<void> {
        if (this.state.notifications) {
            let notification = this.state.notifications[notificationIndex];
            notification = {
                ...notification,
                notificationTrigger
            };

            const updatedNotification = await updateNotification(notification.id!, notification);
            const newOrganizationArray = [...this.state.notifications];
            newOrganizationArray[notificationIndex] = updatedNotification;

            this.setState({
                notifications: newOrganizationArray
            });
        }
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
                                <th>Trigger</th>
                                <th>Search criteria</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.notifications && (this.state.notifications.map((notification: OrganizationNotification, index: number) => {
                                return (
                                    <tr className="pt-3" key={notification.id}>
                                        <td>{notification.title}</td>
                                        <td>{notification.description}</td>
                                        <td>
                                            <ViewEdit canEdit={true} onUpdate={async (notificationTrigger) => { await this.onTriggerUpdate(index, notificationTrigger); }}
                                                viewComponent={() => { return <TriggerNotification value={notification.notificationTrigger}></TriggerNotification> }}
                                                editComponent={(props: any) => <AhoraTriggerNotificationField onUpdate={props.onUpdate} value={notification.notificationTrigger} />
                                                } />
                                        </td>
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