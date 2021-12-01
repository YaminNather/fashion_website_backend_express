import Stripe from "stripe";

export default function getStripe(): Stripe {
  const apiKey: string = "sk_test_51JkTmBSHRuYM7AUm8T5AUtBN5nFLi6NVFF5L36YddGt1t93kS8t3TML7wz36vIeg5R7XToPNuYeOWiLDZVvVbr7S0063rpf0z1";

  const config: Stripe.StripeConfig = {
    apiVersion: "2020-08-27"
  };
  
  return new Stripe(apiKey, config);
}