export default interface LocalInterface extends Record<string, string> {
    addDiscussionButtonText: string;
    status1: string;
    status2: string;
    docType3: string;
    docType4: string;
    docType5: string;
    docType6: string;

    docTypeDescriptor: string;
    docTypeFieldName: string;

    subjectFieldName: string;
    labelsFieldName: string;
    descriptionFieldName: string;
    markdownPlaceHolder: string;
    privateFieldName: string;
    usersFieldName: string;

    submitButtonText: string;
    cancelButtonText: string;

    private: string;
    public: string;

    newLabelText: string;
    selectLabels: string;
    deleteDocType: string;

    deleteComment: string;
    editComment: string;
    quoteComment: string
    pinComment: string;
    unpinComment: string;
    updateCommentButtonText: string;

    selectUsers: string;
    noDocSelectText: string;
    noDocSelectedButtonText: string;

    menuInboxText: string;
    menuPrivateText: string;
    menuShortcutsText: string;
    menuShortcutManageText: string;
    menuDashboardsText: string;
    menuDocsText: string;
    menuTeamsText: string;
    menuMilestonesText: string;
    MenuSettingsText: string;

    docsNoResults: string;

    login: string;
    logout: string;
}