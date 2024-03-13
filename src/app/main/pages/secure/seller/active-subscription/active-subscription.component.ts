import { Component, OnInit } from "@angular/core";
import { StripeService } from "./stripe.service";

@Component({
  selector: "app-active-subscription",
  templateUrl: "./active-subscription.component.html",
  styleUrls: ["./active-subscription.component.scss"],
})
export class ActiveSubscription implements OnInit {
  constructor(private stripeService: StripeService) {}

  async ngOnInit() {
    const stripe = await this.stripeService.createStripe();
    const cardElement = await this.stripeService.createCardElement();
    cardElement.mount("#card-element");

    const submitButton = document.getElementById("submit");
    if (submitButton) {
      submitButton.addEventListener("click", async () => {
        const token = await this.stripeService.createToken(cardElement);
        if (token) {
          // Token successfully generated
          console.log("Token:", token);
          // Send the token to your backend for further processing
        } else {
          // Error generating token
          console.log("Error generating token");
        }
      });
    } else {
      console.error("Submit button not found.");
    }
  }
}
