declare module 'midtrans-client' {
  interface MidtransConfig {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  interface TransactionDetails {
    order_id: string;
    gross_amount: number;
  }

  interface CustomerDetails {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  }

  interface ItemDetail {
    id: string;
    price: number;
    quantity: number;
    name: string;
  }

  interface SnapParameter {
    transaction_details: TransactionDetails;
    customer_details?: CustomerDetails;
    item_details?: ItemDetail[];
    [key: string]: unknown;
  }

  interface SnapTokenResponse {
    token: string;
    redirect_url: string;
  }

  class Snap {
    constructor(config: MidtransConfig);
    createTransaction(parameter: SnapParameter): Promise<SnapTokenResponse>;
    createTransactionToken(parameter: SnapParameter): Promise<string>;
    createTransactionRedirectUrl(parameter: SnapParameter): Promise<string>;
  }

  class CoreApi {
    constructor(config: MidtransConfig);
    charge(parameter: Record<string, unknown>): Promise<Record<string, unknown>>;
    capture(transactionId: string): Promise<Record<string, unknown>>;
    cancel(transactionId: string): Promise<Record<string, unknown>>;
    status(transactionId: string): Promise<Record<string, unknown>>;
  }

  export { Snap, CoreApi };
  export default { Snap, CoreApi };
}
