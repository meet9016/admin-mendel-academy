import { PaymentType } from "@/app/(admin)/(others-pages)/payment/page";

export const decodeHtml = (html: string): string => {
    if (typeof window === "undefined") return html;
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

 export const getStatusSeverity = (row: PaymentType) => {
    switch (row.payment_status) {
      case "paid":
      case "succeeded":
        return "success";
      case "Pending":
        return "warning";
      case "failed":
      case "cancelled":
        return "danger";
      default:
        return "info";
    }
  };