import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import DeleteIcon from "@material-ui/icons/Delete";
import { useCart, useDispatchCart } from "../Components/ContextReducer";

const Cart = () => {
  const data = useCart();
  const dispatch = useDispatchCart();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (data.length === 0) {
    return <div className="m-5 w-100 text-center fs-3">The Cart is Empty!</div>;
  }

  const handleCheckOut = async () => {
    const userEmail = localStorage.getItem("userEmail");
    const orderDate = new Date().toDateString();

    try {
      setLoading(true);

      // Create a PaymentMethod using the card element.
      const cardElement = elements.getElement(CardElement);
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        console.error("Error creating PaymentMethod:", error);
        throw new Error("Error creating PaymentMethod");
      }

      if (!paymentMethod || !paymentMethod.id) {
        console.error("PaymentMethod or PaymentMethod.id is undefined");
        throw new Error("PaymentMethod or PaymentMethod.id is undefined");
      }

      // Send the payment information to your server.
      const response = await fetch("http://localhost:5000/api/auth/orderData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_data: data.map((food) => ({
            name: food.name,
            qty: food.qty,
            size: food.size,
            price: food.price,
          })),
          email: userEmail,
          order_date: orderDate,
          payment_method: paymentMethod.id,
        }),
      });

      if (response.status === 200) {
        dispatch({ type: "DROP" });
        // Optionally, you can redirect the user to a success page or show a success message.
      } else {
        console.error(
          "Error during API call. Response status:",
          response.status
        );
        setError("Checkout failed. Please try again later.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      setError("Checkout failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = data.reduce((total, food) => total + food.price, 0);

  return (
    <div className="container m-auto mt-5 table-responsive table-responsive-sm table-responsive-md">
      <table className="table table-hover">
        <thead className="text-success fs-4">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Quantity</th>
            <th scope="col">Option</th>
            <th scope="col">Amount</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((food, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{food.name}</td>
              <td>{food.qty}</td>
              <td>{food.size}</td>
              <td>{food.price}</td>
              <td>
                <button
                  type="button"
                  className="btn p-0"
                  onClick={() => {
                    dispatch({ type: "REMOVE", index: index });
                  }}
                >
                  <DeleteIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h1 className="fs-2">Total Price: {totalPrice}/-</h1>
      </div>
      <div>
        <CardElement />
        <button
          className="btn bg-success mt-5"
          onClick={handleCheckOut}
          disabled={loading}
        >
          {loading ? "Processing..." : "Check Out"}
        </button>
        {error && <p className="text-danger mt-3">{error}</p>}
      </div>
    </div>
  );
};

export default Cart;
