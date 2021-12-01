import axios, { AxiosResponse } from "axios"

export default class VerifyPaymentService {
  public verifyPayment = async (orderId: string) => {
    const response: AxiosResponse = await axios.get(
      `https://api.razorpay.com/v1/orders/${orderId}`,
      {
        auth: {
          username: "rzp_test_1hrXSB3kRQMgLu",
          password: "T0oxxSPF9jgiUjT6onmL0Tif"
        }
      }
    );

    return (response.data as any).status == "paid";
  }
}