import { store } from "app/store";
import { DecorateRequest, RestCollectorClient, RestCollectorOptions, RestCollectorRequest, RestCollectorResult } from "rest-collector";
import pusher from "./pusher";
let socketId: string | undefined;
pusher.connection.bind('connected', function () {
    socketId = pusher.connection.socket_id;
});
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