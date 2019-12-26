import { store } from "app/store";
import { RestCollectorClient, RestCollectorOptions, RestCollectorResult } from "rest-collector";

export default class AhoraRestCollector<E = any, B = any> extends RestCollectorClient<E, B> {

    sendRequest(options: RestCollectorOptions<B>): Promise<RestCollectorResult<E>> {

        options.params = { ...options.params, organizationId: store.getState().organizations.currentOrganization!.login }
        return super.sendRequest(options);
    }

}