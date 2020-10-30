import { store } from "app/store";
import { DecorateRequest, RestCollectorClient, RestCollectorOptions, RestCollectorRequest, RestCollectorResult } from "rest-collector";
import io from 'socket.io-client';
let socketId: string | undefined = io().id;
export default class AhoraRestCollector<E = any, B = any> extends RestCollectorClient<E, B> {

    constructor(entityRestAPI?: string, decorateRequests?: DecorateRequest<B>) {
        super(entityRestAPI, {
            decorateRequest: (req: RestCollectorRequest, bag?: B) => {
                req.headers.socketid = socketId;
            }
        })
    }
    sendRequest(options: RestCollectorOptions<B>): Promise<RestCollectorResult<E>> {
        options.params = { ...options.params, organizationId: store.getState().organizations.currentOrganization!.login }
        return super.sendRequest(options);
    }

}