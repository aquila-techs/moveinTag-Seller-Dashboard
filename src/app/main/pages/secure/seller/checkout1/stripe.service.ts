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
      "pk_test_51FMVPnBsGswEgNabZmzIsj0Wfm70T55gJpUeJHpehwSTlGfwZFdG72qUyuG3NooBq9XDE11gOUmZRAOzckkFNiEK00THKSIghZ"
    ); // Replace 'YOUR_STRIPE_PUBLIC_KEY' with your actual Stripe public key
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
