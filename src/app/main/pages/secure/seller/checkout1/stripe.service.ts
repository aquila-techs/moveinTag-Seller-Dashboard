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
      "pk_test_51OpInML7MEQHcjwNU367fibxmzTw2PaMeG1kJRrPddEYeeaQL9UgllVC6rx7ZzkmRHG1GAfvIkEufvkXGlkQzHHD00uuXE849c"
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
