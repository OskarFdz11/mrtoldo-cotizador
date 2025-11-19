// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  status: "Pendiente" | "Pagado";
};

export type Revenue = {
  id: number;
  date?: Date;
  customerId?: number;
  billingDetailsId?: number;
  iva?: boolean;
  subtotal: number;
  total: number;
  notes?: string;
  status?: "Pendiente" | "Pagado";
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, "amount"> & {
  amount: number;
};

export type QuotationsTable = {
  id: string;
  date: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  subtotal: number;
  total: number;
  status: "Pendiente" | "Pagado";
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string | number;
  name: string;
  lastname: string;
  email: string;
  phone: string | null;
  company: string;
  rfc: string;
};

export type CategoryField = {
  id: string | number;
  name: string;
  description?: string;
};

export type ProductField = {
  id: string | number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  quantity: number;
  brand: string;
  category: CategoryField;
  deleted_at?: Date | null;
  updated_at?: Date | null;
  created_at?: Date | null;
  quotationProducts?: QuotationProductField[];
};

export type BillingDetailsField = {
  id: string | number;
  name: string;
  lastname: string;
  company: string;
  rfc: string;
  clabe: string;
  checkAccount: string;
  cardNumber: string;
  phone: string | null;
  email: string;
  address?: {
    id: string | number;
    street: string;
    outsideNumber: string;
    colony: string;
    city: string;
    cp: string;
  };
};

export type BillingDetailsEditFormProps = {
  billingDetails: {
    id: number;
    name: string;
    lastname: string;
    company: string;
    rfc: string;
    clabe: string;
    checkAccount: string;
    cardNumber: string;
    phone: string | null;
    email: string;
    address: {
      id: number;
      street: string;
      outsideNumber: string;
      colony: string;
      city: string;
      cp: string;
    } | null;
  };
};

export type QuotationForm = {
  id: string | number;
  customerId: string | number;
  billingDetailsId: string | number;
  iva: boolean;
  subtotal: number;
  total: number;
  notes: string;
  status: "Pendiente" | "Pagado";
  date: Date;
  products: QuotationProductInput[];
};

export type QuotationProductField = {
  quotationId: string | number;
  productId: string | number;
  quantity: number;
  price: number;
  product: ProductField;
};

export type QuotationProductInput = {
  productId: string | number;
  quantity: number;
  price: number;
};

export type QuotationWithDetails = {
  id: number;
  date: Date;
  customerId: number;
  billingDetailsId: number;
  iva: boolean;
  subtotal: number;
  total: number;
  notes: string;
  status: string;
  customer: {
    id: number;
    name: string;
    lastname: string;
    email: string;
    company: string;
  };
  billingDetails: {
    id: number;
    name: string;
    lastname: string;
    company: string;
    email: string;
    phone: string | null;
  };
  products: {
    quotationId: number;
    productId: number;
    quantity: number;
    price: number;
    product: {
      id: number;
      name: string;
      description: string;
      image_url: string;
      brand: string;
    };
  }[];
};

type DuplicateQuotationSuccess = {
  readonly errors: {};
  readonly message: string;
  readonly success: true;
  readonly quotationId: number;
};

type DuplicateQuotationError = {
  readonly errors: { readonly general: readonly string[] };
  readonly message: string;
  readonly success: false;
};

export type DuplicateQuotationResponse =
  | DuplicateQuotationSuccess
  | DuplicateQuotationError;
