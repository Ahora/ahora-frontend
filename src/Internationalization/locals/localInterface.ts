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
    selectUser: string;
    noDocSelectText: string;
    noDocSelectedButtonText: string;

    menuinboxText: string;
    menustarText: string;
    menuprivateText: string;
    menuShortcutsText: string;
    menuShortcutManageText: string;
    menuDashboardsText: string;
    menudocsText: string;
    menuTeamsText: string;
    menuMilestonesText: string;
    menuSettingsText: string;

    docsNoResults: string;

    login: string;
    logout: string;

    shortcutTableTitle: string;
    shortcutAddButtonText: string;
    shortcutTableSearchCriteria: string;
    shortcutTableActions: string;
    shortcutTableDeleteButtonText: string;
    shortcutTableClearNotificationsText: string;

    shortcutAddTitle: string;
    shortcutAddSearchCriteria: string;
    shortcutAddStar: string;
    ahoraFormSubmitText: string;

    commentsNewLabel: string;
    commentsPinnedComments: string;
    commentsCommentsText: string;

    closedAtDescriptor: string;
    lastViewedByMeDescriptor: string;
    assigneeMeDescriptor: string;

    statusCommentContent: string;
    assigneeCommentContent: string;
    isPrivateCommentprivate: string;
    isPrivateCommentpublic: string;

    unassigned: string;

    recentUsers: string;
    usersSearchResults: string;
    selectedUsers: string;

    searchLabelText: string;
    searchReporterText: string;
    searchAssigneeText: string;
    searchMentionText: string;
    searchStatusText: string;
    searchDocTypeText: string;
    searchIsPrivateText: string;

    renameShortcut: string;
    editShortcut: string;
    clearNotificationsShortcut: string;
    deleteShortcut: string;
    addShortcutButton: string;

    all: string;
}