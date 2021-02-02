import { SearchCriterias } from "app/components/SearchDocsInput";
import SimpleDocsInput from "app/components/SearchDocsInput/SimpleDocsInput";
import { addShortcutSimple, deleteShortcut, OrganizationShortcut, updateShortcut, updateShortcutSearchCriteria, updateShortcutStar } from "app/services/OrganizationShortcut";
import { ApplicationState } from "app/store";
import { addShortcutFromState, deleteShortcutFromState, loadShortcutDocs, setShourtcutStarAction, updateShortcutDraftsearchCriteriaAction, updateShortcutsearchCriteriaAction, updateShortcutToState } from "app/store/shortcuts/actions";
import StoreOrganizationShortcut from "app/store/shortcuts/StoreOrganizationShortcut";
import React, { useEffect, useState } from "react";
import { Dispatch } from 'redux';
import { connect } from "react-redux";
import { SettingOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
import { FormattedMessage } from "react-intl";
import { Badge, Dropdown, Input, Menu } from "antd";
import "./style.scss";
import { RouteComponentProps, withRouter } from "react-router";
import { isBrowser } from "react-device-detect";


interface InjectableProps {
    shortcut?: StoreOrganizationShortcut;
    canUpdateSearchCriteria: boolean;
    canEdit: boolean,
    organizationId?: string;
}

interface DispatchProps {
    setSearchCriterias(section: string, data?: SearchCriterias): void;
    setShortcutStar(shortcutdId: string, star: boolean): void;
    setDraftSearchCriterias(section: string, data?: SearchCriterias): void;
    loadShortcutDocs(shortcutId: string, page: number): void;
    updateShortcutToState(shortcut: OrganizationShortcut): void;
    removeShortcutFromState(id: string): void;
    addShortcutToState(shortcut: OrganizationShortcut): void,
}

interface Props extends RouteComponentProps, InjectableProps, DispatchProps {
    shortcutdId: string;
}

function ShortcutTitle(props: Props) {

    const [editMode, setEditMode] = useState(false)
    const [renameMode, setRenameMode] = useState(false);
    const [renameText, setRenameText] = useState(props.shortcut?.shortcut?.title);

    useEffect(() => {
        setRenameText(props.shortcut?.shortcut?.title);
        if (props.shortcutdId === "docs" && isBrowser) {
            setEditMode(true);
            setRenameMode(false);
        }
        else {
            setEditMode(false);
            setRenameMode(false);
        }
    }, [props.shortcutdId])

    const toggleStar = async () => {
        const star: boolean = !props.shortcut?.shortcut?.star;
        props.setShortcutStar(props.shortcutdId, star);
        try {
            await updateShortcutStar(props.shortcutdId, star);

        } catch (error) {
            props.setShortcutStar(props.shortcutdId, !star);
        }
    }

    const clearNotifications = async () => {
        if (props.shortcut?.shortcut) {
            const shortCutToUpdate = { ...props.shortcut?.shortcut, since: new Date() }
            const updatedShortcut = await updateShortcut(shortCutToUpdate.id!, shortCutToUpdate);
            props.updateShortcutToState(updatedShortcut);
        }
    }

    const renameNotification = async () => {

        if (renameText && props.shortcut) {
            if (props.shortcutdId === "docs") {
                const addedShortcut = await addShortcutSimple(renameText, props.shortcut.draftsearchCriteria!);
                props.addShortcutToState(addedShortcut);
                props.history.replace(`/organizations/${props.organizationId}/${addedShortcut.id}`);

            }
            else {
                if (props.shortcut.shortcut) {
                    const shortCutToUpdate = { ...props.shortcut?.shortcut, title: renameText }
                    const oldText = props.shortcut.shortcut.title;
                    try {
                        props.updateShortcutToState(shortCutToUpdate);
                        setRenameMode(false);
                        await updateShortcut(shortCutToUpdate.id!, shortCutToUpdate);
                    } catch (error) {
                        props.updateShortcutToState({ ...shortCutToUpdate, title: oldText });
                        setRenameMode(true);
                    }
                }
            }
        }

    }

    const ondeleteShortcut = async () => {
        await deleteShortcut(props.shortcutdId);
        props.removeShortcutFromState(props.shortcutdId);
        props.history.replace(`/organizations/${props.organizationId}/docs`);
    }


    const onInputSearchSelected = async (searchCriterias?: SearchCriterias) => {
        props.setDraftSearchCriterias(props.shortcutdId, searchCriterias);
        props.loadShortcutDocs(props.shortcutdId, 1);
    }

    const onSaveSearchCriteria = async (searchCriterias: SearchCriterias) => {
        if (props.shortcutdId === "docs") {
            setEditMode(false);
            setRenameMode(true)
        }
        else {
            await updateShortcutSearchCriteria(props.shortcutdId, searchCriterias);
            props.setSearchCriterias(props.shortcutdId, searchCriterias);
            setEditMode(false);
        }
    }

    const menu = (
        <Menu>
            <Menu.Item onClick={() => { setRenameMode(true) }} key="0">
                <FormattedMessage id="renameShortcut" />
            </Menu.Item>
            <Menu.Item onClick={() => { setEditMode(true) }} key="1">
                <FormattedMessage id="editShortcut" />
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item onClick={clearNotifications} key="3">
                <FormattedMessage id="clearNotificationsShortcut" />
            </Menu.Item>
            <Menu.Item onClick={ondeleteShortcut} key="4">
                <FormattedMessage id="deleteShortcut" />
            </Menu.Item>
        </Menu>
    );

    return <div className="shortcut-title">
        {(!editMode && !renameMode) &&
            <>
                {props.canEdit && <span className="side" onClick={toggleStar}>{props.shortcut?.shortcut?.star ? <StarFilled /> : <StarOutlined />}</span>}
                <span className="title"><Badge offset={[15, 0]} count={props.shortcut?.unreadDocs?.size}>{props.shortcut && <FormattedMessage id={`menu${props.shortcutdId}Text`} defaultMessage={props.shortcut?.shortcut?.title} />}</Badge></span>
                {props.canUpdateSearchCriteria &&
                    <span className="side">
                        <Dropdown className="side" overlay={menu} trigger={['click']}>
                            <SettingOutlined />
                        </Dropdown>
                    </span>
                }
            </>
        }
        {editMode &&
            <SimpleDocsInput
                onSave={onSaveSearchCriteria}
                showSaveButton={true}
                searchSelected={onInputSearchSelected}
                searchCriterias={props.shortcut?.searchCriteria} ></SimpleDocsInput>
        }

        {renameMode &&
            <Input autoFocus onPressEnter={() => { renameNotification() }} value={renameText} onChange={(event) => { setRenameText(event.target.value) }} addonAfter={<span onClick={() => { renameNotification() }} className="renameBtn">{props.shortcutdId === "docs" ? <FormattedMessage id="addShortcutButton" /> : <FormattedMessage id="renameShortcut" />}</span>}></Input>
        }
    </div>
}


const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        addShortcutToState: (status: OrganizationShortcut) => { dispatch(addShortcutFromState(status)) },
        removeShortcutFromState: (id: string) => { dispatch(deleteShortcutFromState(id)) },
        updateShortcutToState: (status: OrganizationShortcut) => { dispatch(updateShortcutToState(status)) },
        setSearchCriterias: (shortcutdId: string, data: SearchCriterias) => dispatch(updateShortcutsearchCriteriaAction(shortcutdId, data)),
        setShortcutStar: (shortcutdId: string, star: boolean) => dispatch(setShourtcutStarAction(shortcutdId, star)),
        setDraftSearchCriterias: (shortcutdId: string, data: SearchCriterias) => dispatch(updateShortcutDraftsearchCriteriaAction(shortcutdId, data)),
        loadShortcutDocs: (shortcutdId: string, page: number) => dispatch(loadShortcutDocs(shortcutdId, page)),

    }
}

const mapStateToProps = (state: ApplicationState, ownProps: Props): InjectableProps => {
    let availableShortcut: StoreOrganizationShortcut | undefined = state.shortcuts.map.get(ownProps.shortcutdId);
    return {
        organizationId: state.organizations.currentOrganization?.login,
        shortcut: availableShortcut,
        canEdit: !availableShortcut?.strict,
        canUpdateSearchCriteria: (availableShortcut?.strict !== true),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ShortcutTitle as any)) as any; 