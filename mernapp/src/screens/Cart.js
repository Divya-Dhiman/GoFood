import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import { useCart, useDispatchCart } from "../Components/ContextReducer";
import StripeCheckout from "react-stripe-checkout";
const Cart = () => {
  const data = useCart();
  const dispatch = useDispatchCart();

  if (data.length === 0) {
    return <div className="m-5 w-100 text-center fs-3">The Cart is Empty!</div>;
  }

  const handleCheckOut = async () => {
    let userEmail = localStorage.getItem("userEmail");
    let response = await fetch("http://localhost:5000/api/auth/orderData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_data: data,
        email: userEmail,
        order_date: new Date().toDateString(),
        token: token.id,
      }),
    });
    console.log("JSON RESPONSE:::::", response.status);
    if (response.status === 200) {
      dispatch({ type: "DROP" });
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
        {/* Use the StripeCheckout component to handle payments */}
        <StripeCheckout
          stripeKey="pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfipXmEDMb0gSCassK5T3ZfxsAbcgKVmAIXF7oZ6ItlZZbXO6idTHE67IM007EwQ4uN3"
          token={handleCheckOut}
          amount={totalPrice * 100} // Amount in cents
          name="Badmosh"
          description="Payment for items in the cart"
          currency="INR"
        >
          <button className="btn bg-success mt-5">Pay Now</button>
        </StripeCheckout>
      </div>
    </div>
  );
};

export default Cart;
