import { Injectable } from "@angular/core";
import { environment } from 'environments/environment';



declare var Stripe: any;

@Injectable({
  providedIn: "root",
})
export class StripeService {
  private stripe: any;

  constructor() {}

  async createStripe(): Promise<any> {
    this.stripe = Stripe(environment.stripeKey);
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
      return result.token.id;
    }
  }
}
