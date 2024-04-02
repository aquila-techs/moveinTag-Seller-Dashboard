import { Injectable } from "@angular/core";

declare var Stripe: any;

@Injectable({
  providedIn: "root",
})
export class StripeService {
  private stripe: any;

  constructor() {}

  async createStripe(): Promise<any> {
    this.stripe = Stripe(
      "pk_live_51OpInML7MEQHcjwNtcHMqFdDQd2xhImkDL8W0eMUAcCi0KPMBsNOfnQD4li1LLkWDYOM9q9ihfGsDHwysz2x5Pwf00OBmIS7mJ"
    );
    return this.stripe;
  }

  async createCardElement(): Promise<any> {
    const stripe = await this.createStripe();
    const elements = stripe.elements();
    return elements.create("card", {
      hidePostalCode: true,
    });
  }

  async createToken(cardElement: any): Promise<string> {
    const result = await this.stripe.createToken(cardElement);
    if (result.error) {
      console.error(result.error);
      return "error is here...";
    } else {
      return result;
    }
  }
}
