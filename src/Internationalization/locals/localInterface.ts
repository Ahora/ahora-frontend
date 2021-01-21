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
    privateFieldName: string;
    usersFieldName: string;

    submitButtonText: string;
    cancelButtonText: string;

    private: string;
    public: string;

}