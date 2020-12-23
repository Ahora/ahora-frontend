
import AhoraRestCollector from "../sdk/AhoraRestCollector";

export interface Attachment {
    contentType: string;
    filename: string;
}

export interface AttachmentUpload {
    id: number;
    contentType: string;
    filename: string;
    urlToUpload: string;
    viewUrl: string;
}

const attachmentsClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/attachments/{id}");
const markUploadedClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/attachments/{id}/markUploaded");
export const AddAttachment = async (attachment: Attachment): Promise<AttachmentUpload> => {
    const result = await attachmentsClient.post({
        data: attachment
    });
    return result.data;
}

export const markUploaded = async (id: number): Promise<void> => {
    await markUploadedClient.post({
        params: { id }
    });
}