import { getWebSocketId } from "app/websockets";
import { DecorateRequest, RestCollectorClient, RestCollectorOptions, RestCollectorRequest, RestCollectorResult } from "rest-collector";

let orgName: string | undefined;

export const initOrgIdForRest = (login?: string) => {
    orgName = login;
}

export default class AhoraRestCollector<E = any, B = any> extends RestCollectorClient<E, B> {

    constructor(entityRestAPI?: string, decorateRequests?: DecorateRequest<B>) {
        super(entityRestAPI, {
            decorateRequest: (req: RestCollectorRequest, bag?: B) => {
                //TODO: Fix cicular reference!
                req.headers.socketid = getWebSocketId();
            }
        })
    }
    sendRequest(options: RestCollectorOptions<B>): Promise<RestCollectorResult<E>> {
        options.params = { ...options.params, organizationId: orgName }
        return super.sendRequest(options);
    }

}