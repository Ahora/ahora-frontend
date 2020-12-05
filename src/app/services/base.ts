import { store } from "app/store";
import { socket } from "app/websockets/organizationWS";
import { DecorateRequest, RestCollectorClient, RestCollectorOptions, RestCollectorRequest, RestCollectorResult } from "rest-collector";
export default class AhoraRestCollector<E = any, B = any> extends RestCollectorClient<E, B> {

    constructor(entityRestAPI?: string, decorateRequests?: DecorateRequest<B>) {
        super(entityRestAPI, {
            decorateRequest: (req: RestCollectorRequest, bag?: B) => {
                req.headers.socketid = socket.id;
            }
        })
    }
    sendRequest(options: RestCollectorOptions<B>): Promise<RestCollectorResult<E>> {
        options.params = { ...options.params, organizationId: store.getState().organizations.currentOrganization!.login }
        return super.sendRequest(options);
    }

}